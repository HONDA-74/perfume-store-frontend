/**
 * Products API service.
 * Matches backend products endpoints exactly.
 * 
 * Backend endpoints:
 * GET    /api/v1/products
 * POST   /api/v1/products (admin)
 * GET    /api/v1/products/:idOrSlug
 * PATCH  /api/v1/products/:id (admin)
 * DELETE /api/v1/products/:id (admin)
 * PATCH  /api/v1/products/:id/stock (admin)
 */

import { apiClient } from '@/lib';
import { normalizePaginatedResponse } from '@/services/api/pagination';
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  PaginatedData,
  Product,
  ProductQueryParams,
  CreateProductDto,
  UpdateProductDto,
  UpdateStockDto,
} from '@/types';

/**
 * Fetch paginated list of products.
 */
export async function getProducts(
  params?: ProductQueryParams
): Promise<PaginatedData<Product>> {
  const { data } = await apiClient.get<ApiPaginatedResponse<Product>>(
    '/products',
    { params }
  );
  return normalizePaginatedResponse(data);
}

/**
 * Fetch single product by ID or slug.
 */
export async function getProduct(idOrSlug: string): Promise<Product> {
  const { data } = await apiClient.get<ApiSuccessResponse<Product>>(
    `/products/${idOrSlug}`
  );
  return data.data;
}

/**
 * Create product (admin only).
 */
export async function createProduct(payload: CreateProductDto): Promise<Product> {
  const { data } = await apiClient.post<ApiSuccessResponse<Product>>(
    '/products',
    payload
  );
  return data.data;
}

/**
 * Update product (admin only).
 */
export async function updateProduct(
  id: string,
  payload: UpdateProductDto
): Promise<Product> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Product>>(
    `/products/${id}`,
    payload
  );
  return data.data;
}

/**
 * Delete product (admin only).
 */
export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

/**
 * Update product stock (admin only).
 */
export async function updateProductStock(
  id: string,
  payload: UpdateStockDto
): Promise<Product> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Product>>(
    `/products/${id}/stock`,
    payload
  );
  return data.data;
}
