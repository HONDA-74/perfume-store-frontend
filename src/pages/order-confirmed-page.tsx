/**
 * Order Confirmed Page
 * 
 * Order confirmation with order details.
 * Note: Depends on order creation which requires backend address API.
 */

import { useParams, useNavigate } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { useOrder } from '@/hooks/api/use-orders';
import { Price } from '@/components/shared/price';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { ROUTES } from '@/constants';

export function OrderConfirmedPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(orderId!);

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

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Success Message */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle size={32} className="text-green-500" />
              </div>
            </div>
            <h1 className="mb-2 font-serif text-3xl font-normal text-foreground">
              Order Confirmed
            </h1>
            <p className="text-foreground/70">
              Thank you for your purchase! Your order has been confirmed.
            </p>
          </div>

          {/* Order Details */}
          <div className="rounded-lg border border-kenz-border bg-kenz-surface/30 p-8">
            <div className="mb-6 flex items-center justify-between border-b border-kenz-border pb-6">
              <div>
                <p className="text-sm text-foreground/50">Order Number</p>
                <p className="mt-1 font-mono text-lg text-foreground">#{order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground/50">Date</p>
                <p className="mt-1 text-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h2 className="mb-4 font-serif text-lg font-normal text-foreground">Items</h2>
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

            {/* Total */}
            <div className="flex justify-between border-t border-kenz-border pt-6">
              <span className="font-sans text-sm font-medium uppercase tracking-wider text-foreground">
                Total
              </span>
              <Price price={order.total} className="text-xl font-medium" />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate(ROUTES.account.orders)}
              className="flex-1 rounded-md border border-kenz-border px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:border-kenz-gold hover:text-kenz-gold"
            >
              View Orders
            </button>
            <button
              onClick={() => navigate(ROUTES.shop)}
              className="flex-1 rounded-md bg-kenz-gold px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-kenz-bg transition-colors hover:bg-kenz-champagne"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
