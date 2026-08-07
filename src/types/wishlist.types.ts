/**
 * Wishlist domain types.
 * Matches backend wishlist module API contracts exactly.
 * 
 * IMPORTANT: POST /wishlist/items/:productId uses productId in URL path, not body.
 */

export interface Wishlist {
  id: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}
