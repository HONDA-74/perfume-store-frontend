/**
 * React Query hooks for cart.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import * as cartApi from '@/services/api/cart';
import type { AddToCartDto, UpdateCartItemDto, Cart } from '@/types';

/**
 * Get current user's cart.
 */
export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: cartApi.getCart,
    staleTime: 0, // Always fresh - cart changes frequently
  });
}

/**
 * Get cart item count.
 */
export function useCartCount() {
  const { data: cart } = useCart();
  return cart?.items.length ?? 0;
}

/**
 * Add to cart mutation with optimistic update.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartDto) => cartApi.addToCart(payload),
    
    // Optimistic update
    onMutate: async (payload) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });
      
      // Snapshot previous value
      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart.current());
      
      // Optimistically update cache
      if (previousCart) {
        const existingItem = previousCart.items.find(
          (item) => item.productId === payload.productId
        );
        
        if (existingItem) {
          // Update quantity if item exists
          queryClient.setQueryData<Cart>(queryKeys.cart.current(), {
            ...previousCart,
            items: previousCart.items.map((item) =>
              item.productId === payload.productId
                ? { ...item, quantity: item.quantity + payload.quantity }
                : item
            ),
          });
        } else {
          // Add new item (we don't have price yet, server will provide)
          queryClient.setQueryData<Cart>(queryKeys.cart.current(), {
            ...previousCart,
            items: [
              ...previousCart.items,
              {
                productId: payload.productId,
                quantity: payload.quantity,
                priceAtAdd: 0, // Placeholder, real data from server
              },
            ],
          });
        }
      }
      
      return { previousCart };
    },
    
    // On success, update with real data
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart.current(), updatedCart);
    },
    
    // On error, rollback
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.current(), context.previousCart);
      }
    },
    
    // Always refetch after mutation settles
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}

/**
 * Update cart item mutation with optimistic update.
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, payload }: { productId: string; payload: UpdateCartItemDto }) =>
      cartApi.updateCartItem(productId, payload),
    
    // Optimistic update
    onMutate: async ({ productId, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });
      
      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart.current());
      
      if (previousCart) {
        queryClient.setQueryData<Cart>(queryKeys.cart.current(), {
          ...previousCart,
          items: previousCart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: payload.quantity }
              : item
          ),
        });
      }
      
      return { previousCart };
    },
    
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart.current(), updatedCart);
    },
    
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.current(), context.previousCart);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}

/**
 * Remove cart item mutation with optimistic update.
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => cartApi.removeCartItem(productId),
    
    // Optimistic update
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.current() });
      
      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart.current());
      
      if (previousCart) {
        queryClient.setQueryData<Cart>(queryKeys.cart.current(), {
          ...previousCart,
          items: previousCart.items.filter((item) => item.productId !== productId),
        });
      }
      
      return { previousCart };
    },
    
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(queryKeys.cart.current(), updatedCart);
    },
    
    onError: (_error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.current(), context.previousCart);
      }
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.current() });
    },
  });
}

/**
 * Clear cart mutation.
 * No optimistic update - too risky.
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}
