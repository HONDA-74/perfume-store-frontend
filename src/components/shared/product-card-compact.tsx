/**
 * Product Card Compact Component
 *
 * Condensed product card for dense grid layouts, cart items, or related products.
 * Integrated with real backend data and hooks.
 */

import * as React from 'react';
import { Link } from 'react-router';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { mapProductForUI, type ProductUI } from '@/lib/adapters';
import type { Product } from '@/types/product.types';
import { Price } from './price';
import { ProductBadge } from './product-badge';

export interface ProductCardCompactProps {
  /** Product data from backend */
  product: Product;
  /** Optional remove handler (for cart/wishlist items) */
  onRemove?: (productId: string) => void;
  /** Additional CSS classes */
  className?: string;
  /** Show remove button */
  showRemove?: boolean;
}

export function ProductCardCompact({ product, onRemove, className, showRemove = false }: ProductCardCompactProps) {
  const productUI: ProductUI = React.useMemo(() => mapProductForUI(product), [product]);

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(product.id);
  };

  return (
    <article className={cn('group relative flex gap-4', className)}>
      {/* Image */}
      <Link
        to={`/products/${product.slug}`}
        className="relative block h-24 w-24 flex-shrink-0 overflow-hidden border border-border bg-kenz-surface"
      >
        <img
          src={product.images[0]}
          alt={productUI.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {productUI.badge && (
          <div className="absolute left-1 top-1">
            <ProductBadge badge={productUI.badge} className="scale-75" />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
        <div className="flex-1">
          {/* Brand */}
          <span className="font-sans text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground/50">
            {product.brand?.name || 'KENZ'}
          </span>

          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="mt-0.5 line-clamp-2 font-serif text-xs font-normal leading-tight text-foreground/90 transition-colors hover:text-kenz-gold"
          >
            {productUI.title}
          </Link>
        </div>

        {/* Price */}
        <Price price={product.price} discountPrice={product.discountPrice} size="sm" />
      </div>

      {/* Remove Button */}
      {showRemove && onRemove && (
        <button
          onClick={handleRemove}
          className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center text-muted-foreground/40 transition-colors hover:text-foreground"
          aria-label="Remove item"
        >
          <X size={14} />
        </button>
      )}

      {/* Out of Stock Indicator */}
      {!productUI.inStock && (
        <div className="absolute inset-0 flex items-center justify-center bg-kenz-bg/60">
          <span className="font-sans text-[9px] font-medium uppercase tracking-[0.15em] text-foreground/40">
            Out of Stock
          </span>
        </div>
      )}
    </article>
  );
}
