import { getSlatePluginOptions, RenderLeaf } from '@udecode/slate-plugins-core';
import { getRenderLeaf } from '../utils/getRenderLeaf';

export const useRenderLeaf = (pluginKey: string): RenderLeaf => (editor) =>
  getRenderLeaf(getSlatePluginOptions(editor, pluginKey));
