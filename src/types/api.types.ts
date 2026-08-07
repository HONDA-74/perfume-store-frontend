/**
 * Structural types mirroring the backend's standardized response envelope
 * (Luxury Perfume Store API — AI_RULES.md §19 / API_BLUEPRINT.md §1.2-1.3).
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
  errors: unknown[];
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
