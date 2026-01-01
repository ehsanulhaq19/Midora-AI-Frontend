import { useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addConversationToProject, setProjectConversationsData } from '@/store/slices/projectsSlice'
import { conversationApi } from '@/api/conversation/api'
import { aiApi } from '@/api/ai/api'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import { setAutoMode } from '@/store/slices/aiModelsSlice'
import {
  setLoading,
  setError,
  clearError,
  setConversations,
  addConversation,
  removeConversation,
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
  setInitialContent,
  setStreamingMetadata,
  completeStreaming,
  stopStreaming,
} from '@/store/slices/conversationSlice'
import { Conversation, Message } from '@/api/conversation/types'
import { useToast } from './use-toast'
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
    initialContent,
    streamingMetadata,
    pagination,
    isLoadingMore,
    conversationPagination,
    isLoadingMoreConversations,
  } = useSelector((state: RootState) => state.conversation)
  
  const { projectConversationsData } = useSelector((state: RootState) => state.projects)
  
  // Track which conversations are being loaded to prevent duplicate API calls
  const loadingConversationsRef = useRef<Set<string>>(new Set())

  // Load conversations
  const loadConversations = useCallback(async (messageSearch?: string) => {
    try {
      dispatch(clearError())
      
      const response = await conversationApi.getConversations(1, 20, "-created_at", messageSearch)
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
  }, [dispatch, showErrorToast])

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
    // Skip if already the current conversation and messages are loaded
    if (currentConversation?.uuid === conversationUuid && messages[conversationUuid]) {
      return
    }
    
    // Prevent duplicate API calls for the same conversation
    if (loadingConversationsRef.current.has(conversationUuid)) {
      return
    }
    
    try {
      dispatch(clearError())
      
      // First, check if conversation exists in regular conversations
      let conversation = conversations[conversationUuid]
      
      // If not found, check if it's linked to a project
      let isProjectConversation = false
      if (!conversation) {
        // Check project conversations data
        const projectIds = Object.keys(projectConversationsData)
        for (const projectId of projectIds) {
          const projectConvs = projectConversationsData[projectId] || []
          const projectConv = projectConvs.find((c: any) => c.uuid === conversationUuid)
          if (projectConv) {
            // Found in project conversations - convert to Conversation format
            // DO NOT add to conversations store - project conversations should only exist in projects slice
            conversation = {
              id: projectConv.uuid, // Use uuid as id
              uuid: projectConv.uuid,
              name: projectConv.name,
              created_by: 0, // Will be updated when fetched from API if needed
              created_at: projectConv.created_at,
              updated_at: projectConv.created_at, // Use created_at as fallback
            } as Conversation
            isProjectConversation = true
            break
          }
        }
      }
      
      if (conversation) {
        dispatch(setCurrentConversation(conversation))
        
        // Load messages if not already loaded
        if (!messages[conversationUuid]) {
          loadingConversationsRef.current.add(conversationUuid)
          try {
            const response = await conversationApi.getMessages(conversationUuid, 1, 50)
            if (response.error) {
              throw new Error(response.error)
            }
            dispatch(setMessages({ 
              conversationUuid, 
              messages: response.data?.messages || [], 
              pagination: response.data?.pagination 
            }))
          } finally {
            loadingConversationsRef.current.delete(conversationUuid)
          }
        }
      } else {
        // Conversation not found in either place, fetch it from API
        // Only add to conversations store if it's NOT a project conversation
        loadingConversationsRef.current.add(conversationUuid)
        try {
          const conversationResponse = await conversationApi.getConversation(conversationUuid)
          if (conversationResponse.error) {
            throw new Error(conversationResponse.error)
          }
          const fetchedConversation = conversationResponse.data!
          
          // Check if this conversation is linked to a project before adding to conversation slice
          const isLinkedToProject = Object.keys(projectConversationsData).some(projectId => {
            const projectConvs = projectConversationsData[projectId] || []
            return projectConvs.some((c: any) => c.uuid === conversationUuid)
          })
          
          // Only add to conversations store if NOT linked to a project
          if (!isLinkedToProject) {
            dispatch(addConversation(fetchedConversation))
          }
          
          dispatch(setCurrentConversation(fetchedConversation))
          
          const messagesResponse = await conversationApi.getMessages(conversationUuid, 1, 50)
          if (messagesResponse.error) {
            throw new Error(messagesResponse.error)
          }
          dispatch(setMessages({ 
            conversationUuid, 
            messages: messagesResponse.data?.messages || [], 
            pagination: messagesResponse.data?.pagination 
          }))
        } finally {
          loadingConversationsRef.current.delete(conversationUuid)
        }
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Load Conversation', errorMessage)
      loadingConversationsRef.current.delete(conversationUuid)
    }
  }, [dispatch, conversations, messages, projectConversationsData, showErrorToast, currentConversation])

  // Send a message
  const sendMessage = useCallback(async (content: string, modelUuid?: string, conversationUuid?: string, fileUuids?: string[], uploadedFiles?: any[], projectId?: string) => {
    try {
      dispatch(clearError())
      
      let targetConversationUuid = conversationUuid || currentConversation?.uuid
      
      // Create conversation if none exists
      if (!targetConversationUuid) {
        const response = await conversationApi.createConversation({ name: `${content.substring(0, 50)}...` })
        if (response.error) {
          const errorObject = response.processedError || {
            error_type: 'CONVERSATION_CREATION_FAILED',
            error_message: response.error,
            status: response.status
          }
          throw new Error(JSON.stringify(errorObject))
        }
        const newConversation = response.data!
        
        // Only add to conversation slice if NOT linked to a project
        // Project conversations should only exist in projects slice
        if (!projectId) {
          dispatch(addConversation(newConversation))
        }
        
        dispatch(setCurrentConversation(newConversation))
        targetConversationUuid = newConversation.uuid
        
        // Store project association if projectId is provided
        if (projectId) {
          dispatch(addConversationToProject({ projectId, conversationUuid: targetConversationUuid }))
        }
      } else {
        // Associate existing conversation with project if projectId is provided
        if (projectId) {
          dispatch(addConversationToProject({ projectId, conversationUuid: targetConversationUuid }))
          // Remove from conversation slice if it exists there (it's now a project conversation)
          if (conversations[targetConversationUuid]) {
            dispatch(removeConversation(targetConversationUuid))
          }
        }
      }
      
      // Convert uploaded files to LinkedFile format
      const linkedFiles = uploadedFiles?.map(file => ({
        uuid: file.uuid,
        filename: file.filename,
        file_extension: file.file_extension,
        file_type: file.file_type,
        file_size: file.file_size,
        storage_type: 'offline' // Default storage type
      })) || []

      // Add user message to store immediately
      const messageUuid = `user-${Date.now()}`
      const userMessage: Message = {
        uuid: messageUuid,
        content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        model_name: null,
        linked_files: linkedFiles.length > 0 ? linkedFiles : undefined,
        sender: user ? {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          uuid: user.uuid,
          username: user.username || '',
          is_active: true,
          is_verified: true,
          is_onboarded: true,
          meta_data: {
            sso_created: true,
            created_via: 'sso'
          }
        } : {
          email: '',
          first_name: '',
          last_name: '',
          uuid: '',
          username: '',
          is_active: false,
          is_verified: false,
          is_onboarded: false,
          meta_data: null
        }
      }
      
      dispatch(addMessage({ conversationUuid: targetConversationUuid, message: userMessage }))
      
      // Start streaming
      dispatch(startStreaming())
      
      // Track accumulated content for completion
      let accumulatedContent = ''
      let streamingBuffer = ''
      let initialContentBuffer = ''
      let lastUpdateTime = 0
      let lastInitialUpdateTime = 0
      const UPDATE_THROTTLE = 50 // Update UI every 50ms max
      let hasRealContentStarted = false
      let initialContentRafPending = false
      let streamingContentRafPending = false
      let isFirstInitialChunk = true
      
      // Generate AI response with streaming
      await aiApi.generateContentStream(
        { query: content, conversation_uuid: targetConversationUuid, stream: true, ai_model_uuid: modelUuid, file_uuids: fileUuids, project_uuid: projectId },
        (chunk: string, type: string, metadata?: any) => {
          if (type === 'metadata') {
            // Handle metadata stream responses - update metadata state only
            if (metadata?.message_type) {
              dispatch(setStreamingMetadata({ message_type: metadata.message_type }))
            }
          } else if (type === 'model_selection') {
            console.log("metadata = ", metadata)
            // Handle model selection stream responses
            dispatch(setStreamingMetadata({
              selected_model: metadata?.selected_model,
              selected_provider: metadata?.selected_provider,
              query_category: metadata?.query_category,
              rank: metadata?.rank
            }))
          } else if (type === 'initial_content') {
            // Handle initial content from local model (only show if real content hasn't started)
            if (!hasRealContentStarted) {
              initialContentBuffer += chunk
              
              // Dispatch immediately on first chunk for instant feedback
              if (isFirstInitialChunk) {
                isFirstInitialChunk = false
                dispatch(setInitialContent(initialContentBuffer))
                lastInitialUpdateTime = Date.now()
              } else if (!initialContentRafPending) {
                // Schedule RAF update for subsequent chunks (smoother than throttling)
                initialContentRafPending = true
                requestAnimationFrame(() => {
                  dispatch(setInitialContent(initialContentBuffer))
                  initialContentRafPending = false
                  lastInitialUpdateTime = Date.now()
                })
              }
            }
          } else if (type === 'content') {
            // Real content has started - clear initial content and switch to real content
            if (!hasRealContentStarted) {
              hasRealContentStarted = true
              dispatch(setInitialContent('')) // Clear initial content
            }
            
            accumulatedContent += chunk
            streamingBuffer += chunk
            
            // Throttle UI updates for smoother performance
            const now = Date.now()
            if (now - lastUpdateTime >= UPDATE_THROTTLE) {
              dispatch(setStreamingContent(streamingBuffer))
              lastUpdateTime = now
            } else if (!streamingContentRafPending) {
              // Use RAF as fallback for smooth updates
              streamingContentRafPending = true
              requestAnimationFrame(() => {
                dispatch(setStreamingContent(streamingBuffer))
                streamingContentRafPending = false
                lastUpdateTime = Date.now()
              })
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
            
                // Link conversation to project if projectId was provided
                if (projectId && targetConversationUuid) {
                  dispatch(addConversationToProject({ projectId, conversationUuid: targetConversationUuid }))
                  
                  // Remove from conversation slice if it exists there (it's now a project conversation)
                  if (conversations[targetConversationUuid]) {
                    dispatch(removeConversation(targetConversationUuid))
                  }
                  
                  // Add conversation data to projectConversationsData
                  const conversation = conversations[targetConversationUuid] || {
                    uuid: targetConversationUuid,
                    name: metadata.conversation_name || content.substring(0, 50) + '...',
                    created_at: new Date().toISOString(),
                  }
                  const conversationData = {
                    uuid: conversation.uuid || targetConversationUuid,
                    name: conversation.name || metadata.conversation_name || content.substring(0, 50) + '...',
                    created_at: conversation.created_at || new Date().toISOString()
                  }
                  // Get existing conversations for this project
                  const existingConversations = projectConversationsData[projectId] || []
                  // Check if conversation already exists
                  if (!existingConversations.find((c: any) => c.uuid === conversationData.uuid)) {
                    dispatch(setProjectConversationsData({
                      projectId,
                      conversations: [...existingConversations, conversationData]
                    }))
                  }
                }
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
  }, [dispatch, currentConversation, createConversation, showErrorToast, conversations, projectConversationsData])

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
  const loadMoreConversations = useCallback(async (messageSearch?: string) => {
    try {
      if (!conversationPagination || conversationPagination.page >= conversationPagination.total_pages) {
        return // No more pages to load
      }
      
      dispatch(setLoadingMoreConversations(true))
      dispatch(clearError())
      
      const nextPage = conversationPagination.page + 1
      const response = await conversationApi.getConversations(nextPage, conversationPagination.per_page, "-created_at", messageSearch)
      
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
  }, [dispatch, conversationPagination, showErrorToast])

  // Start new chat
  const startNewChat = useCallback(() => {
    // Stop any ongoing streaming when starting a new chat
    dispatch(stopStreaming())
    dispatch(setCurrentConversation(null))
    // Reset to auto mode when starting a new chat
    dispatch(setAutoMode(true))
  }, [dispatch])

  // Delete a conversation
  const deleteConversation = useCallback(async (conversationUuid: string) => {
    try {
      dispatch(clearError())
      
      const response = await conversationApi.deleteConversation(conversationUuid)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'CONVERSATION_DELETION_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      // Remove conversation from store
      dispatch(removeConversation(conversationUuid))
      
      // If it was the current conversation, clear it
      if (currentConversation?.uuid === conversationUuid) {
        dispatch(setCurrentConversation(null))
      }
      
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Delete Conversation', errorMessage)
      return false
    }
  }, [dispatch, currentConversation, showErrorToast])

  // Archive a conversation
  const archiveConversation = useCallback(async (conversationUuid: string) => {
    try {
      dispatch(clearError())
      
      const response = await conversationApi.archiveConversation(conversationUuid)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'CONVERSATION_ARCHIVE_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      // Remove conversation from store (archived conversations are filtered out)
      dispatch(removeConversation(conversationUuid))
      
      // If it was the current conversation, clear it
      if (currentConversation?.uuid === conversationUuid) {
        dispatch(setCurrentConversation(null))
      }
      
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Archive Conversation', errorMessage)
      return false
    }
  }, [dispatch, currentConversation, showErrorToast])

  // Unarchive a conversation
  const unarchiveConversation = useCallback(async (conversationUuid: string) => {
    try {
      dispatch(clearError())
      
      const response = await conversationApi.unarchiveConversation(conversationUuid)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'CONVERSATION_UNARCHIVE_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      // If conversation data is returned, add it back to the store
      if (response.data) {
        dispatch(addConversation(response.data))
      }
      
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Unarchive Conversation', errorMessage)
      return false
    }
  }, [dispatch, showErrorToast])

  // Load archived conversations
  const loadArchivedConversations = useCallback(async (messageSearch?: string, page: number = 1, perPage: number = 20) => {
    try {
      dispatch(clearError())
      
      const response = await conversationApi.getArchivedConversations(page, perPage, "-created_at", messageSearch)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'ARCHIVED_CONVERSATIONS_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      return {
        conversations: response.data?.conversations || [],
        pagination: response.data?.pagination || { page: 1, per_page: 20, total: 0, total_pages: 0 }
      }
    } catch (err) {
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Load Archived Conversations', errorMessage)
      throw err
    }
  }, [dispatch, showErrorToast])

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
    initialContent,
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
    deleteConversation,
    archiveConversation,
    unarchiveConversation,
    loadArchivedConversations,
    clearError: () => dispatch(clearError()),
  }
}
