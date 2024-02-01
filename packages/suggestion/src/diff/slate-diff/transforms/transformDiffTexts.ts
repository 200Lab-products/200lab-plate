import { TOperation, TText } from '@udecode/plate-common';
import { Path } from 'slate';

import { dmp } from '../utils/dmp';
import { getProperties } from '../utils/get-properties';

// Main function to transform an array of text nodes into another array of text nodes
export function transformDiffTexts(
  nodes: TText[],
  nextNodes: TText[],
  path: number[]
): TOperation[] {
  // Validate input - both arrays must have at least one node
  if (nodes.length === 0) throw new Error('must have at least one nodes');
  if (nextNodes.length === 0)
    throw new Error('must have at least one nextNodes');

  const operations: TOperation[] = [];

  // Start with the first node in the array, assuming all nodes are to be merged into one
  let node = nodes[0];

  if (nodes.length > 1) {
    // If there are multiple nodes, merge them into one, adding merge operations
    for (let i = 1; i < nodes.length; i++) {
      operations.push({
        type: 'merge_node',
        path: Path.next(path),
        position: 0, // Required by type; not actually used here
        properties: {}, // Required by type; not actually used here
      });
      // Update the node's text with the merged text (for splitTextNodes)
      node = { ...node, text: node.text + nodes[i].text };
    }
  }

  // After merging, apply split operations based on the target state (`nextNodes`)
  for (const op of splitTextNodes(node, nextNodes, path)) {
    operations.push(op);
  }

  return operations;
}

// Function to compute the text operations needed to transform string `a` into string `b`
function slateTextDiff(a: string, b: string): Omit<TOperation, 'path'>[] {
  // Compute the diff between two strings
  const diff = dmp.diff_main(a, b);
  dmp.diff_cleanupSemantic(diff);

  const operations: Omit<TOperation, 'path'>[] = [];

  // Initialize an offset to track position within the string
  let offset = 0;
  // Initialize an index to iterate through the diff chunks
  let i = 0;

  while (i < diff.length) {
    const chunk = diff[i];
    const op = chunk[0]; // Operation code: -1 = delete, 0 = leave unchanged, 1 = insert
    const text = chunk[1]; // The text associated with this diff chunk

    switch (op) {
      case 0: {
        // For unchanged text, just move the offset forward
        offset += text.length;

        break;
      }
      case -1: {
        // For deletions, add a remove_text operation
        operations.push({ type: 'remove_text', offset, text });
        // operations.push({ type: 'split_node', path:  })
        break;
      }
      case 1: {
        // For insertions, add an insert_text operation
        operations.push({ type: 'insert_text', offset, text });
        // operations.push({
        //   type: 'insert_node',
        //   node: getSuggestionNode({
        //     text,
        //   }),
        // });
        // Move the offset forward by the length of the inserted text
        offset += text.length;

        break;
      }
      // No default
    }
    // Move to the next diff chunk
    i += 1;
  }
  // console.info("slateTextDiff", { a, b, diff, operations });
  return operations;
}

/* Accomplish something like this

node={"text":"xyz A **B** C"} ->
               split={"text":"A "} {"text":"B","bold":true} {"text":" C"}

via a combination of remove_text/insert_text as above and split_node
operations.
*/
// Function to split a single text node into multiple nodes based on the desired target state
function splitTextNodes(
  node: TText,
  split: TText[],
  path: number[] // the path to node.
): TOperation[] {
  if (split.length === 0) {
    // If there are no target nodes, simply remove the original node
    return [
      {
        type: 'remove_node',
        node,
        path,
      },
    ];
  }

  // Start with the concatenated text of the target state
  let splitText = '';
  for (const { text } of split) {
    splitText += text;
  }
  const nodeText = node.text;
  const operations: TOperation[] = [];

  // If the concatenated target text differs from the original, compute the necessary text transformations
  if (splitText !== nodeText) {
    // Use diff-match-pach to transform the text in the source node to equal
    // the text in the sequence of target nodes.  Once we do this transform,
    // we can then worry about splitting up the resulting source node.
    for (const op of slateTextDiff(nodeText, splitText)) {
      // TODO: maybe path has to be changed if there are multiple OPS?
      operations.push({ path, ...op } as any);
    }
  }

  // Adjust properties of the initial node to match the first target node, if necessary
  const newProperties = getProperties(split[0], node);
  if (getKeysLength(newProperties) > 0) {
    operations.push({
      type: 'set_node',
      path,
      properties: getProperties(node),
      newProperties,
    });
  }

  let properties = getProperties(split[0]);
  // For each segment in the target state, split the node and adjust properties as needed
  let splitPath = path;
  for (let i = 0; i < split.length - 1; i++) {
    const part = split[i];
    const nextPart = split[i + 1];
    const newProps = getProperties(nextPart, properties);

    operations.push({
      type: 'split_node',
      path: splitPath,
      position: part.text.length,
      properties: newProps,
    });

    splitPath = Path.next(splitPath);
    properties = getProperties(nextPart);
  }
  return operations;
}

/*
NOTE: the set_node api lets you delete properties by setting
them to null, but the split_node api doesn't (I guess Ian forgot to
implement that... or there is a good reason).  So if there are any
property deletes, then we have to also do a set_node... or just be
ok with undefined values.  For text where values are treated as
booleans, this is fine and that's what we do.   Maybe the reason
is just to keep the operations simple and minimal.
Also setting to undefined / false-ish for a *text* node property
is equivalent to not having it regarding everything else.
*/

function getKeysLength(obj: object | undefined | null): number {
  if (obj == null) {
    return 0;
  }
  return Object.keys(obj).length;
}

interface Op {
  type: 'insert_text' | 'remove_text';
  offset: number;
  text: string;
}
