/**
 * AI API service.
 * Matches backend AI endpoints exactly.
 * 
 * Backend endpoints:
 * POST /api/v1/ai/chat (normal)
 * POST /api/v1/ai/chat/stream (streaming with SSE)
 */

import { apiClient } from '@/lib';
import type {
  ApiSuccessResponse,
  AIChatRequest,
  AIChatResponse,
  AIChatStreamChunk,
} from '@/types';

/**
 * Send AI chat message (normal response).
 */
export async function sendChatMessage(
  payload: AIChatRequest
): Promise<AIChatResponse> {
  const { data } = await apiClient.post<ApiSuccessResponse<AIChatResponse>>(
    '/ai/chat',
    payload
  );
  return data.data;
}

/**
 * Send AI chat message with streaming response.
 * Uses Server-Sent Events (SSE) for real-time streaming.
 * 
 * @param payload Chat request with messages
 * @param onChunk Callback for each streamed chunk
 * @param onError Callback for errors
 * @param onComplete Callback when stream completes
 * @returns Abort function to cancel the stream
 */
export function sendChatMessageStream(
  payload: AIChatRequest,
  onChunk: (chunk: AIChatStreamChunk) => void,
  onError?: (error: Error) => void,
  onComplete?: () => void
): () => void {
  const controller = new AbortController();
  const { signal } = controller;

  // Use fetch for SSE streaming (axios doesn't support it well)
  const baseURL = apiClient.defaults.baseURL || '';
  const url = `${baseURL}/ai/chat/stream`;

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      // TODO: Add authorization header when auth is implemented
    },
    body: JSON.stringify(payload),
    signal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable');
      }

      // Read stream
      const readStream = (): Promise<void> => {
        return reader.read().then(({ done, value }) => {
          if (done) {
            onComplete?.();
            return;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          lines.forEach((line) => {
            if (line.startsWith('data: ')) {
              const data = line.slice(6); // Remove 'data: ' prefix
              if (data === '[DONE]') {
                onComplete?.();
                return;
              }

              try {
                const parsed = JSON.parse(data) as AIChatStreamChunk;
                onChunk(parsed);
              } catch (err) {
                console.error('Failed to parse SSE chunk:', err);
              }
            }
          });

          return readStream();
        });
      };

      return readStream();
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        onError?.(error instanceof Error ? error : new Error(String(error)));
      }
    });

  // Return abort function
  return () => controller.abort();
}
