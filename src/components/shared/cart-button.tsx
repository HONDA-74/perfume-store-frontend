import * as React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib';

export interface CartButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemCount?: number;
  onClick?: () => void;
}

/**
 * CartButton — displays shopping bag icon with item count badge.
 * Used in navbar and mobile navigation for cart access.
 */
const CartButton = React.forwardRef<HTMLButtonElement, CartButtonProps>(
  ({ itemCount = 0, className, onClick, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn('relative', className)}
        onClick={onClick}
        aria-label={`Shopping cart with ${itemCount} items`}
        {...props}
      >
        <ShoppingBag className="h-5 w-5" />
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
CartButton.displayName = 'CartButton';

export { CartButton };
