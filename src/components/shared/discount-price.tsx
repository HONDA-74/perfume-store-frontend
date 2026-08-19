import * as React from 'react';
import { cn } from '@/lib';
import { Price } from './price';

export interface DiscountPriceProps extends React.HTMLAttributes<HTMLDivElement> {
  originalPrice: number;
  discountedPrice: number;
  currency?: string;
  locale?: string;
}

/**
 * DiscountPrice — displays original price (struck through) alongside
 * discounted price with clear visual hierarchy.
 */
const DiscountPrice = React.forwardRef<HTMLDivElement, DiscountPriceProps>(
  ({ originalPrice, discountedPrice, currency = 'USD', locale = 'en-US', className, ...props }, ref) => {
    const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);

    return (
      <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
        <Price price={originalPrice} discountPrice={discountedPrice} size="lg" className="text-error-500" />
        {discountPercentage > 0 && (
          <span className="text-caption font-semibold text-error-500">-{discountPercentage}%</span>
        )}
      </div>
    );
  },
);
DiscountPrice.displayName = 'DiscountPrice';

export { DiscountPrice };
