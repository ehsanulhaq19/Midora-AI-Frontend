import { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { aiApi } from '@/api/ai/api'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import {
  startStreaming,
  setStreamingContent,
  setInitialContent,
  setStreamingMetadata,
  completeStreaming,
  stopStreaming,
  setError,
  updateMessageContent,
  addMessageVersion,
  addMessageVersions,
  setCurrentMessageVersion,
  clearMessageContent,
  startRegeneration
} from '@/store/slices/conversationSlice'
import { useToast } from './use-toast'
import { handleApiError } from '@/lib/error-handler'

export const useRegenerate = () => {
  const dispatch = useDispatch()
  const { user } = useAuthRedux()
  const { error: showErrorToast } = useToast()
  const { isStreaming } = useSelector((state: RootState) => state.conversation)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const regenerateMessage = useCallback(async (
    messageUuid: string,
    aiModelUuid: string,
    conversationUuid: string
  ) => {
    try {
      setIsRegenerating(true)
      dispatch(setError(null))
      
      // Start regeneration - clear content and prepare for streaming
      dispatch(startRegeneration({ conversationUuid, messageUuid }))
      
      // Start streaming
      dispatch(startStreaming())
      
      // Track accumulated content for completion
      let accumulatedContent = ''
      let streamingBuffer = ''
      let initialContentBuffer = ''
      let lastUpdateTime = 0
      const UPDATE_THROTTLE = 50 // Update UI every 50ms max
      let hasRealContentStarted = false
      let initialContentRafPending = false
      let streamingContentRafPending = false
      let isFirstInitialChunk = true
      
      // Regenerate AI response with streaming
      await aiApi.regenerateContentStream(
        { message_uuid: messageUuid, ai_model_uuid: aiModelUuid },
        (chunk: string, type: string, metadata?: any) => {
          if (type === 'metadata') {
            // Handle metadata stream responses - update metadata state only
            if (metadata?.message_type) {
              dispatch(setStreamingMetadata({ message_type: metadata.message_type }))
            }
          } else if (type === 'model_selection') {
            console.log("regenerate metadata = ", metadata)
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
              } else if (!initialContentRafPending) {
                // Schedule RAF update for subsequent chunks (smoother than throttling)
                initialContentRafPending = true
                requestAnimationFrame(() => {
                  dispatch(setInitialContent(initialContentBuffer))
                  initialContentRafPending = false
                })
              }
            }
          } else if (type === 'content') {
            // Real content has started - clear initial content and switch to real content
            if (!hasRealContentStarted) {
              hasRealContentStarted = true
              dispatch(setInitialContent('')) // Clear initial content
            }
            
            // Handle regular content chunks
            accumulatedContent += chunk
            streamingBuffer += chunk
            
            // Update the message content in real-time
            dispatch(updateMessageContent({ 
              conversationUuid, 
              messageUuid, 
              content: streamingBuffer 
            }))
            
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
          if (metadata.type === "initial_metadata") {
            // Handle initial metadata - just store the message info for later use
            // Don't add version yet, wait for completion
          } else if (metadata.type === "completion") {
            // Handle completion - create final version with complete content
            if (metadata.message) {
              // Update the message with final content and model info
              const finalMessage = {
                ...metadata.message,
                content: accumulatedContent,
                model_name: metadata.selected_model || metadata.model_used
              }
              
              // Add as new version using the new pattern
              dispatch(addMessageVersion({
                conversationUuid,
                originalMessageUuid: messageUuid,
                newMessage: finalMessage
              }))
            }
            
            // Stop streaming
            dispatch(setStreamingContent(streamingBuffer))
            dispatch(stopStreaming())
            setIsRegenerating(false)
          }
        },
        (error: string) => {
          dispatch(stopStreaming())
          dispatch(setError(error))
          setIsRegenerating(false)
          showErrorToast('Regenerate Error', error)
        }
      )
      
    } catch (err) {
      dispatch(stopStreaming())
      setIsRegenerating(false)
      const errorMessage = handleApiError(err)
      dispatch(setError(errorMessage))
      showErrorToast('Failed to Regenerate Message', errorMessage)
    }
  }, [dispatch, showErrorToast])

  const switchMessageVersion = useCallback((
    conversationUuid: string,
    messageUuid: string,
    versionIndex: number
  ) => {
    dispatch(setCurrentMessageVersion({
      conversationUuid,
      messageUuid,
      versionIndex
    }))
  }, [dispatch])

  return {
    regenerateMessage,
    switchMessageVersion,
    isRegenerating
  }
}
