/**
 * Pure, generic, side-effect-free helpers with no domain/business knowledge
 * (mirrors the backend's `shared/` philosophy — SYSTEM_ARCHITECTURE.md §5).
 * Feature-specific formatting (currency, product-specific labels, etc.)
 * belongs inside that feature once it exists, not here.
 */

/** No-op function — useful as a default prop value for optional callbacks. */
export function noop(): void {}

/** Type guard: narrows `T | null | undefined` to `T`. */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/** Clamps a number between a minimum and maximum (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
