/**
 * Order Detail Page
 * 
 * Full order details with ability to cancel if status allows.
 */

import { useParams, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
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
    } catch (err) {
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
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-2 font-mono text-2xl text-foreground">#{order.orderNumber}</h1>
            <p className="text-foreground/60">Placed on {new Date(order.placedAt).toLocaleDateString()}</p>
          </div>
          {canCancel && (
            <button
              onClick={handleCancel}
              disabled={cancelOrder.isPending}
              className="rounded-md border border-red-500 px-6 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 disabled:opacity-50"
            >
              {cancelOrder.isPending ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <div className="rounded-lg border border-kenz-border bg-kenz-surface/30 p-6">
              <h2 className="mb-4 font-serif text-xl font-normal text-foreground">Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={`${item.productId}-${index}`} className="flex justify-between">
                    <div>
                      <p className="text-foreground">{item.nameSnapshot}</p>
                      <p className="text-sm text-foreground/50">Quantity: {item.quantity}</p>
                    </div>
                    <Price price={item.lineTotal} />
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-lg border border-kenz-border bg-kenz-surface/30 p-6">
              <h2 className="mb-4 font-serif text-xl font-normal text-foreground">Shipping Address</h2>
              <div className="text-sm text-foreground/70">
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
              <div className="rounded-lg border border-kenz-border bg-kenz-surface/30 p-6">
                <h2 className="mb-4 font-serif text-xl font-normal text-foreground">Status</h2>
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
              <div className="rounded-lg border border-kenz-border bg-kenz-surface/30 p-6">
                <h2 className="mb-4 font-serif text-xl font-normal text-foreground">Summary</h2>
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
