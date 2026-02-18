# WebSocket HOC and Context Usage Examples

## Quick Start

### 1. Basic Setup (Already Done in AppProviders)

```tsx
// src/components/providers/AppProviders.tsx
import { WebSocketInitializer } from '@/components/providers/WebSocketInitializer'

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <ReduxProvider>
          <AuthInitializer />
          <AuthProvider>
            <WebSocketInitializer>
              {children}
            </WebSocketInitializer>
          </AuthProvider>
        </ReduxProvider>
      </ThemeProvider>
    </LanguageProvider>
  )
}
```

### 2. Using WebSocket in a Component

Choose your preferred pattern:

## Pattern Examples

### Example 1: Simple Hook Usage (Recommended)

```typescript
// src/components/chat/ChatWindow.tsx
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { MESSAGE_GENERATE, MESSAGE_REGENERATE } from '@/constants/websocket-events'

const ChatWindow: React.FC = () => {
  const { isConnected, registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    const unregister = registerHandlers({
      [MESSAGE_GENERATE]: (msg) => {
        console.log('AI message received:', msg)
        updateChatUI(msg)
      },
      [MESSAGE_REGENERATE]: (msg) => {
        console.log('AI message regenerated:', msg)
        replaceChatUI(msg)
      },
    })
    
    // Cleanup on unmount
    return unregister
  }, [registerHandlers])
  
  return (
    <div className="chat-window">
      <div className="connection-status">
        Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
      <div className="messages">
        {/* Chat messages here */}
      </div>
    </div>
  )
}

export default ChatWindow
```

### Example 2: With Redux Integration

```typescript
// src/hooks/use-websocket-conversation.ts (Already implemented)
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '@/store/slices/conversationSlice'

export const useWebSocketConversation = () => {
  const dispatch = useDispatch()
  const { registerHandlers, isConnected, reconnectAttempts } = useWebSocketContext()
  const currentConversation = useSelector(
    (state: RootState) => state.conversation.currentConversation
  )
  
  const handleMessageEvent = useCallback(
    (data: WebSocketMessage) => {
      const conversationUuid = data.response_message?.conversation_uuid
      
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
  
  useEffect(() => {
    return registerHandlers({
      [MESSAGE_GENERATE]: handleMessageEvent,
      [MESSAGE_REGENERATE]: handleMessageEvent,
    })
  }, [handleMessageEvent, registerHandlers])
  
  return { isConnected, reconnectAttempts }
}

// Usage in component
const ConversationPanel: React.FC = () => {
  const { isConnected } = useWebSocketConversation()
  return <div>Messages: {isConnected ? 'Live' : 'Buffering'}</div>
}
```

### Example 3: Multiple Handlers (Feature-Based)

```typescript
// src/hooks/use-websocket-notifications.ts
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { useToast } from '@/hooks/use-toast'

export const useWebSocketNotifications = () => {
  const { registerHandlers } = useWebSocketContext()
  const { success, error } = useToast()
  
  useEffect(() => {
    return registerHandlers({
      'notification_new': (msg) => {
        success?.(msg.title, msg.message)
      },
      'notification_error': (msg) => {
        error?.(msg.title, msg.message)
      },
      'notification_update': (msg) => {
        console.log('Notification updated:', msg)
      },
    })
  }, [registerHandlers, success, error])
}

// Usage
const NotificationCenter: React.FC = () => {
  useWebSocketNotifications()
  return <div>Notifications active</div>
}
```

### Example 4: Using HOC for Class Components

```typescript
// src/components/chat/ChatContainer.tsx
import { withWebSocket, WebSocketProps } from '@/components/hoc/withWebSocket'

interface ChatContainerProps {
  websocket: WebSocketProps
  conversationId: string
}

const ChatContainer: React.FC<ChatContainerProps> = ({ websocket, conversationId }) => {
  const [messages, setMessages] = useState<any[]>([])
  
  useEffect(() => {
    const unregister = websocket.registerHandlers({
      'message_generate': (msg) => {
        if (msg.conversation_uuid === conversationId) {
          setMessages(prev => [...prev, msg.message])
        }
      },
    })
    
    return unregister
  }, [websocket, conversationId])
  
  return (
    <div className="chat-container">
      <div className="status">
        {websocket.isConnected ? 'Connected' : `Reconnecting... (${websocket.reconnectAttempts})`}
      </div>
      <div className="messages">
        {messages.map(msg => (
          <ChatMessage key={msg.uuid} message={msg} />
        ))}
      </div>
      <button onClick={() => websocket.requestPending()}>
        Check Pending Messages
      </button>
    </div>
  )
}

export default withWebSocket(ChatContainer)
```

