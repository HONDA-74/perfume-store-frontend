/**
 * Collection Adapter
 *
 * Backend Reality: No Collections API exists.
 * Backend has Categories only.
 *
 * UI Strategy: Treat categories as collections in the UI layer.
 * Routes like `/collections` show categories.
 * Route `/collections/:slug` shows category detail + filtered products.
 *
 * This adapter provides a semantic mapping layer so the UI
 * can use "collection" terminology while the backend uses categories.
 */

import type { Category } from '@/types/product.types';

/**
 * Collection type alias
 * In this application, collections ARE categories
 */
export type Collection = Category;

/**
 * Direct mapping (identity function for type safety)
 */
export function mapCategoryToCollection(category: Category): Collection {
  return category;
}

/**
 * Map array of categories to collections
 */
export function mapCategoriesToCollections(categories: Category[]): Collection[] {
  return categories; // Direct mapping
}

/**
 * Map collection back to category (for API calls)
 */
export function mapCollectionToCategory(collection: Collection): Category {
  return collection;
}

/**
 * Type guard to check if a value is a valid collection
 */
export function isValidCollection(value: unknown): value is Collection {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value &&
    'slug' in value
  );
}
