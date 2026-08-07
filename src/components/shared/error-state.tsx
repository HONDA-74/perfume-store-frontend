import * as React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/ui/button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * ErrorState — displays error messaging with optional retry action.
 * Used when data fetching or operations fail.
 */
const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      title = 'Something went wrong',
      message = 'Unable to load this content. Please try again.',
      onRetry,
      retryLabel = 'Try Again',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className,
        )}
        role="alert"
        {...props}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-50">
          <AlertCircle className="h-8 w-8 text-error-500" />
        </div>
        <h3 className="mb-2 font-serif text-h3 font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="mb-6 max-w-md text-body-md text-neutral-600">
          {message}
        </p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </div>
    );
  },
);
ErrorState.displayName = 'ErrorState';

export { ErrorState };
