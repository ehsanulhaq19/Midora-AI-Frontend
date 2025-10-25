/**
 * Conversation API types
 * Type definitions for all conversation-related API requests and responses
 */

// Sender types
export interface Sender {
  email: string
  first_name: string
  last_name: string
  uuid: string
  username: string
  is_active: boolean
  is_verified: boolean
  is_onboarded: boolean
  meta_data: {
    sso_created?: boolean
    created_via?: string
  } | null
}

// Linked file types
export interface LinkedFile {
  uuid: string
  filename: string
  file_extension: string
  file_type: string
  file_size: number
  storage_type: string
}

// Message types
export interface Message {
  content: string
  uuid: string
  sender: Sender
  model_name: string | null
  linked_files?: LinkedFile[]
  created_at: string
  updated_at: string | null
  // Versioning support for regeneration
  versions?: Message[]
  currentVersionIndex?: number
}

// Message group types for new response structure
export interface MessageGroup {
  type: 'single_message' | 'multi_message'
  messages: Message[]
  parent_message_uuid: string | null
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

// Response types (after baseApiClient processing)
export interface CreateConversationResponse extends Conversation {}

export interface GetConversationsResponse {
  items: Conversation[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface GetConversationResponse extends Conversation {}

export interface GetMessagesResponse {
  items: MessageGroup[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface CreateMessageResponse extends Message {}

export interface DeleteConversationResponse {
  success: boolean
}

// Error object structure for throw new Error
export interface ConversationErrorObject {
  error_type: string
  error_message: string
  error_id?: string
  status?: number
}
