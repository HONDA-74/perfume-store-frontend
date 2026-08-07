import * as React from 'react';
import { Search, TrendingUp } from 'lucide-react';
import { cn } from '@/lib';
import { Separator } from '@/components/ui/separator';

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'result';
}

export interface SearchSuggestionsProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  suggestions: SearchSuggestion[];
  onSelect: (suggestion: SearchSuggestion) => void;
  isLoading?: boolean;
}

/**
 * SearchSuggestions — dropdown list of search suggestions and results.
 * Displays recent searches, popular queries, and live results.
 */
const SearchSuggestions = React.forwardRef<
  HTMLDivElement,
  SearchSuggestionsProps
>(({ suggestions, onSelect, isLoading = false, className, ...props }, ref) => {
  if (isLoading) {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-neutral-200 bg-neutral-0 p-4 shadow-lg',
          className,
        )}
        {...props}
      >
        <p className="text-body-sm text-neutral-500">Searching...</p>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  const groupedSuggestions = suggestions.reduce(
    (acc, suggestion) => {
      acc[suggestion.type].push(suggestion);
      return acc;
    },
    { recent: [], popular: [], result: [] } as Record<
      SearchSuggestion['type'],
      SearchSuggestion[]
    >,
  );

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg',
        className,
      )}
      {...props}
    >
      {/* Recent Searches */}
      {groupedSuggestions.recent.length > 0 && (
        <div className="p-2">
          <p className="px-3 py-2 text-caption font-semibold uppercase tracking-wide text-neutral-600">
            Recent
          </p>
          {groupedSuggestions.recent.map((suggestion) => (
            <button
              key={suggestion.id}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-neutral-50"
              onClick={() => onSelect(suggestion)}
            >
              <Search className="h-4 w-4 text-neutral-400" />
              <span className="text-body-sm text-neutral-900">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      )}

      {groupedSuggestions.recent.length > 0 &&
        groupedSuggestions.popular.length > 0 && <Separator />}

      {/* Popular Searches */}
      {groupedSuggestions.popular.length > 0 && (
        <div className="p-2">
          <p className="px-3 py-2 text-caption font-semibold uppercase tracking-wide text-neutral-600">
            Popular
          </p>
          {groupedSuggestions.popular.map((suggestion) => (
            <button
              key={suggestion.id}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-neutral-50"
              onClick={() => onSelect(suggestion)}
            >
              <TrendingUp className="h-4 w-4 text-neutral-400" />
              <span className="text-body-sm text-neutral-900">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      )}

      {(groupedSuggestions.recent.length > 0 ||
        groupedSuggestions.popular.length > 0) &&
        groupedSuggestions.result.length > 0 && <Separator />}

      {/* Search Results */}
      {groupedSuggestions.result.length > 0 && (
        <div className="p-2">
          {groupedSuggestions.result.map((suggestion) => (
            <button
              key={suggestion.id}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-neutral-50"
              onClick={() => onSelect(suggestion)}
            >
              <Search className="h-4 w-4 text-neutral-400" />
              <span className="text-body-sm text-neutral-900">
                {suggestion.text}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
SearchSuggestions.displayName = 'SearchSuggestions';

export { SearchSuggestions };
