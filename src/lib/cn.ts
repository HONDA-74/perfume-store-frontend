import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges conditional class names (clsx) and resolves conflicting Tailwind
 * utility classes (tailwind-merge) — the standard pairing referenced in
 * Design_System.md §2.3 ("Always use cn() ... when computing conditional
 * component classes"). Every shared UI component should route its
 * `className` prop through this.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
