import type { DeserializeHtml } from '@udecode/plate-common/server';

import { ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from './constants';

export const deserializeHtmlCodeBlock: DeserializeHtml = {
  getNode: (el) => {
    const languageSelectorText =
      [...el.childNodes].find((node: ChildNode) => node.nodeName === 'SELECT')
        ?.textContent || '';

    let codeClass = el.querySelector('code')?.getAttribute('class');
    let langName = 'text';

    if (codeClass) {
      langName = codeClass.split(/language-([a-z]+)/)[1];
    }

    const textContent = el.textContent?.replace(languageSelectorText, '') || '';

    let lines = textContent.split('\n');

    if (!lines?.length) {
      lines = [textContent];
    }

    const codeLines = lines.map((line) => ({
      children: [{ text: line }],
      type: ELEMENT_CODE_LINE,
    }));

    return {
      children: codeLines,
      type: ELEMENT_CODE_BLOCK,
      lang: langName
    };
  },
  rules: [
    {
      validNodeName: 'PRE',
    },
    {
      validNodeName: 'P',
      validStyle: {
        fontFamily: 'Consolas',
      },
    },
  ],
};
