/**
 * AI API client
 * Handles all AI-related API calls including content generation and model management
 */

import { baseApiClient, ApiResponse } from '../base'
import { appConfig } from '@/config/app'
import { tokenManager } from '@/lib/token-manager'
import {
  AIModel,
  AIModelsResponse,
  AIServiceProvider,
  AIServiceProvidersResponse,
  GenerateContentRequest,
  GenerateContentResponse,
  RegenerateContentRequest,
  StreamingChunkCallback,
  StreamingCompleteCallback,
  StreamingErrorCallback
} from './types'

class AIApiClient {
  private baseClient = baseApiClient

  /**
   * Get AI service providers with active models
   */
  async getServiceProviders(): Promise<ApiResponse<AIServiceProvidersResponse>> {
    return this.baseClient.get<AIServiceProvidersResponse>('/api/v1/ai-service-providers/with-active-models')
  }

  /**
   * Generate AI content (non-streaming)
   */
  async generateContent(data: GenerateContentRequest): Promise<ApiResponse<GenerateContentResponse>> {
    return this.baseClient.post<GenerateContentResponse>('/api/v1/ai/generate', data)
  }

  /**
   * Regenerate AI content with streaming
   */
  async regenerateContentStream(
    data: RegenerateContentRequest,
    onChunk: StreamingChunkCallback,
    onComplete: StreamingCompleteCallback,
    onError: StreamingErrorCallback
  ): Promise<void> {
    const token = tokenManager.getAccessToken()
    if (!token) {
      throw new Error('No access token found')
    }

    const url = `${appConfig.backendUrl}/api/v1/ai/regenerate-stream`
    
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }

    // Send credentials conditionally to avoid CORS issues
    const refreshToken = tokenManager.getRefreshToken()
    if (refreshToken) {
      requestOptions.credentials = 'include'
      console.log('Sending credentials with regenerate streaming request to include refresh token cookie')
    } else {
      console.log('Skipping credentials for regenerate streaming request (no refresh token)')
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      onError(errorData.error_message || `HTTP error! status: ${response.status}`)
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      onError('No response body reader available')
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6))
              
              switch (eventData.type) {
                case 'initial_metadata':
                  onComplete(eventData)
                  break
                case 'initial_content':
                  // Handle initial content from local model (placeholder content)
                  onChunk(eventData.chunk || '', 'initial_content', eventData)
                  break
                case 'metadata':
                case 'meta_data':
                  // Handle metadata stream responses (don't add to content)
                  onChunk('', 'metadata', eventData)
                  break
                case 'model_selection':
                  // Handle model selection stream responses
                  onChunk('', 'model_selection', eventData)
                  break
                case 'content':
                  onChunk(eventData.chunk || '', 'content', eventData)
                  break
                case 'completion':
                  onComplete(eventData)
                  break
                case 'error':
                  onError(eventData.error || 'Unknown error occurred')
                  break
                case 'unethical':
                  onError(eventData.message || 'Content flagged as unethical')
                  break
                default:
                  console.warn('Unknown streaming event type:', eventData.type)
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Streaming error occurred')
    } finally {
      reader.releaseLock()
    }
  }

  /**
   * Generate AI content with streaming
   */
  async generateContentStream(
    data: GenerateContentRequest,
    onChunk: StreamingChunkCallback,
    onComplete: StreamingCompleteCallback,
    onError: StreamingErrorCallback
  ): Promise<void> {
    const token = tokenManager.getAccessToken()
    if (!token) {
      throw new Error('No access token found')
    }

    const url = `${appConfig.backendUrl}/api/v1/ai/generate-stream`
    
    const requestOptions: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data, stream: true }),
    }

    // Send credentials conditionally to avoid CORS issues
    const refreshToken = tokenManager.getRefreshToken()
    if (refreshToken) {
      requestOptions.credentials = 'include'
      console.log('Sending credentials with streaming request to include refresh token cookie')
    } else {
      console.log('Skipping credentials for streaming request (no refresh token)')
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      onError(errorData.error_message || `HTTP error! status: ${response.status}`)
      return
    }

    const reader = response.body?.getReader()
    if (!reader) {
      onError('No response body reader available')
      return
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.slice(6))
              
              switch (eventData.type) {
                case 'initial_metadata':
                  onComplete(eventData)
                  break
                case 'initial_content':
                  // Handle initial content from local model (placeholder content)
                  onChunk(eventData.chunk || '', 'initial_content', eventData)
                  break
                case 'metadata':
                case 'meta_data':
                  // Handle metadata stream responses (don't add to content)
                  onChunk('', 'metadata', eventData)
                  break
                case 'model_selection':
                  // Handle model selection stream responses
                  onChunk('', 'model_selection', eventData)
                  break
                case 'content':
                  onChunk(eventData.chunk || '', 'content', eventData)
                  break
                case 'completion':
                  onComplete(eventData)
                  break
                case 'error':
                  onError(eventData.error || 'Unknown error occurred')
                  break
                case 'unethical':
                  onError(eventData.message || 'Content flagged as unethical')
                  break
                default:
                  console.warn('Unknown streaming event type:', eventData.type)
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError)
            }
          }
        }
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Streaming error occurred')
    } finally {
      reader.releaseLock()
    }
  }
}

// Export singleton instance
export const aiApi = new AIApiClient()

// Export the class for custom instances
export { AIApiClient }
