/**
 * Cart API service.
 * Matches backend cart endpoints exactly.
 * 
 * Backend endpoints:
 * GET    /api/v1/cart
 * DELETE /api/v1/cart
 * POST   /api/v1/cart/items
 * PATCH  /api/v1/cart/items/:productId
 * DELETE /api/v1/cart/items/:productId
 */

import { apiClient } from '@/lib';
import type {
  ApiSuccessResponse,
  Cart,
  AddToCartDto,
  UpdateCartItemDto,
} from '@/types';

/**
 * Get current user's cart.
 */
export async function getCart(): Promise<Cart> {
  const { data } = await apiClient.get<ApiSuccessResponse<Cart>>('/cart');
  return data.data;
}

/**
 * Add item to cart.
 */
export async function addToCart(payload: AddToCartDto): Promise<Cart> {
  const { data } = await apiClient.post<ApiSuccessResponse<Cart>>(
    '/cart/items',
    payload
  );
  return data.data;
}

/**
 * Update cart item quantity.
 * Uses productId in URL path, not itemId.
 */
export async function updateCartItem(
  productId: string,
  payload: UpdateCartItemDto
): Promise<Cart> {
  const { data } = await apiClient.patch<ApiSuccessResponse<Cart>>(
    `/cart/items/${productId}`,
    payload
  );
  return data.data;
}

/**
 * Remove item from cart.
 * Uses productId in URL path, not itemId.
 */
export async function removeCartItem(productId: string): Promise<Cart> {
  const { data } = await apiClient.delete<ApiSuccessResponse<Cart>>(
    `/cart/items/${productId}`
  );
  return data.data;
}

/**
 * Clear cart.
 */
export async function clearCart(): Promise<void> {
  await apiClient.delete('/cart');
}
