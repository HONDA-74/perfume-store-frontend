import * as React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib';

export interface FavoriteButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

/**
 * FavoriteButton — toggle button for adding/removing items from wishlist.
 * Heart icon fills when favorited, transitions smoothly.
 */
const FavoriteButton = React.forwardRef<HTMLButtonElement, FavoriteButtonProps>(
  ({ isFavorite = false, onToggle, className, onClick, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle?.(!isFavorite);
      onClick?.(e);
    };

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn('transition-transform active:scale-90', className)}
        onClick={handleClick}
        aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={isFavorite}
        {...props}
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-all duration-fast',
            isFavorite
              ? 'fill-error-500 text-error-500'
              : 'fill-none text-neutral-600',
          )}
        />
      </Button>
    );
  },
);
FavoriteButton.displayName = 'FavoriteButton';

export { FavoriteButton };
