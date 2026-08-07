/**
 * React Query hooks for products.
 */

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as productsApi from '@/services/api/products';
import type {
  ProductQueryParams,
  CreateProductDto,
  UpdateProductDto,
  UpdateStockDto,
} from '@/types';

/**
 * Fetch paginated products list.
 */
export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params as Record<string, unknown> | undefined),
    queryFn: () => productsApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single product by ID or slug.
 */
export function useProduct(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(idOrSlug),
    queryFn: () => productsApi.getProduct(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Infinite scroll products list.
 */
export function useInfiniteProducts(params?: ProductQueryParams) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.infinite(params as Record<string, unknown> | undefined),
    queryFn: ({ pageParam = 1 }) => productsApi.getProducts({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      const { meta } = lastPage;
      return meta.page < meta.totalPages ? meta.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Create product mutation (admin).
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProductDto) => productsApi.createProduct(payload),
    onSuccess: () => {
      // Invalidate products lists
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

/**
 * Update product mutation (admin).
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductDto }) =>
      productsApi.updateProduct(id, payload),
    onSuccess: (_, variables) => {
      // Invalidate specific product and lists
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

/**
 * Delete product mutation (admin).
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      // Invalidate products lists
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

/**
 * Update product stock mutation (admin).
 */
export function useUpdateProductStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStockDto }) =>
      productsApi.updateProductStock(id, payload),
    onSuccess: (_, variables) => {
      // Invalidate specific product and lists
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}
