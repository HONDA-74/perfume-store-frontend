import { Outlet, ScrollRestoration } from 'react-router';

/**
 * LandingLayout — stripped-down layout for the Landing Page.
 *
 * Intentionally excludes the global Header and Footer:
 *  - The Landing Page Hero contains its own floating LandingNavbar.
 *  - The landing page composition (full-bleed hero, etc.) demands a
 *    headerless canvas so the Liquid Ether background fills the viewport
 *    edge-to-edge from the very top.
 *
 * All other routes continue to use RootLayout (global Header + Footer).
 * This layout does NOT modify any shared components.
 */
export function LandingLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
