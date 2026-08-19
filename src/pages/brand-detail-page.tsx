/**
 * Brand Detail Page
 * 
 * Brand information with filteredproducts from that brand.
 */

import { useParams, useNavigate } from 'react-router';
import { useBrand } from '@/hooks/api/use-brands';
import { useProducts } from '@/hooks/api/use-products';
import { ProductCard } from '@/components/shared/product-card';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { ROUTES } from '@/constants';

export function BrandDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: brand, isLoading: isBrandLoading, error: brandError } = useBrand(slug!);
  const { data: productsData, isLoading: isProductsLoading } = useProducts(
    brand ? { brandId: brand.id, limit: 50 } : undefined
  );

  if (isBrandLoading) {
    return <PageLoader />;
  }

  if (brandError || !brand) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="Brand not found"
          message="The brand you're looking for doesn't exist"
          actionLabel="View All Brands"
          onAction={() => navigate('/brands')}
        />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: ROUTES.home },
    { label: 'Brands', href: '/brands' },
    { label: brand.name },
  ];

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <Breadcrumb items={breadcrumbItems} className="mb-8" />

        {/* Brand Header */}
        <div className="mb-12 rounded-lg border border-kenz-border bg-kenz-surface/30 p-8 lg:p-12">
          {brand.logo && (
            <div className="mb-6 flex justify-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-32 max-w-full object-contain"
              />
            </div>
          )}
          <h1 className="mb-4 text-center font-serif text-4xl font-normal text-foreground">
            {brand.name}
          </h1>
          {brand.description && (
            <p className="mx-auto max-w-2xl text-center text-foreground/70">
              {brand.description}
            </p>
          )}
          <div className="mt-6 flex justify-center gap-6 text-sm text-foreground/50">
            {brand.country && <span>📍 {brand.country}</span>}
            {brand.foundedYear && <span>📅 Est. {brand.foundedYear}</span>}
            {brand.website && (
              <a
                href={brand.website}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-kenz-gold"
              >
                🌐 Website
              </a>
            )}
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="mb-8 font-serif text-2xl font-normal text-foreground">
            Products by {brand.name}
          </h2>

          {isProductsLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-lg border border-kenz-border bg-kenz-surface/30"
                />
              ))}
            </div>
          ) : !productsData?.items.length ? (
            <EmptyState
              title="No products available"
              message={`${brand.name} doesn't have any products yet`}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productsData.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
