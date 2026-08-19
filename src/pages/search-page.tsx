/**
 * Search Page
 * 
 * Full search results page with query input and filtering.
 */

import * as React from 'react';
import { useSearchParams } from 'react-router';
import { Search, X } from 'lucide-react';
import { useProducts } from '@/hooks/api/use-products';
import { ProductCard } from '@/components/shared/product-card';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';

const DEBOUNCE_MS = 300;

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const [inputValue, setInputValue] = React.useState(queryParam);
  const [debouncedQuery, setDebouncedQuery] = React.useState(queryParam);

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
      if (inputValue) {
        setSearchParams({ q: inputValue });
      } else {
        setSearchParams({});
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchParams]);

  // Update input when URL changes (e.g., back button)
  React.useEffect(() => {
    if (queryParam !== inputValue) {
      setInputValue(queryParam);
      setDebouncedQuery(queryParam);
    }
  }, [queryParam]);

  const shouldSearch = debouncedQuery.length > 0;
  const { data, isLoading, isFetching } = useProducts(
    shouldSearch ? { search: debouncedQuery, limit: 24 } : undefined
  );

  const clearSearch = () => {
    setInputValue('');
    setDebouncedQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <SectionHeader title="Search" subtitle="Find your perfect fragrance" />

        {/* Search Input */}
        <div className="mx-auto mt-8 max-w-2xl">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50"
            />
            <input
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search fragrances, brands..."
              className="w-full rounded-lg border border-kenz-border bg-kenz-surface/30 py-4 pl-12 pr-12 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
            />
            {inputValue && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mt-12">
          {!shouldSearch ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-foreground/50">Start typing to search products</p>
            </div>
          ) : isLoading || isFetching ? (
            <PageLoader />
          ) : !data?.items.length ? (
            <EmptyState
              icon={<Search className="h-12 w-12" />}
              title="No results found"
              message={`No products match "${debouncedQuery}"`}
              actionLabel="Clear Search"
              onAction={clearSearch}
            />
          ) : (
            <>
              <p className="mb-8 text-foreground/70">
                Found {data.meta.totalItems} {data.meta.totalItems === 1 ? 'result' : 'results'} for "{debouncedQuery}"
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
