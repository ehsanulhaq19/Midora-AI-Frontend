# WebSocket Integration - Quick Start Guide

## What's New

A complete WebSocket connection management system has been implemented with:
- ✅ Global WebSocket connection on app load
- ✅ Context-based provider pattern
- ✅ Generic HOC for component integration
- ✅ Automatic connection/disconnection with authentication
- ✅ Full TypeScript support

## Setup (Already Done ✅)

The WebSocket system is already integrated into your app:

```
App Layout
└── AppProviders
    └── WebSocketInitializer ← Automatically creates connection
```

No setup needed! The connection is created automatically when:
1. User logs in ✅
2. Access token is available ✅
3. User stays authenticated ✅

## Using WebSocket in Your Components

### Option 1: Hook (Recommended for Most Cases)

```typescript
import { useWebSocketContext } from '@/hooks/use-websocket-context'

const MyComponent = () => {
  const { isConnected, registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    // Register handlers - returned function cleans up on unmount
    return registerHandlers({
      'message_generate': (msg) => {
        console.log('AI message received:', msg)
      },
      'message_regenerate': (msg) => {
        console.log('AI message regenerated:', msg)
      },
    })
  }, [registerHandlers])
  
  return (
    <div>
      {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
    </div>
  )
}
```

### Option 2: Redux Integration (For Conversation Updates)

Already implemented in `useWebSocketConversation`:

```typescript
import { useWebSocketConversation } from '@/hooks/use-websocket-conversation'

const ChatWindow = () => {
  const { isConnected, reconnectAttempts } = useWebSocketConversation()
  // Messages automatically dispatched to Redux!
  
  return <div>Messages: {isConnected ? 'Live' : 'Buffering'}</div>
}
```

### Option 3: HOC (For Class Components)

```typescript
import { withWebSocket, WebSocketProps } from '@/components/hoc/withWebSocket'

interface Props {
  websocket: WebSocketProps
}

const ChatContainer: React.FC<Props> = ({ websocket }) => {
  useEffect(() => {
    return websocket.registerHandlers({
      'message_generate': (msg) => {
        console.log('Message:', msg)
      },
    })
  }, [websocket])
  
  return <div>{websocket.isConnected ? 'Connected' : 'Offline'}</div>
}

export default withWebSocket(ChatContainer)
```

## Real-World Example

```typescript
// src/components/chat/ChatMessages.tsx
import { useWebSocketContext } from '@/hooks/use-websocket-context'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage } from '@/store/slices/conversationSlice'
import { MESSAGE_GENERATE, MESSAGE_REGENERATE } from '@/constants/websocket-events'

const ChatMessages = () => {
  const { isConnected, registerHandlers } = useWebSocketContext()
  const dispatch = useDispatch()
  const currentConversation = useSelector((state) => state.conversation.current)
  
  const handleMessageReceived = (data) => {
    if (data.message && currentConversation?.uuid === data.conversation_uuid) {
      dispatch(addMessage({
        conversationUuid: data.conversation_uuid,
        message: data.message,
      }))
    }
  }
  
  useEffect(() => {
    // Register handlers - cleanup happens automatically
    return registerHandlers({
      [MESSAGE_GENERATE]: handleMessageReceived,
      [MESSAGE_REGENERATE]: handleMessageReceived,
    })
  }, [registerHandlers, dispatch, currentConversation?.uuid])
  
  return (
    <div className="chat-container">
      <div className="status">
        {isConnected ? '🟢 Connected' : '🔴 Offline'}
      </div>
      {/* Messages rendered from Redux store */}
    </div>
  )
}

export default ChatMessages
```

## Available Message Types

Import from `@/constants/websocket-events`:

