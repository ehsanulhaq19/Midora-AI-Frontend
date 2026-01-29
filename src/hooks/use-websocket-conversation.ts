'use client'

import { useCallback, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addMessage } from '@/store/slices/conversationSlice'
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { WebSocketMessage, WebSocketMessageHandlers } from '@/hooks/use-websocket'
import { MESSAGE_GENERATE, MESSAGE_REGENERATE } from '@/constants/websocket-events'

interface WebSocketConversationMessage extends WebSocketMessage {
  message?: Record<string, any>
  response_message?: Record<string, any>
}

/**
 * Hook that registers conversation-specific message handlers with the global WebSocket connection.
 * Automatically handles cleanup of handlers on component unmount.
 * 
 * Listens for MESSAGE_GENERATE and MESSAGE_REGENERATE events and dispatches messages
 * to Redux store for the current active conversation.
 * 
 * Usage:
 * ```tsx
 * const { isConnected, reconnectAttempts } = useWebSocketConversation()
 * ```
 */
export const useWebSocketConversation = () => {
  const dispatch = useDispatch()
  const { isConnected, reconnectAttempts, registerHandlers } = useWebSocketContext()
  const currentConversation = useSelector(
    (state: RootState) => state.conversation.currentConversation
  )

  const handleMessageEvent = useCallback(
    (data: WebSocketConversationMessage) => {
      if (!data.message) {
        console.warn('Received message event with no message data')
        return
      }

      const conversationUuid = data.response_message?.conversation_uuid

      if (!conversationUuid) {
        console.warn('Received message event without conversation context')
        return
      }

      if (currentConversation && currentConversation.uuid === conversationUuid) {
        dispatch(
          addMessage({
            conversationUuid,
            message: data.message,
          })
        )
      }
    },
    [currentConversation, dispatch]
  )

  const handlers = useMemo<WebSocketMessageHandlers>(
    () => ({
      [MESSAGE_GENERATE]: handleMessageEvent,
      [MESSAGE_REGENERATE]: handleMessageEvent,
    }),
    [handleMessageEvent]
  )

  useEffect(() => {
    const unregister = registerHandlers(handlers)
    return unregister
  }, [handlers, registerHandlers])

  return {
    isConnected,
    reconnectAttempts,
  }
}

