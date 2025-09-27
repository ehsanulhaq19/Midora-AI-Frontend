/**
 * Conversation API client
 * Handles all conversation-related API calls
 */

import { baseApiClient, ApiResponse } from '../base'
import {
  Conversation,
  Message,
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationsResponse,
  GetConversationResponse,
  GetMessagesResponse,
  CreateMessageRequest,
  CreateMessageResponse,
  DeleteConversationResponse
} from './types'

class ConversationApiClient {
  private baseClient = baseApiClient

  /**
   * Get all conversations
   */
  async getConversations(page: number = 1, perPage: number = 20, orderBy: string = "-created_at"): Promise<ApiResponse<{ conversations: Conversation[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>> {
    const response = await this.baseClient.get<GetConversationsResponse>(`/api/v1/conversations?page=${page}&per_page=${perPage}&order_by=${orderBy}`)
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    // Extract conversations and pagination from the response data
    const conversations = response?.data.items || []
    const pagination = {
      page: response?.data.page || page,
      per_page: response?.data.per_page || perPage,
      total: response?.data.total || 0,
      total_pages: response?.data.total_pages || 0
    }
    
    return { data: { conversations, pagination }, status: response.status }
  }

  /**
   * Get a specific conversation
   */
  async getConversation(conversationUuid: string): Promise<ApiResponse<Conversation>> {
    const response = await this.baseClient.get<GetConversationResponse>(`/api/v1/conversations/${conversationUuid}`)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as Conversation, status: response.status }
  }

  /**
   * Create a new conversation
   */
  async createConversation(data: CreateConversationRequest): Promise<ApiResponse<Conversation>> {
    const response = await this.baseClient.post<CreateConversationResponse>('/api/v1/conversations', data)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as Conversation, status: response.status }
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(conversationUuid: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.baseClient.delete<DeleteConversationResponse>(`/api/v1/conversations/${conversationUuid}`)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as { success: boolean }, status: response.status }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationUuid: string, page: number = 1, perPage: number = 50): Promise<ApiResponse<{ messages: Message[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>> {
    const response = await this.baseClient.get<GetMessagesResponse>(`/api/v1/messages/conversations/${conversationUuid}?page=${page}&per_page=${perPage}`)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    // Extract messages and pagination from the response data
    const messages = response.data?.items || []
    const pagination = {
      page: response.data?.page || page,
      per_page: response.data?.per_page || perPage,
      total: response.data?.total || 0,
      total_pages: response.data?.total_pages || 0
    }
    
    return { data: { messages, pagination }, status: response.status }
  }

  /**
   * Create a new message
   */
  async createMessage(conversationUuid: string, data: CreateMessageRequest): Promise<ApiResponse<Message>> {
    const response = await this.baseClient.post<CreateMessageResponse>(`/api/v1/messages/conversations/${conversationUuid}`, data)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as Message, status: response.status }
  }
}

// Export singleton instance
export const conversationApi = new ConversationApiClient()

// Export the class for custom instances
export { ConversationApiClient }