```typescript
// Server to Client
import {
  MESSAGE_GENERATE,        // AI response message
  MESSAGE_REGENERATE,      // Regenerated AI response
  CONNECTION_ESTABLISHED,  // Connection confirmed
  PONG,                   // Keepalive response
  PENDING_CHECK_COMPLETE, // Pending messages sync complete
  ERROR,                  // Error occurred
} from '@/constants/websocket-events'

// Client to Server
import {
  PING,        // Keepalive request
  GET_PENDING, // Request pending messages
} from '@/constants/websocket-events'
```

## Common Tasks

### Send a Message to Server

```typescript
const { send } = useWebSocketContext()

send({
  type: 'message_generate',
  message: 'Hello, AI!',
  timestamp: new Date().toISOString(),
})
```

### Request Pending Messages

```typescript
const { requestPending } = useWebSocketContext()

requestPending() // Sends GET_PENDING message
```

### Check Connection Status

```typescript
const { isConnected, reconnectAttempts } = useWebSocketContext()

if (isConnected) {
  console.log('Connected!')
} else {
  console.log(`Reconnecting... attempt ${reconnectAttempts}`)
}
```

### Multiple Handlers (Feature-Based)

```typescript
export const useWebSocketNotifications = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'notification_new': handleNewNotification,
      'notification_update': handleUpdateNotification,
      'notification_delete': handleDeleteNotification,
    })
  }, [registerHandlers])
}

export const useWebSocketConversation = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'message_generate': handleMessage,
      'message_regenerate': handleMessage,
    })
  }, [registerHandlers])
}

// Use both in your app
const App = () => {
  useWebSocketNotifications()
  useWebSocketConversation()
  return <div>App with WebSocket</div>
}
```

## Files Created/Modified

### New Components (Ready to Use)
- ✅ `src/contexts/WebSocketContext.tsx` - Context definition
- ✅ `src/components/providers/WebSocketInitializer.tsx` - Global provider
- ✅ `src/hooks/use-websocket-context.ts` - Context hook
- ✅ `src/components/hoc/withWebSocket.tsx` - HOC component

### Modified Components
- ✅ `src/components/providers/AppProviders.tsx` - Integrated initializer
- ✅ `src/hooks/use-websocket-conversation.ts` - Updated to use context

## Connection Flow

```
1. App Starts
   ↓
2. AppProviders renders
   ↓
3. AuthInitializer restores user from localStorage
   ↓
4. WebSocketInitializer starts
   ↓
5. Gets user and token from Redux/localStorage
   ↓
6. Opens WebSocket connection to /ws/user/{userUUID}
   ↓
7. Receives connection_established message
   ↓
8. Components can now register handlers
   ↓
9. Server sends messages (e.g., message_generate)
   ↓
10. Handlers are called, Redux updated
    ↓
11. Components re-render with new data
```

## Error Handling

### WebSocket Errors (Automatic)
- Connection fails → Auto-reconnect with exponential backoff
- Server sends error → Shows toast notification
- Parse error → Logged to console

### Handler Errors (Manual)
```typescript
useEffect(() => {
  return registerHandlers({
    'message_generate': (msg) => {
      try {
        handleMessage(msg)
      } catch (error) {
        console.error('Handler failed:', error)
        showErrorToast('Message Failed', error.message)
      }
    },
  })
}, [registerHandlers])
```

### Missing Provider Error
If you use `useWebSocketContext` outside the provider:
```
Error: useWebSocketContext must be used within a WebSocketInitializer provider.
Make sure WebSocketInitializer is present in your component tree,
after AuthInitializer and AuthProvider.
```

## Debugging

### Check Connection Status
```typescript
const { isConnected, reconnectAttempts } = useWebSocketContext()
console.log('Connected:', isConnected, 'Attempts:', reconnectAttempts)
```

### Enable Console Logging
The WebSocket hook logs important events:
```
Connected to WebSocket channel
Received pong from server
Handler called with: {...}
WebSocket disconnected
WebSocket connected successfully
```

