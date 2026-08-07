import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib';
import { Logo } from './logo';

export interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showLogo?: boolean;
}

/**
 * PageLoader — full-page loading screen with brand logo and spinner.
 * Used for initial page loads and route transitions.
 */
const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  ({ showLogo = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-modal flex flex-col items-center justify-center bg-neutral-0',
          className,
        )}
        role="status"
        aria-live="polite"
        aria-label="Loading page"
        {...props}
      >
        {showLogo && (
          <div className="mb-8">
            <Logo variant="dark" size="lg" />
          </div>
        )}
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  },
);
PageLoader.displayName = 'PageLoader';

export { PageLoader };
