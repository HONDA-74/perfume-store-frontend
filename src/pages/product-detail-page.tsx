/**
 * Product Detail Page
 * 
 * Full product view with gallery, details, add to cart, and wishlist.
 * Integrated with real backend via useProduct.
 */

import * as React from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useProduct } from '@/hooks/api/use-products';
import { useAddToCart } from '@/hooks/api/use-cart';
import { useToggleWishlist, useIsInWishlist } from '@/hooks/api/use-wishlist';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { Price } from '@/components/shared/price';
import { Rating } from '@/components/shared/rating';
import { ProductBadge } from '@/components/shared/product-badge';
import { QuantitySelector } from '@/components/shared/quantity-selector';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { deriveProductBadge } from '@/lib/adapters/product-adapter';
import { getConcentrationLabel } from '@/lib/adapters/enum-adapter';
import { ROUTES } from '@/constants';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { openCartDrawer } = useUIStore();
  const isAuthenticated = authStore.isAuthenticated();

  const [quantity, setQuantity] = React.useState(1);
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  const { data: product, isLoading, error } = useProduct(slug!);
  const addToCart = useAddToCart();
  const { toggle: toggleWishlist, isLoading: isTogglingWishlist } = useToggleWishlist();
  const isWishlisted = useIsInWishlist(product?.id || '');

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        quantity,
      });
      openCartDrawer();
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleToggleWishlist = async () => {
    if (!product || !isAuthenticated) return;
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="Product not found"
          message="The product you're looking for doesn't exist"
          actionLabel="Back to Shop"
          onAction={() => navigate(ROUTES.shop)}
        />
      </div>
    );
  }

  const badgeType = deriveProductBadge(product);
  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  const breadcrumbItems = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Shop', href: ROUTES.shop },
    { label: product.brand?.name || 'Brand', href: `/brands/${product.brand?.slug}` },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 sm:flex-col sm:gap-3">
                {product.images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 w-16 flex-shrink-0 overflow-hidden rounded border transition-all ${
                      idx === activeImageIndex
                        ? 'border-kenz-gold opacity-100'
                        : 'border-kenz-border opacity-50 hover:opacity-75'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="relative flex-1 overflow-hidden rounded-lg border border-kenz-border bg-kenz-surface/30">
              <div className="aspect-[4/5]">
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {badgeType && (
                <div className="absolute left-4 top-4">
                  <ProductBadge badge={badgeType} />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Brand */}
            {product.brand && (
              <Link
                to={`/brands/${product.brand.slug}`}
                className="mb-2 font-sans text-xs uppercase tracking-wider text-kenz-gold transition-colors hover:text-kenz-champagne"
              >
                {product.brand.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="mb-4 font-serif text-3xl font-normal text-foreground lg:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            {product.ratingCount > 0 && (
              <div className="mb-6">
                <Rating value={product.ratingAverage} count={product.ratingCount} />
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              <Price
                price={product.price}
                discountPrice={product.discountPrice}
                className="text-2xl"
              />
            </div>

            {/* Size & Concentration */}
            <div className="mb-8 space-y-4">
              <div>
                <p className="mb-2 font-sans text-xs uppercase tracking-wider text-foreground/50">
                  Size
                </p>
                <p className="text-sm text-foreground">{product.sizeMl}ml</p>
              </div>
              <div>
                <p className="mb-2 font-sans text-xs uppercase tracking-wider text-foreground/50">
                  Concentration
                </p>
                <p className="text-sm text-foreground">
                  {getConcentrationLabel(product.concentration)}
                </p>
              </div>
            </div>

            {/* Stock Status */}
            {isLowStock && (
              <p className="mb-4 text-sm text-amber-500">Only {product.stockQuantity} left in stock</p>
            )}
            {isOutOfStock && (
              <p className="mb-4 text-sm text-red-500">Out of stock</p>
            )}

            {/* Quantity & Actions */}
            {!isOutOfStock && (
              <div className="mb-8 space-y-4">
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={product.stockQuantity}
                />

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending || isOutOfStock}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-kenz-gold px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-kenz-bg transition-colors hover:bg-kenz-champagne disabled:opacity-50"
                  >
                    <ShoppingBag size={18} />
                    {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                  </button>

                  {isAuthenticated && (
                    <button
                      onClick={handleToggleWishlist}
                      disabled={isTogglingWishlist}
                      className={`flex h-12 w-12 items-center justify-center rounded-md border transition-all ${
                        isWishlisted
                          ? 'border-kenz-gold bg-kenz-gold/10 text-kenz-gold'
                          : 'border-kenz-border text-foreground/70 hover:border-kenz-gold hover:text-kenz-gold'
                      }`}
                      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                      <Heart
                        size={18}
                        className={isWishlisted ? 'fill-current' : ''}
                      />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8 border-t border-kenz-border pt-8">
              <h2 className="mb-4 font-serif text-lg font-normal text-foreground">
                Description
              </h2>
              <p className="text-sm leading-relaxed text-foreground/70">
                {product.description}
              </p>
            </div>

            {/* Fragrance Notes */}
            {(product.notes.top.length > 0 ||
              product.notes.middle.length > 0 ||
              product.notes.base.length > 0) && (
              <div className="border-t border-kenz-border pt-8">
                <h2 className="mb-6 font-serif text-lg font-normal text-foreground">
                  Fragrance Notes
                </h2>
                <div className="space-y-4">
                  {product.notes.top.length > 0 && (
                    <div>
                      <p className="mb-2 font-sans text-xs uppercase tracking-wider text-foreground/50">
                        Top Notes
                      </p>
                      <p className="text-sm text-foreground/70">
                        {product.notes.top.join(', ')}
                      </p>
                    </div>
                  )}
                  {product.notes.middle.length > 0 && (
                    <div>
                      <p className="mb-2 font-sans text-xs uppercase tracking-wider text-foreground/50">
                        Heart Notes
                      </p>
                      <p className="text-sm text-foreground/70">
                        {product.notes.middle.join(', ')}
                      </p>
                    </div>
                  )}
                  {product.notes.base.length > 0 && (
                    <div>
                      <p className="mb-2 font-sans text-xs uppercase tracking-wider text-foreground/50">
                        Base Notes
                      </p>
                      <p className="text-sm text-foreground/70">
                        {product.notes.base.join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
