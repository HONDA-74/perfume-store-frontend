/**
 * Payment domain types.
 * Matches backend payments module API contracts exactly.
 */

/**
 * Create payment intent request.
 */
export interface CreatePaymentIntentDto {
  orderId: string;
}

/**
 * Payment intent response from Stripe.
 */
export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
}

/**
 * Refund request (admin only).
 */
export interface RefundOrderDto {
  orderId: string;
  reason?: string;
}
