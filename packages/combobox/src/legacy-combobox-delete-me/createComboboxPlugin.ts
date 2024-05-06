import { createPluginFactory } from '@udecode/plate-common/server';

import { onChangeCombobox } from './onChangeCombobox';
import { onKeyDownCombobox } from './onKeyDownCombobox';

export const KEY_COMBOBOX = 'combobox';

export const createComboboxPlugin = createPluginFactory({
  handlers: {
    onChange: onChangeCombobox,
    onKeyDown: onKeyDownCombobox,
  },
  key: KEY_COMBOBOX,
});
