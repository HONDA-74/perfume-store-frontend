/**
 * AI domain types.
 * Matches backend AI module API contracts exactly.
 */

/**
 * Product recommendation from AI.
 * Backend: ProductRecommendationDto
 */
export interface AIProductRecommendation {
  productId: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  reason: string;
  confidenceScore: number;
}

/**
 * AI chat request.
 * Backend: ChatRequestDto
 */
export interface AIChatRequest {
  message: string;
  conversationId?: string;
}

/**
 * AI chat response (normal endpoint).
 * Backend: ChatResponseDto
 */
export interface AIChatResponse {
  conversationId: string;
  message: string;
  recommendations: AIProductRecommendation[];
}

/**
 * AI chat streaming chunk.
 */
export interface AIChatStreamChunk {
  delta: string;
  done: boolean;
}
