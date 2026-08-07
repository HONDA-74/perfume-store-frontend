import { create } from 'zustand';

/**
 * Example Zustand store establishing the project's store pattern:
 * plain `create<State>()`, no persistence/middleware unless a store
 * specifically needs it, one store per concern.
 *
 * This store intentionally holds only transient, cross-cutting UI state
 * (e.g. "is the mobile nav drawer open") — never domain/business state
 * like cart contents or auth session, which belong to their own feature
 * once `src/features/*` is implemented, per AI_RULES.md §1 Single
 * Responsibility applied to the frontend.
 */
interface UIState {
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileNavOpen: false,
  openMobileNav: () => set({ isMobileNavOpen: true }),
  closeMobileNav: () => set({ isMobileNavOpen: false }),
}));
