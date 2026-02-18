# WebSocket HOC and Context Implementation Summary

## What Was Implemented

A generic, production-ready WebSocket connection management system with HOC and Context-based API for the Midora AI frontend.

## Key Features

✅ **Global WebSocket Connection**: Single WebSocket per authenticated user  
✅ **Context-Based API**: Clean, React-idiomatic context access  
✅ **Generic HOC**: `withWebSocket` HOC for wrapping components  
✅ **Custom Hooks**: `useWebSocketContext()` for direct context access  
✅ **Automatic Lifecycle**: Connects on auth, disconnects on logout  
✅ **Handler Management**: Register/unregister message handlers dynamically  
✅ **Type-Safe**: Full TypeScript support  
✅ **Error Handling**: Comprehensive error handling and recovery  
✅ **Auto-Reconnection**: Exponential backoff reconnection strategy  

## Components Created

### 1. **WebSocketContext** (`src/contexts/WebSocketContext.tsx`)
- Defines the context interface
- Provides context provider wrapper

### 2. **WebSocketInitializer** (`src/components/providers/WebSocketInitializer.tsx`)
- Context provider implementation
- Manages global WebSocket connection
- Handles handler registry
- Auto-connects when user authenticates

### 3. **useWebSocketContext Hook** (`src/hooks/use-websocket-context.ts`)
- Access global WebSocket state and methods
- Error handling if used outside provider

### 4. **withWebSocket HOC** (`src/components/hoc/withWebSocket.tsx`)
- Higher-Order Component for class/function components
- Injects WebSocket props
- `useWebSocketProps()` hook for direct access

### 5. **Updated AppProviders** (`src/components/providers/AppProviders.tsx`)
- Integrated WebSocketInitializer into provider hierarchy
- Positioned after AuthProvider for proper dependency

### 6. **Updated useWebSocketConversation** (`src/hooks/use-websocket-conversation.ts`)
- Refactored to use context-based approach
- Registers handlers with global connection
- Maintains backward compatibility

## Architecture

```
┌─────────────────────────────────────┐
│        RootLayout                   │
├─────────────────────────────────────┤
│   <AppProviders>                    │
│  ├─ LanguageProvider                │
│  ├─ ThemeProvider                   │
│  ├─ ThemeInitializer                │
│  ├─ ReduxProvider                   │
│  ├─ AuthInitializer (restore auth)  │
│  ├─ AuthProvider                    │
│  │                                  │
│  └─ WebSocketInitializer            │
│     ├─ Creates global WS connection │
│     ├─ Manages handler registry     │
│     └─ Provides context             │
│        └─ App Content               │
└─────────────────────────────────────┘
```

## API Reference

### WebSocketContextType

```typescript
interface WebSocketContextType {
  // Connection state
  isConnected: boolean
  reconnectAttempts: number
  
  // Messaging
  send: (message: WebSocketMessage) => void
  requestPending: () => void
  
  // Handler management
  registerHandlers: (handlers: WebSocketMessageHandlers) => () => void
  unregisterHandlers: (handlerIds: string[]) => void
}
```

### WebSocketProps (from HOC)

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

## Usage Examples

### Hook-Based (Recommended)

```typescript
import { useWebSocketContext } from '@/hooks/use-websocket-context'

const MyComponent = () => {
  const { isConnected, registerHandlers } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'message_generate': (msg) => handleMessage(msg),
      'error': (msg) => handleError(msg),
    })
  }, [registerHandlers])
  
  return <div>{isConnected ? 'Connected' : 'Offline'}</div>
}
```

### HOC-Based

```typescript
import { withWebSocket, WebSocketProps } from '@/components/hoc/withWebSocket'

interface Props {
  websocket: WebSocketProps
}

const MyComponent: React.FC<Props> = ({ websocket }) => {
  useEffect(() => {
    return websocket.registerHandlers({
      'message_generate': (msg) => handleMessage(msg),
    })
  }, [websocket])
  
  return <div>{websocket.isConnected ? 'Connected' : 'Offline'}</div>
}

export default withWebSocket(MyComponent)
```

### useWebSocketProps Hook (Alternative HOC)

```typescript
import { useWebSocketProps } from '@/components/hoc/withWebSocket'

const MyComponent = () => {
  const websocket = useWebSocketProps()
  
  useEffect(() => {
    return websocket.registerHandlers({...})
  }, [websocket])
  
  return <div>{websocket.isConnected ? 'Connected' : 'Offline'}</div>
}
```

### Feature-Based Hooks

```typescript
export const useWebSocketConversation = () => {
  const { registerHandlers, isConnected } = useWebSocketContext()
  
  useEffect(() => {
    return registerHandlers({
      'message_generate': handleMessage,
      'message_regenerate': handleMessage,
    })
  }, [registerHandlers])
  
  return { isConnected }
}

// Usage in component
const ChatPanel = () => {
  const { isConnected } = useWebSocketConversation()
  return <div>Messages: {isConnected ? 'Live' : 'Buffering'}</div>
}
```

## Connection Lifecycle

```
User Logs In
    ↓
Auth State Updated in Redux
    ↓
WebSocketInitializer reads auth state
    ↓
useWebSocket hook connects to WebSocket
    ↓
connection_established message received
    ↓
Components register handlers
    ↓
Server sends message (e.g., message_generate)
    ↓
WebSocket receives and dispatches to handlers
    ↓
Component updates UI
    ↓
User Logs Out
    ↓
WebSocketInitializer disconnects
    ↓
Connection closed
```

