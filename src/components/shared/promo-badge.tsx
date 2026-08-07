import * as React from 'react';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib';

export interface PromoBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  description?: string;
  discount?: string;
}

/**
 * PromoBadge — displays active promo code with discount information.
 * Used in cart and checkout to show applied promotions.
 */
const PromoBadge = React.forwardRef<HTMLDivElement, PromoBadgeProps>(
  ({ code, description, discount, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 rounded-lg border border-success-500 bg-success-50 p-3',
          className,
        )}
        {...props}
      >
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-success-500">
          <Tag className="h-4 w-4 text-neutral-0" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="success" className="font-mono">
              {code}
            </Badge>
            {discount && (
              <span className="text-body-sm font-semibold text-success-700">
                {discount} off
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-caption text-neutral-600">{description}</p>
          )}
        </div>
      </div>
    );
  },
);
PromoBadge.displayName = 'PromoBadge';

export { PromoBadge };
