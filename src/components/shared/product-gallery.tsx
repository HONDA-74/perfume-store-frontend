import * as React from 'react';
import { cn } from '@/lib';
import { ProductImage } from './product-image';
import { ProductThumbnail } from './product-thumbnail';

export interface ProductGalleryImage {
  id: string;
  src: string;
  alt: string;
}

export interface ProductGalleryProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: ProductGalleryImage[];
  isLoading?: boolean;
}

/**
 * ProductGallery — main product image display with thumbnail navigation.
 * Displays large featured image with clickable thumbnail strip below.
 */
const ProductGallery = React.forwardRef<HTMLDivElement, ProductGalleryProps>(
  ({ images, isLoading = false, className, ...props }, ref) => {
    const [activeIndex, setActiveIndex] = React.useState(0);

    const activeImage = images[activeIndex];

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {/* Main Image */}
        <div className="overflow-hidden rounded-lg bg-neutral-50">
          {activeImage && (
            <ProductImage
              src={activeImage.src}
              alt={activeImage.alt}
              aspectRatio="portrait"
              isLoading={isLoading}
              className="w-full"
            />
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <ProductThumbnail
                key={image.id}
                src={image.src}
                alt={image.alt}
                isActive={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
ProductGallery.displayName = 'ProductGallery';

export { ProductGallery };
