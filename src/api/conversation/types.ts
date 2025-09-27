/**
 * Conversation API types
 * Type definitions for all conversation-related API requests and responses
 */

// Message types
export interface Message {
  uuid: string
  content: string
  sender_id: number
  conversation_uuid: string
  created_at: string
  updated_at: string
  sender?: {
    uuid: string
    email: string
    first_name: string
    last_name: string
  }
}

// Conversation types
export interface Conversation {
  id: string
  uuid: string
  name: string
  created_by: number
  created_at: string
  updated_at: string
  messages?: Message[]
}

// Request types
export interface CreateConversationRequest {
  name: string
  user_ids?: number[]
}

export interface CreateMessageRequest {
  content: string
}

// Response types
export interface CreateConversationResponse {
  success: boolean
  data: Conversation
}

export interface GetConversationsResponse {
  success: boolean
  data: {
    items: Conversation[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export interface GetConversationResponse {
  success: boolean
  data: Conversation
}

export interface GetMessagesResponse {
  success: boolean
  data: {
    items: Message[]
    total: number
    page: number
    per_page: number
    total_pages: number
  }
}

export interface CreateMessageResponse {
  success: boolean
  data: Message
}

export interface DeleteConversationResponse {
  success: boolean
}
