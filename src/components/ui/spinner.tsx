/* eslint-disable react-refresh/only-export-components */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        default: 'h-6 w-6',
        sm: 'h-4 w-4',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
  srText?: string;
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, srText = 'Loading...', ...props }, ref) => {
    return (
      <div ref={ref} role="status" className={cn('inline-block', className)} {...props}>
        <div className={cn(spinnerVariants({ size }))} />
        <span className="sr-only">{srText}</span>
      </div>
    );
  },
);
Spinner.displayName = 'Spinner';

export { Spinner, spinnerVariants };
