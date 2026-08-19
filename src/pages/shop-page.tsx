/**
 * Shop Page - Main product catalog with filters and pagination.
 * 
 * Integrated with real backend API via useProducts, useBrands, useCategories.
 * URL-based filter state for shareable/bookmarkable filtered views.
 */

import { useSearchParams } from 'react-router';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '@/hooks/api/use-products';
import { useBrands } from '@/hooks/api/use-brands';
import { useCategories } from '@/hooks/api/use-categories';
import { ProductCard } from '@/components/shared/product-card';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';
import { FragranceGender, FragranceConcentration } from '@/types';

const ITEMS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const;

const GENDER_OPTIONS = [
  { value: FragranceGender.MALE, label: 'Men' },
  { value: FragranceGender.FEMALE, label: 'Women' },
  { value: FragranceGender.UNISEX, label: 'Unisex' },
];

const CONCENTRATION_OPTIONS = [
  { value: FragranceConcentration.PARFUM, label: 'Parfum' },
  { value: FragranceConcentration.EDP, label: 'Eau de Parfum' },
  { value: FragranceConcentration.EDT, label: 'Eau de Toilette' },
  { value: FragranceConcentration.EDC, label: 'Eau de Cologne' },
];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse URL params
  const page = parseInt(searchParams.get('page') || '1');
  const sort = searchParams.get('sort') || 'featured';
  const brandId = searchParams.get('brandId') || undefined;
  const categoryId = searchParams.get('categoryId') || undefined;
  const gender = searchParams.get('gender') as FragranceGender | undefined;
  const concentration = searchParams.get('concentration') as FragranceConcentration | undefined;
  const inStock = searchParams.get('inStock') === 'true' || undefined;
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;

  // Fetch data
  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    page,
    limit: ITEMS_PER_PAGE,
    brandId,
    categoryId,
    gender,
    concentration,
    inStock,
    minPrice,
    maxPrice,
  });

  const { data: brandsData } = useBrands();
  const { data: categoriesData } = useCategories();

  // Update filter
  const updateFilter = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 when filter changes
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };

  // Check if any filters are active
  const hasActiveFilters = brandId || categoryId || gender || concentration || inStock || minPrice || maxPrice;

  // Pagination
  const totalPages = productsData?.meta.totalPages || 1;
  const currentPage = productsData?.meta.page || 1;

  const goToPage = (pageNum: number) => {
    if (pageNum < 1 || pageNum > totalPages) return;
    updateFilter('page', pageNum.toString());
  };

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <SectionHeader
          title="Shop Fragrances"
          subtitle="Discover your signature scent"
        />

        <div className="mt-12 flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden w-64 flex-shrink-0 lg:block">
            <div className="sticky top-24 space-y-6">
              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-kenz-border px-4 py-2 text-sm text-foreground/70 transition-colors hover:border-kenz-gold hover:text-kenz-gold"
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}

              {/* Sort */}
              <div>
                <h3 className="mb-3 font-sans text-sm font-medium uppercase tracking-wider text-foreground">
                  Sort By
                </h3>
                <select
                  value={sort}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="w-full rounded-md border border-kenz-border bg-kenz-surface px-3 py-2 text-sm text-foreground focus:border-kenz-gold focus:outline-none"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brands */}
              {brandsData?.items && brandsData.items.length > 0 && (
                <div>
                  <h3 className="mb-3 font-sans text-sm font-medium uppercase tracking-wider text-foreground">
                    Brand
                  </h3>
                  <div className="space-y-2">
                    {brandsData.items.map((brand) => (
                      <label key={brand.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="brand"
                          checked={brandId === brand.id}
                          onChange={() => updateFilter('brandId', brandId === brand.id ? undefined : brand.id)}
                          className="h-4 w-4 border-kenz-border text-kenz-gold focus:ring-kenz-gold"
                        />
                        <span className="text-sm text-foreground/70 transition-colors group-hover:text-foreground">
                          {brand.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              {categoriesData?.items && categoriesData.items.length > 0 && (
                <div>
                  <h3 className="mb-3 font-sans text-sm font-medium uppercase tracking-wider text-foreground">
                    Category
                  </h3>
                  <div className="space-y-2">
                    {categoriesData.items.map((category) => (
                      <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          checked={categoryId === category.id}
                          onChange={() => updateFilter('categoryId', categoryId === category.id ? undefined : category.id)}
                          className="h-4 w-4 border-kenz-border text-kenz-gold focus:ring-kenz-gold"
                        />
                        <span className="text-sm text-foreground/70 transition-colors group-hover:text-foreground">
                          {category.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Gender */}
              <div>
                <h3 className="mb-3 font-sans text-sm font-medium uppercase tracking-wider text-foreground">
                  Gender
                </h3>
                <div className="space-y-2">
                  {GENDER_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === option.value}
                        onChange={() => updateFilter('gender', gender === option.value ? undefined : option.value)}
                        className="h-4 w-4 border-kenz-border text-kenz-gold focus:ring-kenz-gold"
                      />
                      <span className="text-sm text-foreground/70 transition-colors group-hover:text-foreground">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Concentration */}
              <div>
                <h3 className="mb-3 font-sans text-sm font-medium uppercase tracking-wider text-foreground">
                  Concentration
                </h3>
                <div className="space-y-2">
                  {CONCENTRATION_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="concentration"
                        checked={concentration === option.value}
                        onChange={() => updateFilter('concentration', concentration === option.value ? undefined : option.value)}
                        className="h-4 w-4 border-kenz-border text-kenz-gold focus:ring-kenz-gold"
                      />
                      <span className="text-sm text-foreground/70 transition-colors group-hover:text-foreground">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In Stock Only */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={inStock || false}
                    onChange={(e) => updateFilter('inStock', e.target.checked ? 'true' : undefined)}
                    className="h-4 w-4 rounded border-kenz-border text-kenz-gold focus:ring-kenz-gold"
                  />
                  <span className="text-sm text-foreground/70 transition-colors group-hover:text-foreground">
                    In Stock Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => alert('Mobile filters coming soon')}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-kenz-gold px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-kenz-bg shadow-lg transition-all hover:bg-kenz-champagne lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoadingProducts ? (
              <PageLoader />
            ) : !productsData?.items.length ? (
              <EmptyState
                title="No products found"
                message={hasActiveFilters ? 'Try adjusting your filters' : 'No products available'}
                actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
                onAction={hasActiveFilters ? clearFilters : undefined}
              />
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-sm text-foreground/70">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, productsData.meta.totalItems)} of {productsData.meta.totalItems} products
                  </p>
                </div>

                {/* Products Grid */}
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {productsData.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-kenz-border text-foreground/70 transition-colors hover:border-kenz-gold hover:text-kenz-gold disabled:opacity-30 disabled:hover:border-kenz-border disabled:hover:text-foreground/70"
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-colors ${
                          pageNum === currentPage
                            ? 'border-kenz-gold bg-kenz-gold text-kenz-bg'
                            : 'border-kenz-border text-foreground/70 hover:border-kenz-gold hover:text-kenz-gold'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex h-10 w-10 items-center justify-center rounded-md border border-kenz-border text-foreground/70 transition-colors hover:border-kenz-gold hover:text-kenz-gold disabled:opacity-30 disabled:hover:border-kenz-border disabled:hover:text-foreground/70"
                      aria-label="Next page"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
