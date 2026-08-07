/**
 * Query key namespaces for TanStack Query. Kept as plain readonly tuples/
 * factories (no actual query functions here — those belong in each
 * feature's own `services`/`hooks`, per API_BLUEPRINT.md's module list:
 * auth, users, products, categories, brands, cart, wishlist, orders).
 *
 * Usage once a feature exists:
 *   useQuery({ queryKey: QUERY_KEYS.products.detail(slug), queryFn: ... })
 */
export const QUERY_KEYS = {
  products: {
    all: ['products'] as const,
    list: (params?: Record<string, unknown>) => ['products', 'list', params] as const,
    detail: (idOrSlug: string) => ['products', 'detail', idOrSlug] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
  },
  brands: {
    all: ['brands'] as const,
    list: () => ['brands', 'list'] as const,
  },
  cart: {
    root: ['cart'] as const,
  },
  wishlist: {
    root: ['wishlist'] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (params?: Record<string, unknown>) => ['orders', 'list', params] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  auth: {
    me: ['auth', 'me'] as const,
  },
} as const;
