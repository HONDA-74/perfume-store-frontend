import * as React from 'react';
import { cn } from '@/lib';

export interface PageLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  showLogo?: boolean;
}

/**
 * PageLoader — full-page loading screen with KENZ brand styling.
 * Used for initial page loads and route transitions.
 */
const PageLoader = React.forwardRef<HTMLDivElement, PageLoaderProps>(
  ({ showLogo = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('fixed inset-0 z-modal flex flex-col items-center justify-center bg-kenz-bg', className)}
        role="status"
        aria-live="polite"
        aria-label="Loading page"
        {...props}
      >
        <div className="flex flex-col items-center gap-6">
          <div className="relative h-10 w-10">
            <div
              className="absolute inset-0 rounded-full border border-transparent"
              style={{
                borderTopColor: 'hsl(43 82% 52%)',
                animation: 'spin 0.9s var(--ease-kenz, cubic-bezier(0.16, 1, 0.3, 1)) infinite',
              }}
            />
            <div
              className="absolute inset-1 rounded-full border border-transparent"
              style={{
                borderTopColor: 'rgba(212,163,23,0.35)',
                animation: 'spin 1.3s var(--ease-kenz, cubic-bezier(0.16, 1, 0.3, 1)) infinite reverse',
              }}
            />
          </div>
          {showLogo && (
            <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-kenz-champagne/50">KENZ</span>
          )}
        </div>
      </div>
    );
  },
);
PageLoader.displayName = 'PageLoader';

export { PageLoader };
