/**
 * Wishlist Page
 * 
 * User's saved products with ability to remove and add to cart.
 */

import { useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/api/use-wishlist';
import { useProduct } from '@/hooks/api/use-products';
import { ProductCard } from '@/components/shared/product-card';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';
import { ROUTES } from '@/constants';

export function WishlistPage() {
  const navigate = useNavigate();
  const { data: wishlist, isLoading, error } = useWishlist();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="Failed to load wishlist"
          message="Please try again later"
        />
      </div>
    );
  }

  if (!wishlist?.items.length) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          icon={<Heart className="h-12 w-12" />}
          title="Your wishlist is empty"
          message="Save your favorite fragrances here"
          actionLabel="Browse Products"
          onAction={() => navigate(ROUTES.shop)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <SectionHeader
          title="My Wishlist"
          subtitle={`${wishlist.items.length} ${wishlist.items.length === 1 ? 'item' : 'items'} saved`}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.items.map((item) => (
            <WishlistProductCard key={item.productId} productId={item.productId} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Wishlist product card wrapper that fetches product data.
 * Uses React Query caching to avoid duplicate requests.
 */
function WishlistProductCard({ productId }: { productId: string }) {
  const { data: product, isLoading } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="h-96 animate-pulse rounded-lg border border-kenz-border bg-kenz-surface/30" />
    );
  }

  if (!product) {
    return null;
  }

  return <ProductCard product={product} isWishlisted={true} />;
}
