/**
 * Base API client for all backend API calls
 * This file provides the foundation for all API interactions
 */

import { appConfig } from '@/config/app'
import { requestInterceptor } from './interceptors'
import { handleApiError } from '@/lib/error-handler'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
  message?: string
  success?: boolean
  error_type?: string
  error_message?: string
  error_id?: string
  processedError?: {
    error_type: string
    error_message: string
    error_id?: string
    status?: number
  }
}

export interface ApiError {
  error_type: string
  error_message: string
  error_id?: string
  status?: number
}

class BaseApiClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = appConfig.backendUrl
    this.timeout = appConfig.apiTimeout
  }

  /**
   * Process response data according to new backend format
   */
  private processResponseData<T>(responseData: any, response: Response): ApiResponse<T> {
    // Handle new backend response format
    if (responseData && typeof responseData === 'object') {
      if (responseData.success === true && responseData.data !== undefined) {
        // Success response format: { success: true, data: {...} }
        return { 
          data: responseData.data, 
          status: response.status,
          success: true
        }
      } else if (responseData.success === false) {
        // Error response format: { success: false, error_type: "...", error_message: "...", error_id: "..." }
        const errorMessage = handleApiError(responseData || response)
        return { 
          error: errorMessage, 
          status: response.status,
          success: false,
          error_type: responseData.error_type,
          error_message: responseData.error_message,
          error_id: responseData.error_id,
          processedError: {
            error_type: responseData.error_type || 'UNKNOWN_ERROR',
            error_message: responseData.error_message || errorMessage,
            error_id: responseData.error_id,
            status: response.status
          }
        }
      }
    }
    
    // Fallback for legacy format or unexpected response structure
    return { data: responseData, status: response.status }
  }

  /**
   * Make a GET request to the backend
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const url = `${this.baseUrl}${endpoint}`
      console.log('Making GET request to:', url)
      const interceptedOptions = requestInterceptor(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      })

      const response = await fetch(url, interceptedOptions)
      console.log('GET response status:', response.status)

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Try to parse error response from backend
        let errorData: any = null
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json()
            errorData = jsonResponse?.detail || jsonResponse
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }

        const errorMessage = handleApiError(errorData || response)
        return { 
          error: errorMessage, 
          status: response.status,
          processedError: {
            error_type: errorData?.error_type || 'UNKNOWN_ERROR',
            error_message: errorData?.error_message || errorMessage,
            error_id: errorData?.error_id,
            status: response.status
          }
        }
      }

      const responseData = await response.json()
      return this.processResponseData<T>(responseData, response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const errorMessage = handleApiError(error)
        return { 
          error: errorMessage, 
          status: 408,
          processedError: {
            error_type: 'REQUEST_TIMEOUT',
            error_message: errorMessage,
            error_id: undefined,
            status: 408
          }
        }
      }
      
      const errorMessage = handleApiError(error)
      return { 
        error: errorMessage, 
        status: 500,
        processedError: {
          error_type: 'INTERNAL_SERVER_ERROR',
          error_message: errorMessage,
          error_id: undefined,
          status: 500
        }
      }
    }
  }

  /**
   * Make a POST request to the backend
   */
  async post<T>(endpoint: string, data: any, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const url = `${this.baseUrl}${endpoint}`
      const interceptedOptions = requestInterceptor(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      })

      const response = await fetch(url, interceptedOptions)

      clearTimeout(timeoutId)

      console.log('--------Response:', response)
      if (!response.ok) {
        // Try to parse error response from backend
        let errorData: any = null
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json()
            errorData = jsonResponse?.detail || jsonResponse
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }
        
        console.log('--------Error data:', errorData)
        const errorMessage = handleApiError(errorData || response)
        return { 
          error: errorMessage, 
          status: response.status,
          processedError: {
            error_type: errorData?.error_type || 'UNKNOWN_ERROR',
            error_message: errorData?.error_message || errorMessage,
            error_id: errorData?.error_id,
            status: response.status
          }
        }
      }

      const responseData = await response.json()
      return this.processResponseData<T>(responseData, response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const errorMessage = handleApiError(error)
        return { 
          error: errorMessage, 
          status: 408,
          processedError: {
            error_type: 'REQUEST_TIMEOUT',
            error_message: errorMessage,
            error_id: undefined,
            status: 408
          }
        }
      }
      
      const errorMessage = handleApiError(error)
      return { 
        error: errorMessage, 
        status: 500,
        processedError: {
          error_type: 'INTERNAL_SERVER_ERROR',
          error_message: errorMessage,
          error_id: undefined,
          status: 500
        }
      }
    }
  }

  /**
   * Make a PUT request to the backend
   */
  async put<T>(endpoint: string, data: any, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const url = `${this.baseUrl}${endpoint}`
      const interceptedOptions = requestInterceptor(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        ...options,
      })

      const response = await fetch(url, interceptedOptions)

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Try to parse error response from backend
        let errorData: any = null
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json()
            errorData = jsonResponse?.detail || jsonResponse
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }

        const errorMessage = handleApiError(errorData || response)
        return { 
          error: errorMessage, 
          status: response.status,
          processedError: {
            error_type: errorData?.error_type || 'UNKNOWN_ERROR',
            error_message: errorData?.error_message || errorMessage,
            error_id: errorData?.error_id,
            status: response.status
          }
        }
      }

      const responseData = await response.json()
      return { data: responseData, status: response.status }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const errorMessage = handleApiError(error)
        return { 
          error: errorMessage, 
          status: 408,
          processedError: {
            error_type: 'REQUEST_TIMEOUT',
            error_message: errorMessage,
            error_id: undefined,
            status: 408
          }
        }
      }
      
      const errorMessage = handleApiError(error)
      return { 
        error: errorMessage, 
        status: 500,
        processedError: {
          error_type: 'INTERNAL_SERVER_ERROR',
          error_message: errorMessage,
          error_id: undefined,
          status: 500
        }
      }
    }
  }

  /**
   * Make a DELETE request to the backend
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), this.timeout)

      const url = `${this.baseUrl}${endpoint}`
      const interceptedOptions = requestInterceptor(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      })

      const response = await fetch(url, interceptedOptions)

      clearTimeout(timeoutId)

      if (!response.ok) {
        // Try to parse error response from backend
        let errorData: any = null
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json()
            errorData = jsonResponse?.detail || jsonResponse
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }

        const errorMessage = handleApiError(errorData || response)
        return { 
          error: errorMessage, 
          status: response.status,
          processedError: {
            error_type: errorData?.error_type || 'UNKNOWN_ERROR',
            error_message: errorData?.error_message || errorMessage,
            error_id: errorData?.error_id,
            status: response.status
          }
        }
      }

      const responseData = await response.json()
      return this.processResponseData<T>(responseData, response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const errorMessage = handleApiError(error)
        return { 
          error: errorMessage, 
          status: 408,
          processedError: {
            error_type: 'REQUEST_TIMEOUT',
            error_message: errorMessage,
            error_id: undefined,
            status: 408
          }
        }
      }
      
      const errorMessage = handleApiError(error)
      return { 
        error: errorMessage, 
        status: 500,
        processedError: {
          error_type: 'INTERNAL_SERVER_ERROR',
          error_message: errorMessage,
          error_id: undefined,
          status: 500
        }
      }
    }
  }

  /**
   * Check if the backend service is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health')
      return response.status === 200
    } catch {
      return false
    }
  }
}

// Export singleton instance
export const baseApiClient = new BaseApiClient()

// Export the class for custom instances
export { BaseApiClient }
