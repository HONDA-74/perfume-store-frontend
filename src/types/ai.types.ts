/**
 * AI domain types.
 * Matches backend AI module API contracts exactly.
 */

/**
 * AI chat message.
 */
export interface AIChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * AI chat request.
 */
export interface AIChatRequest {
  messages: AIChatMessage[];
}

/**
 * AI chat response (normal endpoint).
 */
export interface AIChatResponse {
  message: string;
  recommendations?: string[];
}

/**
 * AI chat streaming chunk.
 */
export interface AIChatStreamChunk {
  delta: string;
  done: boolean;
}
