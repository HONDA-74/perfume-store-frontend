/**
 * Centralized query key factory for TanStack Query.
 * 
 * Organizes keys by backend resource domain (per backend src/modules/ structure):
 * - auth
 * - users
 * - products
 * - categories
 * - brands
 * - cart
 * - wishlist
 * - orders
 * - uploads
 * - ai (AI Scent Finder)
 * - notifications
 * - payments
 * 
 * Query keys must be:
 * - Stable and predictable
 * - Hierarchical (for targeted invalidation)
 * - Typed (for safety)
 * 
 * Pattern:
 * - all: ['resource'] - invalidates everything
 * - lists: ['resource', 'list'] - all list queries
 * - list: ['resource', 'list', filters] - specific list
 * - details: ['resource', 'detail'] - all detail queries
 * - detail: ['resource', 'detail', id] - specific detail
 */

export const queryKeys = {
  /**
   * Authentication & Session
   */
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
  },

  /**
   * Products
   */
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.lists(), filters] as const,
    infinite: (filters?: Record<string, unknown>) =>
      [...queryKeys.products.all, 'infinite', filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },

  /**
   * Categories
   */
  categories: {
    all: ['categories'] as const,
    lists: () => [...queryKeys.categories.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.categories.lists(), filters] as const,
    details: () => [...queryKeys.categories.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  /**
   * Brands
   */
  brands: {
    all: ['brands'] as const,
    lists: () => [...queryKeys.brands.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.brands.lists(), filters] as const,
    details: () => [...queryKeys.brands.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.brands.details(), id] as const,
  },

  /**
   * Cart
   */
  cart: {
    all: ['cart'] as const,
    current: () => [...queryKeys.cart.all, 'current'] as const,
    enriched: () => [...queryKeys.cart.all, 'enriched'] as const,
  },

  /**
   * Wishlist
   */
  wishlist: {
    all: ['wishlist'] as const,
    current: () => [...queryKeys.wishlist.all, 'current'] as const,
  },

  /**
   * Orders
   */
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },

  /**
   * AI Chat
   */
  ai: {
    all: ['ai'] as const,
    chat: () => [...queryKeys.ai.all, 'chat'] as const,
  },

  /**
   * Payments (Stripe)
   */
  payments: {
    all: ['payments'] as const,
    intent: (orderId: string) => [...queryKeys.payments.all, 'intent', orderId] as const,
  },
} as const;

/**
 * Type helper to extract query key type from factory.
 * Usage: type ProductListKey = QueryKey<typeof queryKeys.products.list>;
 */
export type QueryKey<T extends (...args: unknown[]) => readonly unknown[]> = ReturnType<T>;
