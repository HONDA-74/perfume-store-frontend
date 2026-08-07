import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib';

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  rating: number;
  maxRating?: number;
  showValue?: boolean;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Rating — displays star rating with optional numeric value and review count.
 * Supports fractional ratings with partial star fills.
 */
const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      rating,
      maxRating = 5,
      showValue = false,
      reviewCount,
      size = 'md',
      className,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const textSizeClasses = {
      sm: 'text-caption',
      md: 'text-body-sm',
      lg: 'text-body-md',
    };

    const clampedRating = Math.max(0, Math.min(rating, maxRating));

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        <div className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of ${maxRating}`}>
          {Array.from({ length: maxRating }, (_, index) => {
            const fillPercentage = Math.max(
              0,
              Math.min(100, (clampedRating - index) * 100),
            );

            return (
              <div key={index} className="relative">
                <Star
                  className={cn(sizeClasses[size], 'text-neutral-200')}
                  fill="currentColor"
                />
                {fillPercentage > 0 && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${fillPercentage}%` }}
                  >
                    <Star
                      className={cn(sizeClasses[size], 'text-primary-500')}
                      fill="currentColor"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {showValue && (
          <span className={cn('font-medium text-neutral-700', textSizeClasses[size])}>
            {rating.toFixed(1)}
          </span>
        )}

        {reviewCount !== undefined && (
          <span className={cn('text-neutral-500', textSizeClasses[size])}>
            ({reviewCount})
          </span>
        )}
      </div>
    );
  },
);
Rating.displayName = 'Rating';

export { Rating };
