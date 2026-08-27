/**
 * Admin Dashboard Page
 * Overview with derived metrics from existing API data.
 */

import { Package, Tag, FolderOpen, ShoppingCart } from 'lucide-react';
import { useProducts } from '@/hooks/api/use-products';
import { useBrands } from '@/hooks/api/use-brands';
import { useCategories } from '@/hooks/api/use-categories';
import { useOrders } from '@/hooks/api/use-orders';
import { PageLoader } from '@/components/shared/page-loader';

interface StatCard {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
}

export function AdminDashboardPage() {
  const productsQuery = useProducts({ limit: 1 });
  const brandsQuery = useBrands({ limit: 1 });
  const categoriesQuery = useCategories({ limit: 1 });
  const ordersQuery = useOrders({ limit: 1 });

  const isLoading = productsQuery.isLoading || brandsQuery.isLoading || 
    categoriesQuery.isLoading || ordersQuery.isLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  const stats: StatCard[] = [
    {
      label: 'Total Products',
      value: productsQuery.data?.meta.totalItems ?? 0,
      icon: Package,
    },
    {
      label: 'Total Brands',
      value: brandsQuery.data?.meta.totalItems ?? 0,
      icon: Tag,
    },
    {
      label: 'Total Categories',
      value: categoriesQuery.data?.meta.totalItems ?? 0,
      icon: FolderOpen,
    },
    {
      label: 'Total Orders',
      value: ordersQuery.data?.meta.totalItems ?? 0,
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="p-8" style={{ background: '#0B0A0C', minHeight: '100%' }}>
      <div className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '2rem', color: 'rgba(243,242,245,0.9)', marginBottom: '6px' }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 300, color: 'rgba(243,242,245,0.35)' }}>
          Overview of your store
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="p-6 border rounded"
              style={{ background: '#121115', borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded" style={{ background: 'rgba(212,195,163,0.08)' }}>
                  <Icon size={20} style={{ color: 'hsl(43 82% 52%)' }} />
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 400, color: 'rgba(243,242,245,0.9)', lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 300, letterSpacing: '0.05em', color: 'rgba(243,242,245,0.3)', marginTop: '8px', textTransform: 'uppercase' }}>
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 border rounded" style={{ background: '#121115', borderColor: 'rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 300, color: 'rgba(243,242,245,0.4)', fontStyle: 'italic' }}>
          Note: Dashboard displays derived metrics from paginated API responses. Advanced analytics (revenue charts, growth metrics, conversion rates) require dedicated backend analytics endpoints.
        </p>
      </div>
    </div>
  );
}
