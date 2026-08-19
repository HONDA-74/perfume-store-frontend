import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

/**
 * Auth Store - Authentication state and token management.
 * 
 * Manages:
 * - Access/refresh tokens (persisted to localStorage)
 * - Current user data (synced from React Query)
 * - Authentication status
 * 
 * IMPORTANT:
 * - User data is the source of truth from React Query (useCurrentUser hook)
 * - This store only holds tokens and provides helper methods
 * - Do NOT duplicate user data fetching here
 */
interface AuthState {
  // Tokens
  accessToken: string | null;
  refreshToken: string | null;

  // User (synced from React Query)
  user: User | null;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  logout: () => void;

  // Computed
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      accessToken: null,
      refreshToken: null,
      user: null,

      // Set tokens after login/register/refresh
      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, refreshToken });
      },

      // Sync user from React Query
      setUser: (user: User | null) => {
        set({ user });
      },

      // Clear all auth state on logout
      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      },

      // Logout (alias for clearAuth)
      logout: () => {
        get().clearAuth();
      },

      // Check if user is authenticated
      isAuthenticated: () => {
        const state = get();
        return !!(state.accessToken && state.user);
      },

      // Check if user has admin role
      isAdmin: () => {
        const state = get();
        return state.user?.role === 'ADMIN';
      },
    }),
    {
      name: 'kenz-auth-storage',
      // Only persist tokens, not user data (user is fetched from server)
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

/**
 * Token storage adapter for axios interceptor.
 * Bridges Zustand store with axios token management.
 */
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return useAuthStore.getState().accessToken;
  },

  getRefreshToken: (): string | null => {
    return useAuthStore.getState().refreshToken;
  },

  setTokens: (accessToken: string, refreshToken: string): void => {
    useAuthStore.getState().setTokens(accessToken, refreshToken);
  },

  clearTokens: (): void => {
    useAuthStore.getState().clearAuth();
  },
};
