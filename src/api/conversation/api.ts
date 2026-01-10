/**
 * Conversation API client
 * Handles all conversation-related API calls
 */

import { baseApiClient, ApiResponse } from '../base'
import {
  Conversation,
  Message,
  MessageGroup,
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationsResponse,
  GetConversationResponse,
  GetMessagesResponse,
  CreateMessageRequest,
  CreateMessageResponse,
  DeleteConversationResponse
  , LinkedConversationItem
} from './types'

class ConversationApiClient {
  private baseClient = baseApiClient

  /**
   * Transform message groups into individual messages with versioning support
   */
  private transformMessageGroups(messageGroups: MessageGroup[]): Message[] {
    const transformedMessages: Message[] = []
    
    messageGroups.forEach(group => {
      if (group.type === 'single_message') {
        // Single message - add as is
        transformedMessages.push(...group.messages)
      } else if (group.type === 'multi_message') {
        // Multi message - group messages by parent_message_uuid for versioning
        const parentMessageId = group.parent_message_uuid
        
        if (parentMessageId) {
          // Find if we already have a message with this parent ID
          const existingMessageIndex = transformedMessages.findIndex(
            msg => msg.uuid === parentMessageId
          )
          
          if (existingMessageIndex !== -1) {
            // Add versions to existing message
            const existingMessage = transformedMessages[existingMessageIndex]
            if (!existingMessage.versions) {
              // Create versions array with the original message as first version
              existingMessage.versions = [{ ...existingMessage }]
              existingMessage.currentVersionIndex = 0
            }
            // Add new versions
            existingMessage.versions.push(...group.messages)
            existingMessage.currentVersionIndex = existingMessage.versions.length - 1
            // Update content to show the latest version
            if (group.messages.length > 0) {
              const latestMessage = group.messages[group.messages.length - 1]
              existingMessage.content = latestMessage.content
              existingMessage.model_name = latestMessage.model_name
            }
          } else {
            // Parent message not found, add the first message as the main message with versions
            if (group.messages.length > 0) {
              const mainMessage = { ...group.messages[0] }
              mainMessage.versions = [...group.messages]
              mainMessage.currentVersionIndex = group.messages.length - 1
              // Show the latest version content
              const latestMessage = group.messages[group.messages.length - 1]
              mainMessage.content = latestMessage.content
              mainMessage.model_name = latestMessage.model_name
              // Use the parent message ID as the main message UUID
              mainMessage.uuid = parentMessageId
              transformedMessages.push(mainMessage)
            }
          }
        } else {
          // No parent message ID, add all messages as individual messages
          transformedMessages.push(...group.messages)
        }
      }
    })
    
    return transformedMessages
  }

  /**
   * Get all conversations
   */
  async getConversations(
    page: number = 1, 
    perPage: number = 20, 
    orderBy: string = "-last_message_at",
    messageSearch?: string,
    doDeepSearch?: boolean
  ): Promise<ApiResponse<{ conversations: Conversation[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      order_by: orderBy
    })
    
    if (messageSearch && messageSearch.trim()) {
      params.append('message_search', messageSearch.trim())
    }
    
    if (doDeepSearch) {
      params.append('do_deep_search', 'true')
    }
    
    const headers: Record<string,string> = {}
    if (messageSearch && messageSearch.trim()) {
      // Increase timeout for message search to 20 minutes
      headers['X-Request-Timeout'] = String(1200000)
    }
    const response = await this.baseClient.get<GetConversationsResponse>(`/api/v1/conversations?${params.toString()}`, { headers })
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    // Extract conversations and pagination from the response data
    const conversations = response?.data?.items || []
    const pagination = {
      page: response?.data?.page || page,
      per_page: response?.data?.per_page || perPage,
      total: response?.data?.total || 0,
      total_pages: response?.data?.total_pages || 0
    }
    
