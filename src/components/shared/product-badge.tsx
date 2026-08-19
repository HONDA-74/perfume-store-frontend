/**
 * Product Badge Component
 *
 * Displays product badges (new, sale, bestseller, limited).
 * Badges are derived from backend product fields via product-adapter.
 *
 * Badge derivation logic (in product-adapter.ts):
 * - sale: if discountPrice exists
 * - bestseller: if isFeatured is true
 * - new: if created within last 30 days
 * - limited: if stock < 10 units
 */

import { cn } from '@/lib/cn';

export type ProductBadgeType = 'new' | 'sale' | 'bestseller' | 'limited';

export interface ProductBadgeProps {
  /** Badge type */
  badge: ProductBadgeType;
  /** Additional CSS classes */
  className?: string;
}

const badgeConfig: Record<ProductBadgeType, { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-kenz-champagne/15 text-kenz-champagne border-kenz-champagne/25',
  },
  sale: {
    label: 'Sale',
    className: 'bg-kenz-gold/15 text-kenz-gold border-kenz-gold/25',
  },
  bestseller: {
    label: 'Bestseller',
    className: 'bg-kenz-gold/20 text-kenz-gold border-kenz-gold/30',
  },
  limited: {
    label: 'Limited',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
};

export function ProductBadge({ badge, className }: ProductBadgeProps) {
  const { label, className: badgeClass } = badgeConfig[badge];

  return (
    <span
      className={cn(
        'inline-block font-sans text-[9px] font-medium uppercase tracking-[0.15em]',
        'rounded-[2px] border px-2 py-0.5',
        badgeClass,
        className,
      )}
    >
      {label}
    </span>
  );
}
