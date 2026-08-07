/**
 * React Query hooks for categories.
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as categoriesApi from '@/services/api/categories';
import type { BaseQueryParams } from '@/types';

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
