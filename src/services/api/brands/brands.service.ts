/**
 * Brands API service.
 * Handles all brand-related API calls.
 * 
 * Backend endpoints (when implemented):
 * GET    /api/v1/brands
 * GET    /api/v1/brands/:id
 */

import { apiClient } from '@/lib';
import type {
  ApiSuccessResponse,
  PaginatedData,
  Brand,
  BaseQueryParams,
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
