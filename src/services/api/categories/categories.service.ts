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
import { PAGINATION_DEFAULTS } from '@/constants/app.constants';
import { normalizePaginatedResponse } from '@/services/api/pagination';
import type {
  ApiPaginatedResponse,
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
  const { data } = await apiClient.get<ApiPaginatedResponse<Category>>(
    '/categories',
    { params }
  );
  return normalizePaginatedResponse(data);
}

/**
 * Fetch every category using backend-compliant pages.
 */
export async function getAllCategories(): Promise<PaginatedData<Category>> {
  const firstPage = await getCategories({ page: 1, limit: PAGINATION_DEFAULTS.maxLimit });

  const remainingPages = firstPage.meta.totalPages > 1
    ? await Promise.all(
      Array.from({ length: firstPage.meta.totalPages - 1 }, (_, index) =>
        getCategories({ page: index + 2, limit: PAGINATION_DEFAULTS.maxLimit })
      )
    )
    : [];

  const items = [firstPage, ...remainingPages].flatMap((page) => page.items);

  return {
    items,
    meta: {
      page: 1,
      limit: items.length,
      totalItems: items.length,
      totalPages: 1,
    },
  };
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
