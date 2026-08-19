/**
 * Footer Component
 * 
 * Site footer with KENZ dark luxury styling.
 */

import { Link } from 'react-router';
import { ROUTES } from '@/constants';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-kenz-border bg-kenz-surface/30">
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              to={ROUTES.home}
              className="font-serif text-2xl font-normal tracking-wider text-kenz-champagne"
            >
              KENZ
            </Link>
            <p className="mt-4 text-sm text-foreground/60">
              Curating exceptional fragrances for the discerning connoisseur.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 font-sans text-sm font-medium uppercase tracking-wider text-foreground">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={ROUTES.shop}
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/brands"
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Brands
                </Link>
              </li>
              <li>
                <Link
                  to="/collections"
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.scentMatchmaker}
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Scent Finder
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="mb-4 font-sans text-sm font-medium uppercase tracking-wider text-foreground">
              Customer Care
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={ROUTES.account.root}
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  My Account
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.account.orders}
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.wishlist}
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Wishlist
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="mb-4 font-sans text-sm font-medium uppercase tracking-wider text-foreground">
              Information
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-foreground/60 transition-colors hover:text-kenz-gold"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-kenz-border pt-8 text-center">
          <p className="text-sm text-foreground/50">
            © {currentYear} KENZ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
