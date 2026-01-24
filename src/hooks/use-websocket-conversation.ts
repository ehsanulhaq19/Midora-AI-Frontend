/*
WebSocket Conversation Listener Hook
Manages WebSocket connection for real-time conversation message updates
*/

import { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { addMessage } from '@/store/slices/conversationSlice'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import { useToast } from '@/hooks/use-toast'

interface WebSocketMessage {
  type: string
  message?: any
  conversation?: any
  timestamp?: string
}

export const useWebSocketConversation = () => {
  const dispatch = useDispatch()
  const { user } = useAuthRedux()
  const { error: showErrorToast } = useToast()
  const websocketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000

  const currentConversation = useSelector(
    (state: RootState) => state.conversation.currentConversation
  )
  const messages = useSelector(
    (state: RootState) => state.conversation.messages
  )

  // Connect to the WebSocket user-specific channel
  const connect = useCallback(() => {
    if (!user || !user.uuid) {
      console.warn('Cannot connect to WebSocket: User not authenticated or no UUID')
      return
    }

    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.debug('WebSocket already connected')
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        console.warn('No access token found for WebSocket connection')
        return
      }

      // Build WebSocket URL with encoded user UUID and token
      const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const wsHost = window.location.host
      const wsUrl = `${wsProtocol}://${wsHost}/ws/user/${user.uuid}?token=${encodeURIComponent(token)}`

      console.log('Connecting to WebSocket:', wsUrl.replace(token, 'REDACTED'))

      websocketRef.current = new WebSocket(wsUrl)

      websocketRef.current.onopen = () => {
        console.log('WebSocket connected successfully')
        reconnectAttemptsRef.current = 0
      }

      websocketRef.current.onmessage = (event: MessageEvent) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data)
          console.log('Received WebSocket message:', data.type)

          // Handle different message types
          switch (data.type) {
            case 'user_channel_connected':
              console.log('Connected to user channel:', data.message)
              break

            case 'message_generate':
            case 'message_regenerate':
              handleMessageEvent(data)
              break

            case 'pong':
              console.debug('Received pong from server')
              break

            case 'error':
              console.error('WebSocket error:', data)
              showErrorToast('WebSocket Error', 'Received error from server')
              break

            default:
              console.debug('Unknown message type:', data.type)
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error, event.data)
        }
      }

      websocketRef.current.onerror = (event: Event) => {
        console.error('WebSocket error:', event)
        showErrorToast('WebSocket Error', 'Connection error occurred')
      }

      websocketRef.current.onclose = () => {
        console.log('WebSocket disconnected')
        websocketRef.current = null

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1
          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
          )

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectDelay)
        } else {
          console.error('Max reconnection attempts reached')
          showErrorToast(
            'WebSocket Connection Failed',
            'Could not establish WebSocket connection after multiple attempts'
          )
        }
      }
    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      showErrorToast('WebSocket Connection Error', 'Failed to connect to WebSocket')
    }
  }, [user, showErrorToast])

  // Handle incoming message events (message_generate or message_regenerate)
  const handleMessageEvent = useCallback(
    (data: WebSocketMessage) => {
      if (!data.message || !data.conversation) {
        console.warn('Received message event with incomplete data')
        return
      }

      const conversationUuid = data.conversation.uuid

      // Only add message if it belongs to the currently open conversation
      if (currentConversation && currentConversation.uuid === conversationUuid) {
        console.log('Adding message to current conversation:', data.message.uuid)

        dispatch(
          addMessage({
            conversationUuid,
            message: data.message,
          })
        )
      } else {
        console.log(
          'Message received for non-active conversation. Will increment unread count.',
          conversationUuid
        )
        // TODO: Increment unread message count for the conversation in sidebar
      }
    },
    [currentConversation, dispatch]
  )

  // Send periodic pings to keep connection alive
  useEffect(() => {
    const pingInterval = setInterval(() => {
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        try {
          websocketRef.current.send(
            JSON.stringify({
              type: 'ping',
              timestamp: new Date().toISOString(),
            })
          )
        } catch (error) {
          console.error('Error sending ping:', error)
        }
      }
    }, 30000) // Ping every 30 seconds

    return () => clearInterval(pingInterval)
  }, [])

  // Connect to WebSocket when user is authenticated
  useEffect(() => {
    if (user && user.uuid) {
      connect()
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close()
        websocketRef.current = null
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [user, connect])

  return {
    isConnected: websocketRef.current?.readyState === WebSocket.OPEN,
    reconnectAttempts: reconnectAttemptsRef.current,
  }
}

