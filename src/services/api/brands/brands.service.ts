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
import type {
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
  const { data } = await apiClient.get<ApiSuccessResponse<PaginatedData<Brand>>>(
    '/brands',
    { params }
  );
  return data.data;
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
