import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { PageLoader } from '@/components/shared/page-loader';
import { Price } from '@/components/shared/price';
import { useOrders } from '@/hooks/api/use-orders';
import { getOrderStatusColor, getOrderStatusLabel } from '@/lib/adapters/enum-adapter';
import { ROUTES } from '@/constants';

export function OrdersPage() {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useOrders();

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <div className="mb-8">
        <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">{t('account.orderHistory')}</p>
        <h1 className="font-serif text-[clamp(1.5rem,2.5vw,2rem)] font-normal text-white/85">{t('accountPage.yourOrders')}</h1>
        <p className="mt-1 text-xs font-light italic text-white/30">{t('accountPage.ordersDescription')}</p>
      </div>

      {error ? (
        <OrderMessage title={t('accountPage.loadOrders')} copy={t('accountPage.refresh')} />
      ) : !data?.items.length ? (
        <OrderMessage title={t('accountPage.noOrdersTitle')} copy={t('accountPage.noOrdersCopy')} action />
      ) : (
        <div className="border border-white/[0.06] bg-[#121115] px-6">
          {data.items.map((order) => (
            <article key={order.id} className="border-b border-white/5 py-5 last:border-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <p className="font-mono text-[11px] font-medium tracking-[0.04em] text-white/70">{order.orderNumber}</p>
                    <span className={`border px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.08em] ${getOrderStatusColor(order.status)}`}>{getOrderStatusLabel(order.status)}</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-light text-white/30">
                    <span>{new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(order.placedAt))}</span>
                    <span>{t('accountPage.itemCount', { count: order.items.length })}</span>
                    <Price price={order.total} className="text-[10px]" />
                  </div>
                  <p className="mt-2 truncate font-serif text-sm text-white/45">{order.items.map((item) => item.nameSnapshot).join(' · ')}</p>
                </div>
                <Link to={`/account/orders/${order.id}`} className="flex flex-none items-center gap-1.5 text-[10px] text-white/30 transition-colors hover:text-white/60" aria-label={`${t('accountPage.viewOrder')} ${order.orderNumber}`}>{t('accountPage.view')} <ArrowRight size={10} className="directional-icon" /></Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderMessage({ title, copy, action = false }: { title: string; copy: string; action?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="border border-white/5 bg-[#121115] p-14 text-center">
      <p className="font-serif text-lg font-normal text-white/40">{title}</p>
      <p className="mb-5 mt-2 text-[11px] font-light text-white/25">{copy}</p>
      {action && <Link to={ROUTES.shop} className="inline-flex h-10 items-center gap-2 bg-kenz-gold px-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#0B0A0C] transition-opacity hover:opacity-80">{t('wishlist.explore')}</Link>}
    </div>
  );
}
