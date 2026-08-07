/**
 * Primitive UI components — assembled from Radix UI primitives + CVA variants.
 * See ./README.md for usage philosophy. This barrel export makes
 * `import { Button, Dialog, ... } from '@/components/ui'` possible, but
 * direct file imports (`import { Button } from '@/components/ui/button'`)
 * remain the recommended pattern to keep bundler tree-shaking predictable.
 */

// Form Controls
export * from './button';
export * from './input';
export * from './textarea';
export * from './label';
export * from './checkbox';
export * from './radio-group';
export * from './switch';
export * from './select';

// Feedback & Display
export * from './badge';
export * from './card';
export * from './separator';
export * from './avatar';
export * from './skeleton';
export * from './spinner';
export * from './toast';

// Overlays
export * from './dialog';
export * from './drawer';
export * from './sheet';
export * from './popover';
export * from './tooltip';
export * from './dropdown-menu';

// Navigation & Layout
export * from './tabs';
export * from './accordion';
export * from './breadcrumb';
export * from './pagination';
export * from './scroll-area';

// Theme
export * from './theme-toggle';
