/**
 * Authentication & Authorization types.
 * Matches backend auth module API contracts exactly.
 * Backend: POST /auth/login, POST /auth/register return combined response.
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

/**
 * Combined auth response from login/register.
 * Backend returns: { accessToken, refreshToken, user }
 */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Response from token refresh endpoint.
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
