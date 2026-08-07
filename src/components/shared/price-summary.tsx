import * as React from 'react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';
import { Price } from './price';

export interface PriceSummaryItem {
  label: string;
  amount: number;
  emphasized?: boolean;
}

export interface PriceSummaryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: PriceSummaryItem[];
  totalLabel?: string;
  totalAmount: number;
  currency?: string;
  locale?: string;
}

/**
 * PriceSummary — itemized price breakdown for cart and checkout.
 * Displays subtotal, shipping, taxes, and final total.
 */
const PriceSummary = React.forwardRef<HTMLDivElement, PriceSummaryProps>(
  (
    {
      items,
      totalLabel = 'Total',
      totalAmount,
      currency = 'USD',
      locale = 'en-US',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn('space-y-3 rounded-lg bg-neutral-50 p-4', className)}
        {...props}
      >
        {/* Line Items */}
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between"
          >
            <span
              className={cn(
                'text-body-sm',
                item.emphasized
                  ? 'font-semibold text-neutral-900'
                  : 'text-neutral-600',
              )}
            >
              {item.label}
            </span>
            <Price
              amount={item.amount}
              currency={currency}
              locale={locale}
              className={cn(
                'text-body-sm',
                item.emphasized
                  ? 'font-semibold text-neutral-900'
                  : 'text-neutral-700',
              )}
            />
          </div>
        ))}

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-serif text-h4 font-bold text-neutral-900">
            {totalLabel}
          </span>
          <Price
            amount={totalAmount}
            currency={currency}
            locale={locale}
            className="font-serif text-h4 font-bold text-primary-500"
          />
        </div>
      </div>
    );
  },
);
PriceSummary.displayName = 'PriceSummary';

export { PriceSummary };
