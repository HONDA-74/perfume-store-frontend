import { lazy, Suspense, type ReactNode } from 'react';
import type { RouteObject } from 'react-router';
import { ROUTES } from '@/constants';
import { RootLayout, LandingLayout, RouteErrorBoundary } from '@/components/layouts';
import { PageLoader } from '@/components/shared/page-loader';
import { RoutePlaceholder } from './route-placeholder';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { AccountLayout } from '@/components/layouts/account-layout';
import { AdminRoute, GuestRoute, ProtectedRoute } from './route-guards';

const HomePage = lazy(() => import('./home').then((module) => ({ default: module.HomePage })));
const ShopPage = lazy(() => import('@/pages/shop-page').then((module) => ({ default: module.ShopPage })));
const ProductDetailPage = lazy(() => import('@/pages/product-detail-page').then((module) => ({ default: module.ProductDetailPage })));
const BrandsPage = lazy(() => import('@/pages/brands-page').then((module) => ({ default: module.BrandsPage })));
const CollectionsPage = lazy(() => import('@/pages/collections-page').then((module) => ({ default: module.CollectionsPage })));
const HeritagePage = lazy(() => import('@/pages/heritage-page').then((module) => ({ default: module.HeritagePage })));
const BrandDetailPage = lazy(() => import('@/pages/brand-detail-page').then((module) => ({ default: module.BrandDetailPage })));
const SearchPage = lazy(() => import('@/pages/search-page').then((module) => ({ default: module.SearchPage })));
const CartPage = lazy(() => import('@/pages/cart-page').then((module) => ({ default: module.CartPage })));
const WishlistPage = lazy(() => import('@/pages/wishlist-page').then((module) => ({ default: module.WishlistPage })));
const CheckoutPage = lazy(() => import('@/pages/checkout-page').then((module) => ({ default: module.CheckoutPage })));
const OrderConfirmedPage = lazy(() => import('@/pages/order-confirmed-page').then((module) => ({ default: module.OrderConfirmedPage })));
const AccountDashboardPage = lazy(() => import('@/pages/account/account-dashboard-page').then((module) => ({ default: module.AccountDashboardPage })));
const OrdersPage = lazy(() => import('@/pages/account/orders-page').then((module) => ({ default: module.OrdersPage })));
const OrderDetailPage = lazy(() => import('@/pages/account/order-detail-page').then((module) => ({ default: module.OrderDetailPage })));
const ProfilePage = lazy(() => import('@/pages/account/profile-page').then((module) => ({ default: module.ProfilePage })));
const AddressesPage = lazy(() => import('@/pages/account/addresses-page').then((module) => ({ default: module.AddressesPage })));
const ScentFinderPage = lazy(() => import('@/pages/scent-finder-page').then((module) => ({ default: module.ScentFinderPage })));
const LoginPage = lazy(() => import('@/pages/auth-pages').then((module) => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('@/pages/auth-pages').then((module) => ({ default: module.RegisterPage })));
const AdminLoginPage = lazy(() => import('@/pages/auth-pages').then((module) => ({ default: module.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('@/pages/admin/admin-dashboard-page').then((module) => ({ default: module.AdminDashboardPage })));
const AdminProductsPage = lazy(() => import('@/pages/admin/admin-products-page').then((module) => ({ default: module.AdminProductsPage })));
const AdminProductFormPage = lazy(() => import('@/pages/admin/admin-product-form-page').then((module) => ({ default: module.AdminProductFormPage })));
const AdminBrandsPage = lazy(() => import('@/pages/admin/admin-brands-page').then((module) => ({ default: module.AdminBrandsPage })));

const loadPage = (page: ReactNode) => <Suspense fallback={<PageLoader />}>{page}</Suspense>;

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
  {
    path: ROUTES.auth.login,
    element: <GuestRoute>{loadPage(<LoginPage />)}</GuestRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/auth/login',
    element: <GuestRoute>{loadPage(<LoginPage />)}</GuestRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: ROUTES.auth.register,
    element: <GuestRoute>{loadPage(<RegisterPage />)}</GuestRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/auth/register',
    element: <GuestRoute>{loadPage(<RegisterPage />)}</GuestRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: ROUTES.admin.login,
    element: <GuestRoute>{loadPage(<AdminLoginPage />)}</GuestRoute>,
    errorElement: <RouteErrorBoundary />,
  },
  /* ── Landing Page — headerless layout ─────────────────────────────── */
  {
    path: ROUTES.home,
    element: <LandingLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: loadPage(<HomePage />) },
    ],
  },

  /* ── All other pages — full site shell ────────────────────────────── */
  {
    path: ROUTES.home,
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: ROUTES.shop.slice(1),           element: loadPage(<ShopPage />) },
      { path: ROUTES.brandDetail.slice(1),    element: loadPage(<BrandDetailPage />) },
      { path: ROUTES.productDetail.slice(1),  element: loadPage(<ProductDetailPage />) },
      { path: ROUTES.search.slice(1),         element: loadPage(<SearchPage />) },
      { path: ROUTES.wishlist.slice(1),       element: <ProtectedRoute>{loadPage(<WishlistPage />)}</ProtectedRoute> },
      { path: ROUTES.cart.slice(1),           element: <ProtectedRoute>{loadPage(<CartPage />)}</ProtectedRoute> },
      { path: ROUTES.brands.slice(1),         element: loadPage(<BrandsPage />) },
      { path: ROUTES.collections.slice(1),    element: loadPage(<CollectionsPage />) },
      { path: ROUTES.heritage.slice(1),       element: loadPage(<HeritagePage />) },
      { path: ROUTES.checkout.slice(1),       element: <ProtectedRoute>{loadPage(<CheckoutPage />)}</ProtectedRoute> },
      { path: ROUTES.orderSuccess.slice(1),   element: <ProtectedRoute>{loadPage(<OrderConfirmedPage />)}</ProtectedRoute> },
      {
        path: 'account',
        element: <ProtectedRoute><AccountLayout /></ProtectedRoute>,
        children: [
          { index: true, element: loadPage(<AccountDashboardPage />) },
          { path: 'orders', element: loadPage(<OrdersPage />) },
          { path: 'orders/:orderId', element: loadPage(<OrderDetailPage />) },
          { path: 'profile', element: loadPage(<ProfilePage />) },
          { path: 'addresses', element: loadPage(<AddressesPage />) },
        ],
      },
      { path: ROUTES.scentMatchmaker.slice(1), element: loadPage(<ScentFinderPage />) },
      { path: ROUTES.notFound,                element: <RoutePlaceholder label="404 Not Found" /> },
    ],
  },
  {
    path: ROUTES.admin.root,
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: loadPage(<AdminDashboardPage />) },
      { path: 'products', element: loadPage(<AdminProductsPage />) },
      { path: 'products/new', element: loadPage(<AdminProductFormPage />) },
      { path: 'products/:id/edit', element: loadPage(<AdminProductFormPage />) },
      { path: 'brands', element: loadPage(<AdminBrandsPage />) },
    ],
  },
];