### Example 5: Conditional Handler Registration

```typescript
// src/components/moderation/ModerationPanel.tsx
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { useAuthRedux } from '@/hooks/use-auth-redux'

const ModerationPanel: React.FC = () => {
  const { isConnected, registerHandlers } = useWebSocketContext()
  const { user } = useAuthRedux()
  const [isModeration, setIsModeration] = useState(false)
  
  // Only register moderation handlers if user has moderation role
  useEffect(() => {
    if (user?.role !== 'moderator') {
      return // Don't register handlers
    }
    
    return registerHandlers({
      'moderation_request': (msg) => {
        console.log('Moderation request:', msg)
        showModerationRequest(msg)
      },
      'moderation_update': (msg) => {
        console.log('Moderation status updated:', msg)
        updateModerationStatus(msg)
      },
    })
  }, [registerHandlers, user])
  
  return (
    <div className="moderation-panel">
      {isModeration && (
        <div className="handlers-active">
          Moderation handlers active
        </div>
      )}
    </div>
  )
}

export default ModerationPanel
```

### Example 6: Error Handling

```typescript
// src/components/streaming/StreamingContainer.tsx
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { useToast } from '@/hooks/use-toast'

const StreamingContainer: React.FC = () => {
  const { registerHandlers } = useWebSocketContext()
  const { error: showError } = useToast()
  
  useEffect(() => {
    return registerHandlers({
      'stream_start': (msg) => {
        console.log('Stream started')
      },
      'stream_chunk': (msg) => {
        appendToStream(msg.chunk)
      },
      'stream_complete': (msg) => {
        completeStream(msg)
      },
      'stream_error': (msg) => {
        showError?.('Stream Error', msg.error_message)
        handleStreamError(msg)
      },
    })
  }, [registerHandlers, showError])
  
  return <div className="streaming-container">{/* Stream UI */}</div>
}

export default StreamingContainer
```

### Example 7: Dynamic Handler Management

```typescript
// src/hooks/use-feature-websocket.ts
import { useWebSocketContext } from '@/hooks/use-websocket-context'

export const useFeatureWebSocket = (featureName: string) => {
  const { registerHandlers } = useWebSocketContext()
  const [handlers, setHandlers] = useState<Record<string, Function>>({})
  
  const addHandler = useCallback(
    (type: string, handler: (msg: any) => void) => {
      setHandlers(prev => ({
        ...prev,
        [type]: handler,
      }))
    },
    []
  )
  
  const removeHandler = useCallback(
    (type: string) => {
      setHandlers(prev => {
        const updated = { ...prev }
        delete updated[type]
        return updated
      })
    },
    []
  )
  
  useEffect(() => {
    if (Object.keys(handlers).length === 0) {
      return
    }
    
    return registerHandlers(handlers)
  }, [handlers, registerHandlers])
  
  return { addHandler, removeHandler }
}

// Usage
const DynamicFeature: React.FC = () => {
  const { addHandler, removeHandler } = useFeatureWebSocket('dynamic')
  
  const enableNotifications = useCallback(() => {
    addHandler('notification_new', (msg) => {
      console.log('New notification:', msg)
    })
  }, [addHandler])
  
  const disableNotifications = useCallback(() => {
    removeHandler('notification_new')
  }, [removeHandler])
  
  return (
    <div>
      <button onClick={enableNotifications}>Enable Notifications</button>
      <button onClick={disableNotifications}>Disable Notifications</button>
    </div>
  )
}
```

### Example 8: Message Sending

```typescript
// src/components/chat/ChatInput.tsx
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { MESSAGE_GENERATE } from '@/constants/websocket-events'

const ChatInput: React.FC = () => {
  const { send } = useWebSocketContext()
  const [message, setMessage] = useState('')
  
  const handleSend = useCallback(() => {
    send({
      type: MESSAGE_GENERATE,
      message: message,
      timestamp: new Date().toISOString(),
    })
    setMessage('')
  }, [send, message])
  
  return (
    <div className="chat-input">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

export default ChatInput
```

### Example 9: Request Pending Messages

```typescript
// src/components/chat/PendingMessagesButton.tsx
import { useWebSocketContext } from '@/hooks/use-websocket-context'

const PendingMessagesButton: React.FC = () => {
  const { requestPending, isConnected } = useWebSocketContext()
  
  const handleRequestPending = useCallback(() => {
    if (isConnected) {
      console.log('Requesting pending messages...')
      requestPending()
    } else {
      console.warn('Not connected to WebSocket')
    }
  }, [requestPending, isConnected])
  
  return (
    <button
      onClick={handleRequestPending}
      disabled={!isConnected}
      className="request-pending-btn"
    >
      {isConnected ? 'Check Pending' : 'Connecting...'}
    </button>
  )
}

export default PendingMessagesButton
```

