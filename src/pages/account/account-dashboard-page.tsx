import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants';
import { useCurrentUser } from '@/hooks/api/use-auth';
import { useOrders } from '@/hooks/api/use-orders';
import { useWishlistCount } from '@/hooks/api/use-wishlist';
import { useAddresses } from '@/hooks/api/use-users';
import { getOrderStatusLabel } from '@/lib/adapters/enum-adapter';

export function AccountDashboardPage() {
  const { t } = useTranslation();
  const { data: user } = useCurrentUser();
  const orders = useOrders({ page: 1, limit: 1 });
  const wishlistCount = useWishlistCount();
  const addresses = useAddresses();
  const recentOrder = orders.data?.items[0];
  const firstName = user?.fullName?.trim().split(/\s+/)[0] || t('account.member');
  const memberYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : '—';

  return (
    <div>
      <header className="mb-10">
        <p className="mb-2 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">{t('account.registry')}</p>
        <h1 className="font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-normal text-white/85">{t('accountPage.welcome', { name: firstName })}</h1>
      </header>

      <section className="mb-12 grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label={t('accountPage.summary')}>
        <StatCard label={t('account.totalOrders')} value={orders.data?.meta.totalItems ?? 0} />
        <StatCard label={t('accountPage.wishlist')} value={wishlistCount} sub={t('account.savedFragrances')} />
        <StatCard label={t('accountPage.addresses')} value={addresses.data?.length ?? 0} sub={t('accountPage.saved')} />
        <StatCard label={t('accountPage.memberSince')} value={memberYear} sub={t('accountPage.registry')} />
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">{t('accountPage.recentOrder')}</h2>
          {!!orders.data?.meta.totalItems && <Link to={ROUTES.account.orders} className="flex items-center gap-1.5 text-[10px] tracking-[0.08em] text-[#D4C3A3]/50 transition-colors hover:text-[#D4A017]">{t('accountPage.viewAll')} <ArrowRight size={11} className="directional-icon" /></Link>}
        </div>
        {recentOrder ? (
          <div className="flex flex-col gap-4 border border-white/[0.06] bg-[#121115] p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-3">
                <p className="text-[11px] font-medium tracking-[0.04em] text-white/70">#{recentOrder.orderNumber}</p>
                <span className="border border-[#D4A017]/20 bg-[#D4A017]/[0.06] px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-[#D4A017]/80">{getOrderStatusLabel(recentOrder.status)}</span>
              </div>
              <p className="text-[10px] font-light text-white/30">{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(recentOrder.placedAt))} · {recentOrder.items.length} {recentOrder.items.length === 1 ? 'item' : 'items'} · ${recentOrder.total.toFixed(2)}</p>
            </div>
            <Link to={`/account/orders/${recentOrder.id}`} className="flex h-9 items-center gap-1.5 border border-white/[0.08] px-4 text-[10px] tracking-[0.08em] text-white/35 transition-all hover:border-white/[0.18] hover:text-white/65">{t('accountPage.viewOrder')} <ArrowRight size={11} className="directional-icon" /></Link>
          </div>
        ) : (
          <div className="border border-white/[0.05] bg-[#121115] p-12 text-center">
            <p className="mb-2 font-serif text-lg text-white/40">{t('accountPage.noOrdersTitle')}</p>
            <p className="mb-5 text-[11px] font-light text-white/25">{t('accountPage.noOrdersCopy')}</p>
            <Link to={ROUTES.shop} className="inline-flex h-10 items-center bg-[#D4A017] px-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#0B0A0C]">{t('accountPage.explore')}</Link>
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return <div className="border border-white/[0.06] bg-[#121115] px-5 py-5"><p className="mb-2.5 text-[9px] font-medium uppercase tracking-[0.15em] text-[#D4C3A3]/40">{label}</p><p className="font-serif text-[28px] leading-none text-white/80">{value}</p>{sub && <p className="mt-1.5 text-[10px] font-light text-white/25">{sub}</p>}</div>;
}
