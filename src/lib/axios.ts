import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';

/**
 * Single shared Axios instance for the whole app. Feature-level API modules
 * (under `src/services/` or a feature's own `services/` folder) should
 * import this instance rather than calling `axios` directly — this is the
 * one place base URL, timeout, and cross-cutting interceptors are defined
 * (mirrors the backend's "one shared axios instance" convention referenced
 * in Design_System.md §10 "API Integration Layer").
 *
 * Intentionally NOT wired up yet:
 *  - Authorization header injection (no auth implemented in this scaffold)
 *  - 401/refresh-token retry flow
 *  - Toast/error-notification side effects
 * Those are feature/business concerns, added when Auth and API integration
 * are actually implemented — this file only establishes the transport layer.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor placeholder. Left as an explicit pass-through (not
 * omitted) so the extension point is obvious — e.g. attaching a Bearer
 * token once Auth exists.
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

/**
 * Response interceptor placeholder. Left as an explicit pass-through/reject
 * so the standardized backend envelope (`{ success, message, data, meta }`
 * per the API's AI_RULES.md §19) has one obvious place to be unwrapped once
 * real API integration begins.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);
