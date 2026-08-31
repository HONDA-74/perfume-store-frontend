/**
 * Order Detail Page
 * 
 * Full order details with ability to cancel if status allows.
 */

import { useParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { useOrder, useCancelOrder } from '@/hooks/api/use-orders';
import { Price } from '@/components/shared/price';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { getOrderStatusLabel, getOrderStatusColor, getPaymentStatusLabel, getPaymentStatusColor } from '@/lib/adapters/enum-adapter';
import { ROUTES } from '@/constants';

export function OrderDetailPage() {
  const { t, i18n } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(orderId!);
  const cancelOrder = useCancelOrder();

  const handleCancel = async () => {
    if (!order || !window.confirm(t('order.cancelConfirm'))) return;
    try {
      await cancelOrder.mutateAsync(order.id);
    } catch {
      alert(t('order.cancelFailed'));
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title={t('order.notFound')}
          message={t('order.notFoundDescription')}
          actionLabel={t('order.viewOrders')}
          onAction={() => navigate(ROUTES.account.orders)}
        />
      </div>
    );
  }

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  return (
    <div>
      <Breadcrumb items={[{ label: 'KENZ', href: '/' }, { label: t('nav.account'), href: ROUTES.account.root }, { label: t('account.orders'), href: ROUTES.account.orders }, { label: order.orderNumber }]} className="mb-6" />
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft size={16} className="directional-icon" />
          {t('common.back')}
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">{t('account.orderNumber')}</p>
            <h1 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] font-normal text-white/85">{order.orderNumber}</h1>
            <p className="mt-2 text-[11px] font-light text-white/30">{t('account.placedOn', { date: new Date(order.placedAt).toLocaleDateString(i18n.language) })}</p>
          </div>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelOrder.isPending}
              className="border border-red-400/40 px-6 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-red-300/70 transition-colors hover:bg-red-500/10 disabled:opacity-50"
            >
              {cancelOrder.isPending ? t('order.cancelling') : t('order.cancel')}
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="border border-white/[0.06] bg-[#121115] p-6">
              <h2 className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">{t('order.itemsOrdered')}</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-serif text-sm text-white/80">{item.nameSnapshot}</p>
                      <p className="mt-1 text-[10px] text-white/30">{t('order.quantity', { count: item.quantity })}</p>
                    </div>
                    <Price price={item.lineTotal} />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-white/[0.06] bg-[#121115] p-6">
              <h2 className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">{t('order.deliveryDetails')}</h2>
              <div className="text-xs font-light leading-6 text-white/45">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Order Status */}
              <div className="border border-white/[0.06] bg-[#121115] p-6">
                <h2 className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">{t('account.status')}</h2>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-foreground/50">{t('order.orderStatus')}</p>
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-foreground/50">{t('order.paymentStatus')}</p>
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border border-white/[0.06] bg-[#121115] p-6">
                <h2 className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">{t('order.orderTotal')}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">{t('cart.subtotal')}</span>
                    <Price price={order.subtotal} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">{t('order.discount')}</span>
                    <Price price={-order.discountTotal} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">{t('cart.shipping')}</span>
                    <Price price={order.shippingFee} />
                  </div>
                  <div className="flex justify-between border-t border-kenz-border pt-3 font-medium">
                    <span className="text-foreground">{t('cart.total')}</span>
                    <Price price={order.total} className="text-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
