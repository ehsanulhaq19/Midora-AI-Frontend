# WebSocket HOC and Context Implementation

## Overview

This document describes the generic Higher-Order Component (HOC) and Context-based approach for managing WebSocket connections in the Midora AI frontend application.

## Architecture

### Component Hierarchy

The WebSocket integration follows a provider-based pattern integrated into the app's provider hierarchy:

```
RootLayout
└── AppProviders
    ├── LanguageProvider
    ├── ThemeProvider
    ├── ThemeInitializer
    ├── ReduxProvider
    ├── AuthInitializer (restores auth from localStorage)
    ├── AuthProvider
    └── WebSocketInitializer (depends on Auth)
        └── App Content
```

**Important**: `WebSocketInitializer` must be placed **after** `AuthInitializer` and `AuthProvider` because it depends on the authenticated user information.

### Key Components

#### 1. **WebSocketContext** (`src/contexts/WebSocketContext.tsx`)

Defines the context interface for WebSocket state and methods:

```typescript
interface WebSocketContextType {
  isConnected: boolean
  reconnectAttempts: number
  send: (message: WebSocketMessage) => void
  requestPending: () => void
  registerHandlers: (handlers: WebSocketMessageHandlers) => () => void
  unregisterHandlers: (handlerIds: string[]) => void
}
```

#### 2. **WebSocketInitializer** (`src/components/providers/WebSocketInitializer.tsx`)

Manages the global WebSocket connection and provides context to child components.

**Responsibilities:**
- Auto-connects to WebSocket when user is authenticated
- Manages custom message handlers registry
- Provides context value to child components
- Handles connection lifecycle events

**Features:**
- Automatic connection on user authentication
- Automatic disconnection on user logout
- Support for registering/unregistering message handlers
- Centralized connection state management
- Error handling and reconnection tracking

**Usage in AppProviders:**

```tsx
<AuthInitializer />
<AuthProvider>
  <WebSocketInitializer>
    <div className="min-h-screen app-bg-primary">
      {children}
      <ToastContainer />
    </div>
  </WebSocketInitializer>
</AuthProvider>
```

#### 3. **useWebSocketContext Hook** (`src/hooks/use-websocket-context.ts`)

Provides access to the WebSocket context from child components.

**Usage:**

```typescript
const { isConnected, send, registerHandlers } = useWebSocketContext()

// Register handlers
const unregister = registerHandlers({
  'message_generate': (msg) => handleMessage(msg),
  'error': (msg) => handleError(msg),
})

// Cleanup on unmount
useEffect(() => {
  return unregister
}, [unregister])
```

**Error Handling:**
Throws an error if used outside of `WebSocketInitializer` provider.

#### 4. **withWebSocket HOC** (`src/components/hoc/withWebSocket.tsx`)

Generic HOC that wraps components with WebSocket capabilities.

**Injected Props:**

```typescript
interface WebSocketProps {
  isConnected: boolean
  reconnectAttempts: number
  send: (message: WebSocketMessage) => void
  requestPending: () => void
  registerHandlers: (handlers: WebSocketMessageHandlers) => () => void
  unregisterHandlers: (handlerIds: string[]) => void
}
```

**Class Component Usage:**

```typescript
interface MyComponentProps extends Record<string, any> {
  websocket: WebSocketProps
}

const MyComponent: React.FC<MyComponentProps> = ({ websocket }) => {
  useEffect(() => {
    return websocket.registerHandlers({
      'message_generate': (msg) => handleMessage(msg),
    })
  }, [websocket])

  return <div>{websocket.isConnected ? 'Connected' : 'Connecting...'}</div>
}

export default withWebSocket(MyComponent)
```

**Function Component Alternative - useWebSocketProps Hook:**

```typescript
const MyComponent: React.FC = () => {
  const websocket = useWebSocketProps()
  
  useEffect(() => {
    return websocket.registerHandlers({
      'message_generate': handleMessage,
    })
  }, [websocket])

  return <div>{websocket.isConnected ? 'Connected' : 'Disconnected'}</div>
}
```

## Usage Patterns

### Pattern 1: Using useWebSocketContext Hook (Recommended)

For functional components that need WebSocket functionality:

```typescript
import { useWebSocketContext } from '@/hooks/use-websocket-context'

const MyComponent: React.FC = () => {
  const { isConnected, registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    const unregister = registerHandlers({
      'message_generate': (msg) => {
        console.log('Message received:', msg)
      },
    })
    
    return unregister
  }, [registerHandlers])
  
  return <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
}

export default MyComponent
```

### Pattern 2: Using the Legacy useWebSocketConversation Hook

For conversation-specific message handling (automatically registers handlers):

