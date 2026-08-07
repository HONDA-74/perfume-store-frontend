/**
 * Generic, feature-agnostic constants. Feature-specific constants belong
 * inside that feature's own `constants/` folder once features exist
 * (mirrors the backend's AI_RULES.md §8 folder convention).
 */

/** Design_System.md §1.8 breakpoint tokens, mirrored for JS-side media logic. */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/** Matches the backend's AI_RULES.md §28 pagination defaults (API_BLUEPRINT.md §1.4). */
export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 50,
} as const;
