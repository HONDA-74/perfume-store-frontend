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
 */
const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      title,
      message,
      actionLabel,
      onAction,
      className,
      ...props
    },
    ref,
  ) => {
    const defaultIcon = <Package className="h-8 w-8 text-neutral-400" />;

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
          {icon || defaultIcon}
        </div>
        <h3 className="mb-2 font-serif text-h3 font-semibold text-neutral-900">
          {title}
        </h3>
        {message && (
          <p className="mb-6 max-w-md text-body-md text-neutral-600">
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
