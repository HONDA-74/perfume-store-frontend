# Shared Components

This directory contains application-level reusable components that are used across multiple features or pages.

## Purpose

Shared components are:
- Reusable across different features
- Built on top of primitive UI components from `@/components/ui`
- May contain business logic presentation
- Production-grade with full TypeScript support
- Fully responsive and accessible

## Component Categories

### Navigation
- **Logo** — KENZ wordmark with variant support
- **NavigationLink** — styled navigation anchor with active state
- **Navbar** — main site header with search, cart, wishlist
- **MobileNavbar** — slide-over mobile navigation panel
- **Footer** — global site footer with links and branding
- **AnnouncementBar** — top banner for site-wide announcements
- **UserMenu** — dropdown menu for authenticated users
- **CartButton** — shopping cart icon with item count
- **WishlistButton** — wishlist icon with item count
- **SearchButton** — icon button to trigger search

### Product
- **ProductCard** — primary product card for catalog grids
- **ProductCardCompact** — condensed card for cart/wishlist
- **ProductImage** — optimized image with aspect ratio
- **ProductThumbnail** — clickable thumbnail for galleries
- **ProductGallery** — main image display with thumbnails
- **ProductBadge** — status badges (new, sale, exclusive)
- **Price** — formatted currency display
- **DiscountPrice** — original + discounted price display
- **Rating** — star rating with fractional support
- **StockBadge** — inventory status indicator
- **QuantitySelector** — stepper for quantity input
- **FavoriteButton** — wishlist toggle button
- **WishlistToggle** — compact wishlist overlay toggle

### Search
- **SearchBar** — complete search with suggestions
- **SearchInput** — styled search input with clear
- **SearchSuggestions** — dropdown suggestion list
- **SearchEmptyState** — no results message

### States
- **LoadingState** — centered loading indicator
- **ErrorState** — error message with retry
- **EmptyState** — empty list/collection message
- **NotFoundState** — 404-style missing content
- **OfflineState** — network disconnection message

### Layout
- **Container** — responsive container with max-width
- **Section** — semantic section with spacing
- **SectionHeader** — section title with description
- **PageHeader** — page title with breadcrumbs
- **DividerTitle** — title with decorative dividers
- **PageLoader** — full-page loading screen

### Commerce
- **PriceSummary** — itemized price breakdown
- **PromoBadge** — active promotion display
- **ShippingProgress** — progress to free shipping

### Feedback
- **ConfirmationDialog** — generic confirmation modal
- **DeleteDialog** — specialized delete confirmation
- **LoadingOverlay** — blocking loading overlay
- **SpinnerOverlay** — inline spinner overlay

## Usage

```tsx
import {
  Navbar,
  ProductCard,
  SearchBar,
  LoadingState
} from '@/components/shared';

// Or import individually
import { Logo } from '@/components/shared/logo';
```

## Design System Compliance

All components follow:
- **Design_System.md** — design tokens, spacing, typography
- **BRAND_GUIDELINES.md** — brand voice, color usage, tone
- TypeScript strict mode
- Accessibility standards (WCAG 2.1 AA)
- Dark mode support
- Keyboard navigation
- Screen reader compatibility

## Development Guidelines

1. **Fully Typed** — every component has complete TypeScript interfaces
2. **Reusable Props** — accept configuration via props, no hardcoded data
3. **Responsive** — mobile-first design with breakpoint support
4. **Accessible** — proper ARIA labels, semantic HTML, keyboard support
5. **Loading States** — handle async data and loading indicators
6. **No Business Logic** — presentation only, no API calls or data fetching
7. **Sensible Defaults** — work out-of-the-box with minimal configuration

## Component Props Pattern

Every shared component follows this pattern:

```tsx
export interface ComponentProps extends React.HTMLAttributes<HTMLElement> {
  // Required props first
  value: string;
  
  // Optional props with defaults
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  
  // Callbacks
  onChange?: (value: string) => void;
  onClick?: () => void;
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ variant = 'default', size = 'md', className, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  }
);
```

## Distinction from `components/ui/`

- `ui/` — zero domain knowledge, could ship as a standalone design-system package (Button, Input, Modal)
- `shared/` — has domain awareness (knows what a "product" or "price" is) but is still reused across ≥2 features

## Verification

Run these commands to verify all components:

```bash
npm run lint
npm run typecheck
npm run build
```

All must pass with zero errors.
