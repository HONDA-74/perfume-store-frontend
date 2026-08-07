import * as React from 'react';
import { cn } from '@/lib';

export interface SectionHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
}

/**
 * SectionHeader — section title with optional description and action.
 * Provides consistent header styling across sections.
 */
const SectionHeader = React.forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    { title, description, action, align = 'left', className, ...props },
    ref,
  ) => {
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mb-8 flex flex-col gap-4',
          align === 'left' ? 'items-start' : 'items-center',
          className,
        )}
        {...props}
      >
        <div className={cn('flex-1', alignClasses[align])}>
          <h2 className="font-serif text-h2 font-bold text-neutral-900">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-body-lg text-neutral-600">{description}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    );
  },
);
SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
