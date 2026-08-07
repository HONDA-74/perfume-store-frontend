import * as React from 'react';
import { cn } from '@/lib';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

/**
 * Logo component — renders the KENZ wordmark in Playfair Display serif.
 * Supports light/dark variants and optional tagline display.
 * Follows BRAND_GUIDELINES.md §9 and LOGO_USAGE.md specifications.
 */
const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  (
    { variant = 'dark', size = 'md', showTagline = false, className, ...props },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'text-2xl',
      md: 'text-3xl',
      lg: 'text-4xl',
    };

    const variantClasses = {
      light: 'text-neutral-0',
      dark: 'text-neutral-900',
      primary: 'text-primary-500',
    };

    return (
      <div
        ref={ref}
        className={cn('flex flex-col', className)}
        {...props}
        aria-label="KENZ - Discover the World's Fragrance Treasures"
      >
        <span
          className={cn(
            'font-serif font-semibold tracking-wider',
            sizeClasses[size],
            variantClasses[variant],
          )}
        >
          KENZ
        </span>
        {showTagline && (
          <span
            className={cn(
              'text-caption mt-1 font-sans tracking-wide',
              variant === 'light'
                ? 'text-neutral-100'
                : variant === 'primary'
                  ? 'text-neutral-700'
                  : 'text-neutral-600',
            )}
          >
            Discover the World&rsquo;s Fragrance Treasures
          </span>
        )}
      </div>
    );
  },
);
Logo.displayName = 'Logo';

export { Logo };
