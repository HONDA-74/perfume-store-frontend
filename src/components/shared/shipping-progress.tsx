import * as React from 'react';
import { Truck, Check } from 'lucide-react';
import { cn } from '@/lib';

export interface ShippingProgressProps
  extends React.HTMLAttributes<HTMLDivElement> {
  current: number;
  threshold: number;
  currency?: string;
  locale?: string;
}

/**
 * ShippingProgress — displays progress towards free shipping threshold.
 * Shows amount remaining and visual progress bar.
 */
const ShippingProgress = React.forwardRef<
  HTMLDivElement,
  ShippingProgressProps
>(
  (
    {
      current,
      threshold,
      currency = 'USD',
      locale = 'en-US',
      className,
      ...props
    },
    ref,
  ) => {
    const remaining = Math.max(0, threshold - current);
    const progress = Math.min(100, (current / threshold) * 100);
    const isQualified = current >= threshold;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(amount);
    };

    return (
      <div
        ref={ref}
        className={cn('space-y-2 rounded-lg bg-neutral-50 p-4', className)}
        {...props}
      >
        {/* Message */}
        <div className="flex items-center gap-2">
          {isQualified ? (
            <>
              <Check className="h-5 w-5 text-success-500" />
              <p className="text-body-sm font-medium text-success-700">
                You qualify for free shipping!
              </p>
            </>
          ) : (
            <>
              <Truck className="h-5 w-5 text-neutral-600" />
              <p className="text-body-sm text-neutral-700">
                Add {formatCurrency(remaining)} more for free shipping
              </p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
          <div
            className="h-full bg-primary-500 transition-all duration-normal"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    );
  },
);
ShippingProgress.displayName = 'ShippingProgress';

export { ShippingProgress };
