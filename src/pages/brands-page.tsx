/**
 * Brands Page
 * 
 * Grid of all brands with navigation to brand detail pages.
 */

import { Link } from 'react-router';
import { useBrands } from '@/hooks/api/use-brands';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';

export function BrandsPage() {
  const { data, isLoading, error } = useBrands();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="Failed to load brands"
          message="Please try again later"
        />
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="No brands available"
          message="Check back later for new brands"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <SectionHeader
          title="Our Brands"
          subtitle="Discover exceptional fragrance houses"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((brand) => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="group overflow-hidden rounded-lg border border-kenz-border bg-kenz-surface/30 p-8 transition-all hover:border-kenz-gold"
            >
              {brand.logoUrl && (
                <div className="mb-6 flex h-24 items-center justify-center">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="max-h-full max-w-full object-contain opacity-90 transition-opacity group-hover:opacity-100"
                  />
                </div>
              )}
              <h3 className="mb-2 font-serif text-xl font-normal text-foreground transition-colors group-hover:text-kenz-gold">
                {brand.name}
              </h3>
              {brand.description && (
                <p className="text-sm text-foreground/60 line-clamp-2">
                  {brand.description}
                </p>
              )}
              {brand.countryOfOrigin && (
                <p className="mt-3 text-xs uppercase tracking-wider text-foreground/40">
                  {brand.countryOfOrigin}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
