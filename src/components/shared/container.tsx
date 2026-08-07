import * as React from 'react';
import { cn } from '@/lib';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Container — responsive container with max-width bounds.
 * Per Design_System.md §4.1 layout specifications.
 */
const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = '2xl', className, ...props }, ref) => {
    const maxWidthClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'container mx-auto px-4 sm:px-6 lg:px-8',
          maxWidthClasses[maxWidth],
          className,
        )}
        {...props}
      />
    );
  },
);
Container.displayName = 'Container';

export { Container };
