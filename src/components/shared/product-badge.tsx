import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib';

export interface ProductBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type: 'new' | 'sale' | 'exclusive' | 'limited' | 'bestseller';
}

/**
 * ProductBadge — specialized badge for product status indicators.
 * Displays contextual badges like "New", "Sale", "Exclusive", etc.
 */
const ProductBadge = React.forwardRef<HTMLDivElement, ProductBadgeProps>(
  ({ type, className, ...props }, _ref) => {
    const badgeConfig = {
      new: {
        label: 'New',
        variant: 'default' as const,
      },
      sale: {
        label: 'Sale',
        variant: 'destructive' as const,
      },
      exclusive: {
        label: 'Exclusive',
        variant: 'default' as const,
      },
      limited: {
        label: 'Limited Edition',
        variant: 'secondary' as const,
      },
      bestseller: {
        label: 'Bestseller',
        variant: 'success' as const,
      },
    };

    const config = badgeConfig[type];

    return (
      <Badge
        variant={config.variant}
        className={cn('uppercase tracking-wide', className)}
        {...props}
      >
        {config.label}
      </Badge>
    );
  },
);
ProductBadge.displayName = 'ProductBadge';

export { ProductBadge };
