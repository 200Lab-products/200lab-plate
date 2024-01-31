import React from 'react';
import { findNodePath, InjectComponentReturnType } from '@udecode/plate-common';
import { TIndentElement } from '@udecode/plate-indent';

import { getEnclosingToggleIds } from './queries';
import { useToggleControllerStore } from './store';

export const injectToggle = (): InjectComponentReturnType => WithToggle;

const WithToggle: InjectComponentReturnType = ({
  element,
  children,
  editor,
}) => {
  const [openIds] = useToggleControllerStore().use.openIds();
  const path = findNodePath(editor, element);
  if (!path) return children;

  // TODO Instead of relying on editor.children, use the element's siblings
  const inToggleIds = getEnclosingToggleIds(
    editor.children as TIndentElement[],
    [element, path]
  );

  const isOpen = inToggleIds.every((id) => openIds.has(id));
  if (isOpen) return children;

  return (
    <div
      style={{
        visibility: 'hidden',
        height: 0,
        margin: 0,
      }}
    >
      {children}
    </div>
  );
};
