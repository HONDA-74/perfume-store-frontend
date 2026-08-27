/**
 * Brands API service.
 * Handles all brand-related API calls.
 * 
 * Backend endpoints:
 * GET    /api/v1/brands
 * GET    /api/v1/brands/:id
 * POST   /api/v1/brands (admin)
 * PATCH  /api/v1/brands/:id (admin)
 * DELETE /api/v1/brands/:id (admin)
 */

import { apiClient } from '@/lib';
import { PAGINATION_DEFAULTS } from '@/constants/app.constants';
import { normalizePaginatedResponse } from '@/services/api/pagination';
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginatedData,
  Brand,
  BaseQueryParams,
  CreateBrandDto,
  UpdateBrandDto,
} from '@/types';

/**
 * Fetch paginated list of brands.
 */
export async function getBrands(
  params?: BaseQueryParams
): Promise<PaginatedData<Brand>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Brand>>(
    '/brands',
    { params }
  );
  return normalizePaginatedResponse(data);
}

/**
 * Fetch every brand using backend-compliant pages.
 */
export async function getAllBrands(): Promise<PaginatedData<Brand>> {
  const firstPage = await getBrands({ page: 1, limit: PAGINATION_DEFAULTS.maxLimit });

  const remainingPages = firstPage.meta.totalPages > 1
    ? await Promise.all(
      Array.from({ length: firstPage.meta.totalPages - 1 }, (_, index) =>
        getBrands({ page: index + 2, limit: PAGINATION_DEFAULTS.maxLimit })
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
 * Fetch single brand by ID or slug.
 */
export async function getBrand(idOrSlug: string): Promise<Brand> {
  const { data } = await apiClient.get<ApiSuccessResponse<Brand>>(
    `/brands/${idOrSlug}`
  );
  return data.data;
}

/**
 * Create brand (admin).
 */
export async function createBrand(payload: CreateBrandDto): Promise<Brand> {
  const { data } = await apiClient.post<ApiSuccessResponse<Brand>>(
    '/brands',
    payload
  );
  return data.data;
}

/**
 * Update brand (admin).
 */
export async function updateBrand(id: string, payload: UpdateBrandDto): Promise<Brand> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Brand>>(
    `/brands/${id}`,
    payload
  );
  return data.data;
}

/**
 * Delete brand (admin).
 */
export async function deleteBrand(id: string): Promise<void> {
  await apiClient.delete(`/brands/${id}`);
}
