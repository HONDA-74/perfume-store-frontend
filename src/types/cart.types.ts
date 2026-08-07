/**
 * Cart domain types.
 * Matches backend cart module API contracts exactly.
 */

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Minimal cart item structure from backend.
 * Product data is NOT embedded - use productId to fetch if needed.
 */
export interface CartItem {
  productId: string;
  quantity: number;
  priceAtAdd: number;
}

export interface AddToCartDto {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
