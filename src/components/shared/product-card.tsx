/**
 * Product Card Component
 *
 * Premium editorial product card for catalog/grid displays.
 * Integrated with real backend API via hooks:
 * - useAddToCart for cart mutations
 * - useToggleWishlist for wishlist mutations
 * - useAuthStore for authentication state
 *
 * Adapted from Figma UI with backend field mapping via product-adapter.
 */

import * as React from 'react';
import { Link } from 'react-router';
import { Heart, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/cn';
import { mapProductForUI, type ProductUI } from '@/lib/adapters';
import type { Product } from '@/types/product.types';
import { useAddToCart } from '@/hooks/api/use-cart';
import { useAllBrands } from '@/hooks/api/use-brands';
import { useToggleWishlist, useIsInWishlist } from '@/hooks/api/use-wishlist';
import { useAuthStore } from '@/stores/auth.store';
import { Price } from './price';
import { Rating } from './rating';
import { ProductBadge } from './product-badge';
import { toast } from 'sonner';

export interface ProductCardProps {
  /** Product data from backend */
  product: Product;
  /** Additional CSS classes */
  className?: string;
  /** Whether product is in wishlist (optional, will be derived if not provided) */
  isWishlisted?: boolean;
}

export function ProductCard({ product, className, isWishlisted: isWishlistedProp }: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const addToCart = useAddToCart();
  const brands = useAllBrands();
  const { toggle: toggleWishlist, isLoading: isTogglingWishlist } = useToggleWishlist();
  
  // Use shared wishlist query - React Query caches this across all ProductCards
  const isWishlistedFromQuery = useIsInWishlist(product.id);
  const isWishlisted = isWishlistedProp ?? isWishlistedFromQuery;

  // Map product to UI format
  const productUI: ProductUI = React.useMemo(() => mapProductForUI(product), [product]);
  const brandName = product.brand?.name ?? brands.data?.items.find((brand) => brand.id === product.brandId)?.name;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || !productUI.inStock) return;

    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }

    setIsAdding(true);

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity: 1,
      });
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setTimeout(() => setIsAdding(false), 1200);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please sign in to save to wishlist');
      return;
    }

    try {
      await toggleWishlist(product.id);
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <article
      className={cn('group relative flex flex-col', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products/${product.slug}`}
        data-cursor="view"
        data-cursor-label="VIEW"
        className="relative block overflow-hidden border border-border bg-kenz-surface"
        style={{ aspectRatio: '3/4' }}
      >
        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={productUI.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-kenz"
          style={{ transform: isHovered ? 'scale(1.06)' : 'scale(1)' }}
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500"
          style={{ opacity: isHovered ? 1 : 0 }}
        />

        {/* Badge */}
        {productUI.badge && (
          <div className="absolute left-3 top-3">
            <ProductBadge badge={productUI.badge} />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          disabled={isTogglingWishlist || !isAuthenticated}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center transition-all duration-300"
          style={{
            opacity: isHovered || isWishlisted ? 1 : 0,
            transform: isHovered || isWishlisted ? 'translateY(0)' : 'translateY(-4px)',
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={15}
            className="transition-colors duration-200"
            fill={isWishlisted ? 'hsl(43 82% 52%)' : 'none'}
            stroke={isWishlisted ? 'hsl(43 82% 52%)' : 'rgba(255,255,255,0.7)'}
          />
        </button>

        {/* Add to Cart Button */}
        {productUI.inStock && (
          <button
            onClick={handleAddToCart}
            disabled={addToCart.isPending || isAdding}
            className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 py-3 transition-all duration-500 ease-kenz glass-dark"
            style={{
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
            }}
          >
            <ShoppingBag size={12} />
            <span className="text-caption-kenz font-sans font-medium uppercase tracking-[0.12em] text-foreground/85">
              {isAdding ? 'ADDED' : 'ADD TO BAG'}
            </span>
          </button>
        )}

        {/* Out of Stock Overlay */}
        {!productUI.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-kenz-bg/60">
            <span className="text-caption-kenz font-sans font-medium uppercase tracking-[0.15em] text-foreground/40">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-col gap-1.5 pb-1 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            {/* Brand */}
            {brandName && <span className="truncate font-sans text-[10px] font-medium uppercase tracking-[0.15em] text-[#D4C3A3]/60">{brandName}</span>}

            {/* Title */}
            <Link
              to={`/products/${product.slug}`}
              className="line-clamp-2 font-serif text-[1.0625rem] font-normal leading-snug text-white/90 transition-colors hover:text-kenz-gold"
            >
              {productUI.title}
            </Link>
          </div>

        </div>

        <div className="flex items-center gap-3">
          <Rating value={product.ratingAverage} count={product.ratingCount} size="sm" />
          <span className="font-sans text-[9px] uppercase tracking-[0.1em] text-white/20">
            {product.concentration?.replaceAll('_', ' ') ?? ''}
          </span>
        </div>

        <Price price={product.price} discountPrice={product.discountPrice} size="sm" />
      </div>
    </article>
  );
}
