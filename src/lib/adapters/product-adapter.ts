/**
 * Product Adapter
 *
 * Handles field name mismatches between backend Product schema
 * and UI component prop expectations from migrated Figma components.
 *
 * Backend fields → UI field mappings:
 * - name → title
 * - notes.middle → heartNotes
 * - ratingCount → reviewCount
 * - ratingAverage → rating
 *
 * Also derives UI-specific properties not in backend:
 * - badge (new/sale/bestseller/limited)
 * - inStock (from stockQuantity)
 */

import type { Product } from '@/types/product.types';

/**
 * Extended product interface with UI-friendly field names
 */
export interface ProductUI extends Omit<Product, 'name' | 'ratingCount' | 'ratingAverage'> {
  title: string;
  rating: number;
  reviewCount: number;
  heartNotes?: string[];
  badge?: 'new' | 'sale' | 'bestseller' | 'limited' | null;
  inStock: boolean;
}

/**
 * Map backend Product to UI-friendly shape
 */
export function mapProductForUI(product: Product): ProductUI {
  return {
    ...product,
    title: product.name,
    rating: product.ratingAverage,
    reviewCount: product.ratingCount,
    heartNotes: product.notes?.middle,
    badge: deriveProductBadge(product),
    inStock: product.stockQuantity > 0,
  };
}

/**
 * Derive product badge from backend fields
 *
 * Priority order:
 * 1. sale - if discountPrice exists
 * 2. bestseller - if isFeatured is true
 * 3. new - if created within last 30 days
 * 4. limited - if stock is low (< 10 units)
 */
export function deriveProductBadge(
  product: Product,
): 'new' | 'sale' | 'bestseller' | 'limited' | null {
  // Sale badge takes priority
  if (product.discountPrice && product.discountPrice < product.price) {
    return 'sale';
  }

  // Featured products are bestsellers
  if (product.isFeatured) {
    return 'bestseller';
  }

  // New products (created within last 30 days)
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const createdAtTime = new Date(product.createdAt).getTime();
  if (createdAtTime > thirtyDaysAgo) {
    return 'new';
  }

  // Limited stock warning
  if (product.stockQuantity > 0 && product.stockQuantity < 10) {
    return 'limited';
  }

  return null;
}

/**
 * Map array of products for UI
 */
export function mapProductsForUI(products: Product[]): ProductUI[] {
  return products.map(mapProductForUI);
}
