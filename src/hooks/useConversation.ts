import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { conversationApi } from '@/api/conversation/api'
import { aiApi } from '@/api/ai/api'
import { useAuthRedux } from '@/hooks/useAuthRedux'
import { setAutoMode } from '@/store/slices/aiModelsSlice'
import {
  setLoading,
  setError,
  clearError,
  setConversations,
  addConversation,
  setCurrentConversation,
  setMessages,
  prependMessages,
  setLoadingMore,
  setLoadingMoreConversations,
  appendConversations,
  addMessage,
  removeMessage,
  startStreaming,
  setStreamingContent,
  setStreamingMetadata,
  completeStreaming,
  stopStreaming,
} from '@/store/slices/conversationSlice'
import { Conversation, Message } from '@/api/conversation/types'
import { useToast } from './useToast'
import { handleApiError } from '@/lib/error-handler'

export const useConversation = () => {
  const dispatch = useDispatch()
  const { user } = useAuthRedux()
  const { error: showErrorToast } = useToast()
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    error,
    isStreaming,
    streamingContent,
    streamingMetadata,
    pagination,
    isLoadingMore,
    conversationPagination,
    isLoadingMoreConversations,
  } = useSelector((state: RootState) => state.conversation)

  // Load conversations
  const loadConversations = useCallback(async () => {
    try {
      dispatch(clearError())
      
      const response = await conversationApi.getConversations(1, 20)
      console.log("response = ", response)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'CONVERSATIONS_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      dispatch(setConversations(response.data || { conversations: [], pagination: { page: 1, per_page: 20, total: 0, total_pages: 0 } }))
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Load Conversations', errorMessage)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch])

  // Create a new conversation
  const createConversation = useCallback(async (name: string) => {
    try {
      dispatch(clearError())
      
      const response = await conversationApi.createConversation({ name })
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'CONVERSATION_CREATION_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      const conversation = response.data!
      dispatch(addConversation(conversation))
      dispatch(setCurrentConversation(conversation))
      return conversation
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Create Conversation', errorMessage)
      return null
    } finally {
    }
  }, [dispatch])

  // Select a conversation
  const selectConversation = useCallback(async (conversationUuid: string) => {
    try {
      dispatch(clearError())
      
      // Find conversation in current list
      const conversation = conversations[conversationUuid]
      if (conversation) {
        dispatch(setCurrentConversation(conversation))
        
        // Load messages if not already loaded
        if (!messages[conversationUuid]) {
          const response = await conversationApi.getMessages(conversationUuid, 1, 50)
          if (response.error) {
            throw new Error(response.error)
          }
          dispatch(setMessages({ 
            conversationUuid, 
            messages: response.data?.messages || [], 
            pagination: response.data?.pagination 
          }))
        }
      } else {
        // Load conversation from API if not in current list
        const conversationResponse = await conversationApi.getConversation(conversationUuid)
        if (conversationResponse.error) {
          throw new Error(conversationResponse.error)
        }
        dispatch(setCurrentConversation(conversationResponse.data))
        
        const messagesResponse = await conversationApi.getMessages(conversationUuid, 1, 50)
        if (messagesResponse.error) {
          throw new Error(messagesResponse.error)
        }
        dispatch(setMessages({ 
          conversationUuid, 
          messages: messagesResponse.data?.messages || [], 
          pagination: messagesResponse.data?.pagination 
        }))
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Load Conversation', errorMessage)
    } finally {
    }
  }, [dispatch, conversations, messages])

  // Send a message
  const sendMessage = useCallback(async (content: string, modelUuid?: string, conversationUuid?: string) => {
    try {
      dispatch(clearError())
      
      let targetConversationUuid = conversationUuid || currentConversation?.uuid
      
      // Create conversation if none exists
      if (!targetConversationUuid) {
        const response = await conversationApi.createConversation({ name: `Chat - ${content.substring(0, 50)}...` })
        if (response.error) {
          const errorObject = response.processedError || {
            error_type: 'CONVERSATION_CREATION_FAILED',
            error_message: response.error,
            status: response.status
          }
          throw new Error(JSON.stringify(errorObject))
        }
        const newConversation = response.data!
        dispatch(addConversation(newConversation))
        dispatch(setCurrentConversation(newConversation))
        targetConversationUuid = newConversation.uuid
      }
      
      // Add user message to store immediately
      const messageUuid = `user-${Date.now()}`
      const userMessage: Message = {
        uuid: messageUuid,
        content,
        sender_id: user?.id || 0,
        conversation_uuid: targetConversationUuid,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        sender: user ? {
          uuid: user.uuid,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        } : undefined
      }
      
      dispatch(addMessage({ conversationUuid: targetConversationUuid, message: userMessage }))
      
      // Start streaming
      dispatch(startStreaming())
      
      // Track accumulated content for completion
      let accumulatedContent = ''
      let streamingBuffer = ''
      let lastUpdateTime = 0
      const UPDATE_THROTTLE = 50 // Update UI every 50ms max
      
      // Generate AI response with streaming
      await aiApi.generateContentStream(
        { query: content, conversation_uuid: targetConversationUuid, stream: true, ai_model_uuid: modelUuid },
        (chunk: string, type: string, metadata?: any) => {
          if (type === 'metadata') {
            // Handle metadata stream responses - update metadata state only
            if (metadata?.message_type) {
              dispatch(setStreamingMetadata({ message_type: metadata.message_type }))
            }
          } else if (type === 'model_selection') {
            // Handle model selection stream responses
            dispatch(setStreamingMetadata({
              selected_model: metadata?.selected_model,
              selected_provider: metadata?.selected_provider,
              query_category: metadata?.query_category,
              rank: metadata?.rank
            }))
          } else {
            // Handle regular content chunks
            accumulatedContent += chunk
            streamingBuffer += chunk
            
            // Throttle UI updates for smoother performance
            const now = Date.now()
            if (now - lastUpdateTime >= UPDATE_THROTTLE) {
              dispatch(setStreamingContent(streamingBuffer))
              lastUpdateTime = now
            }
          }
        },
        (metadata: any) => {
          if (metadata.type == "initial_metadata") {
            dispatch(removeMessage({ conversationUuid: targetConversationUuid!, messageUuid: messageUuid }))
            // Only add message if it exists (not null)
            if (metadata.message) {
              dispatch(addMessage({ conversationUuid: targetConversationUuid!, message: metadata.message }))
            }
          } else {
            // Ensure final content is displayed
            dispatch(setStreamingContent(streamingBuffer))
            dispatch(completeStreaming({
              conversationUuid: targetConversationUuid!,
              content: accumulatedContent,
              metadata
            }))
          }
        },
        (error: string) => {
          dispatch(stopStreaming())
          dispatch(setError(error))
          showErrorToast('AI Response Error', error)
        }
      )
      
    } catch (err) {
      dispatch(stopStreaming())
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Send Message', errorMessage)
    }
  }, [dispatch, currentConversation, createConversation])

  // Load more messages for pagination
  const loadMoreMessages = useCallback(async (conversationUuid: string) => {
    try {
      dispatch(setLoadingMore(true))
      dispatch(clearError())
      
      const currentPagination = pagination[conversationUuid]
      if (!currentPagination || currentPagination.page >= currentPagination.total_pages) {
        return // No more pages to load
      }
      
      const nextPage = currentPagination.page + 1
      const response = await conversationApi.getMessages(conversationUuid, nextPage, currentPagination.per_page)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'MESSAGES_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      dispatch(prependMessages({
        conversationUuid,
        messages: response.data?.messages || [],
        pagination: response.data?.pagination || currentPagination
      }))
      
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Load More Messages', errorMessage)
    } finally {
      dispatch(setLoadingMore(false))
    }
  }, [dispatch, pagination])

  // Load more conversations (for pagination)
  const loadMoreConversations = useCallback(async () => {
    try {
      if (!conversationPagination || conversationPagination.page >= conversationPagination.total_pages) {
        return // No more pages to load
      }
      
      dispatch(setLoadingMoreConversations(true))
      dispatch(clearError())
      
      const nextPage = conversationPagination.page + 1
      const response = await conversationApi.getConversations(nextPage, conversationPagination.per_page)
      
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'CONVERSATIONS_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      dispatch(appendConversations(response.data || { conversations: [], pagination: conversationPagination }))
      
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Load More Conversations', errorMessage)
    } finally {
      dispatch(setLoadingMoreConversations(false))
    }
  }, [dispatch, conversationPagination])

  // Start new chat
  const startNewChat = useCallback(() => {
    dispatch(setCurrentConversation(null))
    // Reset to auto mode when starting a new chat
    dispatch(setAutoMode(true))
  }, [dispatch])

  // Convert conversations object to array for components that expect array format
  const conversationsArray = Object.keys(conversations).map(key => conversations[key])
  
  return {
    // State
    conversations: conversationsArray,
    conversationsObject: conversations, // Expose object format for direct access
    currentConversation,
    messages: currentConversation ? messages[currentConversation.uuid] || [] : [],
    isLoading,
    error,
    isStreaming,
    streamingContent,
    streamingMetadata,
    pagination: currentConversation ? pagination[currentConversation.uuid] : null,
    isLoadingMore,
    conversationPagination,
    isLoadingMoreConversations,
    
    // Actions
    loadConversations,
    createConversation,
    selectConversation,
    sendMessage,
    loadMoreMessages,
    loadMoreConversations,
    startNewChat,
    clearError: () => dispatch(clearError()),
  }
}
