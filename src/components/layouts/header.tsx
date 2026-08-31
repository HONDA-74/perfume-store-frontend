import { Link, useLocation, useNavigate } from 'react-router';
import { Heart, LogOut, Menu, Package, Search, ShoppingBag, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ROUTES } from '@/constants';
import { useCartCount } from '@/hooks/api/use-cart';
import { useWishlistCount } from '@/hooks/api/use-wishlist';
import { useLogout } from '@/hooks/api/use-auth';
import { useAuthStore } from '@/stores/auth.store';
import { useUIStore } from '@/stores/ui.store';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const navLinks = [
  { key: 'nav.collections', href: ROUTES.collections }, { key: 'nav.shop', href: ROUTES.shop },
  { key: 'nav.brands', href: ROUTES.brands }, { key: 'nav.heritage', href: ROUTES.heritage },
  { key: 'nav.scentFinder', href: ROUTES.scentMatchmaker },
] as const;

function NavBadge({ count }: { count: number }) {
  if (!count) return null;
  return <span className="absolute -end-1 -top-1 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-[#D4A017] px-[3px] text-[8px] font-semibold leading-none text-[#0B0A0C]">{count > 99 ? '99+' : count}</span>;
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return <Link to={href} className="group relative pb-1 text-[10px] font-medium uppercase tracking-[0.15em] transition-colors duration-200" style={{ color: active ? '#D4C3A3' : 'rgba(243,242,245,0.55)' }}>{label}<span className="absolute bottom-0 start-0 h-px bg-[#D4C3A3] transition-all duration-300" style={{ width: active ? '100%' : 0 }} />{!active && <span className="absolute bottom-0 start-0 h-px w-0 bg-[#D4C3A3]/40 transition-all duration-300 group-hover:w-full" />}</Link>;
}

export function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const { openCartDrawer, openSearch, openMobileNav } = useUIStore();
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const logout = useLogout();
  const handleLogout = async () => { await logout.mutateAsync(); toast.success(t('auth.loggedOut')); navigate(ROUTES.home, { replace: true }); };

  return <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[#0B0A0C]">
    <div className="mx-auto max-w-[1440px] px-6 lg:px-12"><div className="relative flex h-16 items-center justify-between lg:h-20">
      <button onClick={openMobileNav} className="flex h-9 w-9 items-center justify-center text-white/60 transition-colors hover:text-white/90 lg:hidden" aria-label={t('nav.openMenu')}><Menu size={20} /></button>
      <nav className="hidden items-center gap-7 lg:flex" aria-label={t('nav.primary')}>{navLinks.slice(0, 3).map((link) => <NavLink key={link.href} href={link.href} label={t(link.key)} active={location.pathname.startsWith(link.href)} />)}</nav>
      <Link to={ROUTES.home} className="absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 font-serif text-xl tracking-[0.25em] text-[#D4C3A3] transition-colors hover:text-[#E2BB55]" aria-label={t('common.brandHome')}>KENZ</Link>
      <div className="ms-auto flex items-center gap-0.5 sm:gap-1 lg:gap-5">
        <div className="hidden items-center gap-7 lg:flex">{navLinks.slice(3).map((link) => <NavLink key={link.href} href={link.href} label={t(link.key)} active={location.pathname.startsWith(link.href)} />)}</div>
        <LanguageToggle className="hidden xl:inline-flex" />
        <button onClick={openSearch} className="flex h-9 w-9 items-center justify-center text-white/55 transition-colors hover:text-white/90" aria-label={t('nav.search')}><Search size={18} /></button>
        {isAuthenticated ? <>
          <Link to={ROUTES.wishlist} className="relative flex h-9 w-9 items-center justify-center text-white/55 transition-colors hover:text-white/90" aria-label={t('nav.wishlist')}><Heart size={18} /><NavBadge count={wishlistCount} /></Link>
          <button onClick={openCartDrawer} className="relative flex h-9 w-9 items-center justify-center text-white/55 transition-colors hover:text-white/90" aria-label={t('nav.cart')}><ShoppingBag size={18} /><NavBadge count={cartCount} /></button>
          <DropdownMenu><DropdownMenuTrigger asChild><button className="hidden h-9 w-9 items-center justify-center text-white/55 transition-colors hover:text-white/90 sm:flex" aria-label={t('nav.account')}><User size={18} /></button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-white/10 bg-[#121115] text-white/70"><DropdownMenuLabel><p className="truncate text-xs text-white/75">{user?.fullName}</p><p className="mt-1 truncate text-[10px] font-normal text-white/35">{user?.email}</p></DropdownMenuLabel><DropdownMenuSeparator className="bg-white/10" /><DropdownMenuItem onSelect={() => navigate(ROUTES.account.root)}><User className="me-2 h-4 w-4" />{t('nav.myAccount')}</DropdownMenuItem><DropdownMenuItem onSelect={() => navigate(ROUTES.account.orders)}><Package className="me-2 h-4 w-4" />{t('account.orders')}</DropdownMenuItem><DropdownMenuSeparator className="bg-white/10" /><DropdownMenuItem disabled={logout.isPending} onSelect={() => void handleLogout()} className="text-red-200/75"><LogOut className="me-2 h-4 w-4" />{t('nav.signOut')}</DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </> : <div className="hidden items-center gap-2 sm:flex"><Link to={ROUTES.auth.login} className="px-3 py-2 text-[10px] font-medium uppercase tracking-[0.13em] text-white/60 transition hover:text-white">{t('nav.signIn')}</Link><Link to={ROUTES.auth.register} className="border border-[#D4C3A3]/35 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.13em] text-[#D4C3A3] transition hover:border-[#D4C3A3] hover:bg-[#D4C3A3]/10">{t('nav.signUp')}</Link></div>}
      </div>
    </div></div>
  </header>;
}
