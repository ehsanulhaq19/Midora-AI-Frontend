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
  GenerateContentRequest,
  GenerateContentResponse,
  StreamingChunkCallback,
  StreamingCompleteCallback,
  StreamingErrorCallback
} from './types'

class AIApiClient {
  private baseClient = baseApiClient

  /**
   * Get all available AI models
   */
  async getModels(): Promise<ApiResponse<AIModelsResponse>> {
    return this.baseClient.get<AIModelsResponse>('/api/v1/ai/models')
  }

  /**
   * Generate AI content (non-streaming)
   */
  async generateContent(data: GenerateContentRequest): Promise<ApiResponse<GenerateContentResponse>> {
    return this.baseClient.post<GenerateContentResponse>('/api/v1/ai/generate', data)
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

    const response = await fetch(`${appConfig.backendUrl}/api/v1/ai/generate-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ...data, stream: true }),
    })

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
