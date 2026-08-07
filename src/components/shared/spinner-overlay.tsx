import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib';

export interface SpinnerOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  isVisible: boolean;
}

/**
 * SpinnerOverlay — minimal spinner overlay without background.
 * Used for inline loading states within containers.
 */
const SpinnerOverlay = React.forwardRef<HTMLDivElement, SpinnerOverlayProps>(
  ({ isVisible, className, ...props }, ref) => {
    if (!isVisible) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'absolute inset-0 flex items-center justify-center bg-neutral-0/80',
          className,
        )}
        role="status"
        aria-live="polite"
        {...props}
      >
        <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
      </div>
    );
  },
);
SpinnerOverlay.displayName = 'SpinnerOverlay';

export { SpinnerOverlay };
