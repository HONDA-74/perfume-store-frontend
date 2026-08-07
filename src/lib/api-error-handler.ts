import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types';

/**
 * Normalized API error structure for consistent error handling across the app.
 * Preserves useful backend information while providing predictable shape.
 */
export interface NormalizedApiError {
  /** HTTP status code */
  status: number;
  
  /** User-facing error message */
  message: string;
  
  /** Error type for programmatic handling */
  type: 'network' | 'timeout' | 'validation' | 'unauthorized' | 'forbidden' | 'not_found' | 'conflict' | 'rate_limit' | 'server' | 'unknown';
  
  /** Validation errors from backend (422) */
  validationErrors?: Record<string, string[]>;
  
  /** Backend error code if provided */
  code?: string;
  
  /** Original error for debugging */
  originalError?: unknown;
}

/**
 * Normalizes Axios errors into a consistent structure.
 * Handles all common HTTP error codes and network issues.
 * 
 * Backend error envelope (per AI_RULES.md §19):
 * {
 *   success: false,
 *   message: string,
 *   errors?: unknown[]
 * }
 */
export function handleApiError(error: AxiosError): NormalizedApiError {
  // Network error (no response received)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return {
        status: 0,
        message: 'Request timed out. Please check your connection and try again.',
        type: 'timeout',
        originalError: error,
      };
    }
    
    return {
      status: 0,
      message: 'Network error. Please check your internet connection.',
      type: 'network',
      originalError: error,
    };
  }

  const { status, data } = error.response;
  const backendError = data as ApiErrorResponse;

  // Extract message from backend envelope
  const message = backendError?.message || getDefaultErrorMessage(status);

  // 400 - Bad Request
  if (status === 400) {
    return {
      status,
      message,
      type: 'validation',
      originalError: error,
    };
  }

  // 401 - Unauthorized
  if (status === 401) {
    return {
      status,
      message: message || 'You must be logged in to access this resource.',
      type: 'unauthorized',
      originalError: error,
    };
  }

  // 403 - Forbidden
  if (status === 403) {
    return {
      status,
      message: message || 'You do not have permission to access this resource.',
      type: 'forbidden',
      originalError: error,
    };
  }

  // 404 - Not Found
  if (status === 404) {
    return {
      status,
      message: message || 'The requested resource was not found.',
      type: 'not_found',
      originalError: error,
    };
  }

  // 409 - Conflict
  if (status === 409) {
    return {
      status,
      message,
      type: 'conflict',
      originalError: error,
    };
  }

  // 422 - Validation Error (Unprocessable Entity)
  if (status === 422) {
    const validationErrors = extractValidationErrors(backendError);
    return {
      status,
      message: message || 'Validation failed. Please check your input.',
      type: 'validation',
      validationErrors,
      originalError: error,
    };
  }

  // 429 - Too Many Requests (Rate Limiting)
  if (status === 429) {
    return {
      status,
      message: message || 'Too many requests. Please slow down and try again later.',
      type: 'rate_limit',
      originalError: error,
    };
  }

  // 500+ - Server Errors
  if (status >= 500) {
    return {
      status,
      message: message || 'An unexpected server error occurred. Please try again later.',
      type: 'server',
      originalError: error,
    };
  }

  // Fallback for unknown status codes
  return {
    status,
    message: message || 'An unexpected error occurred.',
    type: 'unknown',
    originalError: error,
  };
}

/**
 * Extracts validation errors from backend response.
 * Backend may provide errors in various formats - normalize them.
 */
function extractValidationErrors(
  backendError: ApiErrorResponse
): Record<string, string[]> | undefined {
  const errors = backendError?.errors;
  if (!errors || !Array.isArray(errors)) {
    return undefined;
  }

  // Backend errors format (NestJS class-validator):
  // errors: [{ property: string, constraints: Record<string, string> }]
  const validationErrors: Record<string, string[]> = {};

  type ValidationErrorItem = {
    property?: string;
    constraints?: Record<string, string>;
  };

  errors.forEach((err) => {
    if (typeof err === 'object' && err !== null) {
      const validationError = err as ValidationErrorItem;
      if (validationError.property && validationError.constraints) {
        validationErrors[validationError.property] = Object.values(validationError.constraints);
      }
    }
  });

  return Object.keys(validationErrors).length > 0 ? validationErrors : undefined;
}

/**
 * Default error messages by status code.
 */
function getDefaultErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Bad request. Please check your input.',
    401: 'Authentication required.',
    403: 'Access denied.',
    404: 'Resource not found.',
    409: 'This action conflicts with existing data.',
    422: 'Validation failed.',
    429: 'Too many requests.',
    500: 'Internal server error.',
    502: 'Bad gateway.',
    503: 'Service unavailable.',
    504: 'Gateway timeout.',
  };

  return messages[status] || 'An error occurred.';
}

/**
 * Type guard to check if error is NormalizedApiError.
 */
export function isNormalizedApiError(error: unknown): error is NormalizedApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'message' in error &&
    'type' in error
  );
}
