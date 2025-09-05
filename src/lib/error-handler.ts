/**
 * Error Handler Service
 * Centralized error handling for API responses and user-friendly error messages
 */

import { t } from '@/i18n'

export interface BackendErrorResponse {
  success: false
  error_type: string
  error_message: string
  details?: any
}

export interface ProcessedError {
  message: string
  type: string
  statusCode?: number
  isUserFriendly: boolean
  originalError?: any
}

/**
 * Error categories for better error handling
 */
export enum ErrorCategory {
  AUTHENTICATION = 'AUTHENTICATION',
  VALIDATION = 'VALIDATION',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
  AI_SERVICES = 'AI_SERVICES',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  SYSTEM = 'SYSTEM',
  SUBSCRIPTION = 'SUBSCRIPTION',
  PERMISSIONS = 'PERMISSIONS',
  API = 'API',
  NETWORK = 'NETWORK',
  UNKNOWN = 'UNKNOWN'
}

/**
 * HTTP status code to error category mapping
 */
const STATUS_CODE_CATEGORIES: Record<number, ErrorCategory> = {
  400: ErrorCategory.VALIDATION,
  401: ErrorCategory.AUTHENTICATION,
  403: ErrorCategory.PERMISSIONS,
  404: ErrorCategory.VALIDATION,
  408: ErrorCategory.NETWORK,
  413: ErrorCategory.VALIDATION,
  422: ErrorCategory.VALIDATION,
  429: ErrorCategory.API,
  500: ErrorCategory.SYSTEM,
  502: ErrorCategory.INFRASTRUCTURE,
  503: ErrorCategory.INFRASTRUCTURE,
  504: ErrorCategory.NETWORK,
}

/**
 * Error type to category mapping based on backend error types
 */
