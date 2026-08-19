/**
 * Header Component
 * 
 * Main navigation header with KENZ dark luxury styling.
 * Integrated with real backend state for cart count, auth, and navigation.
 */

import { Link } from 'react-router';
import { Search, ShoppingBag, Heart, Menu, User } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { useCartCount } from '@/hooks/api/use-cart';
import { useWishlistCount } from '@/hooks/api/use-wishlist';
import { ROUTES } from '@/constants';

export function Header() {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated();
  const { openCartDrawer, openSearch, openMobileNav } = useUIStore();
  
  // Real counts from React Query cache
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();

  return (
    <header className="sticky top-0 z-navbar glass-dark border-b border-kenz-border">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button */}
          <button
            onClick={openMobileNav}
            className="flex items-center justify-center text-foreground/70 transition-colors hover:text-foreground lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link
            to={ROUTES.home}
            className="font-serif text-xl font-normal tracking-wider text-kenz-champagne transition-colors hover:text-kenz-gold"
          >
            KENZ
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-8">
            <Link
              to={ROUTES.shop}
              className="font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:text-foreground"
            >
              Shop
            </Link>
            <Link
              to="/brands"
              className="font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:text-foreground"
            >
              Brands
            </Link>
            <Link
              to="/collections"
              className="font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:text-foreground"
            >
              Collections
            </Link>
            <Link
              to={ROUTES.scentMatchmaker}
              className="font-sans text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:text-foreground"
            >
              Scent Finder
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={openSearch}
              className="flex items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link
                to={ROUTES.wishlist}
                className="relative flex items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-kenz-gold text-[9px] font-medium text-kenz-bg">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCartDrawer}
              className="relative flex items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-kenz-gold text-[9px] font-medium text-kenz-bg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            <Link
              to={isAuthenticated ? ROUTES.account.root : '/auth/login'}
              className="flex items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
              aria-label={isAuthenticated ? 'Account' : 'Sign in'}
            >
              <User size={18} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
