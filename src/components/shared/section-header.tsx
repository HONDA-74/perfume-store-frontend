/**
 * Section Header Component
 *
 * Editorial section header with optional eyebrow, title, and subtitle.
 * KENZ dark luxury styling with Playfair Display serif headings.
 */

import { cn } from '@/lib/cn';

export interface SectionHeaderProps {
  /** Optional eyebrow text above title */
  eyebrow?: string;
  /** Main title (required) */
  title: string;
  /** Optional subtitle/description below title */
  subtitle?: string;
  /** Text alignment */
  align?: 'left' | 'center';
  /** Additional CSS classes */
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'left', className }: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={cn('flex flex-col gap-3', alignClass, className)}>
      {eyebrow && (
        <span className="text-caption-kenz font-sans font-medium uppercase tracking-[0.2em] text-kenz-champagne/70">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-h2 font-normal text-foreground/95">{title}</h2>
      {subtitle && (
        <p className="text-body-md max-w-md font-light text-muted-foreground/45">{subtitle}</p>
      )}
    </div>
  );
}