### Example 10: Complete Chat Application

```typescript
// src/components/chat/ChatApp.tsx
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { useWebSocketConversation } from '@/hooks/use-websocket-conversation'
import { useDispatch } from 'react-redux'

const ChatApp: React.FC = () => {
  // Get global WebSocket status
  const { send, requestPending } = useWebSocketContext()
  
  // Setup conversation-specific handlers
  const { isConnected, reconnectAttempts } = useWebSocketConversation()
  
  return (
    <div className="chat-app">
      {/* Header with connection status */}
      <header className="chat-header">
        <h1>Chat</h1>
        <div className={`status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? (
            <span>🟢 Connected</span>
          ) : (
            <span>🔴 Reconnecting ({reconnectAttempts})</span>
          )}
        </div>
      </header>
      
      {/* Main chat area */}
      <div className="chat-body">
        <ChatMessages />
      </div>
      
      {/* Input area */}
      <div className="chat-footer">
        <ChatInput onSend={send} />
        <button onClick={requestPending} disabled={!isConnected}>
          Sync Messages
        </button>
      </div>
    </div>
  )
}

export default ChatApp
```

## Common Patterns

### Pattern: Feature-Based Hooks

```typescript
// Create one hook per feature
export const useWebSocketNotifications = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'notification_new': handleNewNotification,
      'notification_update': handleUpdateNotification,
    })
  }, [registerHandlers])
}

export const useWebSocketConversation = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'message_generate': handleMessage,
    })
  }, [registerHandlers])
}

// Use in components
const App = () => {
  useWebSocketNotifications()
  useWebSocketConversation()
  return <div>App</div>
}
```

### Pattern: Composition

```typescript
const useWebSocketFeatures = () => {
  const notifications = useWebSocketNotifications()
  const conversation = useWebSocketConversation()
  const moderation = useWebSocketModeration()
  
  return {
    notifications,
    conversation,
    moderation,
  }
}

const App = () => {
  useWebSocketFeatures()
  return <div>App</div>
}
```

## Testing Examples

### Mock WebSocket Context

```typescript
import { WebSocketContext } from '@/contexts/WebSocketContext'
import { render } from '@testing-library/react'

const mockWebSocketContext = {
  isConnected: true,
  reconnectAttempts: 0,
  send: jest.fn(),
  requestPending: jest.fn(),
  registerHandlers: jest.fn((handlers) => jest.fn()),
  unregisterHandlers: jest.fn(),
}

const renderWithWebSocket = (component: React.ReactNode) => {
  return render(
    <WebSocketContext.Provider value={mockWebSocketContext}>
      {component}
    </WebSocketContext.Provider>
  )
}

// Usage
it('should render chat window', () => {
  const { getByText } = renderWithWebSocket(<ChatWindow />)
  expect(getByText(/Connected/)).toBeInTheDocument()
})
```

### Test Handler Registration

```typescript
it('should register message handlers on mount', () => {
  const mockRegisterHandlers = jest.fn((handlers) => jest.fn())
  const mockContext = {
    ...mockWebSocketContext,
    registerHandlers: mockRegisterHandlers,
  }
  
  render(
    <WebSocketContext.Provider value={mockContext}>
      <ChatWindow />
    </WebSocketContext.Provider>
  )
  
  expect(mockRegisterHandlers).toHaveBeenCalledWith(
    expect.objectContaining({
      'message_generate': expect.any(Function),
    })
  )
})
```

## Troubleshooting

### Issue: "Cannot find WebSocketInitializer provider"

**Solution**: Ensure the component is rendered within the provider tree:

```tsx
// ✅ Correct
<WebSocketInitializer>
  <MyComponent />
</WebSocketInitializer>

// ❌ Wrong
<MyComponent /> {/* Outside provider */}
```

### Issue: Handlers not being called

**Solution**: Check connection status and message types:

```typescript
const { isConnected, registerHandlers } = useWebSocketContext()

useEffect(() => {
  console.log('Connected:', isConnected)
  
  return registerHandlers({
    'message_generate': (msg) => {
      console.log('Handler called:', msg)
    },
  })
}, [isConnected, registerHandlers])
```

### Issue: Multiple handler registrations

**Solution**: Ensure useEffect returns the unregister function:

```typescript
useEffect(() => {
  // ✅ Correct
  return registerHandlers({...})
  
  // ❌ Wrong - handlers accumulate
  registerHandlers({...})
}, [registerHandlers])
```

