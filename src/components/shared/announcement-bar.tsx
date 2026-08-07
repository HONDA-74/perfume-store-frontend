import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib';

export interface AnnouncementBarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: 'default' | 'primary' | 'info';
}

/**
 * AnnouncementBar — top-of-page banner for site-wide announcements.
 * Supports dismissible state and visual variants.
 */
const AnnouncementBar = React.forwardRef<HTMLDivElement, AnnouncementBarProps>(
  (
    {
      message,
      dismissible = false,
      onDismiss,
      variant = 'default',
      className,
      ...props
    },
    ref,
  ) => {
    const variantClasses = {
      default: 'bg-neutral-900 text-neutral-0',
      primary: 'bg-primary-500 text-neutral-900',
      info: 'bg-neutral-800 text-neutral-0',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-center px-4 py-2 text-center',
          variantClasses[variant],
          className,
        )}
        role="banner"
        {...props}
      >
        <p className="text-body-sm font-medium">{message}</p>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  },
);
AnnouncementBar.displayName = 'AnnouncementBar';

export { AnnouncementBar };
