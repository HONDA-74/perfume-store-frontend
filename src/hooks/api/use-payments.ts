/**
 * React Query hooks for payments.
 */

import { useMutation } from '@tanstack/react-query';
import * as paymentsApi from '@/services/api/payments';
import type { CreatePaymentIntentDto, RefundOrderDto } from '@/types';

/**
 * Create payment intent mutation.
 */
export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (payload: CreatePaymentIntentDto) =>
      paymentsApi.createPaymentIntent(payload),
  });
}

/**
 * Refund order mutation (admin only).
 */
export function useRefundOrder() {
  return useMutation({
    mutationFn: ({ orderId, payload }: { orderId: string; payload?: RefundOrderDto }) =>
      paymentsApi.refundOrder(orderId, payload),
  });
}