const ERROR_TYPE_CATEGORIES: Record<string, ErrorCategory> = {
  // Authentication errors
  UNAUTHENTICATED: ErrorCategory.AUTHENTICATION,
  UNAUTHORIZED: ErrorCategory.AUTHENTICATION,
  INVALID_TOKEN: ErrorCategory.AUTHENTICATION,
  TOKEN_EXPIRED: ErrorCategory.AUTHENTICATION,
  INVALID_CREDENTIALS: ErrorCategory.AUTHENTICATION,
  ACCOUNT_DISABLED: ErrorCategory.AUTHENTICATION,
  ACCOUNT_LOCKED: ErrorCategory.AUTHENTICATION,
  INSUFFICIENT_PERMISSIONS: ErrorCategory.PERMISSIONS,
  ROLE_NOT_FOUND: ErrorCategory.AUTHENTICATION,
  USER_ROLE_NOT_FOUND: ErrorCategory.AUTHENTICATION,
  ROLE_ALREADY_ASSIGNED: ErrorCategory.AUTHENTICATION,
  ROLE_ASSIGNMENT_FAILED: ErrorCategory.AUTHENTICATION,
  ROLE_REMOVAL_FAILED: ErrorCategory.AUTHENTICATION,
  ADMIN_ACCESS_REQUIRED: ErrorCategory.PERMISSIONS,
  USER_ACCESS_REQUIRED: ErrorCategory.AUTHENTICATION,
  DATA_ACCESS_DENIED: ErrorCategory.PERMISSIONS,
  OWNER_ACCESS_REQUIRED: ErrorCategory.PERMISSIONS,

  // Verification errors
  NOT_VERIFIED_USER: ErrorCategory.AUTHENTICATION,
  EMAIL_ALREADY_REGISTERED: ErrorCategory.VALIDATION,
  USER_NOT_FOUND: ErrorCategory.VALIDATION,
  INVALID_OTP: ErrorCategory.VALIDATION,
  OTP_EXPIRED: ErrorCategory.VALIDATION,
  OTP_ALREADY_VERIFIED: ErrorCategory.VALIDATION,
  EMAIL_VERIFICATION_REQUIRED: ErrorCategory.AUTHENTICATION,
  EMAIL_NOT_FOUND: ErrorCategory.VALIDATION,
  PASSWORD_RESET_FAILED: ErrorCategory.AUTHENTICATION,
  INVALID_PASSWORD_RESET_TOKEN: ErrorCategory.AUTHENTICATION,

  // Validation errors
  INVALID_INPUT: ErrorCategory.VALIDATION,
  MISSING_REQUIRED_FIELD: ErrorCategory.VALIDATION,
  INVALID_EMAIL_FORMAT: ErrorCategory.VALIDATION,
  INVALID_PASSWORD_FORMAT: ErrorCategory.VALIDATION,
  PASSWORD_TOO_WEAK: ErrorCategory.VALIDATION,
  INVALID_USERNAME_FORMAT: ErrorCategory.VALIDATION,
  QUERY_TOO_LONG: ErrorCategory.VALIDATION,
  INVALID_MODEL: ErrorCategory.VALIDATION,
  INVALID_UUID: ErrorCategory.VALIDATION,
  INVALID_ENCODED_UUID: ErrorCategory.VALIDATION,
  INVALID_ENCODED_USER_ID: ErrorCategory.VALIDATION,

  // Business logic errors
  PLAN_LIMIT_EXCEEDED: ErrorCategory.BUSINESS_LOGIC,
  DAILY_QUOTA_EXCEEDED: ErrorCategory.BUSINESS_LOGIC,
  MONTHLY_QUOTA_EXCEEDED: ErrorCategory.BUSINESS_LOGIC,
  INSUFFICIENT_TOKENS: ErrorCategory.BUSINESS_LOGIC,
  UNETHICAL_QUERY: ErrorCategory.BUSINESS_LOGIC,
  CONTENT_GENERATION_FAILED: ErrorCategory.BUSINESS_LOGIC,
  COST_ESTIMATION_FAILED: ErrorCategory.BUSINESS_LOGIC,
  QUERY_CATEGORIZATION_FAILED: ErrorCategory.BUSINESS_LOGIC,

  // AI service errors
  AI_SERVICE_UNAVAILABLE: ErrorCategory.AI_SERVICES,
  AI_PROVIDER_ERROR: ErrorCategory.AI_SERVICES,
  AI_MODEL_NOT_AVAILABLE: ErrorCategory.AI_SERVICES,
  AI_RATE_LIMIT_EXCEEDED: ErrorCategory.AI_SERVICES,
  AI_API_KEY_INVALID: ErrorCategory.AI_SERVICES,
  AI_API_QUOTA_EXCEEDED: ErrorCategory.AI_SERVICES,
  AI_API_KEY_NOT_CONFIGURED: ErrorCategory.AI_SERVICES,
  EMPTY_QUERY_PROVIDED: ErrorCategory.VALIDATION,
  AI_REQUEST_FAILED: ErrorCategory.AI_SERVICES,
  AI_RESPONSE_PARSE_FAILED: ErrorCategory.AI_SERVICES,
  AI_NO_RESPONSE_GENERATED: ErrorCategory.AI_SERVICES,
  UNETHICAL_CONTENT: ErrorCategory.BUSINESS_LOGIC,

  // Infrastructure errors
  DATABASE_CONNECTION_FAILED: ErrorCategory.INFRASTRUCTURE,
  DATABASE_QUERY_FAILED: ErrorCategory.INFRASTRUCTURE,
  REDIS_CONNECTION_FAILED: ErrorCategory.INFRASTRUCTURE,
  REDIS_OPERATION_FAILED: ErrorCategory.INFRASTRUCTURE,
  EMAIL_SEND_FAILED: ErrorCategory.INFRASTRUCTURE,
  EMAIL_SERVICE_UNAVAILABLE: ErrorCategory.INFRASTRUCTURE,
  FILE_UPLOAD_FAILED: ErrorCategory.INFRASTRUCTURE,
  FILE_NOT_FOUND: ErrorCategory.INFRASTRUCTURE,
  FILE_TOO_LARGE: ErrorCategory.INFRASTRUCTURE,

  // System errors
  INTERNAL_SERVER_ERROR: ErrorCategory.SYSTEM,
  SERVICE_UNAVAILABLE: ErrorCategory.SYSTEM,
  GATEWAY_TIMEOUT: ErrorCategory.SYSTEM,
  REQUEST_TIMEOUT: ErrorCategory.SYSTEM,
  TOO_MANY_REQUESTS: ErrorCategory.API,
  MAINTENANCE_MODE: ErrorCategory.SYSTEM,

  // Subscription errors
  SUBSCRIPTION_EXPIRED: ErrorCategory.SUBSCRIPTION,
  SUBSCRIPTION_NOT_FOUND: ErrorCategory.SUBSCRIPTION,
  PLAN_NOT_FOUND: ErrorCategory.SUBSCRIPTION,
  PLAN_ALREADY_EXISTS: ErrorCategory.SUBSCRIPTION,
  PLAN_ALLOWANCE_NOT_FOUND: ErrorCategory.SUBSCRIPTION,
  CUSTOM_PLAN_PRICING_NOT_FOUND: ErrorCategory.SUBSCRIPTION,
  CUSTOM_PLAN_RULE_NOT_FOUND: ErrorCategory.SUBSCRIPTION,
  USER_SUBSCRIPTION_NOT_FOUND: ErrorCategory.SUBSCRIPTION,
  USER_USAGE_NOT_FOUND: ErrorCategory.SUBSCRIPTION,
  INSUFFICIENT_ALLOWANCE: ErrorCategory.SUBSCRIPTION,
  CUSTOM_PLAN_ABUSE_DETECTED: ErrorCategory.SUBSCRIPTION,
  PAYMENT_FAILED: ErrorCategory.SUBSCRIPTION,
  PAYMENT_METHOD_INVALID: ErrorCategory.SUBSCRIPTION,
  BILLING_CYCLE_ERROR: ErrorCategory.SUBSCRIPTION,

  // Permission errors
  FEATURE_NOT_AVAILABLE: ErrorCategory.PERMISSIONS,
  PERMISSION_DENIED: ErrorCategory.PERMISSIONS,
  ROLE_INSUFFICIENT: ErrorCategory.PERMISSIONS,
  ACCESS_RESTRICTED: ErrorCategory.PERMISSIONS,

  // API errors
  API_VERSION_DEPRECATED: ErrorCategory.API,
  API_RATE_LIMIT_EXCEEDED: ErrorCategory.API,
  EXTERNAL_SERVICE_ERROR: ErrorCategory.API,
  WEBHOOK_DELIVERY_FAILED: ErrorCategory.API,
}

