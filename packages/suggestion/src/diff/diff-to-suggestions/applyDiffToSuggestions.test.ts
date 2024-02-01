import { createPlateEditor } from '@udecode/plate-common';

import { applyDiffToSuggestions } from './applyDiffToSuggestions';
import {
  addMarkFixtures,
  addTwoMarkFixtures,
  insertTextAddMarkFixtures,
  insertTextFixtures,
  insertUpdateParagraphFixtures,
  insertUpdateTwoParagraphsFixtures,
  mergeNodeFixtures,
  mergeRemoveTextFixtures,
  mergeTextFixtures,
  mergeTwoTextFixtures,
  removeTextFixtures,
} from './applyDiffToSuggestions.fixtures';

describe('slate-diff', () => {
  let editor: any;
  const options = { idFactory: () => '1' };

  beforeEach(() => {
    editor = createPlateEditor();
  });

  it('insert-text', () => {
    editor.children = insertTextFixtures.doc1;
    applyDiffToSuggestions(editor, insertTextFixtures.operations, options);
    expect(editor.children).toStrictEqual(insertTextFixtures.doc2);
  });

  it('remove-text', () => {
    editor.children = removeTextFixtures.doc1;
    applyDiffToSuggestions(editor, removeTextFixtures.operations, options);
    expect(editor.children).toStrictEqual(removeTextFixtures.doc2);
  });

  it('add-mark', () => {
    editor.children = addMarkFixtures.doc1;
    applyDiffToSuggestions(editor, addMarkFixtures.operations, options);
    expect(editor.children).toStrictEqual(addMarkFixtures.doc2);
  });

  it('add-two-mark', () => {
    editor.children = addTwoMarkFixtures.doc1;
    applyDiffToSuggestions(editor, addTwoMarkFixtures.operations, options);
    expect(editor.children).toStrictEqual(addTwoMarkFixtures.doc2);
  });

  it('insert-text-and-add-mark', () => {
    editor.children = insertTextAddMarkFixtures.doc1;
    applyDiffToSuggestions(
      editor,
      insertTextAddMarkFixtures.operations,
      options
    );
    expect(editor.children).toStrictEqual(insertTextAddMarkFixtures.doc2);
  });

  it('merge-text', () => {
    editor.children = mergeTextFixtures.doc1;
    applyDiffToSuggestions(editor, mergeTextFixtures.operations, options);
    expect(editor.children).toStrictEqual(mergeTextFixtures.doc2);
  });

  it('merge-two-text', () => {
    editor.children = mergeTwoTextFixtures.doc1;
    applyDiffToSuggestions(editor, mergeTwoTextFixtures.operations, options);
    expect(editor.children).toStrictEqual(mergeTwoTextFixtures.doc2);
  });

  it('merge-node', () => {
    editor.children = mergeNodeFixtures.doc1;
    applyDiffToSuggestions(editor, mergeNodeFixtures.operations, options);
    expect(editor.children).toStrictEqual(mergeNodeFixtures.doc2);
  });

  it('merge-remove-text', () => {
    editor.children = mergeRemoveTextFixtures.doc1;
    applyDiffToSuggestions(editor, mergeRemoveTextFixtures.operations, options);
    expect(editor.children).toStrictEqual(mergeRemoveTextFixtures.doc2);
  });

  it('insert-and-update-paragraph', () => {
    editor.children = insertUpdateParagraphFixtures.doc1;
    applyDiffToSuggestions(
      editor,
      insertUpdateParagraphFixtures.operations,
      options
    );
    expect(editor.children).toStrictEqual(insertUpdateParagraphFixtures.doc2);
  });

  it('insert-and-update-two-paragraphs', () => {
    editor.children = insertUpdateTwoParagraphsFixtures.doc1;
    applyDiffToSuggestions(
      editor,
      insertUpdateTwoParagraphsFixtures.operations,
      options
    );
    expect(editor.children).toStrictEqual(
      insertUpdateTwoParagraphsFixtures.doc2
    );
  });
});
