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
  brands: '/brands',
  collections: '/collections',
  heritage: '/heritage',
  brandDetail: '/brands/:brandSlug',
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
  auth: {
    login: '/login',
    register: '/register',
  },
  admin: {
    login: '/admin/login',
    root: '/admin',
    products: '/admin/products',
    productNew: '/admin/products/new',
    productEdit: '/admin/products/:id/edit',
    brands: '/admin/brands',
  },
  notFound: '*',
} as const;
