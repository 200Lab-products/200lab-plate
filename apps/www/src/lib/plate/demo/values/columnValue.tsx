/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@udecode/plate-test-utils';

jsx;

export const columnValue: any = (
  <fragment>
    <hh2>🌻 Column</hh2>
    <hp>Create column and the border will hidden when viewing</hp>
    <hcolumngroup layout={[50, 50]}>
      <hcolumn>left</hcolumn>
      <hcolumn>right</hcolumn>
    </hcolumngroup>
  </fragment>
);
