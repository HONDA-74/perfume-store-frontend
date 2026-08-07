/**
 * React Query hooks for authentication.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryKeys } from '@/lib/query-keys';
import { useAuthStore } from '@/stores';
import * as authApi from '@/services/api/auth';
import type {
  LoginCredentials,
  RegisterData,
} from '@/types';

/**
 * Get current authenticated user.
 * Syncs user data with auth store.
 */
export function useCurrentUser() {
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  const query = useQuery({
    queryKey: queryKeys.auth.user(),
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Sync user data to auth store
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    } else if (query.isError) {
      setUser(null);
    }
  }, [query.data, query.isError, setUser]);

  return query;
}

/**
 * Register mutation.
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: RegisterData) => authApi.register(payload),
    onSuccess: (data) => {
      // Store tokens
      setTokens(data.accessToken, data.refreshToken);
      
      // Set user in store
      setUser(data.user);
      
      // Set user data in React Query cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
  });
}

/**
 * Login mutation.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Store tokens
      setTokens(data.accessToken, data.refreshToken);
      
      // Set user in store
      setUser(data.user);
      
      // Set user data in React Query cache
      queryClient.setQueryData(queryKeys.auth.user(), data.user);
    },
  });
}

/**
 * Logout mutation.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear auth store (tokens + user)
      clearAuth();
      
      // Clear all cached data
      queryClient.clear();
    },
    onError: () => {
      // Even if API call fails, clear local state
      clearAuth();
      queryClient.clear();
    },
  });
}
