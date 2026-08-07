import * as React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib';

export interface SearchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

/**
 * SearchButton — icon button that triggers search overlay/modal.
 * Used in navbar for opening the global search experience.
 */
const SearchButton = React.forwardRef<HTMLButtonElement, SearchButtonProps>(
  ({ className, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(className)}
        onClick={onClick}
        aria-label="Search fragrances"
        {...props}
      >
        <Search className="h-5 w-5" />
      </Button>
    );
  },
);
SearchButton.displayName = 'SearchButton';

export { SearchButton };
