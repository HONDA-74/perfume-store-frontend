import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib';

export interface StockBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'pre-order';
  quantity?: number;
}

/**
 * StockBadge — displays product availability status.
 * Shows appropriate color and messaging based on stock level.
 */
const StockBadge = React.forwardRef<HTMLDivElement, StockBadgeProps>(
  ({ status, quantity, className, ...props }, _ref) => {
    const badgeConfig = {
      'in-stock': {
        label: 'In Stock',
        variant: 'success' as const,
      },
      'low-stock': {
        label: quantity ? `Only ${quantity} left` : 'Low Stock',
        variant: 'warning' as const,
      },
      'out-of-stock': {
        label: 'Out of Stock',
        variant: 'destructive' as const,
      },
      'pre-order': {
        label: 'Pre-Order',
        variant: 'secondary' as const,
      },
    };

    const config = badgeConfig[status];

    return (
      <Badge
        variant={config.variant}
        className={cn('font-medium', className)}
        {...props}
      >
        {config.label}
      </Badge>
    );
  },
);
StockBadge.displayName = 'StockBadge';

export { StockBadge };
