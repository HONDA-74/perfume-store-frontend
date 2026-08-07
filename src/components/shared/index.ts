/**
 * Shared Components — application-level reusable components.
 * These are production-grade components built on top of primitive UI components.
 * They encapsulate common patterns and business logic presentation.
 * 
 * See ./README.md for usage guidelines and component organization.
 */

// Navigation
export * from './logo';
export * from './navigation-link';
export * from './navbar';
export * from './mobile-navbar';
export * from './footer';
export * from './announcement-bar';
export * from './user-menu';
export * from './cart-button';
export * from './wishlist-button';
export * from './search-button';

// Product
export * from './product-card';
export * from './product-card-compact';
export * from './product-image';
export * from './product-thumbnail';
export * from './product-gallery';
export * from './product-badge';
export * from './price';
export * from './discount-price';
export * from './rating';
export * from './stock-badge';
export * from './quantity-selector';
export * from './favorite-button';
export * from './wishlist-toggle';

// Search
export * from './search-bar';
export * from './search-input';
export * from './search-suggestions';
export * from './search-empty-state';

// States
export * from './loading-state';
export * from './error-state';
export * from './empty-state';
export * from './not-found-state';
export * from './offline-state';

// Layout
export * from './container';
export * from './section';
export * from './section-header';
export * from './page-header';
export * from './divider-title';
export * from './page-loader';

// Commerce
export * from './price-summary';
export * from './promo-badge';
export * from './shipping-progress';

// Feedback
export * from './confirmation-dialog';
export * from './delete-dialog';
export * from './loading-overlay';
export * from './spinner-overlay';
