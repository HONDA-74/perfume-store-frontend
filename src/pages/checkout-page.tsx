/**
 * Checkout Page
 * 
 * NOTE: Backend requires addressId for orders but has no address CRUD API.
 * This page shows the checkout UI but cannot complete orders until
 * address management is implemented in the backend.
 */

import * as React from 'react';
import { useNavigate } from 'react-router';
import { Lock } from 'lucide-react';
import { useEnrichedCart } from '@/hooks/api/use-cart';
import { Price } from '@/components/shared/price';
import { EmptyState } from '@/components/shared/empty-state';
import { PageLoader } from '@/components/shared/page-loader';
import { SectionHeader } from '@/components/shared/section-header';
import { ROUTES } from '@/constants';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useEnrichedCart();

  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    country: '',
  });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!cart?.items.length) {
    return (
      <div className="container mx-auto px-6 py-24">
        <EmptyState
          title="Your cart is empty"
          message="Add products to your cart before checking out"
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Backend limitation: Cannot create orders without addressId
    // and no address CRUD API exists
    alert('Order creation not yet available. Backend address management API is required.');
  };

  return (
    <div className="min-h-screen bg-kenz-bg">
      <div className="container mx-auto px-6 py-12">
        <SectionHeader title="Checkout" />

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            {/* Backend Limitation Notice */}
            <div className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
              <div className="flex items-start gap-3">
                <Lock size={20} className="mt-0.5 flex-shrink-0 text-amber-500" />
                <div>
                  <h3 className="mb-2 font-sans text-sm font-medium uppercase tracking-wider text-amber-500">
                    Feature In Development
                  </h3>
                  <p className="text-sm text-foreground/70">
                    Order creation requires backend address management API.
                    The checkout form is functional but cannot submit orders until
                    the backend implements address CRUD endpoints.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div>
                <h2 className="mb-4 font-serif text-xl font-normal text-foreground">
                  Contact Information
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                    required
                  />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="mb-4 font-serif text-xl font-normal text-foreground">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                    className="w-full rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="rounded-md border border-kenz-border bg-kenz-surface/30 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-kenz-gold focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled
                className="w-full rounded-md bg-kenz-gold px-6 py-4 font-sans text-sm font-medium uppercase tracking-wider text-kenz-bg transition-colors hover:bg-kenz-champagne disabled:cursor-not-allowed disabled:opacity-50"
              >
                Place Order (Requires Backend Update)
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg border border-kenz-border bg-kenz-surface/30 p-6">
              <h2 className="mb-6 font-serif text-xl font-normal text-foreground">
                Order Summary
              </h2>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-4">
                    <img
                      src={item.product.images[0] || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      className="h-16 w-12 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{item.product.name}</p>
                      <p className="mt-1 text-xs text-foreground/50">Qty: {item.quantity}</p>
                    </div>
                    <Price price={item.product.price * item.quantity} className="text-sm" />
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t border-kenz-border pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Subtotal</span>
                  <Price price={subtotal} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">Shipping</span>
                  <span className="text-foreground/70">TBD</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between border-t border-kenz-border pt-6">
                <span className="font-sans text-sm font-medium uppercase tracking-wider text-foreground">
                  Total
                </span>
                <Price price={subtotal} className="text-xl font-medium" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
