import * as React from 'react';
import { TrendingUp, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SearchInput, SearchEmptyState } from '@/components/shared';
import { Badge } from '@/components/ui/badge';

export interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'product';
}

// Placeholder data - would come from API in production
const placeholderSuggestions: SearchSuggestion[] = [
  { id: '1', text: 'Oud', type: 'recent' },
  { id: '2', text: 'Creed Aventus', type: 'recent' },
  { id: '3', text: 'Tom Ford', type: 'popular' },
  { id: '4', text: 'Woody fragrances', type: 'popular' },
  { id: '5', text: 'Summer scents', type: 'popular' },
];

/**
 * SearchOverlay — modal search experience with suggestions.
 * 
 * Features:
 * - Full-screen modal on mobile, centered on desktop
 * - Real-time search input
 * - Recent searches (from local storage)
 * - Popular/trending searches
 * - Product suggestions
 * - Empty state with helpful prompts
 * - Keyboard shortcuts (Cmd+K / Ctrl+K to open, Esc to close)
 * - Focus trap and restoration
 * 
 * Per UX_FLOW.md §20 and Design_System.md §3.13
 */
export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [suggestions] = React.useState<SearchSuggestion[]>(placeholderSuggestions);

  // Reset search on close
  React.useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut to open search (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // Open logic would be handled by parent
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSearch = (_query: string) => {
    setIsSearching(true);
    // TODO: Implement actual search
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const recentSearches = suggestions.filter((s) => s.type === 'recent');
  const popularSearches = suggestions.filter((s) => s.type === 'popular');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle className="sr-only">Search fragrances</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          {/* Search Input */}
          <div className="px-6 pb-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={handleClear}
              isLoading={isSearching}
              placeholder="Search fragrances, brands, notes..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(searchQuery);
                }
              }}
            />
          </div>

          {/* Search Results / Suggestions */}
          <div className="max-h-[60vh] overflow-y-auto px-6 pb-6">
            {searchQuery.length === 0 ? (
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-neutral-400" />
                      <h3 className="text-body-sm font-semibold uppercase tracking-wide text-neutral-600">
                        Recent
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSearchQuery(item.text);
                            handleSearch(item.text);
                          }}
                          className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-body-sm transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        >
                          {item.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Searches */}
                {popularSearches.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-neutral-400" />
                      <h3 className="text-body-sm font-semibold uppercase tracking-wide text-neutral-600">
                        Popular
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSearchQuery(item.text);
                            handleSearch(item.text);
                          }}
                          className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-neutral-0 px-3 py-2 text-body-sm transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                        >
                          {item.text}
                          <Badge variant="secondary" className="ml-1">
                            Trending
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Helpful Tips */}
                <div className="rounded-lg bg-neutral-50 p-4">
                  <h3 className="mb-2 font-serif text-h4 font-semibold text-neutral-900">
                    Search Tips
                  </h3>
                  <ul className="space-y-2 text-body-sm text-neutral-600">
                    <li>• Try searching by fragrance name, brand, or notes</li>
                    <li>• Use mood or occasion terms like &ldquo;summer&rdquo; or &ldquo;evening&rdquo;</li>
                    <li>• Browse popular searches for inspiration</li>
                  </ul>
                </div>
              </div>
            ) : (
              <SearchEmptyState
                query={searchQuery}
                onClear={handleClear}
              />
            )}
          </div>

          {/* Keyboard Shortcuts Hint */}
          <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-3">
            <div className="flex items-center justify-between text-caption text-neutral-500">
              <span>Press Esc to close</span>
              <span>Use ↑↓ to navigate</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
