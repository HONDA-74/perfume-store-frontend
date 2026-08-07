import { env } from '@/config/env';

/**
 * Static site configuration — brand metadata and layout bounds sourced
 * directly from ARCHITECTURE.md / Design_System.md §4.1. Not a place for
 * feature flags tied to business logic; those belong closer to the feature
 * that owns them.
 */
export const siteConfig = {
  name: env.appName,
  description: 'A high-end e-commerce platform for bespoke, luxury fragrances.',
  locale: 'en-US',
  direction: 'ltr',
  containers: {
    catalog: '1280px', // max-w-7xl — Design_System.md §4.1
    editorial: '1024px', // max-w-5xl
    authForm: '480px', // max-w-md
    wide: '1440px', // Design_System.md §4.1 "Wide desktop displays"
  },
} as const;

export type SiteConfig = typeof siteConfig;
