/**
 * API Interceptors
 * Handles automatic addition of authorization headers and other request/response processing
 */

import { appConfig } from '@/config/app'
import { handleApiError } from '@/lib/error-handler'
import { tokenManager } from '@/lib/token-manager'
import { handle401WithReload, resetReloadCount } from '@/lib/reload-counter'

/**
 * Get access token using token manager
 */
function getAccessToken(): string | null {
  const token = tokenManager.getAccessToken()
  console.log('Found access token:', token ? 'Yes' : 'No')
  return token
}

/**
 * Get refresh token from token manager
 */
function getRefreshToken(): string | null {
  return tokenManager.getRefreshToken()
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
    const refreshToken = getRefreshToken()
    
    const headers: Record<string, string> = {
      ...options.headers as Record<string, string>,
    }
    
    if (accessToken) {
      console.log('Adding authorization header to request:', url)
      headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      console.log('No access token available for request:', url)
    }
    
    // Note: Refresh token is automatically sent as a cookie with the request
    // when credentials: 'include' is set in the base API client
    if (refreshToken) {
      console.log('✅ Refresh token cookie will be sent with request:', url)
      console.log('Refresh token preview:', refreshToken.substring(0, 20) + '...')
    } else {
      console.log('⚠️ No refresh token cookie available for request:', url)
    }
    
    // Return options with headers only (credentials handled by base client)
    const requestOptions: RequestInit = {
      ...options,
      headers,
    }
    
    return requestOptions
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
    
    // Handle 401 Unauthorized errors with reload logic
    if (response.status === 401) {
      console.error('401 Unauthorized error detected')
      // Trigger reload with retry limit
      handle401WithReload()
    }
  } else {
    // Reset reload counter on successful request
    if (response.status >= 200 && response.status < 300) {
      resetReloadCount()
    }
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
export function enhancedErrorInterceptor(error: any): any {
  console.error('API Error:', error)
  
  // Process the error using our error handler
  return handleApiError(error)
}

/**
 * Create a fetch wrapper with interceptors
 */
export function createFetchWithInterceptors() {
  const originalFetch = window.fetch
  
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    try {
      const url = typeof input === 'string' ? input : input.toString()
      const options = init || {}
      
      // Apply request interceptor
      const interceptedOptions = requestInterceptor(url, options)
      
      // Make the request
      const response = await originalFetch(input, interceptedOptions)
      
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
