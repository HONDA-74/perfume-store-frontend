import * as React from 'react';
import { Outlet, useLocation, ScrollRestoration } from 'react-router';
import { Header } from './header';
import { Footer } from './footer';
import { SearchOverlay } from './search-overlay';
import { CartDrawer } from './cart-drawer';
import { MobileNav } from './mobile-nav';

/**
 * RootLayout — main application frame wrapping all pages.
 * 
 * Responsibilities:
 * - Renders Header, Footer, and main content area
 * - Manages scroll restoration between route transitions
 * - Provides skip-to-content accessibility link
 * - Hosts global overlays (Search, Cart, Mobile Nav)
 * - Semantic HTML5 landmark structure
 * 
 * Per ARCHITECTURE.md §13 and Design_System.md §3.17/§3.18
 */
export function RootLayout() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const location = useLocation();

  // Close overlays on route change
  React.useEffect(() => {
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <>
      <ScrollRestoration />
      
      {/* Skip to content link for keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-tooltip focus:rounded-md focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>

      <div className="flex min-h-screen flex-col bg-neutral-0">
        <Header
          onSearchClick={() => setIsSearchOpen(true)}
          onCartClick={() => setIsCartOpen(true)}
          onMobileMenuClick={() => setIsMobileNavOpen(true)}
        />

        <main id="main-content" className="flex-1" tabIndex={-1}>
          <Outlet />
        </main>

        <Footer />
      </div>

      {/* Global Overlays */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