    return { data: { conversations, pagination }, status: response.status }
  }

  /**
   * Get archived conversations
   */
  async getArchivedConversations(
    page: number = 1, 
    perPage: number = 20, 
    orderBy: string = "-last_message_at",
    messageSearch?: string,
    doDeepSearch?: boolean
  ): Promise<ApiResponse<{ conversations: Conversation[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      order_by: orderBy
    })
    
    if (messageSearch && messageSearch.trim()) {
      params.append('message_search', messageSearch.trim())
    }
    
    if (doDeepSearch) {
      params.append('do_deep_search', 'true')
    }
    
    const headers: Record<string,string> = {}
    if (messageSearch && messageSearch.trim()) {
      headers['X-Request-Timeout'] = String(120000)
    }
    const response = await this.baseClient.get<GetConversationsResponse>(`/api/v1/conversations/archive?${params.toString()}`, { headers })
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    // Extract conversations and pagination from the response data
    const conversations = response?.data?.items || []
    const pagination = {
      page: response?.data?.page || page,
      per_page: response?.data?.per_page || perPage,
      total: response?.data?.total || 0,
      total_pages: response?.data?.total_pages || 0
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
   * Archive a conversation
   */
  async archiveConversation(conversationUuid: string): Promise<ApiResponse<Conversation>> {
    const response = await this.baseClient.post<CreateConversationResponse>(`/api/v1/conversations/${conversationUuid}/archive`, {})
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as Conversation, status: response.status }
  }

  /**
   * Unarchive a conversation
   */
  async unarchiveConversation(conversationUuid: string): Promise<ApiResponse<Conversation>> {
    const response = await this.baseClient.post<CreateConversationResponse>(`/api/v1/conversations/${conversationUuid}/unarchive`, {})
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as Conversation, status: response.status }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationUuid: string, page: number = 1, perPage: number = 50): Promise<ApiResponse<{ messages: Message[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>> {
    const response = await this.baseClient.get<GetMessagesResponse>(`/api/v1/messages/conversations/${conversationUuid}?page=${page}&per_page=${perPage}`)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    // Transform message groups into individual messages with versioning support
    const messageGroups = response?.data?.items || []
    const messages = this.transformMessageGroups(messageGroups)
    
    const pagination = {
      page: response?.data?.page || page,
      per_page: response?.data?.per_page || perPage,
      total: response?.data?.total || 0,
      total_pages: response?.data?.total_pages || 0
    }
    
    return { data: { messages, pagination }, status: response.status }
  }

  /**
   * Get public grouped messages for a conversation (no auth required, protected by domain header)
   */
  async getPublicGroupedMessages(conversationUuid: string, page: number = 1, perPage: number = 50, orderBy: string = "-created_at"): Promise<ApiResponse<{ items: any[], pagination: any }>> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      order_by: orderBy
    })

    const headers: Record<string,string> = {}
    try {
      if (typeof window !== "undefined" && window.location && window.location.origin) {
        headers['X-Calling-Domain'] = window.location.origin
      }
    } catch (e) {}

    const response = await this.baseClient.get<{ success: boolean; data: any }>(`/api/v1/public/messages/conversations/${conversationUuid}?${params.toString()}`, { headers })
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    // Transform message groups into individual messages with versioning support
    const messageGroups = response?.data?.items || []
    const messages = this.transformMessageGroups(messageGroups)
    
    const pagination = {
      page: response?.data?.page || page,
      per_page: response?.data?.per_page || perPage,
      total: response?.data?.total || 0,
      total_pages: response?.data?.total_pages || 0
    }
    
    return { data: { messages, pagination }, status: response.status }
  }

  /**
   * Get linked conversations (minimal details) for a conversation
   */
  async getLinkedConversations(conversationUuid: string): Promise<ApiResponse<{ items: LinkedConversationItem[] }>> {
    const response = await this.baseClient.get<{ success: boolean; data: { items: LinkedConversationItem[] } }>(`/api/v1/conversations/${conversationUuid}/links`)
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    return { data: { items: response.data?.items || [] }, status: response.status }
  }

  /**
   * Link a conversation to another conversation
   */
  async linkConversation(conversationUuid: string, linkedConversationUuid: string): Promise<ApiResponse<any>> {
    const response = await this.baseClient.post(`/api/v1/conversations/${conversationUuid}/link`, { linked_conversation_uuid: linkedConversationUuid })
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    return { data: response.data, status: response.status }
  }

  /**
   * Join a conversation (add current authenticated user to conversation participants)
   */
  async joinConversation(conversationUuid: string): Promise<ApiResponse<any>> {
    const response = await this.baseClient.post(`/api/v1/conversations/${conversationUuid}/join`, {})
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    return { data: response.data, status: response.status }
  }

  /**
   * Unlink (soft delete) a link between conversations
   */
  async unlinkConversation(conversationUuid: string, linkedConversationUuid: string): Promise<ApiResponse<any>> {
    const response = await this.baseClient.delete(`/api/v1/conversations/${conversationUuid}/link/${linkedConversationUuid}`)
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    return { data: response.data, status: response.status }
  }

  /**
   * Check if current user is a member of a conversation
   */
  async checkConversationMembership(conversationUuid: string): Promise<ApiResponse<{ is_member: boolean }>> {
    const response = await this.baseClient.get<{ is_member: boolean }>(`/api/v1/conversations/${conversationUuid}/check-membership`)
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    return { data: response.data as { is_member: boolean }, status: response.status }
  }

  /**
   * Get public conversation details without authentication
   */
  async getPublicConversationDetails(conversationUuid: string): Promise<ApiResponse<Conversation>> {
    const headers: Record<string, string> = {}
    try {
      if (typeof window !== "undefined" && window.location && window.location.origin) {
        headers['X-Calling-Domain'] = window.location.origin
      }
    } catch (e) {}

    const response = await this.baseClient.get<Conversation>(`/api/v1/public/conversations/${conversationUuid}/details`, { headers })
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    return { data: response.data as Conversation, status: response.status }
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