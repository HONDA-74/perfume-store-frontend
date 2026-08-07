import { useSyncExternalStore } from 'react';

/**
 * Generic, reusable media-query hook — pure browser-API utility, no
 * feature/business logic. Pairs with `BREAKPOINTS` in
 * `src/constants/app.constants.ts`, e.g.:
 *
 *   const isDesktop = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false, // SSR fallback — not used with Vite's client-only render, kept for safety.
  );
}
