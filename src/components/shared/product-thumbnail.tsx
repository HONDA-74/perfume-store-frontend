import * as React from 'react';
import { cn } from '@/lib';

export interface ProductThumbnailProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  src: string;
  alt: string;
  isActive?: boolean;
}

/**
 * ProductThumbnail — clickable thumbnail image for product gallery navigation.
 * Used in ProductGallery to switch between product images.
 */
const ProductThumbnail = React.forwardRef<
  HTMLButtonElement,
  ProductThumbnailProps
>(({ src, alt, isActive = false, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-fast',
        isActive
          ? 'border-primary-500 ring-2 ring-primary-500 ring-offset-2'
          : 'border-neutral-200 hover:border-neutral-300',
        className,
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </button>
  );
});
ProductThumbnail.displayName = 'ProductThumbnail';

export { ProductThumbnail };
