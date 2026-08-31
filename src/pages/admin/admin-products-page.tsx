/**
 * Admin Products Page
 * List products with search/filter and CRUD operations.
 */

import { useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Edit, Trash2, AlertCircle } from 'lucide-react';
import { useProducts, useDeleteProduct } from '@/hooks/api/use-products';
import { PageLoader } from '@/components/shared/page-loader';
import { deriveProductBadge } from '@/lib/adapters/product-adapter';
import { getConcentrationLabel } from '@/lib/adapters/enum-adapter';

export function AdminProductsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const productsQuery = useProducts({ limit: 50, search: searchQuery || undefined });
  const deleteMutation = useDeleteProduct();

  const handleDelete = (id: string) => {
    if (confirm(t('admin.deleteConfirm'))) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  if (productsQuery.isLoading) {
    return <PageLoader />;
  }

  const products = productsQuery.data?.items ?? [];

  return (
    <div className="p-8" style={{ background: '#0B0A0C', minHeight: '100%' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: '2rem', color: 'rgba(243,242,245,0.9)', marginBottom: '6px' }}>
            {t('admin.manageProducts')}
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 300, color: 'rgba(243,242,245,0.35)' }}>
            {t('admin.welcome')}
          </p>
        </div>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded hover:opacity-85 transition-opacity duration-150"
          style={{ background: 'hsl(43 82% 52%)', color: '#0B0A0C', fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, letterSpacing: '0.02em' }}
        >
          <Plus size={16} />
          {t('admin.addProduct')}
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 relative">
        <Search className="absolute start-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
        <input
          type="text"
          placeholder={t('search.placeholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md ps-12 pe-4 py-2.5 border rounded bg-transparent outline-none transition-colors duration-150"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            color: 'rgba(243,242,245,0.9)',
            fontFamily: 'var(--font-sans)',
            fontSize: '13px',
          }}
          onFocus={(e) => { e.target.style.borderColor = 'rgba(212,195,163,0.3)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      </div>

      {/* Table */}
      {products.length === 0 ? (
        <div className="p-12 border rounded text-center" style={{ background: '#121115', borderColor: 'rgba(255,255,255,0.06)' }}>
          <AlertCircle className="mx-auto mb-3" size={32} style={{ color: 'rgba(243,242,245,0.2)' }} />
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 300, color: 'rgba(243,242,245,0.4)' }}>
            {searchQuery ? t('search.noResults') : t('catalog.empty')}
          </p>
        </div>
      ) : (
        <div className="border rounded overflow-hidden" style={{ background: '#121115', borderColor: 'rgba(255,255,255,0.06)' }}>
          <table className="w-full">
            <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <tr>
                <th className="text-start px-6 py-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(243,242,245,0.4)' }}>
                  {t('admin.products')}
                </th>
                <th className="text-start px-6 py-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(243,242,245,0.4)' }}>
                  {t('catalog.brand')}
                </th>
                <th className="text-start px-6 py-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(243,242,245,0.4)' }}>
                  {t('catalog.price')}
                </th>
                <th className="text-left px-6 py-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(243,242,245,0.4)' }}>
                  {t('catalog.availability')}
                </th>
                <th className="text-end px-6 py-3" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(243,242,245,0.4)' }}>
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const badge = deriveProductBadge(product);
                const concentration = product.concentration ? getConcentrationLabel(product.concentration) : null;
                
                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                            style={{ background: 'rgba(255,255,255,0.02)' }}
                          />
                        )}
                        <div>
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 400, color: 'rgba(243,242,245,0.85)', marginBottom: '2px' }}>
                            {product.name}
                          </p>
                          {concentration && (
                            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 300, color: 'rgba(243,242,245,0.3)' }}>
                              {concentration}
                            </p>
                          )}
                          {badge && (
                            <span
                              className="inline-block mt-1 px-2 py-0.5 rounded text-xs"
                              style={{
                                background: badge === 'new' ? 'rgba(76,175,80,0.15)' : badge === 'sale' ? 'rgba(244,67,54,0.15)' : 'rgba(212,195,163,0.08)',
                                color: badge === 'new' ? 'rgb(76,175,80)' : badge === 'sale' ? 'rgb(244,67,54)' : 'hsl(43 82% 52%)',
                                fontFamily: 'var(--font-sans)',
                                fontSize: '9px',
                                fontWeight: 500,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                              }}
                            >
                              {badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 300, color: 'rgba(243,242,245,0.6)' }}>
                        {product.brand?.name ?? t('common.unavailable')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {product.discountPrice ? (
                        <div>
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'rgba(243,242,245,0.85)' }}>
                            ${product.discountPrice.toFixed(2)}
                          </p>
                          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 300, color: 'rgba(243,242,245,0.3)', textDecoration: 'line-through' }}>
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', fontWeight: 500, color: 'rgba(243,242,245,0.85)' }}>
                          ${product.price.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 300, color: product.stockQuantity > 0 ? 'rgba(243,242,245,0.6)' : 'rgb(244,67,54)' }}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} ${t('catalog.inStockOnly')}` : t('catalog.outOfStock')}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded hover:bg-white/5 transition-colors duration-150"
                          title={t('admin.editProduct')}
                        >
                          <Edit size={16} style={{ color: 'rgba(243,242,245,0.5)' }} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteMutation.isPending && deleteId === product.id}
                          className="p-2 rounded hover:bg-red-500/10 transition-colors duration-150 disabled:opacity-50"
                          title={t('common.delete')}
                        >
                          <Trash2 size={16} style={{ color: 'rgb(244,67,54)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {deleteMutation.isError && (
        <div className="mt-4 p-4 border rounded flex items-start gap-3" style={{ background: 'rgba(244,67,54,0.05)', borderColor: 'rgba(244,67,54,0.2)' }}>
          <AlertCircle className="flex-shrink-0 mt-0.5" size={16} style={{ color: 'rgb(244,67,54)' }} />
          <div>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', fontWeight: 500, color: 'rgb(244,67,54)', marginBottom: '2px' }}>
              {t('common.error')}
            </p>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: 300, color: 'rgba(244,67,54,0.7)' }}>
              {t('common.error')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
