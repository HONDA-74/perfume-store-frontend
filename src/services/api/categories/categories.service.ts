/**
 * Categories API service.
 * Handles all category-related API calls.
 * 
 * Backend endpoints (when implemented):
 * GET    /api/v1/categories
 * GET    /api/v1/categories/:id
 * GET    /api/v1/categories/tree
 */

import { apiClient } from '@/lib';
import type {
  ApiSuccessResponse,
  PaginatedData,
  Category,
  BaseQueryParams,
} from '@/types';

/**
 * Fetch paginated list of categories.
 */
export async function getCategories(
  params?: BaseQueryParams
): Promise<PaginatedData<Category>> {
  const { data } = await apiClient.get<ApiSuccessResponse<PaginatedData<Category>>>(
    '/categories',
    { params }
  );
  return data.data;
}

/**
 * Fetch single category by ID or slug.
 */
export async function getCategory(idOrSlug: string): Promise<Category> {
  const { data } = await apiClient.get<ApiSuccessResponse<Category>>(
    `/categories/${idOrSlug}`
  );
  return data.data;
}

/**
 * Fetch hierarchical category tree.
 */
export async function getCategoryTree(): Promise<Category[]> {
  const { data } = await apiClient.get<ApiSuccessResponse<Category[]>>(
    '/categories/tree'
  );
  return data.data;
}
