import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import { ProductImage } from './product-image';
import { Price } from './price';

export interface ProductCardCompactProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number;
  quantity?: number;
  imageUrl: string;
  imageAlt?: string;
  onRemove?: (id: string) => void;
  onCardClick?: (slug: string) => void;
}

/**
 * ProductCardCompact — condensed product card for cart and wishlist views.
 * Horizontal layout with smaller image and essential info only.
 */
const ProductCardCompact = React.forwardRef<
  HTMLDivElement,
  ProductCardCompactProps
>(
  (
    {
      id,
      slug,
      title,
      brand,
      price,
      quantity,
      imageUrl,
      imageAlt,
      onRemove,
      onCardClick,
      className,
      ...props
    },
    ref,
  ) => {
    const handleCardClick = () => {
      onCardClick?.(slug);
    };

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.(id);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'group relative flex gap-4 rounded-lg border border-neutral-200 bg-neutral-0 p-3 transition-shadow hover:shadow-md',
          onCardClick && 'cursor-pointer',
          className,
        )}
        onClick={onCardClick ? handleCardClick : undefined}
        {...props}
      >
        {/* Image */}
        <div className="flex-shrink-0">
          <ProductImage
            src={imageUrl}
            alt={imageAlt || `${brand} ${title}`}
            aspectRatio="square"
            className="h-20 w-20"
          />
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <p className="text-caption font-medium uppercase tracking-wider text-neutral-600">
              {brand}
            </p>
            <h4 className="line-clamp-2 text-body-sm font-semibold text-neutral-900">
              {title}
            </h4>
          </div>

          <div className="flex items-center justify-between">
            <Price amount={price} className="text-body-md" />
            {quantity !== undefined && (
              <span className="text-body-sm text-neutral-600">
                Qty: {quantity}
              </span>
            )}
          </div>
        </div>

        {/* Remove Button */}
        {onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleRemove}
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  },
);
ProductCardCompact.displayName = 'ProductCardCompact';

export { ProductCardCompact };
