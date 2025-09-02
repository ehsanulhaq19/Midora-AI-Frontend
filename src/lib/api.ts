import { API_CONFIG, HTTP_STATUS } from './constants'
import { apiResponseSchema, type ApiResponse } from './validations'

/**
 * API utility functions for making HTTP requests
 */

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Request options interface
interface RequestOptions extends RequestInit {
  timeout?: number
  retries?: number
}

// Default request options
const defaultOptions: RequestOptions = {
  timeout: API_CONFIG.TIMEOUT,
  retries: API_CONFIG.RETRY_ATTEMPTS,
  headers: {
    'Content-Type': 'application/json',
  },
}

/**
 * Create a timeout promise
 * @param ms - Timeout in milliseconds
 * @returns Promise that rejects after timeout
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
  })
}

/**
 * Retry a function with exponential backoff
 * @param fn - Function to retry
 * @param retries - Number of retries
 * @param delay - Initial delay in milliseconds
 * @returns Promise result
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number
): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    
    await new Promise(resolve => setTimeout(resolve, delay))
    return retryWithBackoff(fn, retries - 1, delay * 2)
  }
}

/**
 * Make an HTTP request with timeout and retry logic
 * @param url - Request URL
 * @param options - Request options
 * @returns Promise with response data
 */
async function makeRequest<T = any>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeout, retries, ...fetchOptions } = { ...defaultOptions, ...options }
  
  const requestFn = async () => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        let errorData: any = {}
        try {
          errorData = await response.json()
        } catch {
          // Ignore JSON parsing errors for error responses
        }
        
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }
      
      // Handle no content responses
      if (response.status === HTTP_STATUS.NO_CONTENT) {
        return {} as T
      }
      
      // Parse JSON response
      const data = await response.json()
      
      // Validate response schema if available
      if (data && typeof data === 'object') {
        try {
          apiResponseSchema.parse(data)
        } catch (validationError) {
          console.warn('API response validation failed:', validationError)
        }
      }
      
      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof ApiError) {
        throw error
      }
      
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408)
      }
      
      throw new ApiError(
        error.message || 'Network error',
        0,
        error
      )
    }
  }
  
  return retryWithBackoff(requestFn, retries || 0, API_CONFIG.RETRY_DELAY)
}

/**
 * GET request
 * @param url - Request URL
 * @param options - Request options
 * @returns Promise with response data
 */
export async function get<T = any>(url: string, options?: RequestOptions): Promise<T> {
  return makeRequest<T>(url, { ...options, method: 'GET' })
}

/**
 * POST request
 * @param url - Request URL
 * @param data - Request body data
 * @param options - Request options
 * @returns Promise with response data
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  return makeRequest<T>(url, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT request
 * @param url - Request URL
 * @param data - Request body data
 * @param options - Request options
 * @returns Promise with response data
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  return makeRequest<T>(url, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PATCH request
 * @param url - Request URL
 * @param data - Request body data
 * @param options - Request options
 * @returns Promise with response data
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  options?: RequestOptions
): Promise<T> {
  return makeRequest<T>(url, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE request
 * @param url - Request URL
 * @param options - Request options
 * @returns Promise with response data
 */
export async function del<T = any>(url: string, options?: RequestOptions): Promise<T> {
  return makeRequest<T>(url, { ...options, method: 'DELETE' })
}

/**
 * Upload file with FormData
 * @param url - Upload URL
 * @param file - File to upload
 * @param additionalData - Additional form data
 * @param options - Request options
 * @returns Promise with response data
 */
export async function uploadFile<T = any>(
  url: string,
  file: File,
  additionalData?: Record<string, any>,
  options?: RequestOptions
): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }
  
  return makeRequest<T>(url, {
    ...options,
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData, let browser set it with boundary
    },
  })
}

/**
 * Download file
 * @param url - Download URL
 * @param filename - Filename for download
 * @param options - Request options
 * @returns Promise that resolves when download starts
 */
export async function downloadFile(
  url: string,
  filename?: string,
  options?: RequestOptions
): Promise<void> {
  const response = await makeRequest<Blob>(url, {
    ...options,
    method: 'GET',
    headers: {
      ...options?.headers,
      'Accept': 'application/octet-stream',
    },
  })
  
  const blob = new Blob([response])
  const downloadUrl = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = downloadUrl
  link.download = filename || 'download'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(downloadUrl)
}

// Export all functions
export const api = {
  get,
  post,
  put,
  patch,
  delete: del,
  uploadFile,
  downloadFile,
}
