/**
 * Breadcrumb Navigation Component
 *
 * Displays breadcrumb trail for current page location.
 * KENZ dark luxury styling with champagne accent on hover.
 */

import { Link } from 'react-router';
import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Optional href (if not provided, renders as plain text) */
  href?: string;
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
  /** Additional CSS classes */
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;

          return (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && (
                <span className="select-none font-sans text-[9px] text-foreground/20" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    'font-sans text-[10px] uppercase tracking-[0.1em]',
                    isLast ? 'text-foreground/55' : 'text-foreground/30',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="font-sans text-[10px] uppercase tracking-[0.1em] text-foreground/30 transition-colors duration-200 hover:text-kenz-champagne/70"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
