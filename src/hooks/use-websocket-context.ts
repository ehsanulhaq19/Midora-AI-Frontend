import { useContext } from 'react'
import { WebSocketContext, WebSocketContextType } from '@/contexts/WebSocketContext'

/**
 * Access WebSocket context from child components.
 * Must be used within a component tree that has WebSocketInitializer provider.
 * 
 * @throws Error if used outside of WebSocketInitializer provider
 * @returns WebSocket context with connection state and methods
 */
export const useWebSocketContext = (): WebSocketContextType => {
  const context = useContext(WebSocketContext)
  
  if (context === undefined) {
    throw new Error(
      'useWebSocketContext must be used within a WebSocketInitializer provider. ' +
      'Make sure WebSocketInitializer is present in your component tree, ' +
      'after AuthInitializer and AuthProvider.'
    )
  }
  
  return context
}

