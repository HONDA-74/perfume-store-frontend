import * as React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import { ProductImage } from './product-image';
import { Price } from './price';
import { DiscountPrice } from './discount-price';
import { Rating } from './rating';
import { ProductBadge } from './product-badge';
import { WishlistToggle } from './wishlist-toggle';

export interface ProductCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  slug: string;
  title: string;
  brand: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  imageAlt?: string;
  rating?: number;
  reviewCount?: number;
  badge?: 'new' | 'sale' | 'exclusive' | 'limited' | 'bestseller';
  isInWishlist?: boolean;
  onAddToCart?: (id: string) => void;
  onToggleWishlist?: (id: string, isInWishlist: boolean) => void;
  onCardClick?: (slug: string) => void;
}

/**
 * ProductCard — primary product display card for catalog grids.
 * Per Design_System.md §3.19 - displays perfume image, brand, title, price,
 * and quick actions (add to cart, wishlist).
 */
const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      id,
      slug,
      title,
      brand,
      price,
      originalPrice,
      imageUrl,
      imageAlt,
      rating,
      reviewCount,
      badge,
      isInWishlist = false,
      onAddToCart,
      onToggleWishlist,
      onCardClick,
      className,
      ...props
    },
    ref,
  ) => {
    const hasDiscount = originalPrice && originalPrice > price;

    const handleCardClick = () => {
      onCardClick?.(slug);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
      e.stopPropagation();
      onAddToCart?.(id);
    };

    const handleWishlistToggle = (newState: boolean) => {
      onToggleWishlist?.(id, newState);
    };

    return (
      <Card
        ref={ref}
        className={cn(
          'group relative flex cursor-pointer flex-col overflow-hidden transition-shadow duration-normal hover:shadow-lg',
          className,
        )}
        onClick={handleCardClick}
        {...props}
      >
        {/* Image Container */}
        <div className="relative bg-neutral-50">
          <ProductImage
            src={imageUrl}
            alt={imageAlt || `${brand} ${title}`}
            aspectRatio="portrait"
            className="transition-transform duration-normal group-hover:scale-105"
          />

          {/* Wishlist Toggle */}
          <div className="absolute right-3 top-3">
            <WishlistToggle
              isInWishlist={isInWishlist}
              onToggle={handleWishlistToggle}
            />
          </div>

          {/* Badge */}
          {badge && (
            <div className="absolute left-3 top-3">
              <ProductBadge type={badge} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          {/* Brand */}
          <p className="text-body-sm font-medium uppercase tracking-wider text-neutral-600">
            {brand}
          </p>

          {/* Title */}
          <h3 className="line-clamp-2 font-serif text-h4 font-semibold text-neutral-900">
            {title}
          </h3>

          {/* Rating */}
          {rating !== undefined && (
            <Rating
              rating={rating}
              reviewCount={reviewCount}
              size="sm"
              showValue
            />
          )}

          {/* Price */}
          <div className="mt-auto">
            {hasDiscount ? (
              <DiscountPrice
                originalPrice={originalPrice}
                discountedPrice={price}
              />
            ) : (
              <Price amount={price} className="text-body-lg" />
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="default"
            size="sm"
            className="mt-2 w-full"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </Card>
    );
  },
);
ProductCard.displayName = 'ProductCard';

export { ProductCard };
