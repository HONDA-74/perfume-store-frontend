/**
 * CartDrawer Component
 * 
 * Slide-out cart drawer integrated with real backend cart state.
 * Uses React Query for cart operations - shares state with /cart page.
 */

import * as React from 'react';
import { Link } from 'react-router';
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react';
import { useUIStore } from '@/stores/ui.store';
import { useEnrichedCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/api/use-cart';
import { Price } from '@/components/shared/price';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { ROUTES } from '@/constants';

export function CartDrawer() {
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
    } catch (err) {
      // Error handled by mutation
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem.mutateAsync(productId);
    } catch (err) {
      // Error handled by mutation
    }
  };

  if (!isCartDrawerOpen) return null;

  const subtotal = cart?.items.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  ) ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCartDrawer}
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-md flex-col bg-kenz-bg shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-kenz-border px-6 py-4">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-kenz-gold" />
            <h2 className="font-serif text-lg font-normal text-foreground">
              Shopping Cart
            </h2>
          </div>
          <button
            onClick={closeCartDrawer}
            className="text-foreground/70 transition-colors hover:text-foreground"
            aria-label="Close cart"
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
                title="Failed to load cart"
                message="Please try again later"
              />
            </div>
          ) : !cart?.items.length ? (
            <div className="flex h-full items-center justify-center p-6">
              <EmptyState
                icon={<ShoppingBag className="h-8 w-8" />}
                title="Your cart is empty"
                message="Add some fragrances to get started"
                actionLabel="Browse Products"
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
                  className="flex gap-4 rounded-lg border border-kenz-border bg-kenz-surface/30 p-4"
                >
                  {/* Image */}
                  <Link
                    to={`/products/${item.product.slug}`}
                    onClick={closeCartDrawer}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product.images[0] || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col">
                    <Link
                      to={`/products/${item.product.slug}`}
                      onClick={closeCartDrawer}
                      className="font-serif text-sm text-foreground transition-colors hover:text-kenz-gold"
                    >
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-xs text-foreground/50">
                      {item.product.brand?.name || 'Unknown'} · {item.product.sizeMl}ml
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updateItem.isPending}
                          className="flex h-7 w-7 items-center justify-center rounded border border-kenz-border text-foreground/70 transition-colors hover:border-kenz-gold hover:text-kenz-gold disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={updateItem.isPending}
                          className="flex h-7 w-7 items-center justify-center rounded border border-kenz-border text-foreground/70 transition-colors hover:border-kenz-gold hover:text-kenz-gold disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => handleRemoveItem(item.productId)}
                        disabled={removeItem.isPending}
                        className="text-foreground/50 transition-colors hover:text-red-500 disabled:opacity-30"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex-shrink-0 text-right">
                    <Price price={item.product.price * item.quantity} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart?.items.length ? (
          <div className="border-t border-kenz-border p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-foreground/70">Subtotal</span>
              <Price price={subtotal} className="text-lg font-medium" />
            </div>
            <Link
              to={ROUTES.checkout}
              onClick={closeCartDrawer}
              className="block w-full rounded-md bg-kenz-gold px-6 py-3 text-center font-sans text-sm font-medium uppercase tracking-wider text-kenz-bg transition-colors hover:bg-kenz-champagne"
            >
              Checkout
            </Link>
            <Link
              to={ROUTES.cart}
              onClick={closeCartDrawer}
              className="mt-3 block w-full rounded-md border border-kenz-border px-6 py-3 text-center font-sans text-sm font-medium uppercase tracking-wider text-foreground transition-colors hover:border-kenz-gold hover:text-kenz-gold"
            >
              View Cart
            </Link>
          </div>
        ) : null}
      </aside>
    </>
  );
}
