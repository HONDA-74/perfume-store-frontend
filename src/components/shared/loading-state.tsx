import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib';

export interface LoadingStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * LoadingState — centered loading indicator with optional message.
 * Used for full-page or section-level loading states.
 */
const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ message = 'Loading...', size = 'md', className, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12',
          className,
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        <Loader2
          className={cn(
            'animate-spin text-primary-500',
            sizeClasses[size],
          )}
        />
        {message && (
          <p className="mt-4 text-body-md text-neutral-600">{message}</p>
        )}
      </div>
    );
  },
);
LoadingState.displayName = 'LoadingState';

export { LoadingState };
