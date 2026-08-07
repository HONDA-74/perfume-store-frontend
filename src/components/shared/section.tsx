import * as React from 'react';
import { cn } from '@/lib';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  as?: 'section' | 'div' | 'article' | 'aside';
}

/**
 * Section — semantic section wrapper with vertical spacing.
 * Per Design_System.md §4.3 section spacing specifications.
 */
const Section = React.forwardRef<
  HTMLElement,
  SectionProps & { ref?: React.Ref<HTMLElement> }
>(({ spacing = 'md', as: Component = 'section', className, ...props }, ref) => {
  const spacingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12 lg:py-16',
    lg: 'py-16 lg:py-20',
    xl: 'py-20 lg:py-24',
  };

  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(spacingClasses[spacing], className)}
      {...props}
    />
  );
});
Section.displayName = 'Section';

export { Section };
