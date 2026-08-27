import * as React from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router';
import { Header } from './header';
import { Footer } from './footer';
import { SearchOverlay } from './search-overlay';
import { CartDrawer } from './cart-drawer';
import { MobileNav } from './mobile-nav';
import { useUIStore } from '@/stores/ui.store';

/**
 * RootLayout — main application frame wrapping all pages.
 * 
 * Integrated with useUIStore for global overlay state management.
 * KENZ dark luxury styling applied throughout.
 */
export function RootLayout() {
  const location = useLocation();
  const { closeAll } = useUIStore();

  // Close overlays on route change
  React.useEffect(() => {
    closeAll();
  }, [location.pathname, closeAll]);

  return (
    <>
      <ScrollRestoration />
      
      {/* Skip to content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-kenz-gold focus:px-4 focus:py-2 focus:text-kenz-bg focus:outline-none"
      >
        Skip to main content
      </a>

      <div className="flex min-h-screen flex-col bg-kenz-bg text-foreground">
        <Header />

        <main id="main-content" className="flex-1" tabIndex={-1}>
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Global Overlays */}
      <SearchOverlay />
      <CartDrawer />
      <MobileNav />
    </>
  );
}
