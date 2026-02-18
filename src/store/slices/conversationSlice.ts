import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Conversation, Message } from '@/api/conversation/types'
import { AIModel, StreamingResponse } from '@/api/ai/types'
import { ConversationState } from '@/types/conversation'

const initialState: ConversationState = {
  conversations: {},
  currentConversation: null,
  messages: {},
  isLoading: false,
  error: null,
  isStreaming: false,
  streamingContent: '',
  initialContent: '',
  streamingMetadata: null,
  aiModels: [],
  selectedModel: null,
  pagination: {},
  isLoadingMore: false,
  conversationPagination: null,
  isLoadingMoreConversations: false,
}

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },

    // Clear error state
    clearError: (state) => {
      state.error = null
    },

    // Set conversations
    setConversations: (state, action: PayloadAction<{ conversations: Conversation[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>) => {
      const conversationsObject: { [conversationUuid: string]: Conversation } = {}
      action.payload.conversations.forEach((conversation: Conversation) => {
        conversationsObject[conversation.uuid] = conversation
      })
      state.conversations = conversationsObject
      state.conversationPagination = action.payload.pagination
    },

    // Add a new conversation
    addConversation: (state, action: PayloadAction<Conversation>) => {
      state.conversations[action.payload.uuid] = action.payload
    },

    // Update a conversation
    updateConversation: (state, action: PayloadAction<Conversation>) => {
      if (state.conversations[action.payload.uuid]) {
        state.conversations[action.payload.uuid] = action.payload
      }
    },

    // Remove a conversation
    removeConversation: (state, action: PayloadAction<string>) => {
      delete state.conversations[action.payload]
      if (state.currentConversation?.uuid === action.payload) {
        state.currentConversation = null
      }
    },

    // Set current conversation
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload
    },

    // Set messages for a conversation
    setMessages: (state, action: PayloadAction<{ conversationUuid: string; messages: Message[]; pagination?: { page: number, per_page: number, total: number, total_pages: number } }>) => {
      state.messages[action.payload.conversationUuid] = action.payload.messages
      if (action.payload.pagination) {
        state.pagination[action.payload.conversationUuid] = action.payload.pagination
      }
    },

    // Prepend messages for a conversation (for pagination)
    prependMessages: (state, action: PayloadAction<{ conversationUuid: string; messages: Message[]; pagination: { page: number, per_page: number, total: number, total_pages: number } }>) => {
      const { conversationUuid, messages, pagination } = action.payload
      if (!state.messages[conversationUuid]) {
        state.messages[conversationUuid] = []
      }
      // Prepend new messages to the beginning of the array
      state.messages[conversationUuid] = [...messages, ...state.messages[conversationUuid]]
      state.pagination[conversationUuid] = pagination
    },

    // Set loading more state
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMore = action.payload
    },

    // Set loading more conversations state
    setLoadingMoreConversations: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMoreConversations = action.payload
    },

    // Append more conversations (for pagination)
    appendConversations: (state, action: PayloadAction<{ conversations: Conversation[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>) => {
      action.payload.conversations.forEach((conversation: Conversation) => {
        state.conversations[conversation.uuid] = conversation
      })
      state.conversationPagination = action.payload.pagination
    },

    // Add a message to a conversation
    addMessage: (state, action: PayloadAction<{ conversationUuid: string; message: Message }>) => {
      const { conversationUuid, message } = action.payload
      // Only add message if it's not null or undefined
      if (message) {
        if (!state.messages[conversationUuid]) {
          state.messages[conversationUuid] = []
        }
        state.messages[conversationUuid].push(message)
      }
    },

    // Update a message
    updateMessage: (state, action: PayloadAction<{ conversationUuid: string; messageUuid: string; updates: Partial<Message> }>) => {
      const { conversationUuid, messageUuid, updates } = action.payload
      const messages = state.messages[conversationUuid]
      if (messages) {
        const index = messages.findIndex(msg => msg.uuid === messageUuid)
        if (index !== -1) {
          messages[index] = { ...messages[index], ...updates }
        }
      }
    },

    // Remove a message
    removeMessage: (state, action: PayloadAction<{ conversationUuid: string; messageUuid: string }>) => {
      const { conversationUuid, messageUuid } = action.payload
      const messages = state.messages[conversationUuid]
      if (messages) {
        state.messages[conversationUuid] = messages.filter(msg => msg.uuid !== messageUuid)
      }
    },

    // Set selected model
    setSelectedModel: (state, action: PayloadAction<AIModel | null>) => {
      state.selectedModel = action.payload
    },


    // Start streaming
    startStreaming: (state) => {
      state.isStreaming = true
      state.streamingContent = ''
      state.initialContent = ''
      state.streamingMetadata = null
    },

    // Update streaming content
    updateStreamingContent: (state, action: PayloadAction<string>) => {
      state.streamingContent += action.payload
    },

    // Set streaming content (for batch updates)
    setStreamingContent: (state, action: PayloadAction<string>) => {
      state.streamingContent = action.payload
      // Clear initial content when real content starts
      if (action.payload && state.initialContent) {
        state.initialContent = ''
      }
    },

    // Set initial content (from local model)
    setInitialContent: (state, action: PayloadAction<string>) => {
      state.initialContent = action.payload
    },

    // Set streaming metadata (for metadata stream responses)
    setStreamingMetadata: (state, action: PayloadAction<{ 
      message_type?: string
      selected_model?: string
      selected_provider?: string
      query_category?: string
      rank?: number
    } | null>) => {
      state.streamingMetadata = { ...state.streamingMetadata, ...action.payload }
    },

    // Complete streaming
    completeStreaming: (state, action: PayloadAction<{ conversationUuid: string; content: string; metadata: any }>) => {
      state.isStreaming = false
      state.streamingContent = ''
      state.initialContent = ''
      
      // Add the complete AI message to the conversation only if message exists (not null)
      const { conversationUuid, content, metadata } = action.payload
      
      if (metadata.message) {
        const aiMessage: Message = metadata.message
        
        // Add model_name from streamingMetadata if available
        if (state.streamingMetadata?.selected_model) {
          aiMessage.model_name = state.streamingMetadata.selected_model
        }
        
        if (!state.messages[conversationUuid]) {
          state.messages[conversationUuid] = []
        }
        state.messages[conversationUuid].push(aiMessage)
      }
      
      // Clear streaming metadata after completion
      state.streamingMetadata = null
    },

    // Stop streaming
    stopStreaming: (state) => {
      state.isStreaming = false
      state.streamingContent = ''
      state.initialContent = ''
      state.streamingMetadata = null
    },

    // Update message content (for regeneration)
    updateMessageContent: (state, action: PayloadAction<{ conversationUuid: string; messageUuid: string; content: string }>) => {
      const { conversationUuid, messageUuid, content } = action.payload
      const messages = state.messages[conversationUuid]
      if (messages) {
        const index = messages.findIndex(msg => msg.uuid === messageUuid)
        if (index !== -1) {
          messages[index].content = content
        }
      }
    },

    // Clear message content (for regeneration)
    clearMessageContent: (state, action: PayloadAction<{ conversationUuid: string; messageUuid: string }>) => {
      const { conversationUuid, messageUuid } = action.payload
      const messages = state.messages[conversationUuid]
      if (messages) {
        const index = messages.findIndex(msg => msg.uuid === messageUuid)
        if (index !== -1) {
          messages[index].content = ''
        }
      }
    },

    // Start regeneration (clear content and prepare for streaming)
    startRegeneration: (state, action: PayloadAction<{ conversationUuid: string; messageUuid: string }>) => {
      const { conversationUuid, messageUuid } = action.payload
      const messages = state.messages[conversationUuid]
      if (messages) {
        const index = messages.findIndex(msg => msg.uuid === messageUuid)
        if (index !== -1) {
          // Initialize message versions if not exists
          if (!messages[index].versions) {
            // Create a deep copy of the current message to avoid circular reference
            const currentMessageCopy = { 
              ...messages[index],
              // Ensure we preserve the original content and model name
              content: messages[index].content,
              model_name: messages[index].model_name
            }
            messages[index].versions = [currentMessageCopy]
            // Set current version index to 0 for the first version
            messages[index].currentVersionIndex = 0
          }
          // Clear the content to show streaming, but keep the versions intact
          messages[index].content = ''
        }
      }
    },

    // Add message version (for regeneration)
    addMessageVersion: (state, action: PayloadAction<{ conversationUuid: string; originalMessageUuid: string; newMessage: Message }>) => {
      const { conversationUuid, originalMessageUuid, newMessage } = action.payload
      const messages = state.messages[conversationUuid]
      if (messages) {
        const index = messages.findIndex(msg => msg.uuid === originalMessageUuid)
        if (index !== -1) {
          // Initialize message versions if not exists
          if (!messages[index].versions) {
            // Create a deep copy of the current message to avoid circular reference
            const currentMessageCopy = { 
              ...messages[index],
              // Ensure we preserve the original content and model name
              content: messages[index].content,
              model_name: messages[index].model_name
            }
            messages[index].versions = [currentMessageCopy]
            // Set current version index to 0 for the first version
            messages[index].currentVersionIndex = 0
          }
          // Add new version
          messages[index].versions.push(newMessage)
          // Update current version index to show the new version
          messages[index].currentVersionIndex = messages[index].versions.length - 1
          // Update content to show new version
          messages[index].content = newMessage.content
          // Update model name if available
          if (newMessage.model_name) {
            messages[index].model_name = newMessage.model_name
          }
        }
      }
    },

    // Add multiple message versions (for new response structure)
    addMessageVersions: (state, action: PayloadAction<{ conversationUuid: string; parentMessageUuid: string; versions: Message[] }>) => {
      const { conversationUuid, parentMessageUuid, versions } = action.payload
      const messages = state.messages[conversationUuid]
      if (messages && versions.length > 0) {
        const index = messages.findIndex(msg => msg.uuid === parentMessageUuid)
        if (index !== -1) {
          // Set up versions array
          messages[index].versions = [...versions]
          messages[index].currentVersionIndex = versions.length - 1
          // Update content to show the latest version
          const latestVersion = versions[versions.length - 1]
          messages[index].content = latestVersion.content
          messages[index].model_name = latestVersion.model_name
        } else {
          // Parent message not found, add the first message as the main message with versions
          const mainMessage = versions[0]
          mainMessage.versions = [...versions]
          mainMessage.currentVersionIndex = versions.length - 1
          mainMessage.content = versions[versions.length - 1].content
          mainMessage.model_name = versions[versions.length - 1].model_name
          messages.push(mainMessage)
        }
      }
    },

    // Set current message version
    setCurrentMessageVersion: (state, action: PayloadAction<{ conversationUuid: string; messageUuid: string; versionIndex: number }>) => {
      const { conversationUuid, messageUuid, versionIndex } = action.payload
      const messages = state.messages[conversationUuid]
      if (messages) {
        const index = messages.findIndex(msg => msg.uuid === messageUuid)
        if (index !== -1 && messages[index].versions && messages[index].versions[versionIndex]) {
          messages[index].currentVersionIndex = versionIndex
          messages[index].content = messages[index].versions[versionIndex].content
          // Also update model name if available in the version
          if (messages[index].versions[versionIndex].model_name) {
            messages[index].model_name = messages[index].versions[versionIndex].model_name
          }
        }
      }
    },

    // Clear all conversation data
    clearConversations: (state) => {
      state.conversations = {}
      state.currentConversation = null
      state.messages = {}
      state.isStreaming = false
      state.streamingContent = ''
      state.initialContent = ''
      state.streamingMetadata = null
      state.conversationPagination = null
    },

    // Initialize conversation state
    initializeConversations: (state, action: PayloadAction<{ conversations: Conversation[]; messages: { [key: string]: Message[] } }>) => {
      const conversationsObject: { [conversationUuid: string]: Conversation } = {}
      action.payload.conversations.forEach((conversation: Conversation) => {
        conversationsObject[conversation.uuid] = conversation
      })
      state.conversations = conversationsObject
      state.messages = action.payload.messages
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  setConversations,
  addConversation,
  updateConversation,
  removeConversation,
  setCurrentConversation,
  setMessages,
  prependMessages,
  setLoadingMore,
  setLoadingMoreConversations,
  appendConversations,
  addMessage,
  removeMessage,
  updateMessage,
  updateMessageContent,
  clearMessageContent,
  startRegeneration,
  addMessageVersion,
  addMessageVersions,
  setCurrentMessageVersion,
  setAIModels,
  setSelectedModel,
  startStreaming,
  updateStreamingContent,
  setStreamingContent,
  setInitialContent,
  setStreamingMetadata,
  completeStreaming,
  stopStreaming,
  clearConversations,
  initializeConversations,
} = conversationSlice.actions

export default conversationSlice.reducer