/**
 * Get error category from error type or status code
 */
function getErrorCategory(errorType?: string, statusCode?: number): ErrorCategory {
  if (errorType && ERROR_TYPE_CATEGORIES[errorType]) {
    return ERROR_TYPE_CATEGORIES[errorType]
  }
  
  if (statusCode && STATUS_CODE_CATEGORIES[statusCode]) {
    return STATUS_CODE_CATEGORIES[statusCode]
  }
  
  return ErrorCategory.UNKNOWN
}

/**
 * Check if error should trigger automatic retry
 */
export function shouldRetryError(error: ProcessedError): boolean {
  const retryableCategories = [
    ErrorCategory.NETWORK,
    ErrorCategory.INFRASTRUCTURE,
    ErrorCategory.SYSTEM,
    ErrorCategory.AI_SERVICES
  ]
  
  const retryableStatusCodes = [408, 429, 500, 502, 503, 504]
  
  return (
    retryableCategories.indexOf(error.type as ErrorCategory) !== -1 ||
    (error.statusCode ? retryableStatusCodes.indexOf(error.statusCode) !== -1 : false)
  )
}

/**
 * Check if error requires user authentication
 */
export function requiresAuthentication(error: ProcessedError): boolean {
  const authErrorTypes = [
    'UNAUTHENTICATED',
    'INVALID_TOKEN',
    'TOKEN_EXPIRED',
    'INVALID_CREDENTIALS'
  ]
  
  return (
    authErrorTypes.indexOf(error.type) !== -1 ||
    error.statusCode === 401
  )
}

