import { Outlet, Link } from 'react-router';
import { Logo } from '@/components/shared';

/**
 * MinimalLayout — stripped-down layout for focused experiences.
 * 
 * Used for: Checkout, Auth flows, AI Scent Finder
 * Includes: Logo-only header, no footer, no distractions
 * 
 * Per UX_FLOW.md §7 - checkout requires minimal header
 * to reduce cognitive load and maximize conversion.
 */
export function MinimalLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-0">
      {/* Minimal Header */}
      <header
        className="border-b border-neutral-100 bg-neutral-0"
        role="banner"
      >
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-center px-4">
            <Link
              to="/"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:rounded-sm"
              aria-label="KENZ Home"
            >
              <Logo variant="dark" size="sm" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Minimal Footer - Optional Secure Badge */}
      <footer className="border-t border-neutral-100 bg-neutral-50 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-caption text-neutral-500">
            Secure checkout powered by KENZ
          </p>
        </div>
      </footer>
    </div>
  );
}
