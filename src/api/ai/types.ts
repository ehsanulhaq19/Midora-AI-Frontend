/**
 * AI API types
 * Type definitions for all AI-related API requests and responses
 */

// AI Model types
export interface AIModel {
  model_name: string
  technical_name: string
  provider_name: string
  image_path: string
  capability: string
  input_cost_per_million: number
  output_cost_per_million: number
  generation_category: string[]
}

// AI Models response types
export interface AIModelsResponse {
  OpenAI: AIModel[]
  Gemini: AIModel[]
  Claude: AIModel[]
  DeepSeek: AIModel[]
}

// AI Content Generation types
export interface GenerateContentRequest {
  query: string
  conversation_uuid?: string
  stream?: boolean
  model_name?: string
  max_tokens?: number
  temperature?: number
}

export interface GenerateContentResponse {
  content: string
  model_used: string
  provider: string
  query_category: string
  selected_provider: string
  selected_model: string
  ai_message_id: string
  conversation_uuid: string
  message_id: string
}

// Streaming response types
export interface StreamingResponse {
  type: 'metadata' | 'content' | 'completion' | 'error' | 'unethical'
  conversation_uuid?: string
  message_id?: string
  chunk?: string
  model_used?: string
  query_category?: string
  selected_provider?: string
  selected_model?: string
  ai_message_id?: string
  error?: string
  message?: string
}

// Streaming callback types
export type StreamingChunkCallback = (chunk: string, type: string, metadata?: any) => void
export type StreamingCompleteCallback = (metadata: any) => void
export type StreamingErrorCallback = (error: string) => void
