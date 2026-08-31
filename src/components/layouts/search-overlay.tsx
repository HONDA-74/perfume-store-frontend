/**
 * SearchOverlay Component
 * 
 * Full-screen search overlay with debounced product search.
 * Integrated with real backend API via useProducts.
 */

import * as React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { X, Search, Loader2 } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useProducts } from '@/hooks/api/use-products';
import { ProductCardCompact } from '@/components/shared/product-card-compact';
import { EmptyState } from '@/components/shared/empty-state';

const DEBOUNCE_MS = 300;

export function SearchOverlay() {
  const { t } = useTranslation();
  const { isSearchOpen, closeSearch } = useUIStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products when debounced query changes
  const shouldSearch = debouncedQuery.length > 0;
  const { data, isLoading, isFetching } = useProducts(
    shouldSearch
      ? {
          search: debouncedQuery,
          page: 1,
          limit: 12,
        }
      : undefined
  );

  // Focus input when opened
  React.useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    } else {
      setSearchQuery('');
      setDebouncedQuery('');
    }
  }, [isSearchOpen]);

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen, closeSearch]);

  // Lock body scroll
  React.useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const showResults = debouncedQuery.length > 0;
  const hasResults = data?.items && data.items.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-kenz-bg">
      {/* Header */}
      <div className="border-b border-kenz-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute start-0 top-1/2 -translate-y-1/2 text-foreground/50"
              />
              <input
                ref={inputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search.placeholder')}
                className="w-full border-0 bg-transparent py-2 ps-8 pe-4 font-sans text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
                aria-label={t('search.title')}
              />
              {(isLoading || isFetching) && (
                <Loader2
                  size={18}
                  className="absolute end-0 top-1/2 -translate-y-1/2 animate-spin text-kenz-gold"
                />
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={closeSearch}
              className="text-foreground/70 transition-colors hover:text-foreground"
              aria-label={t('common.close')}
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {!showResults ? (
            <div className="flex h-64 items-center justify-center">
              <p className="text-sm text-foreground/50">
                {t('search.start')}
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 size={32} className="animate-spin text-kenz-gold" />
            </div>
          ) : !hasResults ? (
            <div className="flex h-64 items-center justify-center">
              <EmptyState
                icon={<Search className="h-8 w-8" />}
                title={t('search.noResults')}
                message={t('search.noResultsDescription', { query: debouncedQuery })}
              />
            </div>
          ) : (
            <>
              <p className="mb-6 text-sm text-foreground/70">
                {t('search.resultsCount', { count: data.meta.totalItems })}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.items.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    onClick={closeSearch}
                  >
                    <ProductCardCompact product={product} />
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
