/**
 * React Query hooks for brands.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as brandsApi from '@/services/api/brands';
import type { BaseQueryParams, CreateBrandDto, UpdateBrandDto } from '@/types';

/**
 * Fetch paginated brands list.
 */
export function useBrands(params?: BaseQueryParams) {
  return useQuery({
    queryKey: queryKeys.brands.list(params as Record<string, unknown> | undefined),
    queryFn: () => brandsApi.getBrands(params),
    staleTime: 10 * 60 * 1000, // 10 minutes - brands change rarely
  });
}

/**
 * Fetch single brand by ID or slug.
 */
export function useBrand(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.brands.detail(idOrSlug),
    queryFn: () => brandsApi.getBrand(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Create brand mutation (admin).
 */
export function useCreateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBrandDto) => brandsApi.createBrand(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
    },
  });
}

/**
 * Update brand mutation (admin).
 */
export function useUpdateBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBrandDto }) =>
      brandsApi.updateBrand(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
    },
  });
}

/**
 * Delete brand mutation (admin).
 */
export function useDeleteBrand() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => brandsApi.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.brands.lists() });
    },
  });
}
