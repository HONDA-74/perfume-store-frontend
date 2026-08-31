/**
 * CartDrawer Component
 *
 * Slide-out cart drawer integrated with real backend cart state.
 * Uses React Query for cart operations - shares state with /cart page.
 */

import * as React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useEnrichedCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/api/use-cart';
import { Price } from '@/components/shared/price';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { ROUTES } from '@/constants';

export function CartDrawer() {
  const { t } = useTranslation();
  const { isCartDrawerOpen, closeCartDrawer } = useUIStore();
  const { data: cart, isLoading, error } = useEnrichedCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartDrawerOpen) {
        closeCartDrawer();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartDrawerOpen, closeCartDrawer]);

  // Lock body scroll when open
  React.useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateItem.mutateAsync({ productId, payload: { quantity } });
    } catch {
      // Error handled by mutation
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem.mutateAsync(productId);
    } catch {
      // Error handled by mutation
    }
  };

  if (!isCartDrawerOpen) return null;

  const subtotal =
    cart?.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <aside
        className="bg-kenz-bg fixed end-0 top-0 z-[101] flex h-full w-full max-w-md flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={t('cart.title')}
      >
        {/* Header */}
        <div className="border-kenz-border flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-kenz-gold" />
            <h2 className="text-foreground font-serif text-lg font-normal">{t('cart.eyebrow')}</h2>
          </div>
          <button
            onClick={closeCartDrawer}
            className="text-foreground/70 hover:text-foreground transition-colors"
            aria-label={t('cart.close')}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-full items-center justify-center">
              <PageLoader />
            </div>
          ) : error ? (
            <div className="p-6">
              <EmptyState
                icon={<ShoppingBag className="h-8 w-8" />}
                title={t('cart.error')}
                message={t('cart.errorDescription')}
              />
            </div>
          ) : !cart?.items.length ? (
            <div className="flex h-full items-center justify-center p-6">
              <EmptyState
                icon={<ShoppingBag className="h-8 w-8" />}
                title={t('cart.empty')}
                message={t('cart.emptyDescription')}
                actionLabel={t('cart.explore')}
                onAction={() => {
                  window.location.href = ROUTES.shop;
                  closeCartDrawer();
                }}
              />
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="border-kenz-border bg-kenz-surface/30 flex gap-4 rounded-lg border p-4"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${item.product.slug}`}
                    onClick={closeCartDrawer}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/products/${item.product.slug}`}
                      onClick={closeCartDrawer}
                      className="text-foreground hover:text-kenz-gold font-serif text-sm transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-foreground/50 mt-1 text-xs">
                      {item.product.brand?.name || 'Unknown'} · {item.product.sizeMl}ml
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateItem.isPending}
                          className="border-kenz-border text-foreground/70 hover:border-kenz-gold hover:text-kenz-gold flex h-7 w-7 items-center justify-center rounded border transition-colors disabled:opacity-30"
                          aria-label={`${t('cart.quantity')} -`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-foreground w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={updateItem.isPending}
                          className="border-kenz-border text-foreground/70 hover:border-kenz-gold hover:text-kenz-gold flex h-7 w-7 items-center justify-center rounded border transition-colors disabled:opacity-30"
                          aria-label={`${t('cart.quantity')} +`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={removeItem.isPending}
                        className="text-foreground/50 transition-colors hover:text-red-500 disabled:opacity-30"
                        aria-label={t('cart.remove')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-end">
                    <Price price={item.product.price * item.quantity} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.items.length ? (
          <div className="border-kenz-border border-t p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-foreground/70 text-sm">{t('cart.subtotal')}</span>
              <Price price={subtotal} className="text-lg font-medium" />
            </div>
            <Link
              to={ROUTES.checkout}
              onClick={closeCartDrawer}
              className="bg-kenz-gold text-kenz-bg hover:bg-kenz-champagne block w-full rounded-md px-6 py-3 text-center font-sans text-sm font-medium tracking-wider uppercase transition-colors"
            >
              {t('cart.checkout')}
            </Link>
            <Link
              to={ROUTES.cart}
              onClick={closeCartDrawer}
              className="border-kenz-border text-foreground hover:border-kenz-gold hover:text-kenz-gold mt-3 block w-full rounded-md border px-6 py-3 text-center font-sans text-sm font-medium tracking-wider uppercase transition-colors"
            >
              {t('cart.eyebrow')}
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}
