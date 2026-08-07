import * as React from 'react';
import { Link } from 'react-router';
import { X, Home, ShoppingBag, Heart, Package, User, Sparkles } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/shared';

export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const primaryLinks: NavItem[] = [
  { label: 'Home', href: '/', icon: <Home className="h-5 w-5" /> },
  { label: 'Shop All', href: '/shop', icon: <ShoppingBag className="h-5 w-5" /> },
  { label: 'Collections', href: '/collections', icon: <Package className="h-5 w-5" /> },
  { label: 'Wishlist', href: '/wishlist', icon: <Heart className="h-5 w-5" /> },
];

const secondaryLinks: NavItem[] = [
  { label: 'My Account', href: '/account', icon: <User className="h-5 w-5" /> },
  { label: 'Orders', href: '/account/orders', icon: <Package className="h-5 w-5" /> },
];

/**
 * MobileNav — slide-over navigation for mobile devices.
 * 
 * Features:
 * - Full-screen drawer on mobile
 * - Primary and secondary navigation sections
 * - AI Scent Finder CTA
 * - Keyboard accessible
 * - Focus trap when open
 * - Close on navigation
 * - Smooth slide-in animation
 * 
 * Per UX_FLOW.md §19 and Design_System.md §3.14
 */
export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="left"
        className="w-full sm:w-[350px]"
        id="mobile-navigation"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <Logo variant="dark" size="sm" />
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-2" aria-label="Mobile navigation">
          {/* Primary Links */}
          <div className="space-y-1">
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-md px-3 py-3 font-serif text-h4 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Secondary Links */}
          <div className="space-y-1">
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-body-lg font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900 focus-visible:bg-neutral-50 focus-visible:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          <Separator className="my-4" />

          {/* AI Scent Finder CTA */}
          <div className="rounded-lg border border-primary-500 bg-primary-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <h3 className="font-serif text-h4 font-semibold text-neutral-900">
                AI Scent Finder
              </h3>
            </div>
            <p className="mb-4 text-body-sm text-neutral-600">
              Let AI help you discover your signature fragrance in 2 minutes.
            </p>
            <Button
              asChild
              variant="default"
              size="sm"
              className="w-full"
              onClick={onClose}
            >
              <Link to="/scent-finder">Begin Quiz</Link>
            </Button>
          </div>

          <Separator className="my-4" />

          {/* Sign In/Out */}
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onClose}
          >
            Sign In
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
