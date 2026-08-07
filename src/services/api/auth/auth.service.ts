/**
 * Authentication API service.
 * Matches backend auth endpoints exactly.
 * 
 * Backend endpoints:
 * POST   /api/v1/auth/register
 * POST   /api/v1/auth/login
 * POST   /api/v1/auth/logout
 * POST   /api/v1/auth/refresh
 * GET    /api/v1/auth/me
 */

import { apiClient } from '@/lib';
import type {
  ApiSuccessResponse,
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types';

/**
 * Register new user.
 */
export async function register(payload: RegisterData): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
    '/auth/register',
    payload
  );
  return data.data;
}

/**
 * Login user.
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
    '/auth/login',
    credentials
  );
  return data.data;
}

/**
 * Logout user.
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

/**
 * Refresh access token.
 */
export async function refreshToken(
  payload: RefreshTokenRequest
): Promise<RefreshTokenResponse> {
  const { data } = await apiClient.post<ApiSuccessResponse<RefreshTokenResponse>>(
    '/auth/refresh',
    payload
  );
  return data.data;
}

/**
 * Get current authenticated user.
 */
export async function getCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiSuccessResponse<User>>('/auth/me');
  return data.data;
}
