import type { RouteObject } from 'react-router';
import { ROUTES } from '@/constants';
import { RootLayout, LandingLayout, RouteErrorBoundary } from '@/components/layouts';
import { RoutePlaceholder } from './route-placeholder';
import { HomePage } from './home';
import { ShopPage } from '@/pages/shop-page';
import { ProductDetailPage } from '@/pages/product-detail-page';
import { BrandsPage } from '@/pages/brands-page';
import { BrandDetailPage } from '@/pages/brand-detail-page';
import { SearchPage } from '@/pages/search-page';
import { CartPage } from '@/pages/cart-page';
import { WishlistPage } from '@/pages/wishlist-page';
import { CheckoutPage } from '@/pages/checkout-page';
import { OrderConfirmedPage } from '@/pages/order-confirmed-page';
import { AccountDashboardPage } from '@/pages/account/account-dashboard-page';
import { OrdersPage } from '@/pages/account/orders-page';
import { OrderDetailPage } from '@/pages/account/order-detail-page';
import { ProfilePage } from '@/pages/account/profile-page';
import { AddressesPage } from '@/pages/account/addresses-page';
import { ScentFinderPage } from '@/pages/scent-finder-page';

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
      { path: ROUTES.shop.slice(1),           element: <ShopPage /> },
      { path: ROUTES.brandDetail.slice(1),    element: <BrandDetailPage /> },
      { path: ROUTES.productDetail.slice(1),  element: <ProductDetailPage /> },
      { path: ROUTES.search.slice(1),         element: <SearchPage /> },
      { path: ROUTES.wishlist.slice(1),       element: <WishlistPage /> },
      { path: ROUTES.cart.slice(1),           element: <CartPage /> },
      { path: 'brands',                       element: <BrandsPage /> },
      { path: ROUTES.checkout.slice(1),       element: <CheckoutPage /> },
      { path: ROUTES.orderSuccess.slice(1),   element: <OrderConfirmedPage /> },
      { path: ROUTES.account.root.slice(1),   element: <AccountDashboardPage /> },
      { path: ROUTES.account.orders.slice(1), element: <OrdersPage /> },
      { path: ROUTES.account.orderDetail.slice(1), element: <OrderDetailPage /> },
      { path: ROUTES.account.profile.slice(1), element: <ProfilePage /> },
      { path: ROUTES.account.addresses.slice(1), element: <AddressesPage /> },
      { path: ROUTES.scentMatchmaker.slice(1), element: <ScentFinderPage /> },
      { path: ROUTES.notFound,                element: <RoutePlaceholder label="404 Not Found" /> },
    ],
  },
];

