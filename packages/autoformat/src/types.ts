import type { PlateEditor, Value } from '@udecode/plate-common/server';

import type { GetMatchPointsReturnType } from './utils/getMatchPoints';

export interface MatchRange {
  end: string;
  start: string;
}

export interface AutoformatQueryOptions<
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
> extends Omit<AutoformatCommonRule<V, E>, 'query'> {
  /** `insertText` text. */
  text: string;
}

export interface AutoformatCommonRule<
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
> {
  /**
   * The rule applies when the trigger and the text just before the cursor
   * matches. For `mode: 'block'`: lookup for the end match(es) before the
   * cursor. For `mode: 'text'`: lookup for the end match(es) before the cursor.
   * If `format` is an array, also lookup for the start match(es). For `mode:
   * 'mark'`: lookup for the start and end matches. Note: `'_*'`, `['_*']` and
   * `{ start: '_*', end: '*_' }` are equivalent.
   */
  match: MatchRange | MatchRange[] | string | string[];

  /**
   * If true, insert the triggering character after autoformatting.
   *
   * @default: false
   */
  insertTrigger?: boolean;

  /** Query to allow autoformat. */
  query?: (editor: E, options: AutoformatQueryOptions<V, E>) => boolean;

  /**
   * Triggering character to autoformat.
   *
   * @default the last character of `match` or `match.end`
   */
  trigger?: string | string[];
}

export interface AutoformatBlockRule<
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
> extends AutoformatCommonRule<V, E> {
  match: string | string[];

  /**
   * - Text: insert text.
   * - Block: set block type or custom format.
   * - Mark: insert mark(s) between matches.
   *
   * @default 'text'
   */
  mode: 'block';

  /**
   * If true, allow to autoformat even if there is a block of the same type
   * above the selected block.
   *
   * @default false
   */
  allowSameTypeAbove?: boolean;

  /**
   * Custom formatting function.
   *
   * @default setNodes(editor, { type }, { match: (n) => isBlock(editor, n) })
   */
  format?: (editor: E) => void;

  /**
   * Function called just before `format`. Generally used to reset the selected
   * block.
   */
  preFormat?: (editor: E) => void;

  /**
   * If true, the trigger should be at block start to allow autoformatting.
   *
   * @default true
   */
  triggerAtBlockStart?: boolean;

  /**
   * For `mode: 'block'`: set block type. If `format` is defined, this field is
   * ignored. For `mode: 'mark'`: Mark(s) to add.
   */
  type?: string;
}

export interface AutoformatMarkRule<
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
> extends AutoformatCommonRule<V, E> {
  mode: 'mark';

  /** Mark(s) to add. */
  type: string | string[];

  /** If false, do not format when the string can be trimmed. */
  ignoreTrim?: boolean;
}

export interface AutoformatTextRule<
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
> extends AutoformatCommonRule<V, E> {
  /**
   * String: the matched text is replaced by that string. string[]: the matched
   * texts are replaced by these strings. function: called when there is a
   * match.
   */
  format:
    | ((editor: E, options: GetMatchPointsReturnType) => void)
    | string
    | string[];

  match: string | string[];

  mode: 'text';
}

export type AutoformatRule<
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
> =
  | AutoformatBlockRule<V, E>
  | AutoformatMarkRule<V, E>
  | AutoformatTextRule<V, E>;

export interface AutoformatPlugin<
  V extends Value = Value,
  E extends PlateEditor<V> = PlateEditor<V>,
> {
  enableUndoOnDelete?: boolean;
  /** A list of triggering rules. */
  rules?: AutoformatRule<V, E>[];
}
