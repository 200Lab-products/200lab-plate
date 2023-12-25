import React from 'react';
import { PlateLeaf } from '@udecode/plate-common';

import { cn, withRef } from '@/lib/utils';

export const HighlightLeaf = withRef(
  PlateLeaf,
  ({ className, children, ...props }, ref) => (
    <PlateLeaf
      ref={ref}
      asChild
      className={cn('bg-primary/20 text-inherit dark:bg-primary/40', className)}
      {...props}
    >
      <mark>{children}</mark>
    </PlateLeaf>
  )
);
