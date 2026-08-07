import * as React from 'react';
import { cn } from '@/lib';

export interface PriceProps extends React.HTMLAttributes<HTMLSpanElement> {
  amount: number;
  currency?: string;
  locale?: string;
}

/**
 * Price — formats and displays monetary amounts with proper currency symbols.
 * Uses Intl.NumberFormat for locale-aware formatting.
 */
const Price = React.forwardRef<HTMLSpanElement, PriceProps>(
  (
    { amount, currency = 'USD', locale = 'en-US', className, ...props },
    ref,
  ) => {
    const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(amount);

    return (
      <span
        ref={ref}
        className={cn('font-sans font-semibold text-neutral-900', className)}
        {...props}
      >
        {formatted}
      </span>
    );
  },
);
Price.displayName = 'Price';

export { Price };
