import * as React from 'react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';

export interface PriceSummaryItem {
  label: string;
  amount: number;
  emphasized?: boolean;
}

export interface PriceSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
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
    const formatCurrency = (amount: number) =>
      new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);

    return (
      <div
        ref={ref}
        className={cn('bg-kenz-surface space-y-3 rounded-lg p-4', className)}
        {...props}
      >
        {/* Line Items */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span
              className={cn(
                'text-body-sm',
                item.emphasized ? 'text-foreground font-semibold' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </span>
            <span
              className={cn(
                'font-sans text-sm',
                item.emphasized ? 'text-foreground font-semibold' : 'text-foreground/80',
              )}
            >
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-h4 text-foreground font-serif font-bold">{totalLabel}</span>
          <span className="text-h4 text-kenz-gold font-serif font-bold">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    );
  },
);
PriceSummary.displayName = 'PriceSummary';

export { PriceSummary };
