/**
 * Error handling utilities
 * Maps backend error types to user-friendly messages using i18n
 */

import { t } from '@/i18n'

export interface ApiError {
  error_type: string
  error_message: string
  status?: number
}

/**
 * Maps backend error types to user-friendly error messages
 */
export const getErrorMessage = (error: ApiError | Error | string): string => {
  // Handle string errors
  if (typeof error === 'string') {
    return error
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message
  }

  // Handle API errors with error_type
  if (error && typeof error === 'object' && 'error_type' in error) {
    const apiError = error as ApiError
    
    // Map backend error types to i18n keys
    const errorTypeMap: Record<string, string> = {
      // Authentication errors
      'UNAUTHENTICATED': 'errors.UNAUTHENTICATED',
      'UNAUTHORIZED': 'errors.UNAUTHORIZED',
      'INVALID_TOKEN': 'errors.INVALID_TOKEN',
      'TOKEN_EXPIRED': 'errors.TOKEN_EXPIRED',
      'INVALID_CREDENTIALS': 'errors.INVALID_CREDENTIALS',
      'ACCOUNT_DISABLED': 'errors.ACCOUNT_DISABLED',
      'ACCOUNT_LOCKED': 'errors.ACCOUNT_LOCKED',
      'INSUFFICIENT_PERMISSIONS': 'errors.INSUFFICIENT_PERMISSIONS',
      
      // User verification and registration errors
      'NOT_VERIFIED_USER': 'errors.NOT_VERIFIED_USER',
      'EMAIL_ALREADY_REGISTERED': 'errors.EMAIL_ALREADY_REGISTERED',
      'USER_NOT_FOUND': 'errors.USER_NOT_FOUND',
      'INVALID_OTP': 'errors.INVALID_OTP',
      'OTP_EXPIRED': 'errors.OTP_EXPIRED',
      'OTP_ALREADY_VERIFIED': 'errors.OTP_ALREADY_VERIFIED',
      'EMAIL_VERIFICATION_REQUIRED': 'errors.EMAIL_VERIFICATION_REQUIRED',
      'EMAIL_NOT_FOUND': 'errors.EMAIL_NOT_FOUND',
      'PASSWORD_RESET_FAILED': 'errors.PASSWORD_RESET_FAILED',
      'INVALID_PASSWORD_RESET_TOKEN': 'errors.INVALID_PASSWORD_RESET_TOKEN',
      
      // Validation errors
      'INVALID_INPUT': 'errors.INVALID_INPUT',
      'MISSING_REQUIRED_FIELD': 'errors.MISSING_REQUIRED_FIELD',
      'INVALID_EMAIL_FORMAT': 'errors.INVALID_EMAIL_FORMAT',
      'INVALID_PASSWORD_FORMAT': 'errors.INVALID_PASSWORD_FORMAT',
      'PASSWORD_TOO_WEAK': 'errors.PASSWORD_TOO_WEAK',
      'INVALID_USERNAME_FORMAT': 'errors.INVALID_USERNAME_FORMAT',
      'QUERY_TOO_LONG': 'errors.QUERY_TOO_LONG',
      'INVALID_MODEL': 'errors.INVALID_MODEL',
      
      // Business logic errors
      'PLAN_LIMIT_EXCEEDED': 'errors.PLAN_LIMIT_EXCEEDED',
      'DAILY_QUOTA_EXCEEDED': 'errors.DAILY_QUOTA_EXCEEDED',
      'MONTHLY_QUOTA_EXCEEDED': 'errors.MONTHLY_QUOTA_EXCEEDED',
      'INSUFFICIENT_TOKENS': 'errors.INSUFFICIENT_TOKENS',
      'UNETHICAL_QUERY': 'errors.UNETHICAL_QUERY',
      'CONTENT_GENERATION_FAILED': 'errors.CONTENT_GENERATION_FAILED',
      
      // AI Service errors
      'AI_SERVICE_UNAVAILABLE': 'errors.AI_SERVICE_UNAVAILABLE',
      'AI_PROVIDER_ERROR': 'errors.AI_PROVIDER_ERROR',
      'AI_MODEL_NOT_AVAILABLE': 'errors.AI_MODEL_NOT_AVAILABLE',
      'AI_RATE_LIMIT_EXCEEDED': 'errors.AI_RATE_LIMIT_EXCEEDED',
      'AI_API_KEY_INVALID': 'errors.AI_API_KEY_INVALID',
      'AI_API_QUOTA_EXCEEDED': 'errors.AI_API_QUOTA_EXCEEDED',
      'AI_API_KEY_NOT_CONFIGURED': 'errors.AI_API_KEY_NOT_CONFIGURED',
      'EMPTY_QUERY_PROVIDED': 'errors.EMPTY_QUERY_PROVIDED',
      'AI_REQUEST_FAILED': 'errors.AI_REQUEST_FAILED',
      'AI_RESPONSE_PARSE_FAILED': 'errors.AI_RESPONSE_PARSE_FAILED',
      'AI_NO_RESPONSE_GENERATED': 'errors.AI_NO_RESPONSE_GENERATED',
      'UNETHICAL_CONTENT': 'errors.UNETHICAL_CONTENT',
      
      // Email Service errors
      'EMAIL_SEND_FAILED': 'errors.EMAIL_SEND_FAILED',
      'EMAIL_SERVICE_UNAVAILABLE': 'errors.EMAIL_SERVICE_UNAVAILABLE',
      'INVALID_EMAIL_ADDRESS': 'errors.INVALID_EMAIL_ADDRESS',
      'EMAIL_TEMPLATE_NOT_FOUND': 'errors.EMAIL_TEMPLATE_NOT_FOUND',
      
      // System errors
      'INTERNAL_SERVER_ERROR': 'errors.INTERNAL_SERVER_ERROR',
      'SERVICE_UNAVAILABLE': 'errors.SERVICE_UNAVAILABLE',
      'GATEWAY_TIMEOUT': 'errors.GATEWAY_TIMEOUT',
      'REQUEST_TIMEOUT': 'errors.REQUEST_TIMEOUT',
      'TOO_MANY_REQUESTS': 'errors.TOO_MANY_REQUESTS',
      'MAINTENANCE_MODE': 'errors.MAINTENANCE_MODE',
    }

    const i18nKey = errorTypeMap[apiError.error_type]
    
    if (i18nKey) {
      try {
        return t(i18nKey)
      } catch (translationError) {
        console.warn(`Translation not found for error type: ${apiError.error_type}`)
        return apiError.error_message || 'An unexpected error occurred'
      }
    }
    
    // Fallback to backend error message if no mapping found
    return apiError.error_message || 'An unexpected error occurred'
  }

  // Fallback for unknown error types
  return 'An unexpected error occurred'
}

/**
 * Handles API errors and returns user-friendly messages
 */
export const handleApiError = (error: any): string => {
  console.error('API Error:', error)
  
  // Handle network errors
  if (!error.detail) {
    return t('errors.NETWORK_ERROR')
  }
  
  const data = error.detail
  
  if (data && typeof data === 'object') {
    return getErrorMessage(data)
  }
  
  return t('errors.UNKNOWN_ERROR')
}

/**
 * Creates a standardized error object
 */
export const createError = (message: string, type?: string): ApiError => ({
  error_type: type || 'UNKNOWN_ERROR',
  error_message: message
})