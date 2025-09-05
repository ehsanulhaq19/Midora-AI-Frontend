/**
 * API Interceptors
 * Handles automatic addition of authorization headers and other request/response processing
 */

import { appConfig } from '@/config/app'
import { COOKIE_NAMES } from '@/lib/auth'
import { errorHandler, ProcessedError } from '@/lib/error-handler'

/**
 * Get access token from cookies
 */
function getAccessToken(): string | null {
  if (typeof document === 'undefined') return null
  console.log('Getting access token from cookies', COOKIE_NAMES)
  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === COOKIE_NAMES.ACCESS_TOKEN) {
      const token = decodeURIComponent(value)
      console.log('Found access token in cookies:', token ? 'Yes' : 'No')
      return token
    }
  }
  console.log('No access token found in cookies')
  return null
}

/**
 * Check if the URL is a backend API call
 */
function isBackendApiCall(url: string): boolean {
  return url.startsWith(appConfig.backendUrl)
}

/**
 * Request interceptor to add authorization headers
 */
export function requestInterceptor(url: string, options: RequestInit = {}): RequestInit {
  // Only add authorization header for backend API calls
  if (isBackendApiCall(url)) {
    const accessToken = getAccessToken()
    
    if (accessToken) {
      console.log('Adding authorization header to request:', url)
      return {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    } else {
      console.log('No access token available for request:', url)
    }
  }
  
  return options
}

/**
 * Response interceptor to handle common response processing
 */
export function responseInterceptor(response: Response): Response {
  // Add any common response processing here
  // For example, logging, error handling, etc.
  
  return response
}

/**
 * Enhanced response interceptor that processes error responses
 */
export async function enhancedResponseInterceptor(response: Response): Promise<Response> {
  // If response is not ok, we'll let the base API client handle it
  // This interceptor is mainly for logging and monitoring
  if (!response.ok) {
    console.warn(`API Error Response: ${response.status} ${response.statusText}`)
  }
  
  return response
}

/**
 * Error interceptor to handle common errors
 */
export function errorInterceptor(error: any): any {
  // Add any common error processing here
  // For example, logging, user notifications, etc.
  
  console.error('API Error:', error)
  return error
}

/**
 * Enhanced error interceptor that processes errors with our error handler
 */
export function enhancedErrorInterceptor(error: any): ProcessedError {
  console.error('API Error:', error)
  
  // Process the error using our error handler
  return errorHandler.handleNetworkError(error)
}

/**
 * Create a fetch wrapper with interceptors
 */
export function createFetchWithInterceptors() {
  const originalFetch = window.fetch
  
  return async (url: string, options: RequestInit = {}) => {
    try {
      // Apply request interceptor
      const interceptedOptions = requestInterceptor(url, options)
      
      // Make the request
      const response = await originalFetch(url, interceptedOptions)
      
      // Apply response interceptor
      const interceptedResponse = responseInterceptor(response)
      
      return interceptedResponse
    } catch (error) {
      // Apply error interceptor
      throw errorInterceptor(error)
    }
  }
}

/**
 * Initialize interceptors
 * This should be called once when the app starts
 */
export function initializeInterceptors() {
  if (typeof window !== 'undefined') {
    // Replace the global fetch with our intercepted version
    window.fetch = createFetchWithInterceptors()
  }
}
