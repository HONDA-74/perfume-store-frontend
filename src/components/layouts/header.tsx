import * as React from 'react';
import { Link } from 'react-router';
import { Menu } from 'lucide-react';
import { Logo, CartButton, WishlistButton, SearchButton } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib';

export interface HeaderProps {
  onSearchClick?: () => void;
  onCartClick?: () => void;
  onMobileMenuClick?: () => void;
}

interface NavLink {
  label: string;
  href: string;
}

const navigationLinks: NavLink[] = [
  { label: 'Collections', href: '/collections' },
  { label: 'Perfumes', href: '/shop' },
  { label: 'Heritage', href: '/heritage' },
  { label: 'Scent Finder', href: '/scent-finder' },
];

/**
 * Header — main site header with responsive navigation.
 * 
 * Features:
 * - Centered KENZ logo with variant support
 * - Primary navigation links (desktop only)
 * - Search, Wishlist, Cart buttons
 * - Theme toggle
 * - Mobile menu trigger
 * - Sticky positioning with backdrop blur
 * - Scroll-aware shadow
 * 
 * Per Design_System.md §3.17 and UX_FLOW.md §17
 */
export function Header({
  onSearchClick,
  onCartClick,
  onMobileMenuClick,
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-navbar border-b transition-all duration-normal',
        isScrolled
          ? 'border-neutral-200 bg-neutral-0/90 shadow-sm backdrop-blur-md'
          : 'border-neutral-100 bg-neutral-0/90 backdrop-blur-md',
      )}
      role="banner"
    >
      <div className="container mx-auto">
        <div className="flex h-20 items-center justify-between gap-4 px-4 lg:px-6">
          {/* Left: Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMobileMenuClick}
              aria-label="Open menu"
              aria-expanded={false}
              aria-controls="mobile-navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Left: Desktop Navigation */}
          <nav
            className="hidden items-center gap-8 lg:flex"
            aria-label="Primary navigation"
          >
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-body-md font-medium uppercase tracking-wide text-neutral-700 transition-colors duration-fast hover:text-primary-500 focus-visible:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Center: Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:left-auto lg:translate-x-0">
            <Link
              to="/"
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:rounded-sm"
              aria-label="KENZ Home"
            >
              <Logo variant="dark" size="md" />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <SearchButton onClick={onSearchClick} />
            <WishlistButton itemCount={0} onClick={() => {}} />
            <CartButton itemCount={0} onClick={onCartClick} />
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
