import type { RouteObject } from 'react-router';
import { ROUTES } from '@/constants';
import { RootLayout, RouteErrorBoundary } from '@/components/layouts';
import { RoutePlaceholder } from './route-placeholder';

/**
 * Route tree definition, consumed by `src/routes/router.tsx`.
 *
 * Deliberately contains NO page elements yet (no `<HomePage />`,
 * `<ShopPage />`, etc.) — building pages is explicitly out of scope for
 * this scaffold. Each leaf route's `element` is a small inline placeholder
 * (`RoutePlaceholder`) so the router is fully functional and navigable
 * today; swap each placeholder for the real page component from
 * `src/features/*` as that feature is implemented, without touching this
 * file's structure.
 *
 * Path strings are sourced from `ROUTES` (`src/constants/routes.constants.ts`)
 * so a URL is never hand-typed in two places.
 */
export const routeConfig: RouteObject[] = [
  {
    path: ROUTES.home,
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <RoutePlaceholder label="Home" /> },
      { path: ROUTES.shop.slice(1), element: <RoutePlaceholder label="Shop / Catalog" /> },
      {
        path: ROUTES.productDetail.slice(1),
        element: <RoutePlaceholder label="Product Detail" />,
      },
      { path: ROUTES.search.slice(1), element: <RoutePlaceholder label="Search Results" /> },
      { path: ROUTES.wishlist.slice(1), element: <RoutePlaceholder label="Wishlist" /> },
      { path: ROUTES.cart.slice(1), element: <RoutePlaceholder label="Cart" /> },
      { path: ROUTES.checkout.slice(1), element: <RoutePlaceholder label="Checkout" /> },
      {
        path: ROUTES.orderSuccess.slice(1),
        element: <RoutePlaceholder label="Order Success" />,
      },
      {
        path: ROUTES.account.root.slice(1),
        element: <RoutePlaceholder label="Account Dashboard" />,
      },
      {
        path: ROUTES.account.orders.slice(1),
        element: <RoutePlaceholder label="My Orders" />,
      },
      {
        path: ROUTES.account.orderDetail.slice(1),
        element: <RoutePlaceholder label="Order Details" />,
      },
      {
        path: ROUTES.account.profile.slice(1),
        element: <RoutePlaceholder label="Profile Settings" />,
      },
      {
        path: ROUTES.account.addresses.slice(1),
        element: <RoutePlaceholder label="Address Book" />,
      },
      {
        path: ROUTES.scentMatchmaker.slice(1),
        element: <RoutePlaceholder label="AI Scent Matchmaker" />,
      },
      { path: ROUTES.notFound, element: <RoutePlaceholder label="404 Not Found" /> },
    ],
  },
];
