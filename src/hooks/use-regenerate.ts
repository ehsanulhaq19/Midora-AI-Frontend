import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { aiApi } from '@/api/ai/api'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import {
  startStreaming,
  setStreamingContent,
  setStreamingMetadata,
  completeStreaming,
  stopStreaming,
  setError,
  updateMessageContent,
  addMessageVersion,
  setCurrentMessageVersion
} from '@/store/slices/conversationSlice'
import { useToast } from './use-toast'
import { handleApiError } from '@/lib/error-handler'

export const useRegenerate = () => {
  const dispatch = useDispatch()
  const { user } = useAuthRedux()
  const { error: showErrorToast } = useToast()
  const { isStreaming } = useSelector((state: RootState) => state.conversation)

  const regenerateMessage = useCallback(async (
    messageUuid: string,
    aiModelUuid: string,
    conversationUuid: string
  ) => {
    try {
      dispatch(setError(null))
      
      // Start streaming
      dispatch(startStreaming())
      
      // Track accumulated content for completion
      let accumulatedContent = ''
      let streamingBuffer = ''
      let lastUpdateTime = 0
      const UPDATE_THROTTLE = 50 // Update UI every 50ms max
      
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
          if (metadata.type === "initial_metadata") {
            // Handle initial metadata - this contains the new message
            if (metadata.message) {
              // Add the new regenerated message as a version
              dispatch(addMessageVersion({
                conversationUuid,
                originalMessageUuid: messageUuid,
                newMessage: metadata.message
              }))
            }
          } else {
            // Ensure final content is displayed
            dispatch(setStreamingContent(streamingBuffer))
            dispatch(completeStreaming({
              conversationUuid,
              content: accumulatedContent,
              metadata
            }))
          }
        },
        (error: string) => {
          dispatch(stopStreaming())
          dispatch(setError(error))
          showErrorToast('Regenerate Error', error)
        }
      )
      
    } catch (err) {
      dispatch(stopStreaming())
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
    isRegenerating: isStreaming
  }
}
