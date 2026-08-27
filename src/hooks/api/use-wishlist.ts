/**
 * React Query hooks for wishlist.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as wishlistApi from '@/services/api/wishlist';
import type { Wishlist } from '@/types';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Get current user's wishlist.
 */
export function useWishlist() {
  const hasSession = useAuthStore((state) => !!state.accessToken);
  return useQuery({
    queryKey: queryKeys.wishlist.current(),
    queryFn: wishlistApi.getWishlist,
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: hasSession,
  });
}

/**
 * Get wishlist item count.
 */
export function useWishlistCount() {
  const { data: wishlist } = useWishlist();
  return wishlist?.items.length ?? 0;
}

/**
 * Add to wishlist mutation with optimistic update.
 */
export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.addToWishlist(productId),
    
    // Optimistic update
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.current() });
      
      const previousWishlist = queryClient.getQueryData<Wishlist>(
        queryKeys.wishlist.current()
      );
      
      if (previousWishlist) {
        queryClient.setQueryData<Wishlist>(queryKeys.wishlist.current(), {
          ...previousWishlist,
          items: [
            ...previousWishlist.items,
            {
              productId,
              addedAt: new Date().toISOString(),
            },
          ],
        });
      }
      
      return { previousWishlist };
    },
    
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(queryKeys.wishlist.current(), updatedWishlist);
    },
    
    onError: (_error, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.wishlist.current(), context.previousWishlist);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.current() });
    },
  });
}

/**
 * Remove from wishlist mutation with optimistic update.
 */
export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => wishlistApi.removeFromWishlist(productId),
    
    // Optimistic update
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.current() });
      
      const previousWishlist = queryClient.getQueryData<Wishlist>(
        queryKeys.wishlist.current()
      );
      
      if (previousWishlist) {
        queryClient.setQueryData<Wishlist>(queryKeys.wishlist.current(), {
          ...previousWishlist,
          items: previousWishlist.items.filter((item) => item.productId !== productId),
        });
      }
      
      return { previousWishlist };
    },
    
    onSuccess: (updatedWishlist) => {
      queryClient.setQueryData(queryKeys.wishlist.current(), updatedWishlist);
    },
    
    onError: (_error, _variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(queryKeys.wishlist.current(), context.previousWishlist);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.current() });
    },
  });
}

/**
 * Check if product is in wishlist.
 */
export function useIsInWishlist(productId: string) {
  const { data: wishlist } = useWishlist();
  return wishlist?.items.some((item) => item.productId === productId) ?? false;
}

/**
 * Toggle wishlist item (add if not in wishlist, remove if in wishlist).
 * Useful for wishlist button components.
 */
export function useToggleWishlist() {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useWishlist();

  const toggle = (productId: string) => {
    const isInWishlist = wishlist?.items.some((item) => item.productId === productId);
    
    if (isInWishlist) {
      return removeFromWishlist.mutateAsync(productId);
    } else {
      return addToWishlist.mutateAsync(productId);
    }
  };

  return {
    toggle,
    isLoading: addToWishlist.isPending || removeFromWishlist.isPending,
  };
}
