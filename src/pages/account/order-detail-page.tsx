/**
 * Order Detail Page
 * 
 * Full order details with ability to cancel if status allows.
 */

import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { useOrder, useCancelOrder } from '@/hooks/api/use-orders';
import { Price } from '@/components/shared/price';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { getOrderStatusLabel, getOrderStatusColor, getPaymentStatusLabel, getPaymentStatusColor } from '@/lib/adapters/enum-adapter';
import { ROUTES } from '@/constants';

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(orderId!);
  const cancelOrder = useCancelOrder();

  const handleCancel = async () => {
    if (!order || !window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder.mutateAsync(order.id);
    } catch {
      alert('Failed to cancel order');
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="Order not found"
          message="The order you're looking for doesn't exist"
          actionLabel="View Orders"
          onAction={() => navigate(ROUTES.account.orders)}
        />
      </div>
    );
  }

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';

  return (
    <div>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Account', href: ROUTES.account.root }, { label: 'Orders', href: ROUTES.account.orders }, { label: order.orderNumber }]} className="mb-6" />
      <div>
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-white/30 transition-colors hover:text-white/60"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#D4C3A3]/40">Order</p>
            <h1 className="font-serif text-[clamp(1.4rem,2.5vw,2rem)] font-normal text-white/85">{order.orderNumber}</h1>
            <p className="mt-2 text-[11px] font-light text-white/30">Placed on {new Date(order.placedAt).toLocaleDateString()}</p>
          </div>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelOrder.isPending}
              className="border border-red-400/40 px-6 py-2 text-[10px] font-medium uppercase tracking-[0.1em] text-red-300/70 transition-colors hover:bg-red-500/10 disabled:opacity-50"
            >
              {cancelOrder.isPending ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="border border-white/[0.06] bg-[#121115] p-6">
              <h2 className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">Items Ordered</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-serif text-sm text-white/80">{item.nameSnapshot}</p>
                      <p className="mt-1 text-[10px] text-white/30">Quantity {item.quantity}</p>
                    </div>
                    <Price price={item.lineTotal} />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-white/[0.06] bg-[#121115] p-6">
              <h2 className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">Delivery Details</h2>
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
                <h2 className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">Status</h2>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-foreground/50">Order Status</p>
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-wider text-foreground/50">Payment Status</p>
                    <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="border border-white/[0.06] bg-[#121115] p-6">
                <h2 className="mb-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/30">Order Total</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Subtotal</span>
                    <Price price={order.subtotal} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Discount</span>
                    <Price price={-order.discountTotal} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Shipping</span>
                    <Price price={order.shippingFee} />
                  </div>
                  <div className="flex justify-between border-t border-kenz-border pt-3 font-medium">
                    <span className="text-foreground">Total</span>
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