### Verify Handlers Are Registered
```typescript
const { registerHandlers } = useWebSocketContext()

useEffect(() => {
  console.log('Registering handlers...')
  
  return registerHandlers({
    'message_generate': (msg) => {
      console.log('Handler called!', msg)
    },
  })
}, [registerHandlers])
```

## Testing

### Mock the Context
```typescript
import { WebSocketContext } from '@/contexts/WebSocketContext'
import { render } from '@testing-library/react'

const mockContext = {
  isConnected: true,
  reconnectAttempts: 0,
  send: jest.fn(),
  requestPending: jest.fn(),
  registerHandlers: jest.fn(() => jest.fn()),
  unregisterHandlers: jest.fn(),
}

it('renders with WebSocket', () => {
  render(
    <WebSocketContext.Provider value={mockContext}>
      <MyComponent />
    </WebSocketContext.Provider>
  )
  
  expect(mockContext.registerHandlers).toHaveBeenCalled()
})
```

## Best Practices

✅ **Always return the unregister function**
```typescript
useEffect(() => {
  return registerHandlers({...}) // ✅ Clean up
}, [registerHandlers])
```

✅ **Use useMemo for handlers**
```typescript
const handlers = useMemo(() => ({
  'message_generate': handleMessage,
}), [handleMessage])
```

✅ **Group related handlers in hooks**
```typescript
useWebSocketNotifications() // All notification handlers
useWebSocketConversation()  // All conversation handlers
```

✅ **Handle connection state in UI**
```typescript
{isConnected ? '🟢 Live' : '🔴 Offline'}
```

✅ **Use constants for message types**
```typescript
import { MESSAGE_GENERATE } from '@/constants/websocket-events'
```

## Documentation

📖 **Detailed Guide**: See `WEBSOCKET_HOC_AND_CONTEXT.md` for:
- Complete architecture overview
- All component descriptions
- Advanced usage patterns
- Performance considerations
- Migration guide

📖 **Code Examples**: See `WEBSOCKET_USAGE_EXAMPLES.md` for:
- 10+ real-world examples
- Common patterns
- Testing strategies
- Troubleshooting

## What's Happening Behind the Scenes

1. **Single WebSocket**: Only one connection per user (not multiple)
2. **Auto-Management**: Connects on login, disconnects on logout
3. **Message Routing**: Messages sent to registered handlers automatically
4. **Error Recovery**: Automatic reconnection with exponential backoff
5. **Memory Efficient**: Handlers cleaned up when components unmount
6. **Type Safe**: Full TypeScript support for all operations

## Next Steps

1. ✅ WebSocket is already running when app starts
2. ✅ Use `useWebSocketContext()` in your components
3. ✅ Register handlers for messages you need
4. ✅ Clean up handlers on unmount (automatic)
5. ✅ Test with real conversations

## Examples

### Conversation Messages
```typescript
const ChatPanel = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'message_generate': (msg) => updateUI(msg),
    })
  }, [registerHandlers])
}
```

### Notifications
```typescript
const NotificationCenter = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'notification_new': (msg) => showNotification(msg),
    })
  }, [registerHandlers])
}
```

### Analytics
```typescript
const AnalyticsDashboard = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'analytics_update': (msg) => updateCharts(msg),
    })
  }, [registerHandlers])
}
```

## Still Need Help?

- 📖 See `WEBSOCKET_HOC_AND_CONTEXT.md` for detailed documentation
- 📖 See `WEBSOCKET_USAGE_EXAMPLES.md` for code examples
- 🧪 See testing examples in `WEBSOCKET_USAGE_EXAMPLES.md`
- 🐛 See troubleshooting in `WEBSOCKET_HOC_AND_CONTEXT.md`

## Summary

WebSocket is now:
- ✅ Automatically connecting on app load
- ✅ Available in all components via `useWebSocketContext()`
- ✅ Ready to receive messages from the backend
- ✅ Type-safe with TypeScript
- ✅ Easy to test and debug
- ✅ Production-ready with error handling

Start using it in your components today! 🚀

