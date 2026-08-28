/**
 * Price Component
 *
 * Displays product price with optional original price (for sales).
 * Adapted from Figma UI with correct backend field mapping.
 *
 * Backend fields:
 * - price: Current/discounted price
 * - discountPrice: Optional discounted price (if exists, show as current)
 *
 * Display logic:
 * - If discountPrice exists: show discountPrice as current, price as original (strikethrough)
 * - If no discountPrice: show price only
 */

import { cn } from '@/lib/cn';

export interface PriceProps {
  /** Current price to display (or discounted price if on sale) */
  price: number;
  /** Original price before discount (optional) */
  discountPrice?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
}

const sizeMap = {
  sm: { price: 'text-sm', original: 'text-xs' },
  md: { price: 'text-base', original: 'text-sm' },
  lg: { price: 'text-xl', original: 'text-base' },
};

export function Price({ price, discountPrice, size = 'md', className }: PriceProps) {
  const sizes = sizeMap[size];
  const isOnSale = discountPrice !== undefined && discountPrice < price;

  // If on sale, show discountPrice as current and price as original
  const currentPrice = isOnSale ? discountPrice : price;
  const originalPrice = isOnSale ? price : undefined;
  const format = (value: number) => `$${new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)}`;

  return (
    <div className={cn('flex items-baseline gap-2 font-sans', className)}>
      <span className={cn(sizes.price, 'font-medium text-gold')}>
        {format(currentPrice)}
      </span>
      {originalPrice !== undefined && (
        <span className={cn(sizes.original, 'text-muted-foreground/30 line-through')}>
          {format(originalPrice)}
        </span>
      )}
    </div>
  );
}
