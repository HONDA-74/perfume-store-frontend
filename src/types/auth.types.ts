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
  phone?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  email?: string;
  phone?: string;
}

export interface SavedAddress {
  id: string;
  label?: string;
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface CreateSavedAddressData {
  label?: string;
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  street: string;
  postalCode?: string;
  isDefault?: boolean;
}

export type UpdateSavedAddressData = Partial<CreateSavedAddressData>;

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

export interface RequestPasswordResetData {
  email: string;
  locale?: 'en' | 'ar';
}

export interface ConfirmPasswordResetData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface AuthMessageResponse {
  message: string;
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
