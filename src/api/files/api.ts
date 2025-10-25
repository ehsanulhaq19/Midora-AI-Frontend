/**
 * File API client
 * Handles all file-related API calls including upload and management
 */

import { baseApiClient, ApiResponse } from '../base'
import { appConfig } from '@/config/app'
import { tokenManager } from '@/lib/token-manager'
import { FileUploadResponse, FileUploadRequest } from './types'

class FileApiClient {
  private baseClient = baseApiClient

  /**
   * Upload a file to the backend
   */
  async uploadFile(data: FileUploadRequest): Promise<ApiResponse<FileUploadResponse>> {
    const token = tokenManager.getAccessToken()
    if (!token) {
      throw new Error('No access token found')
    }

    const url = `${appConfig.backendUrl}/api/v1/files/upload`
    
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('file', data.file)

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header, let browser set it with boundary for FormData
      },
      body: formData,
    }

    // Send credentials conditionally to avoid CORS issues
    const refreshToken = tokenManager.getRefreshToken()
    if (refreshToken) {
      requestOptions.credentials = 'include'
      console.log('Sending credentials with file upload request to include refresh token cookie')
    } else {
      console.log('Skipping credentials for file upload request (no refresh token)')
    }

    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        // Handle 401 Unauthorized errors with reload logic
        if (response.status === 401) {
          console.error('401 Unauthorized error detected in file upload request')
          // Import and use the reload handler
          const { handle401WithReload } = await import('@/lib/reload-counter')
          handle401WithReload()
        }
        
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

        const { handleApiError } = await import('@/lib/error-handler')
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

      // Reset reload counter on successful request
      const { resetReloadCount } = await import('@/lib/reload-counter')
      resetReloadCount()
      
      const responseData = await response.json()
      
      // Process response data according to backend format
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
          const { handleApiError } = await import('@/lib/error-handler')
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
    } catch (error) {
      const { handleApiError } = await import('@/lib/error-handler')
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
}

// Export singleton instance
export const fileApi = new FileApiClient()

// Export the class for custom instances
export { FileApiClient }
