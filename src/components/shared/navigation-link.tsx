import * as React from 'react';
import { cn } from '@/lib';

export interface NavigationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  variant?: 'default' | 'footer';
}

/**
 * NavigationLink — styled anchor for primary and footer navigation.
 * Supports active state highlighting and hover effects.
 */
const NavigationLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationLinkProps
>(({ isActive = false, variant = 'default', className, children, ...props }, ref) => {
  const baseClasses =
    'inline-flex items-center font-sans font-medium transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

  const variantClasses = {
    default: cn(
      'text-body-md text-neutral-700 hover:text-primary-500',
      isActive && 'text-primary-500 font-semibold',
    ),
    footer: cn(
      'text-body-sm text-neutral-400 hover:text-neutral-0',
      isActive && 'text-neutral-0',
    ),
  };

  return (
    <a
      ref={ref}
      className={cn(baseClasses, variantClasses[variant], className)}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  );
});
NavigationLink.displayName = 'NavigationLink';

export { NavigationLink };
