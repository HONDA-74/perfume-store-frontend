/**
 * Wishlist API service.
 * Matches backend wishlist endpoints exactly.
 * 
 * Backend endpoints:
 * GET    /api/v1/wishlist
 * POST   /api/v1/wishlist/items/:productId
 * DELETE /api/v1/wishlist/items/:productId
 * 
 * IMPORTANT: productId is in URL path, not request body.
 */

import { apiClient } from '@/lib';
import type {
  ApiSuccessResponse,
  Wishlist,
} from '@/types';

/**
 * Get current user's wishlist.
 */
export async function getWishlist(): Promise<Wishlist> {
  const { data } = await apiClient.get<ApiSuccessResponse<Wishlist>>('/wishlist');
  return data.data;
}

/**
 * Add item to wishlist.
 * productId goes in URL path, not body.
 */
export async function addToWishlist(productId: string): Promise<Wishlist> {
  const { data } = await apiClient.post<ApiSuccessResponse<Wishlist>>(
    `/wishlist/items/${productId}`
  );
  return data.data;
}

/**
 * Remove item from wishlist.
 * productId goes in URL path.
 */
export async function removeFromWishlist(productId: string): Promise<Wishlist> {
  const { data } = await apiClient.delete<ApiSuccessResponse<Wishlist>>(
    `/wishlist/items/${productId}`
  );
  return data.data;
}
