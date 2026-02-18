'use client'

import React, { useState, useCallback, useRef, useMemo, ReactNode } from 'react'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import { useWebSocket, WebSocketMessage, WebSocketMessageHandlers } from '@/hooks/use-websocket'
import { WebSocketContext, WebSocketContextType } from '@/contexts/WebSocketContext'
import { tokenManager } from '@/lib/token-manager'

interface WebSocketInitializerProps {
  children: ReactNode
}

/**
 * Manages the global WebSocket connection and provides context to child components.
 * Place inside AppProviders, after AuthInitializer and AuthProvider.
 */
export const WebSocketInitializer: React.FC<WebSocketInitializerProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuthRedux()
  const token = typeof window !== 'undefined' ? tokenManager.getAccessToken() || undefined : undefined
  
  const [customHandlers, setCustomHandlers] = useState<WebSocketMessageHandlers>({})
  const handlerIdCounterRef = useRef(0)
  const handlerIdsRef = useRef<Map<string, string>>(new Map())

  const registerHandlers = useCallback((handlers: WebSocketMessageHandlers) => {
    const handlerIds: string[] = []
    
    setCustomHandlers((prev) => {
      const updated = { ...prev }
      
      Object.entries(handlers).forEach(([type, handler]) => {
        const handlerId = `handler_${++handlerIdCounterRef.current}`
        handlerIdsRef.current.set(JSON.stringify(handler), handlerId)
        updated[type] = handler
        handlerIds.push(handlerId)
      })
      
      return updated
    })
    
    return () => {
      setCustomHandlers((prev) => {
        const updated = { ...prev }
        Object.keys(handlers).forEach((type) => {
          delete updated[type]
        })
        return updated
      })
    }
  }, [])

  const unregisterHandlers = useCallback((handlerIds: string[]) => {
    setCustomHandlers((prev) => {
      const updated = { ...prev }
      handlerIds.forEach((id) => {
        Object.entries(updated).forEach(([key, value]) => {
          if (handlerIdsRef.current.get(JSON.stringify(value)) === id) {
            delete updated[key]
          }
        })
      })
      return updated
    })
  }, [])
  
  const { isConnected, reconnectAttempts, send, requestPending } = useWebSocket({
    userUUID: user?.uuid,
    token,
    handlers: customHandlers,
    autoConnect: isAuthenticated && !!user?.uuid && !!token,
    onError: (error) => {
      console.error('WebSocket initialization error:', error.message)
    },
  })

  const contextValue = useMemo<WebSocketContextType>(
    () => ({
      isConnected,
      reconnectAttempts,
      send,
      requestPending,
      registerHandlers,
      unregisterHandlers,
    }),
    [isConnected, reconnectAttempts, send, requestPending, registerHandlers, unregisterHandlers]
  )

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  )
}

