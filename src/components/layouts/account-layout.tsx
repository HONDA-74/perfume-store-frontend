import type { ReactNode } from 'react';
import { Heart, LayoutDashboard, MapPin, Package, ShoppingBag, User } from 'lucide-react';
import { Link, NavLink, Outlet } from 'react-router';
import { ROUTES } from '@/constants';
import { useCurrentUser } from '@/hooks/api/use-auth';
import { useCartCount } from '@/hooks/api/use-cart';
import { useWishlistCount } from '@/hooks/api/use-wishlist';
import { useTranslation } from 'react-i18next';

const navigation: Array<{ key: string; to: string; icon: ReactNode; end?: boolean }> = [
  { key: 'account.overview', to: ROUTES.account.root, icon: <LayoutDashboard size={14} />, end: true },
  { key: 'account.orders', to: ROUTES.account.orders, icon: <Package size={14} /> },
  { key: 'account.profile', to: ROUTES.account.profile, icon: <User size={14} /> },
  { key: 'account.addresses', to: ROUTES.account.addresses, icon: <MapPin size={14} /> },
];

export function AccountLayout() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const wishlistCount = useWishlistCount();
  const cartCount = useCartCount();

  return (
    <div className="min-h-screen bg-[#0B0A0C] text-[#F3F2F5]">
      <nav aria-label={t('account.navigation')} className="overflow-x-auto border-b border-white/[0.05] bg-[#0D0C10] lg:hidden">
        <div className="flex min-w-max px-4">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `flex items-center gap-2 border-b-2 px-4 py-4 text-[10px] uppercase tracking-[0.1em] transition-colors ${isActive ? 'border-[#D4A017] text-white/80' : 'border-transparent text-white/30'}`}>
              {item.icon}{t(item.key)}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 lg:px-12 lg:py-14 xl:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="mb-8 px-4">
              <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">{t('account.registry')}</p>
              <p className="font-serif text-[17px] text-white/80">{user?.fullName || t('account.member')}</p>
              <p className="mt-1 truncate text-[10px] font-light text-white/25">{user?.email}</p>
            </div>
            <div className="mx-4 mb-3 h-px bg-white/[0.05]" />
            <nav aria-label={t('account.sections')} className="space-y-0.5">
              {navigation.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `group relative flex items-center gap-3 px-4 py-2.5 text-[11px] tracking-[0.06em] transition-colors ${isActive ? 'font-medium text-white/85' : 'font-light text-white/35 hover:text-white/65'}`}>
                  {({ isActive }) => <>{isActive && <span className="absolute start-0 top-1/2 h-4 w-px -translate-y-1/2 bg-[#D4A017]" />}<span className={isActive ? 'text-[#D4A017]' : 'opacity-50'}>{item.icon}</span>{t(item.key)}</>}
                </NavLink>
              ))}
            </nav>
            <div className="mx-4 my-3 h-px bg-white/[0.04]" />
            <nav aria-label={t('account.quickLinks')} className="space-y-0.5">
              <QuickLink to={ROUTES.wishlist} icon={<Heart size={14} />} label={t('nav.wishlist')} count={wishlistCount} />
              <QuickLink to={ROUTES.cart} icon={<ShoppingBag size={14} />} label={t('account.yourBag')} count={cartCount} />
            </nav>
          </div>
        </aside>
        <main><Outlet /></main>
      </div>
    </div>
  );
}

function QuickLink({ to, icon, label, count }: { to: string; icon: ReactNode; label: string; count: number }) {
  return <Link to={to} className="flex items-center gap-3 px-4 py-2.5 text-[11px] font-light tracking-[0.06em] text-white/25 transition-colors hover:text-white/55"><span className="opacity-40">{icon}</span>{label}{count > 0 && <span className="ms-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-sm bg-white/[0.06] px-1 text-[9px] font-medium text-white/40">{count}</span>}</Link>;
}
