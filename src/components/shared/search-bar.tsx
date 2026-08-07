import * as React from 'react';
import { cn } from '@/lib';
import { SearchInput } from './search-input';
import { SearchSuggestions, type SearchSuggestion } from './search-suggestions';

export interface SearchBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions?: SearchSuggestion[];
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * SearchBar — complete search experience with input and suggestions dropdown.
 * Manages focus state, keyboard navigation, and suggestion selection.
 */
const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      onSearch,
      suggestions = [],
      isLoading = false,
      placeholder,
      className,
      ...props
    },
    _ref,
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Show suggestions when focused and has value or suggestions
    React.useEffect(() => {
      setShowSuggestions(isFocused && (value.length > 0 || suggestions.length > 0));
    }, [isFocused, value, suggestions.length]);

    // Handle click outside to close suggestions
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsFocused(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
      onChange(suggestion.text);
      onSearch(suggestion.text);
      setIsFocused(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        onSearch(value);
        setIsFocused(false);
      } else if (e.key === 'Escape') {
        setIsFocused(false);
      }
    };

    return (
      <div
        ref={containerRef}
        className={cn('relative w-full', className)}
        {...props}
      >
        <SearchInput
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          isLoading={isLoading}
          placeholder={placeholder}
        />

        {showSuggestions && (
          <div className="absolute left-0 right-0 top-full z-dropdown mt-2">
            <SearchSuggestions
              suggestions={suggestions}
              onSelect={handleSuggestionSelect}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    );
  },
);
SearchBar.displayName = 'SearchBar';

export { SearchBar };
