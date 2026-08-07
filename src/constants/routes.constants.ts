/**
 * Centralized route path constants. Referenced by `src/routes/routes.config.ts`
 * when pages are added, and by any future navigation component, so a path
 * is never hand-typed as a string literal in more than one place.
 *
 * Paths mirror the pages enumerated in UX_FLOW.md — no page components are
 * created yet (out of scope for this scaffold), but the path contract is
 * fixed here ahead of time.
 */
export const ROUTES = {
  home: '/',
  shop: '/shop',
  productDetail: '/products/:slug',
  search: '/search',
  wishlist: '/wishlist',
  cart: '/cart',
  checkout: '/checkout',
  orderSuccess: '/orders/:orderId/success',
  account: {
    root: '/account',
    orders: '/account/orders',
    orderDetail: '/account/orders/:orderId',
    profile: '/account/profile',
    addresses: '/account/addresses',
  },
  scentMatchmaker: '/scent-finder',
  notFound: '*',
} as const;
