/**
 * React Query hooks for AI chat.
 */

import { useMutation } from '@tanstack/react-query';
import { useState, useCallback, useRef } from 'react';
import * as aiApi from '@/services/api/ai';
import type { AIChatRequest, AIChatStreamChunk } from '@/types';

/**
 * Send AI chat message (normal response).
 */
export function useSendChatMessage() {
  return useMutation({
    mutationFn: (payload: AIChatRequest) => aiApi.sendChatMessage(payload),
  });
}

/**
 * Send AI chat message with streaming response.
 * Returns state management for the streaming process.
 */
export function useSendChatMessageStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<(() => void) | null>(null);

  const sendMessage = useCallback((payload: AIChatRequest) => {
    setIsStreaming(true);
    setStreamedContent('');
    setError(null);

    const handleChunk = (chunk: AIChatStreamChunk) => {
      setStreamedContent((prev) => prev + chunk.delta);
      
      if (chunk.done) {
        setIsStreaming(false);
      }
    };

    const handleError = (err: Error) => {
      setError(err);
      setIsStreaming(false);
    };

    const handleComplete = () => {
      setIsStreaming(false);
    };

    abortRef.current = aiApi.sendChatMessageStream(
      payload,
      handleChunk,
      handleError,
      handleComplete
    );
  }, []);

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStreamedContent('');
    setError(null);
    setIsStreaming(false);
  }, []);

  return {
    sendMessage,
    abort,
    reset,
    isStreaming,
    streamedContent,
    error,
  };
}
