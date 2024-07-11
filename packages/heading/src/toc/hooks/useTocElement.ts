import React, { useEffect } from 'react';

import {
  addSelectedRow,
  getNode,
  getPluginOptions,
  toDOMNode,
  useEditorRef,
  useEditorSelector,
} from '@udecode/plate-common';

import type { Heading } from '../types';

import { heightToTop } from '../../utils';
import { ELEMENT_TOC, type TocPlugin } from '../createTocPlugin';

export type useTocElementStateProps = {
  isScroll: boolean;
  topOffset: number;
};

export const useTocElementState = ({
  isScroll,
  topOffset,
}: useTocElementStateProps) => {
  const editor = useEditorRef();

  const queryHeading = getPluginOptions<TocPlugin>(
    editor,
    ELEMENT_TOC
  ).queryHeading;

  const headingList = useEditorSelector(queryHeading, []);

  const containerRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = toDOMNode(editor, editor);

    if (!container) return;

    containerRef.current = container;

    return () => {
      containerRef.current = null;
    };
  }, [editor]);

  const onContentScroll = React.useCallback(
    (el: HTMLElement, id: string, behavior: ScrollBehavior = 'instant') => {
      if (!containerRef.current) return;
      if (isScroll) {
        containerRef.current?.scrollTo({
          behavior,
          top: heightToTop(el, containerRef as any) - topOffset,
        });
      } else {
        const top = heightToTop(el) - topOffset;
        window.scrollTo({ behavior, top });
      }

      setTimeout(() => {
        addSelectedRow(editor, id);
      }, 0);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isScroll, topOffset]
  );

  return { editor, headingList, onContentScroll };
};

export const useTocElement = ({
  editor,
  onContentScroll,
}: ReturnType<typeof useTocElementState>) => {
  return {
    props: {
      onClick: (
        e: React.MouseEvent<HTMLElement, globalThis.MouseEvent>,
        item: Heading,
        behavior: ScrollBehavior
      ) => {
        e.preventDefault();
        const { id, path } = item;
        const node = getNode(editor, path);

        if (!node) return;

        const el = toDOMNode(editor, node);

        if (!el) return;

        onContentScroll(el, id, behavior);
      },
    },
  };
};
