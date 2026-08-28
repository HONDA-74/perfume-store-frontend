import { Link, useLocation } from 'react-router';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { ROUTES } from '@/constants';
import { useCartCount } from '@/hooks/api/use-cart';
import { useWishlistCount } from '@/hooks/api/use-wishlist';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';

const navLinks = [
  { label: 'Collections', href: ROUTES.collections },
  { label: 'Shop', href: ROUTES.shop },
  { label: 'Brands', href: ROUTES.brands },
  { label: 'Heritage', href: ROUTES.heritage },
  { label: 'Scent Finder', href: ROUTES.scentMatchmaker },
];

function NavBadge({ count }: { count: number }) {
  if (!count) return null;
  return <span className="absolute -right-1 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#D4A017] px-[3px] text-[8px] font-semibold leading-none text-[#0B0A0C]">{count > 99 ? '99+' : count}</span>;
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link to={href} className="group relative pb-1 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors duration-200" style={{ color: active ? '#D4C3A3' : 'rgba(243,242,245,0.55)' }}>
      {label}
      <span className="absolute bottom-0 left-0 h-px bg-[#D4C3A3] transition-all duration-300" style={{ width: active ? '100%' : 0 }} />
      {!active && <span className="absolute bottom-0 left-0 h-px w-0 bg-[#D4C3A3]/40 transition-all duration-300 group-hover:w-full" />}
    </Link>
  );
}

export function Header() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const { openCartDrawer, openSearch, openMobileNav } = useUIStore();
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[#0B0A0C]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="relative flex h-16 items-center justify-between lg:h-20">
          <button onClick={openMobileNav} className="flex h-9 w-9 items-center justify-center text-white/60 transition-colors hover:text-white/90 lg:hidden" aria-label="Open menu"><Menu size={20} /></button>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navLinks.slice(0, 3).map((link) => <NavLink key={link.href} {...link} active={location.pathname.startsWith(link.href)} />)}
          </nav>
          <Link to={ROUTES.home} className="absolute left-1/2 -translate-x-1/2 font-serif text-xl tracking-[0.25em] text-[#D4C3A3] transition-colors hover:text-[#E2BB55]" aria-label="KENZ home">KENZ</Link>
          <div className="ml-auto flex items-center gap-0.5 sm:gap-1 lg:gap-7">
            <div className="hidden items-center gap-7 lg:flex">
              {navLinks.slice(3).map((link) => <NavLink key={link.href} {...link} active={location.pathname.startsWith(link.href)} />)}
            </div>
            <button onClick={openSearch} className="flex h-9 w-9 items-center justify-center text-white/55 transition-colors hover:text-white/90" aria-label="Search"><Search size={18} /></button>
            {isAuthenticated ? (
              <>
                <Link to={ROUTES.wishlist} className="relative flex h-9 w-9 items-center justify-center text-white/55 transition-colors hover:text-white/90" aria-label="Wishlist"><Heart size={18} /><NavBadge count={wishlistCount} /></Link>
                <button onClick={openCartDrawer} className="relative flex h-9 w-9 items-center justify-center text-white/55 transition-colors hover:text-white/90" aria-label="Cart"><ShoppingBag size={18} /><NavBadge count={cartCount} /></button>
                <Link to={ROUTES.account.root} className="hidden h-9 w-9 items-center justify-center text-white/55 transition-colors hover:text-white/90 sm:flex" aria-label="Account"><User size={18} /></Link>
              </>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to={ROUTES.auth.login} className="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.13em] text-white/60 transition hover:text-white">Sign In</Link>
                <Link to={ROUTES.auth.register} className="border border-[#D4C3A3]/35 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#D4C3A3] transition hover:border-[#D4C3A3] hover:bg-[#D4C3A3]/10">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
