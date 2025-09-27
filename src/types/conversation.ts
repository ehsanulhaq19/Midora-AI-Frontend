// Re-export types from API modules for convenience
export type { Message, Conversation } from '@/api/conversation/types'
export type { AIModel, StreamingResponse } from '@/api/ai/types'

export interface ConversationState {
  conversations: { [conversationUuid: string]: Conversation }
  currentConversation: Conversation | null
  messages: { [conversationUuid: string]: Message[] }
  isLoading: boolean
  error: string | null
  isStreaming: boolean
  streamingContent: string
  aiModels: AIModel[]
  selectedModel: AIModel | null
  pagination: { [conversationUuid: string]: { page: number, per_page: number, total: number, total_pages: number } }
  isLoadingMore: boolean
  conversationPagination: { page: number, per_page: number, total: number, total_pages: number } | null
  isLoadingMoreConversations: boolean
}
