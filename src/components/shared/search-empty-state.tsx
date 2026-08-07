import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib';
import { Button } from '@/components/ui/button';

export interface SearchEmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  query?: string;
  onClear?: () => void;
}

/**
 * SearchEmptyState — displayed when search returns no results.
 * Provides clear messaging and option to clear search.
 */
const SearchEmptyState = React.forwardRef<
  HTMLDivElement,
  SearchEmptyStateProps
>(({ query, onClear, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100">
        <Search className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="mb-2 font-serif text-h3 font-semibold text-neutral-900">
        No results found
      </h3>
      {query && (
        <p className="mb-6 max-w-md text-body-md text-neutral-600">
          We couldn&rsquo;t find any fragrances matching{' '}
          <span className="font-semibold">&ldquo;{query}&rdquo;</span>. Try
          adjusting your search or browse our collection.
        </p>
      )}
      {!query && (
        <p className="mb-6 max-w-md text-body-md text-neutral-600">
          Try searching for a fragrance name, brand, or note.
        </p>
      )}
      {onClear && query && (
        <Button variant="outline" onClick={onClear}>
          Clear Search
        </Button>
      )}
    </div>
  );
});
SearchEmptyState.displayName = 'SearchEmptyState';

export { SearchEmptyState };
