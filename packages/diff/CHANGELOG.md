# @udecode/plate-diff

## 30.6.1

### Patch Changes

- [#2984](https://github.com/udecode/plate/pull/2984) by [@12joan](https://github.com/12joan) – Fix: Node equivalency checking is incorrectly dependent on the key order of the node object

## 30.6.0

### Minor Changes

- [#2982](https://github.com/udecode/plate/pull/2982) by [@12joan](https://github.com/12joan) – `computeDiff`: Add `lineBreakChar?: string` option to replace `\n` characters in inserted and removed text with a character such as '¶'. Without this option, added or removed line breaks may be difficult to notice in the diff.

## 30.5.3

### Patch Changes

- [`4cbed7159`](https://github.com/udecode/plate/commit/4cbed7159d51f7427051686e45bcf2a8899aeede) by [@zbeyens](https://github.com/zbeyens) – Move `@udecode/plate-common` to peerDeps to fix a bug when multiple instances were installed

## 30.5.2

### Patch Changes

- [#2961](https://github.com/udecode/plate/pull/2961) by [@zbeyens](https://github.com/zbeyens) – Move `@udecode/plate-common` to peerDeps to fix a bug when multiple instances were installed

## 30.5.0

### Minor Changes

- [#2945](https://github.com/udecode/plate/pull/2945) by [@12joan](https://github.com/12joan) – Refactor `slateDiff` into `@udecode/plate-diff` and add `diffToSuggestions` instead
