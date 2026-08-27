/**
 * React Query hooks for categories.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as categoriesApi from '@/services/api/categories';
import type { BaseQueryParams, CreateCategoryDto, UpdateCategoryDto } from '@/types';

/**
 * Fetch paginated categories list.
 */
export function useCategories(params?: BaseQueryParams) {
  const queryParams = params as Record<string, unknown> | undefined;

  return useQuery({
    queryKey: queryKeys.categories.list(queryParams),
    queryFn: () => categoriesApi.getCategories(params),
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change rarely
  });
}

/**
 * Fetch the complete category list through legal pages of at most 50 records.
 */
export function useAllCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list({ all: true }),
    queryFn: categoriesApi.getAllCategories,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch single category by ID or slug.
 */
export function useCategory(idOrSlug: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(idOrSlug),
    queryFn: () => categoriesApi.getCategory(idOrSlug),
    enabled: !!idOrSlug,
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Create category mutation (admin).
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryDto) => categoriesApi.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
    },
  });
}

/**
 * Update category mutation (admin).
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryDto }) =>
      categoriesApi.updateCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
    },
  });
}

/**
 * Delete category mutation (admin).
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.lists() });
    },
  });
}