```typescript
import { useWebSocketConversation } from '@/hooks/use-websocket-conversation'

const ConversationPanel: React.FC = () => {
  const { isConnected, reconnectAttempts } = useWebSocketConversation()
  
  return (
    <div>
      Connection Status: {isConnected ? 'Connected' : `Connecting... (attempt ${reconnectAttempts})`}
    </div>
  )
}
```

### Pattern 3: Using withWebSocket HOC

For class components or when you need to wrap an existing component:

```typescript
import { withWebSocket, WebSocketProps } from '@/components/hoc/withWebSocket'

interface ChatProps {
  websocket: WebSocketProps
  title: string
}

const Chat: React.FC<ChatProps> = ({ websocket, title }) => {
  useEffect(() => {
    return websocket.registerHandlers({
      'message_generate': (msg) => {
        console.log('New message in', title, msg)
      },
    })
  }, [title, websocket])
  
  return <div>{websocket.isConnected ? 'Connected' : 'Offline'}</div>
}

export default withWebSocket(Chat)
```

### Pattern 4: Using useWebSocketProps Hook

Direct hook access to WebSocket props without HOC:

```typescript
import { useWebSocketProps } from '@/components/hoc/withWebSocket'

const NotificationCenter: React.FC = () => {
  const websocket = useWebSocketProps()
  
  const handleError = (msg: WebSocketMessage) => {
    console.error('WebSocket Error:', msg.message)
  }
  
  useEffect(() => {
    return websocket.registerHandlers({
      'error': handleError,
    })
  }, [websocket])
  
  return (
    <div>
      Connection: {websocket.isConnected}
      <button onClick={() => websocket.requestPending()}>
        Check Pending Messages
      </button>
    </div>
  )
}

export default NotificationCenter
```

## Message Flow

### Connection Setup

1. **App Loads** → `AppProviders` renders
2. **AuthInitializer** → Restores auth state from localStorage
3. **AuthProvider** → Sets up auth context
4. **WebSocketInitializer** → 
   - Gets authenticated user from Redux
   - Gets access token from localStorage
   - Calls `useWebSocket` hook with `autoConnect: isAuthenticated`
5. **useWebSocket** → Establishes WebSocket connection
6. **Components Mounted** → Can register handlers via `useWebSocketContext`

### Message Handling

1. **Server sends message** (e.g., `message_generate`)
2. **WebSocket receives** → `onmessage` handler triggered
3. **Message parsed** → `handleMessage` called in `useWebSocket`
4. **Registered handlers called** → Custom handlers execute
5. **Redux updated** → Component state updates
6. **UI re-renders** → Shows new message

### Handler Registration

```
Component Mounts
    ↓
Call registerHandlers({type: handler})
    ↓
Add handler to customHandlers state
    ↓
useWebSocket merges handlers and re-connects if needed
    ↓
New messages trigger registered handler
    ↓
Handler function executes
    ↓
Component Unmounts
    ↓
Call returned unregister function
    ↓
Remove handler from customHandlers state
```

## Error Handling

### Connection Errors

Handled by `useWebSocket` hook:
- Connection failures → Auto-reconnect with exponential backoff
- Parser errors → Logged to console
- Server errors → Trigger `ERROR` message type

### Handler Errors

```typescript
const { registerHandlers } = useWebSocketContext()

useEffect(() => {
  return registerHandlers({
    'message_generate': (msg) => {
      try {
        handleMessage(msg)
      } catch (error) {
        console.error('Handler error:', error)
        showErrorToast?.('Message Processing Error', error.message)
      }
    },
  })
}, [registerHandlers])
```

### Missing Context Error

If `useWebSocketContext` is used outside of `WebSocketInitializer`:

```
Error: useWebSocketContext must be used within a WebSocketInitializer provider.
Make sure WebSocketInitializer is present in your component tree,
after AuthInitializer and AuthProvider.
```

## Best Practices

### 1. **Cleanup Handlers on Unmount**

```typescript
useEffect(() => {
  const unregister = registerHandlers(handlers)
  
  // Always cleanup
  return unregister
}, [registerHandlers, handlers])
```

### 2. **Use Memoization for Handlers**

```typescript
const handlers = useMemo<WebSocketMessageHandlers>(
  () => ({
    'message_generate': handleMessageEvent,
    'message_regenerate': handleMessageEvent,
  }),
  [handleMessageEvent]
)
```

### 3. **Group Related Handlers**

Create a hook for each domain (conversation, notifications, etc.):

```typescript
// useWebSocketConversation.ts
export const useWebSocketConversation = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'message_generate': handleMessage,
      'message_regenerate': handleMessage,
    })
  }, [registerHandlers])
}

// useWebSocketNotifications.ts
export const useWebSocketNotifications = () => {
  const { registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'notification_new': handleNotification,
    })
  }, [registerHandlers])
}
```

### 4. **Handle Authentication Changes**

