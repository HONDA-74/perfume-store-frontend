/**
 * Rating Component
 *
 * Displays star rating with optional review count.
 * Adapted from Figma UI to use backend field names.
 *
 * Backend fields:
 * - ratingAverage: Average rating (0-5)
 * - ratingCount: Number of reviews
 */

import { cn } from '@/lib/cn';

export interface RatingProps {
  /** Rating value (0-5) */
  value: number;
  /** Number of reviews (optional) */
  count?: number;
  /** Size variant */
  size?: 'sm' | 'md';
  /** Additional CSS classes */
  className?: string;
}

export function Rating({ value, count, size = 'sm', className }: RatingProps) {
  const starSize = size === 'sm' ? 10 : 13;
  const filled = Math.floor(value);
  const hasHalf = value - filled >= 0.5;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`${value} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const isFilled = i < filled;
          const isHalf = i === filled && hasHalf;

          return (
            <svg
              key={i}
              width={starSize}
              height={starSize}
              viewBox="0 0 12 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 1l1.236 2.505L10 3.91l-2 1.95.472 2.74L6 7.27 3.528 8.6 4 5.86 2 3.91l2.764-.405z"
                fill={isFilled ? 'hsl(43 82% 52%)' : isHalf ? 'url(#half-star)' : 'none'}
                stroke={isFilled || isHalf ? 'hsl(43 82% 52%)' : 'rgba(255,255,255,0.2)'}
                strokeWidth="0.8"
              />
              {isHalf && (
                <defs>
                  <linearGradient id="half-star" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="hsl(43 82% 52%)" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
            </svg>
          );
        })}
      </div>
      {count !== undefined && count > 0 && (
        <span className="font-sans text-[10px] leading-none text-muted-foreground/35">
          ({count})
        </span>
      )}
    </div>
  );
}
