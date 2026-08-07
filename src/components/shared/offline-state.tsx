import * as React from 'react';
import { WifiOff } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/ui/button';

export interface OfflineStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * OfflineState — displays when network connection is lost.
 * Provides clear offline messaging and retry action.
 */
const OfflineState = React.forwardRef<HTMLDivElement, OfflineStateProps>(
  (
    {
      title = 'No internet connection',
      message = 'Please check your network connection and try again.',
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
        aria-live="assertive"
        {...props}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <WifiOff className="h-8 w-8 text-neutral-400" />
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
OfflineState.displayName = 'OfflineState';

export { OfflineState };
