/**
 * Quantity Selector Component
 *
 * Increment/decrement input for product quantities.
 * Pure presentation component with controlled value.
 */

import { cn } from '@/lib/cn';

export interface QuantitySelectorProps {
  /** Current quantity value */
  value: number;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Additional CSS classes */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
  disabled = false,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (!disabled && value > min) {
      onChange(Math.max(min, value - 1));
    }
  };

  const handleIncrement = () => {
    if (!disabled && value < max) {
      onChange(Math.min(max, value + 1));
    }
  };

  const isAtMin = value <= min;
  const isAtMax = value >= max;

  return (
    <div
      className={cn(
        'inline-flex h-9 items-center overflow-hidden rounded-[2px] border border-border',
        disabled && 'opacity-50',
        className,
      )}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || isAtMin}
        className={cn(
          'flex h-full w-9 items-center justify-center transition-colors duration-150',
          'text-lg font-light text-muted-foreground hover:bg-accent hover:text-foreground',
          'disabled:cursor-not-allowed disabled:opacity-30',
        )}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className={cn(
          'flex h-full w-9 items-center justify-center border-x border-border',
          'font-sans text-sm font-normal text-foreground/90',
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || isAtMax}
        className={cn(
          'flex h-full w-9 items-center justify-center transition-colors duration-150',
          'text-lg font-light text-muted-foreground hover:bg-accent hover:text-foreground',
          'disabled:cursor-not-allowed disabled:opacity-30',
        )}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
