import * as React from 'react';
import { cn } from '@/lib';
import { Skeleton } from '@/components/ui/skeleton';

export interface ProductImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  isLoading?: boolean;
}

/**
 * ProductImage — optimized image component for product photography.
 * Maintains aspect ratio, handles loading state, and provides fallback.
 */
const ProductImage = React.forwardRef<HTMLImageElement, ProductImageProps>(
  (
    {
      src,
      alt,
      aspectRatio = 'portrait',
      isLoading = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const [imageError, setImageError] = React.useState(false);

    const aspectRatioClasses = {
      square: 'aspect-square',
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
    };

    if (isLoading) {
      return (
        <Skeleton
          className={cn(
            'w-full rounded-md',
            aspectRatioClasses[aspectRatio],
            className,
          )}
        />
      );
    }

    if (imageError) {
      return (
        <div
          className={cn(
            'flex w-full items-center justify-center rounded-md bg-neutral-100',
            aspectRatioClasses[aspectRatio],
            className,
          )}
        >
          <span className="text-body-sm text-neutral-400">Image unavailable</span>
        </div>
      );
    }

    return (
      <div className={cn('relative overflow-hidden rounded-md', className)}>
        {!imageLoaded && (
          <Skeleton
            className={cn('absolute inset-0', aspectRatioClasses[aspectRatio])}
          />
        )}
        <img
          ref={ref}
          src={src}
          alt={alt}
          className={cn(
            'w-full object-cover transition-opacity duration-300',
            aspectRatioClasses[aspectRatio],
            imageLoaded ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
          {...props}
        />
      </div>
    );
  },
);
ProductImage.displayName = 'ProductImage';

export { ProductImage };
