/**
 * MobileNav Component
 * 
 * Mobile navigation drawer with real auth state and navigation.
 */

import * as React from 'react';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { X, User, Heart, ShoppingBag, Sparkles, LogOut } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { ROUTES } from '@/constants';
import { useLogout } from '@/hooks/api/use-auth';
import { LanguageToggle } from '@/components/ui/language-toggle';

export function MobileNav() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobileNavOpen, closeMobileNav } = useUIStore();
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated();
  const user = authStore.user;
  const logout = useLogout();

  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileNavOpen) {
        closeMobileNav();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileNavOpen, closeMobileNav]);

  // Lock body scroll
  React.useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileNavOpen]);

  if (!isMobileNavOpen) return null;

  const handleLogout = async () => {
    await logout.mutateAsync();
    closeMobileNav();
    navigate(ROUTES.home, { replace: true });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
        onClick={closeMobileNav}
      />

      {/* Drawer */}
      <aside
        className="fixed start-0 top-0 z-[101] flex h-full w-full max-w-sm flex-col bg-kenz-bg shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.mobileNavigation')}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-kenz-border px-6 py-4">
          <Link
            to={ROUTES.home}
            onClick={closeMobileNav}
            className="font-serif text-xl font-normal tracking-wider text-kenz-champagne"
          >
            KENZ
          </Link>
          <button
            onClick={closeMobileNav}
            className="text-foreground/70 transition-colors hover:text-foreground"
            aria-label={t('nav.closeMenu')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* User Section */}
          {isAuthenticated && user && (
            <div className="mb-8 rounded-lg border border-kenz-border bg-kenz-surface/30 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kenz-gold/20 text-kenz-gold">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                  <p className="text-xs text-foreground/50">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="space-y-2">
            <Link
              to={ROUTES.shop}
              onClick={closeMobileNav}
              className="block rounded-md px-4 py-3 font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:bg-kenz-surface/50 hover:text-foreground"
            >
              {t('nav.shop')}
            </Link>
            <Link
              to={ROUTES.brands}
              onClick={closeMobileNav}
              className="block rounded-md px-4 py-3 font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:bg-kenz-surface/50 hover:text-foreground"
            >
              {t('nav.brands')}
            </Link>
            <Link
              to={ROUTES.collections}
              onClick={closeMobileNav}
              className="block rounded-md px-4 py-3 font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:bg-kenz-surface/50 hover:text-foreground"
            >
              {t('nav.collections')}
            </Link>
            <Link
              to={ROUTES.scentMatchmaker}
              onClick={closeMobileNav}
              className="flex items-center gap-2 rounded-md px-4 py-3 font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:bg-kenz-surface/50 hover:text-foreground"
            >
              <Sparkles size={16} />
              {t('nav.scentFinder')}
            </Link>
          </nav>

          {/* Authenticated Actions */}
          {isAuthenticated && (
            <div className="mt-8 space-y-2 border-t border-kenz-border pt-6">
              <Link
                to={ROUTES.account.root}
                onClick={closeMobileNav}
                className="flex items-center gap-2 rounded-md px-4 py-3 font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:bg-kenz-surface/50 hover:text-foreground"
              >
                <User size={16} />
                {t('nav.myAccount')}
              </Link>
              <Link
                to={ROUTES.wishlist}
                onClick={closeMobileNav}
                className="flex items-center gap-2 rounded-md px-4 py-3 font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:bg-kenz-surface/50 hover:text-foreground"
              >
                <Heart size={16} />
                {t('nav.wishlist')}
              </Link>
              <Link
                to={ROUTES.cart}
                onClick={closeMobileNav}
                className="flex items-center gap-2 rounded-md px-4 py-3 font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:bg-kenz-surface/50 hover:text-foreground"
              >
                <ShoppingBag size={16} />
                {t('nav.cart')}
              </Link>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-4 py-3 font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:bg-kenz-surface/50 hover:text-foreground"
              >
                <LogOut size={16} />
                {t('nav.signOut')}
              </button>
            </div>
          )}

          {/* Guest Actions */}
          {!isAuthenticated && (
            <div className="mt-8 space-y-3 border-t border-kenz-border pt-6">
              <Link
                to={ROUTES.auth.login}
                onClick={closeMobileNav}
                className="block w-full rounded-md bg-kenz-gold px-6 py-3 text-center font-sans text-sm font-medium uppercase tracking-wider text-kenz-bg transition-colors hover:bg-kenz-champagne"
              >
                {t('nav.signIn')}
              </Link>
              <Link
                to={ROUTES.auth.register}
                onClick={closeMobileNav}
                className="block w-full rounded-md border border-kenz-border px-6 py-3 text-center font-sans text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:border-kenz-gold hover:text-kenz-gold"
              >
                {t('auth.createTitle')}
              </Link>
            </div>
          )}
          <div className="mt-6 border-t border-kenz-border pt-6"><LanguageToggle showLabel className="w-full" /></div>
        </div>
      </aside>
    </>
  );
}
