/**
 * Enum Adapter
 *
 * Provides human-readable labels and UI styling for backend enum values.
 *
 * Backend enums use SCREAMING_SNAKE_CASE (MALE, FEMALE, PENDING, SHIPPED, etc.)
 * UI displays need proper capitalization and semantic styling.
 */

import type { FragranceGender, FragranceConcentration } from '@/types/product.types';
import type { OrderStatus, PaymentStatus } from '@/types/order.types';

/**
 * Gender display labels
 */
export function getGenderLabel(gender: FragranceGender): string {
  const labels: Record<FragranceGender, string> = {
    MALE: 'Masculine',
    FEMALE: 'Feminine',
    UNISEX: 'Unisex',
  };
  return labels[gender] || gender;
}

/**
 * Concentration display labels
 */
export function getConcentrationLabel(concentration: FragranceConcentration): string {
  const labels: Record<FragranceConcentration, string> = {
    PARFUM: 'Parfum',
    EDP: 'Eau de Parfum',
    EDT: 'Eau de Toilette',
    EDC: 'Eau de Cologne',
  };
  return labels[concentration] || concentration;
}

/**
 * Concentration abbreviations
 */
export function getConcentrationAbbr(concentration: FragranceConcentration): string {
  return concentration; // Already abbreviated in backend
}

/**
 * Order status display labels
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  };
  return labels[status] || status;
}

/**
 * Order status badge colors (Tailwind classes)
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    CONFIRMED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    PROCESSING: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    SHIPPED: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    DELIVERED: 'bg-green-500/10 text-green-500 border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
  };
  return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
}

/**
 * Order status icon names (lucide-react)
 */
export function getOrderStatusIcon(status: OrderStatus): string {
  const icons: Record<OrderStatus, string> = {
    PENDING: 'Clock',
    CONFIRMED: 'CheckCircle',
    PROCESSING: 'Package',
    SHIPPED: 'Truck',
    DELIVERED: 'PackageCheck',
    CANCELLED: 'XCircle',
  };
  return icons[status] || 'Circle';
}

/**
 * Payment status display labels
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    UNPAID: 'Unpaid',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
  };
  return labels[status] || status;
}

/**
 * Payment status badge colors (Tailwind classes)
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    UNPAID: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    PAID: 'bg-green-500/10 text-green-500 border-green-500/20',
    FAILED: 'bg-red-500/10 text-red-500 border-red-500/20',
    REFUNDED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  };
  return colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
}

/**
 * Format size (ml) for display
 */
export function formatSize(sizeMl: number | undefined): string {
  if (!sizeMl) return '';
  return `${sizeMl} ml`;
}

/**
 * Filter options for gender (for UI select dropdowns)
 */
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Masculine' },
  { value: 'FEMALE', label: 'Feminine' },
  { value: 'UNISEX', label: 'Unisex' },
] as const;

/**
 * Filter options for concentration
 */
export const CONCENTRATION_OPTIONS = [
  { value: 'PARFUM', label: 'Parfum' },
  { value: 'EDP', label: 'Eau de Parfum' },
  { value: 'EDT', label: 'Eau de Toilette' },
  { value: 'EDC', label: 'Eau de Cologne' },
] as const;

/**
 * Order status options for admin filters
 */
export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
] as const;
