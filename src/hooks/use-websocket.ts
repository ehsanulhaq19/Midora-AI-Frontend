import { useEffect, useRef, useCallback, useMemo } from 'react'
import {
  CONNECTION_ESTABLISHED,
  PONG,
  PING,
  GET_PENDING,
  PENDING_CHECK_COMPLETE,
  ERROR,
  DEFAULT_PING_INTERVAL,
  DEFAULT_RECONNECT_DELAY,
  DEFAULT_MAX_RECONNECT_ATTEMPTS,
  isServerMessageType,
  isSystemMessage,
  isContentMessage,
} from '@/constants/websocket-events'
import { useToast } from '@/hooks/use-toast'
import { appConfig } from "@/config/app";

export interface WebSocketMessage {
  type: string
  [key: string]: any
}

export type WebSocketMessageHandler = (message: WebSocketMessage) => void | Promise<void>

export interface WebSocketMessageHandlers {
  [messageType: string]: WebSocketMessageHandler
}

export interface UseWebSocketOptions {
  userUUID?: string
  token?: string
  handlers?: WebSocketMessageHandlers
  pingInterval?: number
  reconnectDelay?: number
  maxReconnectAttempts?: number
  autoConnect?: boolean
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: Error) => void
  customUrl?: string
}
export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    userUUID,
    token,
    handlers = {},
    pingInterval = DEFAULT_PING_INTERVAL,
    reconnectDelay = DEFAULT_RECONNECT_DELAY,
    maxReconnectAttempts = DEFAULT_MAX_RECONNECT_ATTEMPTS,
    autoConnect = true,
    onConnected,
    onDisconnected,
    onError,
    customUrl,
  } = options

  const { error: showErrorToast } = useToast()

  const websocketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const isConnectedRef = useRef(false)
  const connectionInProgressRef = useRef(false)

  const defaultHandlers = useMemo<WebSocketMessageHandlers>(
    () => ({
      [CONNECTION_ESTABLISHED]: () => {
        console.log('Connected to WebSocket channel')
      },
      [PONG]: () => {
        console.debug('Received pong from server')
      },
      [PENDING_CHECK_COMPLETE]: (msg: WebSocketMessage) => {
        console.log('Pending events check completed:', msg.data)
      },
      [ERROR]: (msg: WebSocketMessage) => {
        console.error('WebSocket server error:', msg.message)
        showErrorToast?.('WebSocket Error', msg.message || 'Received error from server')
      },
    }),
    [showErrorToast]
  )

  const allHandlers = useMemo(() => ({ ...defaultHandlers, ...handlers }), [defaultHandlers, handlers])

  const handleMessage = useCallback(
    async (message: WebSocketMessage) => {
      try {
        const messageType = message.type

        if (!messageType) {
          console.warn('Received message without type')
          return
        }

        console.debug(`Received WebSocket message: ${messageType}`)

        // Check if handler exists for this message type
        if (messageType in allHandlers) {
          const handler = allHandlers[messageType]
          await handler(message)
        } else {
          console.debug(`No handler found for message type: ${messageType}`)
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error)
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)))
        }
      }
    },
    [allHandlers, onError]
  )

  const send = useCallback((message: WebSocketMessage) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket is not connected')
      return false
    }

    try {
      websocketRef.current.send(JSON.stringify(message))
      return true
    } catch (error) {
      console.error('Error sending WebSocket message:', error)
      return false
    }
  }, [])

  const sendPing = useCallback(() => {
    send({
      type: PING,
      timestamp: new Date().toISOString(),
    })
  }, [send])

  const requestPending = useCallback(() => {
    send({
      type: GET_PENDING,
    })
  }, [send])

  const connect = useCallback(() => {
    if (!userUUID || !token) {
      console.warn('Cannot connect to WebSocket: Missing userUUID or token')
      return
    }

    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      console.debug('WebSocket already connected')
      return
    }

    try {
      // Build WebSocket URL
      let wsUrl: string
      if (customUrl) {
        wsUrl = customUrl
      } else {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
        const wsHost = appConfig.backendUrl.replace(/^https?:\/\//, '').split('/')[0]
        wsUrl = `${wsProtocol}://${wsHost}/ws/user/${userUUID}?token=${encodeURIComponent(token)}`
      }

      console.log('Connecting to WebSocket:', wsUrl.replace(token, 'REDACTED'))
      websocketRef.current = new WebSocket(wsUrl)

      websocketRef.current.onopen = () => {
        console.log('WebSocket connected successfully')
        isConnectedRef.current = true
        reconnectAttemptsRef.current = 0
        if (onConnected) onConnected()

        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
        pingIntervalRef.current = setInterval(() => {
          if (websocketRef.current?.readyState === WebSocket.OPEN) sendPing()
        }, pingInterval)
      }

      websocketRef.current.onmessage = (event: MessageEvent) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data)
          handleMessage(data)
        } catch (error) {
          console.error('Error parsing WebSocket message:', error, event.data)
        }
      }

      websocketRef.current.onerror = (event: Event) => {
        console.error('WebSocket error:', event)
        const error = new Error('WebSocket connection error')
        if (onError) onError(error)
        showErrorToast?.('WebSocket Error', 'Connection error occurred')
      }

      websocketRef.current.onclose = () => {
        console.log('WebSocket disconnected')
        isConnectedRef.current = false

        if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
        if (onDisconnected) onDisconnected()

        if (reconnectAttemptsRef.current < maxReconnectAttempts && autoConnect) {
          reconnectAttemptsRef.current += 1
          console.log(
            `Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`
          )
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectDelay * reconnectAttemptsRef.current)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts && autoConnect) {
          console.error('Max reconnection attempts reached')
          const error = new Error('Failed to establish WebSocket connection after multiple attempts')
          if (onError) onError(error)
          showErrorToast?.(
            'WebSocket Connection Failed',
            'Could not establish WebSocket connection after multiple attempts'
          )
        }
      }
    } catch (error) {
      console.error('Error connecting to WebSocket:', error)
      const err = error instanceof Error ? error : new Error(String(error))
      if (onError) {
        onError(err)
      }
      showErrorToast?.('WebSocket Connection Error', 'Failed to connect to WebSocket')
    }
  }, [
    userUUID,
    token,
    customUrl,
    onConnected,
    onDisconnected,
    onError,
    handleMessage,
    sendPing,
    pingInterval,
    reconnectDelay,
    maxReconnectAttempts,
    autoConnect,
    showErrorToast,
  ])

  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close()
      websocketRef.current = null
    }
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current)
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
    isConnectedRef.current = false
  }, [])

  useEffect(() => {
    if (connectionInProgressRef.current) return

    if (autoConnect && userUUID && token) {
      connectionInProgressRef.current = true

      setTimeout(() => {
        connect()
        connectionInProgressRef.current = false
      }, 5000)
    }
    return () => disconnect()
  }, [userUUID, token, autoConnect, connect, disconnect])

  return {
    isConnected: isConnectedRef.current,
    reconnectAttempts: reconnectAttemptsRef.current,
    maxReconnectAttempts,
    send,
    sendPing,
    requestPending,
    connect,
    disconnect,
  }
}

