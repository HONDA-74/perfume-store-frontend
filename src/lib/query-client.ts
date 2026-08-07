import { QueryClient } from '@tanstack/react-query';

/**
 * Shared QueryClient instance. Consumed by `src/providers/query-provider.tsx`.
 * Defaults are conservative and generic — feature-specific `staleTime`/
 * `retry` overrides belong on individual `useQuery` calls inside
 * `src/features/*`, not here.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
