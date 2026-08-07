import * as React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib';
import { Logo } from './logo';
import { NavigationLink } from './navigation-link';
import { CartButton } from './cart-button';
import { WishlistButton } from './wishlist-button';
import { SearchButton } from './search-button';
import { UserMenu } from './user-menu';

export interface NavbarProps extends React.HTMLAttributes<HTMLElement> {
  cartItemCount?: number;
  wishlistItemCount?: number;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onCartClick?: () => void;
  onWishlistClick?: () => void;
  onSearchClick?: () => void;
  onMobileMenuClick?: () => void;
  onProfile?: () => void;
  onOrders?: () => void;
  onSettings?: () => void;
  onLogout?: () => void;
  navigationLinks?: Array<{
    label: string;
    href: string;
    isActive?: boolean;
  }>;
}

/**
 * Navbar — main site header with logo, navigation, search, and user actions.
 * Sticky positioned with backdrop blur for luxury feel.
 * Per Design_System.md §3.17 and BRAND_GUIDELINES.md.
 */
const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  (
    {
      cartItemCount = 0,
      wishlistItemCount = 0,
      user,
      onCartClick,
      onWishlistClick,
      onSearchClick,
      onMobileMenuClick,
      onProfile,
      onOrders,
      onSettings,
      onLogout,
      navigationLinks = [],
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'sticky top-0 z-navbar border-b border-neutral-100 bg-neutral-0/90 backdrop-blur-md',
          className,
        )}
        {...props}
      >
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMobileMenuClick}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo variant="dark" size="md" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
              {navigationLinks.map((link) => (
                <NavigationLink
                  key={link.href}
                  href={link.href}
                  isActive={link.isActive}
                >
                  {link.label}
                </NavigationLink>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <SearchButton onClick={onSearchClick} />
              <WishlistButton
                itemCount={wishlistItemCount}
                onClick={onWishlistClick}
              />
              <CartButton itemCount={cartItemCount} onClick={onCartClick} />
              {user ? (
                <UserMenu
                  user={user}
                  onProfile={onProfile}
                  onOrders={onOrders}
                  onSettings={onSettings}
                  onLogout={onLogout}
                />
              ) : (
                <Button variant="ghost" size="sm" className="hidden sm:flex">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  },
);
Navbar.displayName = 'Navbar';

export { Navbar };
