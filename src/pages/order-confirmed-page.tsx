import { ArrowRight, Check } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { Price } from '@/components/shared/price';
import { useOrder } from '@/hooks/api/use-orders';
import { ROUTES } from '@/constants';

export function OrderConfirmedPage() {
  const { t, i18n } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(orderId!);

  if (isLoading) return <PageLoader />;
  if (error || !order) {
    return <div className="min-h-[70vh] bg-[#0B0A0C] px-6 py-24"><EmptyState title={t('order.notFound')} message={t('order.notFoundDescription')} actionLabel={t('order.viewOrders')} onAction={() => navigate(ROUTES.account.orders)} /></div>;
  }

  const formattedDate = new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(order.placedAt));

  return (
    <main className="min-h-screen bg-[#0B0A0C]">
      <header className="border-b border-white/5 bg-[#0D0C10]">
        <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12 lg:py-12">
          <Breadcrumb items={[{ label: 'KENZ', href: '/' }, { label: t('order.confirmed') }]} className="mb-6" />
          <div className="mb-4 flex items-center gap-4">
            <span className="flex h-8 w-8 items-center justify-center border border-kenz-gold/40 bg-kenz-gold/[0.08]"><Check size={14} className="text-kenz-gold" /></span>
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/45">{t('order.confirmed')}</p>
          </div>
          <h1 className="font-serif text-[clamp(1.75rem,3.5vw,2.75rem)] font-normal leading-tight text-white/90">{t('order.thankYou')}</h1>
          <p className="mt-3 max-w-[480px] text-[13px] font-light text-white/35">{t('order.preparing')}</p>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] items-start gap-10 px-6 py-10 lg:grid-cols-[1fr_400px] lg:gap-16 lg:px-12 lg:py-14 xl:grid-cols-[1fr_440px]">
        <section className="space-y-8">
          <div className="flex flex-col gap-4 border border-white/[0.06] bg-[#121115] p-5 sm:flex-row sm:items-center">
            <div className="flex-1"><Label>{t('order.number')}</Label><p className="font-mono text-base font-medium tracking-[0.06em] text-kenz-gold">{order.orderNumber}</p></div>
            <div className="sm:text-end"><Label>{t('order.placed')}</Label><p className="text-xs font-light text-white/55">{formattedDate}</p></div>
          </div>

          <div>
            <SectionLabel>{t('order.deliveryTo')}</SectionLabel>
            <div className="space-y-1 border-s border-white/[0.06] ps-4 text-xs font-light leading-7 text-white/40">
              <p className="text-[13px] font-normal text-white/75">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 && `, ${order.shippingAddress.addressLine2}`}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>

          <div>
            <SectionLabel>{t('order.details')}</SectionLabel>
            <div className="border-t border-white/5">
              {order.items.map((item, index) => (
                <div key={`${item.productId}-${index}`} className="flex gap-4 border-b border-white/5 py-5">
                  <div className="flex h-20 w-16 flex-none items-center justify-center border border-white/5 bg-[#19181E] font-serif text-xl text-white/10">K</div>
                  <div className="min-w-0 flex-1"><p className="font-serif text-sm text-white/80">{item.nameSnapshot}</p><p className="mt-1 text-[10px] font-light text-white/30">{t('order.quantity', { count: item.quantity })}</p></div>
                  <Price price={item.lineTotal} className="flex-none text-[13px]" />
                </div>
              ))}
            </div>
          </div>

          <OrderTotals order={order} />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link to={ROUTES.shop} className="flex h-12 flex-1 items-center justify-center gap-2 bg-kenz-gold text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0B0A0C] transition-opacity hover:opacity-85">{t('order.continueShopping')} <ArrowRight size={12} className="directional-icon" /></Link>
            <Link to={ROUTES.account.orders} className="flex h-12 flex-1 items-center justify-center border border-white/10 text-[10px] uppercase tracking-[0.15em] text-white/40 transition-all hover:border-white/20 hover:text-white/70">{t('order.viewOrders')}</Link>
          </div>
        </section>

        <aside className="border border-white/[0.06] bg-[#121115] lg:sticky lg:top-28">
          <div className="border-b border-white/[0.06] px-5 py-4"><p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/30">{t('order.yourOrder')}</p></div>
          <div className="space-y-4 px-5 py-4">
            {order.items.map((item, index) => <div key={`${item.productId}-${index}`} className="flex items-center gap-3"><div className="flex h-[54px] w-11 flex-none items-center justify-center border border-white/5 bg-[#19181E] font-serif text-white/10">K</div><div className="min-w-0 flex-1"><p className="truncate font-serif text-xs text-white/70">{item.nameSnapshot}</p><p className="mt-0.5 text-[9px] font-light text-white/30">{t('order.quantity', { count: item.quantity })}</p></div><Price price={item.lineTotal} className="text-[11px] text-white/50" /></div>)}
          </div>
          <div className="border-t border-white/5 px-5 pb-5 pt-4"><div className="flex items-center justify-between"><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/65">{t('cart.total')}</span><Price price={order.total} className="text-[15px]" /></div></div>
        </aside>
      </div>
    </main>
  );
}

function Label({ children }: { children: React.ReactNode }) { return <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.15em] text-white/30">{children}</p>; }
function SectionLabel({ children }: { children: React.ReactNode }) { return <p className="mb-3.5 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">{children}</p>; }
function OrderTotals({ order }: { order: { subtotal: number; discountTotal: number; shippingFee: number; total: number } }) {
  const { t } = useTranslation();
  return <div className="border-t border-white/[0.06] pt-4"><Total label={t('cart.subtotal')} value={order.subtotal} /><Total label={t('order.discount')} value={-order.discountTotal} /><Total label={t('cart.shipping')} value={order.shippingFee} /><div className="border-t border-white/5"><Total label={t('cart.total')} value={order.total} total /></div></div>;
}
function Total({ label, value, total = false }: { label: string; value: number; total?: boolean }) { return <div className="flex items-center justify-between py-2.5"><span className={total ? 'text-[10px] font-medium uppercase tracking-[0.12em] text-white/65' : 'text-[11px] font-light text-white/35'}>{label}</span><Price price={value} className={total ? 'text-[15px]' : 'text-xs text-white/45'} /></div>; }
