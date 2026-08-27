import { QueryClient } from '@tanstack/react-query';

/**
 * Shared QueryClient instance for TanStack React Query.
 * 
 * Configuration is tailored for e-commerce applications:
 * - Longer stale times for catalog data (products, categories, brands)
 * - Shorter stale times for user-specific data (cart, wishlist, orders)
 * - Conservative retry behavior
 * - No automatic refetch on window focus
 * 
 * Feature-specific overrides belong in individual useQuery calls.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time: 2 minutes
      // Catalog data (products, categories) often override this with longer times
      staleTime: 2 * 60 * 1000,
      
      // Garbage collection time: 10 minutes
      // Keep unused data in cache for potential reuse
      gcTime: 10 * 60 * 1000,
      
      // Retry once for network/timeout errors
      // Don't retry auth errors (401/403) or client errors (400/422)
      retry: (failureCount, error: unknown) => {
        const status = typeof error === 'object' && error !== null && 'status' in error
          ? Number(error.status)
          : undefined;
        // Don't retry on auth errors
        if (status === 401 || status === 403) {
          return false;
        }
        
        // Don't retry on client errors
        if (status !== undefined && status >= 400 && status < 500) {
          return false;
        }
        
        // Retry once for server/network errors
        return failureCount < 1;
      },
      
      // Don't refetch on window focus
      // E-commerce data doesn't need aggressive refetching
      refetchOnWindowFocus: false,
      
      // Don't refetch on reconnect by default
      // Let user trigger refresh if needed
      refetchOnReconnect: false,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    
    mutations: {
      // Never retry mutations automatically
      // User should explicitly retry failed actions
      retry: 0,
    },
  },
});
