import * as React from 'react';
import { cn } from '@/lib';

export interface DividerTitleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * DividerTitle — title with horizontal divider lines on sides.
 * Elegant section separator with centered text.
 */
const DividerTitle = React.forwardRef<HTMLDivElement, DividerTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-4', className)}
        {...props}
      >
        <div className="h-px flex-1 bg-neutral-200" />
        <h3 className="font-serif text-h3 font-semibold text-neutral-900">
          {children}
        </h3>
        <div className="h-px flex-1 bg-neutral-200" />
      </div>
    );
  },
);
DividerTitle.displayName = 'DividerTitle';

export { DividerTitle };
