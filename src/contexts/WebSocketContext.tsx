'use client'

import React, { createContext, ReactNode } from 'react'
import { WebSocketMessage, WebSocketMessageHandlers } from '@/hooks/use-websocket'

export interface WebSocketContextType {
  isConnected: boolean
  reconnectAttempts: number
  send: (message: WebSocketMessage) => void
  requestPending: () => void
  registerHandlers: (handlers: WebSocketMessageHandlers) => () => void
  unregisterHandlers: (handlerIds: string[]) => void
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

interface WebSocketProviderProps {
  children: ReactNode
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  return (
    <WebSocketContext.Provider value={undefined as any}>
      {children}
    </WebSocketContext.Provider>
  )
}

