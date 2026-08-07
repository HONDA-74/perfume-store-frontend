import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib';

export interface LoadingOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  message?: string;
}

/**
 * LoadingOverlay — semi-transparent overlay with spinner.
 * Blocks interaction while async operations complete.
 */
const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ isLoading, message, className, ...props }, ref) => {
    if (!isLoading) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-modal flex flex-col items-center justify-center bg-neutral-900/50 backdrop-blur-sm',
          className,
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        <div className="rounded-lg bg-neutral-0 p-6 shadow-xl">
          <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary-500" />
          {message && (
            <p className="text-body-md font-medium text-neutral-900">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  },
);
LoadingOverlay.displayName = 'LoadingOverlay';

export { LoadingOverlay };
