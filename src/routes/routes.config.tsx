import type { RouteObject } from 'react-router';
import { ROUTES } from '@/constants';
import { RootLayout, LandingLayout, RouteErrorBoundary } from '@/components/layouts';
import { RoutePlaceholder } from './route-placeholder';
import { HomePage } from './home';

/**
 * Route tree definition, consumed by `src/routes/router.tsx`.
 *
 * Two layout roots:
 *  1. LandingLayout (/) — no global Header/Footer. The Landing Page owns
 *     its own chrome (LandingNavbar lives inside HeroSection).
 *  2. RootLayout (/*) — all other pages get the global Header + Footer.
 *
 * Path strings are sourced from `ROUTES` so a URL is never hand-typed
 * in more than one place.
 */
export const routeConfig: RouteObject[] = [
  /* ── Landing Page — headerless layout ─────────────────────────────── */
  {
    path: ROUTES.home,
    element: <LandingLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
    ],
  },

  /* ── All other pages — full site shell ────────────────────────────── */
  {
    path: ROUTES.home,
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: ROUTES.shop.slice(1),           element: <RoutePlaceholder label="Shop / Catalog" /> },
      { path: ROUTES.productDetail.slice(1),  element: <RoutePlaceholder label="Product Detail" /> },
      { path: ROUTES.search.slice(1),         element: <RoutePlaceholder label="Search Results" /> },
      { path: ROUTES.wishlist.slice(1),       element: <RoutePlaceholder label="Wishlist" /> },
      { path: ROUTES.cart.slice(1),           element: <RoutePlaceholder label="Cart" /> },
      { path: ROUTES.checkout.slice(1),       element: <RoutePlaceholder label="Checkout" /> },
      { path: ROUTES.orderSuccess.slice(1),   element: <RoutePlaceholder label="Order Success" /> },
      { path: ROUTES.account.root.slice(1),   element: <RoutePlaceholder label="Account Dashboard" /> },
      { path: ROUTES.account.orders.slice(1), element: <RoutePlaceholder label="My Orders" /> },
      { path: ROUTES.account.orderDetail.slice(1), element: <RoutePlaceholder label="Order Details" /> },
      { path: ROUTES.account.profile.slice(1), element: <RoutePlaceholder label="Profile Settings" /> },
      { path: ROUTES.account.addresses.slice(1), element: <RoutePlaceholder label="Address Book" /> },
      { path: ROUTES.scentMatchmaker.slice(1), element: <RoutePlaceholder label="AI Scent Matchmaker" /> },
      { path: ROUTES.notFound,                element: <RoutePlaceholder label="404 Not Found" /> },
    ],
  },
];

