import * as React from 'react';
import { Package } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * EmptyState — displays message when a list/collection is empty.
 * Configurable icon, title, description, and call-to-action.
 * Updated with KENZ dark luxury styling.
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, message, actionLabel, onAction, className, ...props }, ref) => {
    const defaultIcon = <Package className="h-8 w-8 text-muted-foreground/15" />;

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center px-6 py-20 text-center', className)}
        {...props}
      >
        {(icon || defaultIcon) && <div className="mb-6 text-muted-foreground/15">{icon || defaultIcon}</div>}
        <h3 className="mb-3 font-serif text-h3 font-normal text-foreground/70">{title}</h3>
        {message && (
          <p className="text-body-sm mb-8 max-w-sm font-light leading-relaxed text-muted-foreground/35">
            {message}
          </p>
        )}
        {actionLabel && onAction && (
          <Button variant="default" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  },
);
EmptyState.displayName = 'EmptyState';

export { EmptyState };