/**
 * Check if error is a validation error
 */
export function isValidationError(error: ProcessedError): boolean {
  return (
    error.type === ErrorCategory.VALIDATION ||
    error.statusCode === 400 ||
    error.statusCode === 422
  )
}

/**
 * Process backend error response
 */
export function processBackendError(
  errorResponse: BackendErrorResponse,
  statusCode?: number
): ProcessedError {
  const { error_type, error_message, details } = errorResponse
  
  // Get user-friendly message from i18n
  const userFriendlyMessage = t(`errors.${error_type}`)
  
  // If translation not found, use the error_message from backend or a generic message
  const message = userFriendlyMessage !== `errors.${error_type}` 
    ? userFriendlyMessage 
    : (error_message || t('errors.UNKNOWN_ERROR'))
  
  const category = getErrorCategory(error_type, statusCode)
  
  return {
    message,
    type: error_type,
    statusCode,
    isUserFriendly: true,
    originalError: {
      error_type,
      error_message,
      details
    }
  }
}

/**
 * Process generic error (non-backend errors)
 */
export function processGenericError(
  error: any,
  statusCode?: number
): ProcessedError {
  let message: string
  let type: string
  
  if (error instanceof Error) {
    message = error.message
    type = 'GENERIC_ERROR'
  } else if (typeof error === 'string') {
    message = error
    type = 'STRING_ERROR'
  } else {
    message = t('errors.UNKNOWN_ERROR')
    type = 'UNKNOWN_ERROR'
  }
  
  // Check if it's a network error
  if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
    message = t('errors.NETWORK_ERROR')
    type = 'NETWORK_ERROR'
  }
  
  // Check if it's a timeout error
  if (message.includes('timeout') || message.includes('AbortError')) {
    message = t('errors.REQUEST_TIMEOUT')
    type = 'REQUEST_TIMEOUT'
  }
  
  const category = getErrorCategory(type, statusCode)
  
  return {
    message,
    type,
    statusCode,
    isUserFriendly: true,
    originalError: error
  }
}

/**
 * Main error processing function
 */
export function processError(
  error: any,
  statusCode?: number
): ProcessedError {
  // Check if it's a backend error response
  if (
    error &&
    typeof error === 'object' &&
    error.success === false &&
    error.error_type &&
    error.error_message
  ) {
    return processBackendError(error as BackendErrorResponse, statusCode)
  }
  
  // Process as generic error
  return processGenericError(error, statusCode)
}

/**
 * Create error handler for API responses
 */
export function createApiErrorHandler() {
  return {
    /**
     * Handle API response error
     */
    handleResponseError: (response: Response, errorData?: any): ProcessedError => {
      const statusCode = response.status
      
      if (errorData) {
        return processError(errorData, statusCode)
      }
      
      // Create a generic error based on status code
      let message: string
      switch (statusCode) {
        case 400:
          message = t('errors.VALIDATION_ERROR')
          break
        case 401:
          message = t('errors.UNAUTHENTICATED')
          break
        case 403:
          message = t('errors.UNAUTHORIZED')
          break
        case 404:
          message = t('errors.USER_NOT_FOUND')
          break
        case 408:
          message = t('errors.REQUEST_TIMEOUT')
          break
        case 429:
          message = t('errors.TOO_MANY_REQUESTS')
          break
        case 500:
          message = t('errors.INTERNAL_SERVER_ERROR')
          break
        case 502:
        case 503:
          message = t('errors.SERVICE_UNAVAILABLE')
          break
        case 504:
          message = t('errors.GATEWAY_TIMEOUT')
          break
        default:
          message = t('errors.UNKNOWN_ERROR')
      }
      
      return {
        message,
        type: `HTTP_${statusCode}`,
        statusCode,
        isUserFriendly: true,
        originalError: { status: statusCode, statusText: response.statusText }
      }
    },
    
    /**
     * Handle network/fetch errors
     */
    handleNetworkError: (error: any): ProcessedError => {
      return processGenericError(error)
    }
  }
}

/**
 * Default error handler instance
 */
export const errorHandler = createApiErrorHandler()
