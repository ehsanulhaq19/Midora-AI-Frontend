/**
 * Base API client for all backend API calls
 * This file provides the foundation for all API interactions
 */

import { appConfig } from '@/config/app'
import { requestInterceptor } from './interceptors'

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
  message?: string
}

export interface ApiError {
  message: string
  status: number
  details?: any
}

class BaseApiClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = appConfig.backendUrl
    this.timeout = appConfig.apiTimeout
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data, status: response.status }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout', status: 408 }
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 }
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      return { data: responseData, status: response.status }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout', status: 408 }
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 }
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      return { data: responseData, status: response.status }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout', status: 408 }
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 }
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data, status: response.status }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { error: 'Request timeout', status: 408 }
      }
      return { error: error instanceof Error ? error.message : 'Unknown error', status: 500 }
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
