/**
 * React Query hooks for brands.
 */

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as brandsApi from '@/services/api/brands';
import type { BaseQueryParams } from '@/types';

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
