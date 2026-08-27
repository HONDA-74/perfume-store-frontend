import type { ApiPaginatedResponse, PaginatedData } from '@/types';

/** Normalize the backend's paginated response envelope for application consumers. */
export function normalizePaginatedResponse<T>(response: ApiPaginatedResponse<T>): PaginatedData<T> {
  return {
    items: response.data,
    meta: response.meta,
  };
}
