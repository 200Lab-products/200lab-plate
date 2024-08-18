import {
  type TElement,
  createPluginFactory,
  getEndPoint,
  getNode,
  getNodeProps,
  getStartPoint,
  isCollapsed,
  resetEditorChildren,
  setNodes,
  unsetNodes,
  withoutNormalizing,
} from '@udecode/plate-common/server';
import { Point } from 'slate';

import type { ResetNodePlugin } from './types';

import { onKeyDownResetNode } from './onKeyDownResetNode';

export const KEY_RESET_NODE = 'resetNode';

/** Enables support for resetting block type from rules. */
export const createResetNodePlugin = createPluginFactory<ResetNodePlugin>({
  handlers: {
    onKeyDown: onKeyDownResetNode,
  },
  key: KEY_RESET_NODE,
  options: {
    rules: [],
  },
  withOverrides: (editor, { options }) => {
    const { deleteBackward, deleteFragment } = editor;

    if (!options.disableEditorReset) {
      const deleteFragmentPlugin = () => {
        const { selection } = editor;

        if (!selection) return;

        const start = getStartPoint(editor, []);
        const end = getEndPoint(editor, []);

        if (
          (Point.equals(selection.anchor, start) &&
            Point.equals(selection.focus, end)) ||
          (Point.equals(selection.focus, start) &&
            Point.equals(selection.anchor, end))
        ) {
          resetEditorChildren(editor, {
            insertOptions: { select: true },
          });

          return true;
        }
      };

      editor.deleteFragment = (direction) => {
        if (deleteFragmentPlugin()) return;

        deleteFragment(direction);
      };
    }
    if (!options.disableFirstBlockReset) {
      editor.deleteBackward = (unit) => {
        const { selection } = editor;

        if (selection && isCollapsed(selection)) {
          const start = getStartPoint(editor, []);

          if (Point.equals(selection.anchor, start)) {
            const node = getNode<TElement>(editor, [0])!;

            const { children, ...props } = editor.blockFactory({}, [0]);

            // replace props
            withoutNormalizing(editor, () => {
              // missing id will cause block selection not working and other issues
              const { id, ...nodeProps } = getNodeProps(node);

              unsetNodes(editor, Object.keys(nodeProps), { at: [0] });
              setNodes(editor, props, { at: [0] });
            });

            return;
          }
        }

        deleteBackward(unit);
      };
    }

    return editor;
  },
});
