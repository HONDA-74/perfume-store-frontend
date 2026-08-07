import * as React from 'react';
import { FileQuestion } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/ui/button';

export interface NotFoundStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onGoHome?: () => void;
  homeLabel?: string;
}

/**
 * NotFoundState — 404-style state for missing content or pages.
 * Provides clear messaging and navigation back to home/catalog.
 */
const NotFoundState = React.forwardRef<HTMLDivElement, NotFoundStateProps>(
  (
    {
      title = 'Page not found',
      message = 'The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.',
      onGoHome,
      homeLabel = 'Go to Home',
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
        {...props}
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
          <FileQuestion className="h-8 w-8 text-neutral-400" />
        </div>
        <h3 className="mb-2 font-serif text-h3 font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="mb-6 max-w-md text-body-md text-neutral-600">
          {message}
        </p>
        {onGoHome && (
          <Button variant="default" onClick={onGoHome}>
            {homeLabel}
          </Button>
        )}
      </div>
    );
  },
);
NotFoundState.displayName = 'NotFoundState';

export { NotFoundState };
