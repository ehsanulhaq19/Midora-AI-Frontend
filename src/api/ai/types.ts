/**
 * AI API types
 * Type definitions for all AI-related API requests and responses
 */

// AI Model types
export interface AIModel {
  uuid: string
  encoded_uuid: string
  model_name: string
  capability: string
  input_cost_per_million: string
  output_cost_per_million: string
  provider: string
  api_model_name: string
  image_path: string
  is_fallback_model: boolean
  is_default_model: boolean
  is_active: boolean
  created_at: string
  updated_at: string | null
}

// AI Service Provider types
export interface AIServiceProvider {
  uuid: string
  encoded_uuid: string
  name: string
  api_key: string
  created_at: string
  updated_at: string | null
  active_models: AIModel[]
  active_models_count: number
}

// AI Service Providers Response types
export interface AIServiceProvidersResponse {
  providers: AIServiceProvider[]
  count: number
  message: string
}

// Legacy AI Models response types (for backward compatibility)
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
  ai_model_uuid?: string
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
  type: 'metadata' | 'meta_data' | 'model_selection' | 'content' | 'completion' | 'error' | 'unethical' | 'initial_metadata'
  conversation_uuid?: string
  message_id?: string
  chunk?: string
  message_type?: string
  model_used?: string
  query_category?: string
  selected_provider?: string
  selected_model?: string
  rank?: number
  ai_message_id?: string
  error?: string
  message?: string | null
}

// Streaming callback types
export type StreamingChunkCallback = (chunk: string, type: string, metadata?: any) => void
export type StreamingCompleteCallback = (metadata: any) => void
export type StreamingErrorCallback = (error: string) => void

// Error object structure for throw new Error
export interface AIErrorObject {
  error_type: string
  error_message: string
  error_id?: string
  status?: number
}
