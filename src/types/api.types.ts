/**
 * Structural types mirroring the backend's standardized response envelope
 * (KENZ API — AI_RULES.md §19 / API_BLUEPRINT.md §1.2-1.3).
 * These are shape contracts only — no fetching logic lives here.
 */

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Common query parameters for list endpoints.
 */
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Search query parameters.
 */
export interface SearchQueryParams extends BaseQueryParams {
  q: string;
  filters?: Record<string, string | number | boolean>;
}

/**
 * File upload response.
 */
export interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes?: number;
}
