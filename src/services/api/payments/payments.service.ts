/**
 * Payments API service.
 * Matches backend payments endpoints exactly.
 * 
 * Backend endpoints:
 * POST /api/v1/payments/create-intent (customer)
 * POST /api/v1/payments/webhook (Stripe only - not called by frontend)
 * POST /api/v1/payments/refund/:orderId (admin)
 * 
 * IMPORTANT: Webhook is called by Stripe, not exposed in frontend Data Layer.
 */

import { apiClient } from '@/lib';
import type {
  ApiSuccessResponse,
  CreatePaymentIntentDto,
  PaymentIntent,
  RefundOrderDto,
} from '@/types';

/**
 * Create payment intent for order.
 */
export async function createPaymentIntent(
  payload: CreatePaymentIntentDto
): Promise<PaymentIntent> {
  const { data } = await apiClient.post<ApiSuccessResponse<PaymentIntent>>(
    '/payments/create-intent',
    payload
  );
  return data.data;
}

/**
 * Refund order (admin only).
 */
export async function refundOrder(
  orderId: string,
  payload?: RefundOrderDto
): Promise<void> {
  await apiClient.post(`/payments/refund/${orderId}`, payload);
}
