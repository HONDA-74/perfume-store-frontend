import * as React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib';

export interface WishlistToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  isInWishlist?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * WishlistToggle — compact wishlist toggle for product cards.
 * Designed to overlay product images, with backdrop for visibility.
 */
const WishlistToggle = React.forwardRef<HTMLButtonElement, WishlistToggleProps>(
  (
    {
      isInWishlist = false,
      onToggle,
      size = 'md',
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'h-7 w-7',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    };

    const iconSizeClasses = {
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      onToggle?.(!isInWishlist);
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex items-center justify-center rounded-full backdrop-blur-sm transition-all duration-fast hover:scale-110 active:scale-95',
          'bg-neutral-0/80 hover:bg-neutral-0',
          sizeClasses[size],
          className,
        )}
        onClick={handleClick}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={isInWishlist}
        {...props}
      >
        <Heart
          className={cn(
            'transition-all duration-fast',
            iconSizeClasses[size],
            isInWishlist
              ? 'fill-error-500 text-error-500'
              : 'fill-none text-neutral-600',
          )}
        />
      </button>
    );
  },
);
WishlistToggle.displayName = 'WishlistToggle';

export { WishlistToggle };
