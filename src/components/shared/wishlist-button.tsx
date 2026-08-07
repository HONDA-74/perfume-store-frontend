import * as React from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib';

export interface WishlistButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemCount?: number;
  onClick?: () => void;
}

/**
 * WishlistButton — displays heart icon with item count badge.
 * Used in navbar for wishlist access.
 */
const WishlistButton = React.forwardRef<HTMLButtonElement, WishlistButtonProps>(
  ({ itemCount = 0, className, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn('relative', className)}
        onClick={onClick}
        aria-label={`Wishlist with ${itemCount} items`}
        {...props}
      >
        <Heart className="h-5 w-5" />
        {itemCount > 0 && (
          <Badge
            variant="default"
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]"
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    );
  },
);
WishlistButton.displayName = 'WishlistButton';

export { WishlistButton };