## Handler Registration Flow

```
Component Mounts
    ↓
Call registerHandlers({type: handler})
    ↓
Handler added to customHandlers state in WebSocketInitializer
    ↓
useWebSocket merges custom handlers with default handlers
    ↓
New messages trigger matching handler
    ↓
Handler function executes
    ↓
Component Unmounts
    ↓
Return statement of useEffect calls unregister function
    ↓
Handler removed from customHandlers state
    ↓
No more messages trigger this handler
```

## Key Benefits

1. **Single Connection**: Reduces memory and network overhead
2. **Centralized Management**: One place to manage all WebSocket logic
3. **Type-Safe**: Full TypeScript support for handlers and messages
4. **Modular**: Easy to create feature-specific hooks
5. **Testable**: Mock context for unit testing
6. **Flexible**: Multiple ways to use (hook, HOC, props)
7. **Automatic Cleanup**: Handlers cleaned up on unmount
8. **Production-Ready**: Error handling, reconnection, logging

## Files Modified/Created

### New Files (6)
- `src/contexts/WebSocketContext.tsx`
- `src/components/providers/WebSocketInitializer.tsx`
- `src/hooks/use-websocket-context.ts`
- `src/components/hoc/withWebSocket.tsx`
- `docs/WEBSOCKET_HOC_AND_CONTEXT.md` (detailed documentation)
- `docs/WEBSOCKET_USAGE_EXAMPLES.md` (usage examples)

### Modified Files (2)
- `src/components/providers/AppProviders.tsx` (added WebSocketInitializer)
- `src/hooks/use-websocket-conversation.ts` (refactored to use context)

## Integration Steps (Already Done)

1. ✅ Created WebSocketContext with interface definition
2. ✅ Implemented WebSocketInitializer provider component
3. ✅ Created useWebSocketContext hook
4. ✅ Created withWebSocket HOC
5. ✅ Integrated WebSocketInitializer into AppProviders
6. ✅ Updated useWebSocketConversation to use context
7. ✅ Created comprehensive documentation

## Usage in Existing Components

### ChatWindow / Conversation Components
```typescript
const ChatWindow = () => {
  const { isConnected } = useWebSocketConversation()
  // Component automatically receives message updates
}
```

### New Features
```typescript
// Create feature-specific hooks
export const useWebSocketNotifications = () => {
  const { registerHandlers } = useWebSocketContext()
  useEffect(() => {
    return registerHandlers({
      'notification_new': handleNotification,
    })
  }, [registerHandlers])
}
```

## Next Steps

Components can now:
1. Use `useWebSocketContext()` to access WebSocket state
2. Use `useWebSocketConversation()` for conversation messages
3. Create feature-specific hooks following the same pattern
4. Use HOC for class components
5. Register/unregister handlers dynamically

## Performance Impact

- **Minimal**: Single WebSocket connection replaces previous multiple connections
- **Memory**: Reduced by consolidating connections
- **Network**: Improved by single persistent connection
- **Handler Management**: Efficient memoization prevents unnecessary re-renders

## Backward Compatibility

✅ All existing code continues to work  
✅ `useWebSocketConversation` hook still available  
✅ Old patterns can coexist with new patterns  
✅ Gradual migration possible for existing features  

## Documentation

📖 **Main Documentation**: `docs/WEBSOCKET_HOC_AND_CONTEXT.md`
- Architecture overview
- Component descriptions
- API reference
- Usage patterns
- Best practices
- Error handling
- Testing guidelines
- Troubleshooting

📖 **Usage Examples**: `docs/WEBSOCKET_USAGE_EXAMPLES.md`
- 10+ practical examples
- Quick start guide
- Common patterns
- Testing examples
- Real-world implementations

## Testing

Mock WebSocketContext for unit tests:

```typescript
const mockContext = {
  isConnected: true,
  reconnectAttempts: 0,
  send: jest.fn(),
  requestPending: jest.fn(),
  registerHandlers: jest.fn(() => jest.fn()),
  unregisterHandlers: jest.fn(),
}

render(
  <WebSocketContext.Provider value={mockContext}>
    <MyComponent />
  </WebSocketContext.Provider>
)
```

## Error Handling

1. **Connection Errors**: Auto-reconnect with exponential backoff
2. **Handler Errors**: Try-catch in handler, log to console
3. **Missing Context**: Clear error message if used outside provider
4. **Parse Errors**: Logged to console, doesn't crash app

## Future Enhancements

- Handler priorities
- Message queuing
- Offline support
- Multiple connections
- Built-in metrics/logging
- Message filtering

## Summary

This implementation provides a **production-ready, generic WebSocket management system** for the Midora AI frontend. It:

- ✅ Maintains a single WebSocket connection per user
- ✅ Provides multiple ways to use WebSocket (hook, HOC, direct context)
- ✅ Automatically manages connection lifecycle
- ✅ Enables dynamic handler registration/unregistration
- ✅ Is fully type-safe with TypeScript
- ✅ Includes comprehensive error handling
- ✅ Can be used for conversations, notifications, moderation, and more
- ✅ Is well-documented with examples and guides
- ✅ Is testable and mockable
- ✅ Integrates seamlessly into existing app structure

