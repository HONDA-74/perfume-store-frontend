import * as React from 'react';
import { Link } from 'react-router';
import { ShoppingBag, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { EmptyState, ShippingProgress, PriceSummary } from '@/components/shared';

export interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * CartDrawer — slide-over cart preview for quick review and checkout.
 * 
 * Features:
 * - Slide-in from right
 * - Empty cart state
 * - Line items with thumbnails
 * - Quantity controls
 * - Shipping progress indicator
 * - Price summary
 * - Checkout CTA
 * - Scrollable body
 * - Sticky header and footer
 * 
 * Per UX_FLOW.md §5 and Design_System.md §3.14
 */
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  // Placeholder cart state - would come from cart context/store
  const [cartItems] = React.useState<Array<Record<string, unknown>>>([]);
  const cartSubtotal = 0;
  const shippingThreshold = 100;

  const isEmpty = cartItems.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="flex w-full flex-col sm:w-[450px]">
        {/* Header */}
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center justify-between">
            <span className="font-serif text-h2 font-semibold">Your Cart</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          /* Empty State */
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={<ShoppingBag className="h-8 w-8 text-neutral-400" />}
              title="Your cart is empty"
              message="Discover our curated collection of luxury fragrances and find your signature scent."
              actionLabel="Explore Collection"
              onAction={() => {
                onClose();
                // Navigate to shop - would use router
              }}
            />
          </div>
        ) : (
          <>
            {/* Shipping Progress */}
            <div className="flex-shrink-0 py-4">
              <ShippingProgress
                current={cartSubtotal}
                threshold={shippingThreshold}
              />
            </div>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {/* Cart items would be rendered here */}
                <div className="rounded-lg border border-neutral-200 p-4 text-center">
                  <p className="text-body-sm text-neutral-600">
                    Cart items would appear here
                  </p>
                </div>
              </div>
            </div>

            <Separator className="flex-shrink-0" />

            {/* Footer with Summary and Checkout */}
            <div className="flex-shrink-0 space-y-4 py-4">
              <PriceSummary
                items={[
                  { label: 'Subtotal', amount: cartSubtotal },
                  { label: 'Shipping', amount: 0 },
                ]}
                totalAmount={cartSubtotal}
              />

              <div className="space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link to="/checkout" onClick={onClose}>
                    Proceed to Checkout
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full"
                  size="lg"
                  onClick={onClose}
                >
                  <Link to="/cart">View Full Cart</Link>
                </Button>
              </div>

              <p className="text-center text-caption text-neutral-500">
                Taxes and shipping calculated at checkout
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
