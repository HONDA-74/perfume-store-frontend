/**
 * Orders Page
 * 
 * List of user's orders with links to details.
 */

import { Link } from 'react-router';
import { Package } from 'lucide-react';
import { useOrders } from '@/hooks/api/use-orders';
import { Price } from '@/components/shared/price';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';
import { getOrderStatusLabel, getOrderStatusColor } from '@/lib/adapters/enum-adapter';
import { ROUTES } from '@/constants';

export function OrdersPage() {
  const { data, isLoading, error } = useOrders();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="Failed to load orders"
          message="Please try again later"
        />
      </div>
    );
  }

  if (!data?.items.length) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          icon={<Package className="h-12 w-12" />}
          title="No orders yet"
          message="Start shopping to see your orders here"
          actionLabel="Browse Products"
          onAction={() => window.location.href = ROUTES.shop}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <SectionHeader title="My Orders" subtitle={`${data.meta.totalItems} orders`} />

        <div className="mt-12 space-y-4">
          {data.items.map((order) => (
            <Link
              key={order.id}
              to={`/account/orders/${order.id}`}
              className="block rounded-lg border border-kenz-border bg-kenz-surface/30 p-6 transition-all hover:border-kenz-gold"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-lg text-foreground">#{order.orderNumber}</p>
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-foreground/60">
                    {new Date(order.placedAt).toLocaleDateString()} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <Price price={order.total} className="text-xl font-medium" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
