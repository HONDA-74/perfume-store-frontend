/**
 * Categories API service.
 * Handles all category-related API calls.
 * 
 * Backend endpoints:
 * GET    /api/v1/categories
 * GET    /api/v1/categories/:id
 * GET    /api/v1/categories/tree
 * POST   /api/v1/categories (admin)
 * PATCH  /api/v1/categories/:id (admin)
 * DELETE /api/v1/categories/:id (admin)
 */

import { apiClient } from '@/lib';
import type {
  ApiSuccessResponse,
  PaginatedData,
  Category,
  BaseQueryParams,
  CreateCategoryDto,
  UpdateCategoryDto,
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

/**
 * Create category (admin).
 */
export async function createCategory(payload: CreateCategoryDto): Promise<Category> {
  const { data } = await apiClient.post<ApiSuccessResponse<Category>>(
    '/categories',
    payload
  );
  return data.data;
}

/**
 * Update category (admin).
 */
export async function updateCategory(id: string, payload: UpdateCategoryDto): Promise<Category> {
  const { data} = await apiClient.patch<ApiSuccessResponse<Category>>(
    `/categories/${id}`,
    payload
  );
  return data.data;
}

/**
 * Delete category (admin).
 */
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
