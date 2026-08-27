import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { ROUTES } from '@/constants';
import { cn } from '@/lib';
import { useAuthStore } from '@/stores/auth.store';

/** Navigation links for the Landing Page only. No utility icons. */
const NAV_LINKS = [
  { label: 'Collections', href: '/collections' },
  { label: 'Perfumes',    href: ROUTES.shop },
  { label: 'Heritage',    href: '/heritage' },
  { label: 'Scent Finder', href: ROUTES.scentMatchmaker },
] as const;

/**
 * LandingNavbar — floating glassmorphic navbar exclusive to the Landing Page.
 *
 * Deliberately different from the global site Header:
 *  - Floats above the Liquid Ether background (not sticky-white)
 *  - No utility icons (search, wishlist, cart, theme)
 *  - Navigation links + KENZ wordmark only
 *  - Subtle backdrop blur + translucent glass border
 *  - Minimal, editorial, luxury-brand feel
 *
 * Global Header (src/components/layouts/header.tsx) is NOT modified.
 */
export function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

  /* Tighten glass when user scrolls */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on outside click */
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen]);

  /* Close on route navigation */
  const closeMobile = () => setMobileOpen(false);

  return (
    <header
      role="banner"
      aria-label="Landing page navigation"
      className="absolute top-0 left-0 right-0 z-navbar px-4 sm:px-6 lg:px-8"
      style={{
        paddingTop: '1.25rem',
        animation: 'landing-nav-enter 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '0s',
      }}
    >
      {/* ── Floating pill ─────────────────────────────────────────────── */}
      <div
        ref={mobileMenuRef}
        className={cn(
          'mx-auto max-w-6xl',
          'rounded-[10px]',
          'transition-all duration-500 ease-[cubic-bezier(0.2,0,0,1)]',
        )}
        style={{
          background: scrolled
            ? 'hsl(0 0% 4% / 0.75)'
            : 'hsl(0 0% 6% / 0.55)',
          backdropFilter: 'blur(20px) saturate(140%)',
          WebkitBackdropFilter: 'blur(20px) saturate(140%)',
          border: '1px solid hsl(43 82% 52% / 0.12)',
          boxShadow: scrolled
            ? '0 8px 32px hsl(0 0% 0% / 0.35), inset 0 1px 0 hsl(0 0% 100% / 0.04)'
            : '0 4px 24px hsl(0 0% 0% / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.04)',
        }}
      >
        {/* ── Inner row ───────────────────────────────────────────────── */}
        <div className="flex h-14 items-center justify-between px-5 sm:px-7">

          {/* Left — Desktop nav links */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="landing-nav-link font-sans text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-colors duration-200"
                style={{ 
                  color: 'hsl(0 0% 74% / 0.75)',
                  padding: '0.75rem 0.5rem', // Larger tap target
                  margin: '-0.75rem -0.5rem', // Negative margin to maintain visual spacing
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'hsl(43 82% 65%)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 74% / 0.75)';
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center — Logo (always centered on desktop) */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
            <Link
              to="/"
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 focus-visible:rounded-sm"
              aria-label="KENZ — Home"
            >
              <span
                className="font-serif font-semibold text-2xl"
                style={{
                  letterSpacing: '0.2em',
                  color: 'hsl(43 78% 74%)',
                  textShadow: '0 0 18px hsl(43 78% 52% / 0.35)',
                }}
              >
                KENZ
              </span>
            </Link>
          </div>

          {/* Right — Desktop nav links */}
          <nav
            className="hidden lg:flex items-center gap-7"
            aria-label="Secondary navigation"
          >
            {NAV_LINKS.slice(2).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-colors duration-200"
                style={{ 
                  color: 'hsl(0 0% 74% / 0.75)',
                  padding: '0.75rem 0.5rem', // Larger tap target
                  margin: '-0.75rem -0.5rem', // Negative margin to maintain visual spacing
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'hsl(43 82% 65%)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 74% / 0.75)';
                }}
              >
                {link.label}
              </Link>
            ))}
            <span aria-hidden="true" className="h-4 w-px bg-white/10" />
            {isAuthenticated ? (
              <Link to={ROUTES.account.root} className="border border-[hsl(43_82%_65%/0.35)] px-4 py-2 font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[hsl(43_82%_70%)] transition hover:bg-[hsl(43_82%_52%/0.1)]">
                Account
              </Link>
            ) : (
              <>
                <Link to={ROUTES.auth.login} className="font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-white/65 transition hover:text-white">Sign In</Link>
                <Link to={ROUTES.auth.register} className="border border-[hsl(43_82%_65%/0.35)] px-4 py-2 font-sans text-[0.65rem] font-medium uppercase tracking-[0.14em] text-[hsl(43_82%_70%)] transition hover:bg-[hsl(43_82%_52%/0.1)]">Sign Up</Link>
              </>
            )}
          </nav>

          {/* Mobile — hamburger */}
          <button
            type="button"
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            style={{ color: 'hsl(0 0% 74%)' }}
          >
            {mobileOpen ? (
              /* X */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* ── Mobile drawer ───────────────────────────────────────────── */}
        {mobileOpen && (
          <nav
            aria-label="Mobile navigation"
            className="lg:hidden border-t"
            style={{ borderColor: 'hsl(43 82% 52% / 0.12)' }}
          >
            <div className="flex flex-col py-3 px-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={closeMobile}
                  className="py-4 font-sans text-[0.8rem] font-medium uppercase tracking-[0.15em] border-b"
                  style={{
                    color: 'hsl(0 0% 74% / 0.8)',
                    borderColor: 'hsl(0 0% 100% / 0.05)',
                    minHeight: '3rem', // Minimum 48px tap target
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'hsl(43 82% 65%)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = 'hsl(0 0% 74% / 0.8)';
                  }}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-3 pt-3">
                {isAuthenticated ? (
                  <Link to={ROUTES.account.root} onClick={closeMobile} className="col-span-2 flex min-h-12 items-center justify-center border border-[hsl(43_82%_65%/0.35)] font-sans text-[0.72rem] font-medium uppercase tracking-[0.15em] text-[hsl(43_82%_70%)]">Account</Link>
                ) : (
                  <>
                    <Link to={ROUTES.auth.login} onClick={closeMobile} className="flex min-h-12 items-center justify-center border border-white/10 font-sans text-[0.72rem] font-medium uppercase tracking-[0.15em] text-white/70">Sign In</Link>
                    <Link to={ROUTES.auth.register} onClick={closeMobile} className="flex min-h-12 items-center justify-center bg-[hsl(43_82%_52%)] font-sans text-[0.72rem] font-semibold uppercase tracking-[0.15em] text-[#0B0A0C]">Sign Up</Link>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Keyframe for navbar entrance */}
      <style>{`
        @keyframes landing-nav-enter {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="landing-nav-enter"] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </header>
  );
}
