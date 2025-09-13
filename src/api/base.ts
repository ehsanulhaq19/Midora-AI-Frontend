/**
 * Base API client for all backend API calls
 * This file provides the foundation for all API interactions
 */

import { appConfig } from '@/config/app'
import { requestInterceptor } from './interceptors'
import { errorHandler, ProcessedError } from '@/lib/error-handler'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
  message?: string
  processedError?: ProcessedError
  success?: boolean
  error_type?: string
  error_message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: any
  processedError?: ProcessedError
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
        // Error response format: { success: false, error_type: "...", error_message: "..." }
        const processedError = errorHandler.handleResponseError(response, responseData)
        return { 
          error: processedError.message, 
          status: response.status,
          processedError,
          success: false,
          error_type: responseData.error_type,
          error_message: responseData.error_message
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
            errorData = await response.json()
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }

        const processedError = errorHandler.handleResponseError(response, errorData)
        return { 
          error: processedError.message, 
          status: response.status,
          processedError
        }
      }

      const responseData = await response.json()
      return this.processResponseData<T>(responseData, response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const processedError = errorHandler.handleNetworkError(error)
        return { 
          error: processedError.message, 
          status: 408,
          processedError
        }
      }
      
      const processedError = errorHandler.handleNetworkError(error)
      return { 
        error: processedError.message, 
        status: 500,
        processedError
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

      if (!response.ok) {
        // Try to parse error response from backend
        let errorData: any = null
        try {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            errorData = await response.json()
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }

        const processedError = errorHandler.handleResponseError(response, errorData)
        return { 
          error: processedError.message, 
          status: response.status,
          processedError
        }
      }

      const responseData = await response.json()
      return this.processResponseData<T>(responseData, response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const processedError = errorHandler.handleNetworkError(error)
        return { 
          error: processedError.message, 
          status: 408,
          processedError
        }
      }
      
      const processedError = errorHandler.handleNetworkError(error)
      return { 
        error: processedError.message, 
        status: 500,
        processedError
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
            errorData = await response.json()
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }

        const processedError = errorHandler.handleResponseError(response, errorData)
        return { 
          error: processedError.message, 
          status: response.status,
          processedError
        }
      }

      const responseData = await response.json()
      return { data: responseData, status: response.status }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const processedError = errorHandler.handleNetworkError(error)
        return { 
          error: processedError.message, 
          status: 408,
          processedError
        }
      }
      
      const processedError = errorHandler.handleNetworkError(error)
      return { 
        error: processedError.message, 
        status: 500,
        processedError
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
            errorData = await response.json()
          }
        } catch (parseError) {
          console.warn('Failed to parse error response:', parseError)
        }

        const processedError = errorHandler.handleResponseError(response, errorData)
        return { 
          error: processedError.message, 
          status: response.status,
          processedError
        }
      }

      const responseData = await response.json()
      return this.processResponseData<T>(responseData, response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        const processedError = errorHandler.handleNetworkError(error)
        return { 
          error: processedError.message, 
          status: 408,
          processedError
        }
      }
      
      const processedError = errorHandler.handleNetworkError(error)
      return { 
        error: processedError.message, 
        status: 500,
        processedError
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
