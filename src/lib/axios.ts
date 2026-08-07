import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios';
import { env } from '@/config/env';
import { handleApiError } from './api-error-handler';
import { tokenStorage } from '@/stores/auth.store';

/**
 * Single shared Axios instance for the whole app.
 * 
 * Per backend API structure:
 * - Base URL: VITE_API_BASE_URL (e.g., http://localhost:3000/api/v1)
 * - Timeout: VITE_API_TIMEOUT_MS
 * - JWT auth via Bearer token
 * - Token refresh on 401
 * 
 * Token management is handled by auth.store.ts via tokenStorage adapter.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Track if a token refresh is in progress to prevent multiple simultaneous refreshes.
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Request interceptor for authentication.
 * Injects Bearer token if available.
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for standardized error handling and token refresh.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Normalize error
    const normalizedError = handleApiError(error);

    // Handle 401 Unauthorized - attempt token refresh
    if (normalizedError.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the ongoing refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token available - clear tokens and reject
        tokenStorage.clearTokens();
        processQueue(new Error('No refresh token available'), null);
        isRefreshing = false;
        return Promise.reject(normalizedError);
      }

      try {
        // Attempt to refresh the token
        const { data } = await axios.post(
          `${env.apiBaseUrl}/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { accessToken, refreshToken: newRefreshToken } = data.data;

        // Store new tokens
        tokenStorage.setTokens(accessToken, newRefreshToken);

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        processQueue(null, accessToken);
        isRefreshing = false;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and reject all queued requests
        tokenStorage.clearTokens();
        processQueue(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'), null);
        isRefreshing = false;
        return Promise.reject(normalizedError);
      }
    }

    return Promise.reject(normalizedError);
  }
);
