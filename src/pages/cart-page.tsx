/**
 * Cart Page
 * 
 * Full cart view with same state as CartDrawer (via useEnrichedCart).
 * Supports quantity updates, item removal, and checkout navigation.
 */

import { Link, useNavigate } from 'react-router';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useEnrichedCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/api/use-cart';
import { Price } from '@/components/shared/price';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';
import { ROUTES } from '@/constants';

export function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading, error } = useEnrichedCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

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

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="Failed to load cart"
          message="Please try again later"
        />
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          icon={<ShoppingBag className="h-12 w-12" />}
          title="Your cart is empty"
          message="Discover our collection of exceptional fragrances"
          actionLabel="Browse Products"
          onAction={() => navigate(ROUTES.shop)}
        />
      </div>
    );
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <SectionHeader title="Shopping Cart" subtitle={`${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'}`} />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-6 rounded-lg border border-kenz-border bg-kenz-surface/30 p-6"
              >
                {/* Image */}
                <Link
                  to={`/products/${item.product.slug}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={item.product.images[0] || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="h-32 w-24 rounded-md object-cover"
                  />
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col">
                  <Link
                    to={`/products/${item.product.slug}`}
                    className="font-serif text-lg text-foreground transition-colors hover:text-kenz-gold"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-2 text-sm text-foreground/50">
                    {item.product.brand?.name || 'Unknown Brand'} · {item.product.sizeMl}ml
                  </p>

                  <div className="mt-4 flex items-center gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updateItem.isPending}
                        className="flex h-8 w-8 items-center justify-center rounded border border-kenz-border text-foreground/70 transition-colors hover:border-kenz-gold hover:text-kenz-gold disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-12 text-center text-sm text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={updateItem.isPending || item.quantity >= item.product.stockQuantity}
                        className="flex h-8 w-8 items-center justify-center rounded border border-kenz-border text-foreground/70 transition-colors hover:border-kenz-gold hover:text-kenz-gold disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      disabled={removeItem.isPending}
                      className="ml-auto text-foreground/50 transition-colors hover:text-red-500 disabled:opacity-30"
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex-shrink-0 text-right">
                  <Price
                    price={item.product.price * item.quantity}
                    className="text-lg font-medium"
                  />
                  {item.quantity > 1 && (
                    <p className="mt-1 text-xs text-foreground/50">
                      ${item.product.price.toFixed(2)} each
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-kenz-border bg-kenz-surface/30 p-6">
              <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
                Order Summary
              </h2>

              <div className="space-y-4 border-b border-kenz-border pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Subtotal</span>
                  <Price price={subtotal} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Shipping</span>
                  <span className="text-foreground/70">Calculated at checkout</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <span className="font-sans text-sm font-medium uppercase tracking-wider text-foreground">
                  Total
                </span>
                <Price price={subtotal} className="text-xl font-medium" />
              </div>

              <button
                onClick={() => navigate(ROUTES.checkout)}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-md bg-kenz-gold px-6 py-3 font-sans text-sm font-medium uppercase tracking-wider text-kenz-bg transition-colors hover:bg-kenz-champagne"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>

              <Link
                to={ROUTES.shop}
                className="mt-4 block text-center text-sm text-foreground/70 transition-colors hover:text-foreground"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