The `WebSocketInitializer` automatically:
- Connects when user logs in
- Disconnects when user logs out
- Reconnects when token is refreshed

### 5. **Use TypeScript for Type Safety**

```typescript
interface WebSocketConversationMessage extends WebSocketMessage {
  message?: Record<string, any>
  response_message?: Record<string, any>
}

const handleMessage = (data: WebSocketConversationMessage) => {
  // TypeScript checks properties
  if (data.message?.uuid) {
    // Handle message
  }
}
```

## Migration from Old Implementation

### Before (Direct useWebSocket)

```typescript
export const useWebSocketConversation = () => {
  const { user } = useAuthRedux()
  const token = localStorage.getItem('access_token')
  
  const { isConnected } = useWebSocket({
    userUUID: user?.uuid,
    token,
    handlers: {...},
    autoConnect: !!user?.uuid && !!token,
  })
  
  return { isConnected }
}
```

### After (Using Context)

```typescript
export const useWebSocketConversation = () => {
  const { registerHandlers, isConnected } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({...})
  }, [registerHandlers])
  
  return { isConnected }
}
```

**Benefits:**
- Single WebSocket connection for entire app
- Reduced memory usage
- Easier handler coordination
- Better lifecycle management

## Testing

### Mock WebSocketContext

```typescript
import { WebSocketContext } from '@/contexts/WebSocketContext'

const mockWebSocketValue = {
  isConnected: true,
  reconnectAttempts: 0,
  send: jest.fn(),
  requestPending: jest.fn(),
  registerHandlers: jest.fn(() => jest.fn()),
  unregisterHandlers: jest.fn(),
}

render(
  <WebSocketContext.Provider value={mockWebSocketValue}>
    <MyComponent />
  </WebSocketContext.Provider>
)
```

### Test Handler Registration

```typescript
it('should register message handlers', () => {
  const { getByText } = render(
    <WebSocketContext.Provider value={mockWebSocketValue}>
      <MyComponent />
    </WebSocketContext.Provider>
  )
  
  expect(mockWebSocketValue.registerHandlers).toHaveBeenCalledWith(
    expect.objectContaining({
      'message_generate': expect.any(Function),
    })
  )
})
```

## Troubleshooting

### "useWebSocketContext must be used within a WebSocketInitializer provider"

**Cause:** Component using `useWebSocketContext` is not within the provider tree

**Solution:** Ensure the component is rendered as a child of `WebSocketInitializer`:

```tsx
<WebSocketInitializer>
  <MyComponent /> {/* This works */}
</WebSocketInitializer>

{/* This fails */}
<MyComponent />
```

### WebSocket not connecting

**Possible causes:**
1. User not authenticated
2. Token missing from localStorage
3. Network connectivity issue

**Debug:**
```typescript
const { user, isAuthenticated } = useAuthRedux()
const token = localStorage.getItem('access_token')

console.log('User authenticated:', isAuthenticated, user?.uuid)
console.log('Token available:', !!token)
```

### Handlers not being called

**Possible causes:**
1. Wrong message type
2. Handler not registered in time
3. WebSocket not connected

**Debug:**
```typescript
const { isConnected, registerHandlers } = useWebSocketContext()

useEffect(() => {
  console.log('WebSocket connected:', isConnected)
  console.log('Registering handlers...')
  
  return registerHandlers({
    'message_generate': (msg) => {
      console.log('Handler called with:', msg)
    },
  })
}, [isConnected, registerHandlers])
```

## Files Modified/Created

### New Files
- `src/contexts/WebSocketContext.tsx` - Context definition
- `src/components/providers/WebSocketInitializer.tsx` - Context provider
- `src/hooks/use-websocket-context.ts` - Context hook
- `src/components/hoc/withWebSocket.tsx` - HOC component
- `docs/WEBSOCKET_HOC_AND_CONTEXT.md` - This documentation

### Modified Files
- `src/components/providers/AppProviders.tsx` - Added WebSocketInitializer
- `src/hooks/use-websocket-conversation.ts` - Updated to use context

## Performance Considerations

1. **Single WebSocket Connection**: Only one connection per authenticated user
2. **Lazy Handler Registration**: Handlers registered only when components mount
3. **Automatic Cleanup**: Handlers unregistered on component unmount
4. **Memoized Context Value**: Context value only updates when dependencies change
5. **Exponential Backoff**: Reconnection attempts use exponential backoff to prevent server overload

## Future Enhancements

1. **Handler Priorities**: Allow priority ordering for handler execution
2. **Message Queuing**: Queue messages if connection is temporary down
3. **Metrics/Logging**: Built-in performance metrics and detailed logging
4. **Message Filtering**: Filter messages by type before handler execution
5. **Offline Support**: Support offline message caching
6. **Multiple Connections**: Support multiple WebSocket connections for different channels

