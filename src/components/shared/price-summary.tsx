import * as React from 'react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';

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
        className={cn('space-y-3 rounded-lg bg-kenz-surface p-4', className)}
        {...props}
      >
        {/* Line Items */}
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span
              className={cn(
                'text-body-sm',
                item.emphasized ? 'font-semibold text-foreground' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </span>
            <span className={cn('font-sans text-sm', item.emphasized ? 'font-semibold text-foreground' : 'text-foreground/80')}>
              ${item.amount.toFixed(2)}
            </span>
          </div>
        ))}

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-serif text-h4 font-bold text-foreground">{totalLabel}</span>
          <span className="font-serif text-h4 font-bold text-kenz-gold">${totalAmount.toFixed(2)}</span>
        </div>
      </div>
    );
  },
);
PriceSummary.displayName = 'PriceSummary';

export { PriceSummary };
