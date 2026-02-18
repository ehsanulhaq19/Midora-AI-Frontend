# WebSocket Architecture Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser App (Frontend)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────────────────────────────────────────┐ │
│  │  RootLayout (page.tsx)                             │ │
│  ├────────────────────────────────────────────────────┤ │
│  │  <AppProviders>                                    │ │
│  │  │                                                 │ │
│  │  ├─ LanguageProvider                              │ │
│  │  │  └─ Language/i18n support                      │ │
│  │  │                                                 │ │
│  │  ├─ ThemeProvider                                 │ │
│  │  │  └─ Theme management (light/dark)             │ │
│  │  │                                                 │ │
│  │  ├─ ThemeInitializer                              │ │
│  │  │  └─ Apply theme on startup                    │ │
│  │  │                                                 │ │
│  │  ├─ ReduxProvider                                 │ │
│  │  │  └─ Redux store (conversation, auth, etc)     │ │
│  │  │                                                 │ │
│  │  ├─ AuthInitializer                               │ │
│  │  │  └─ Restore auth from localStorage            │ │
│  │  │                                                 │ │
│  │  ├─ AuthProvider                                  │ │
│  │  │  └─ Auth context (user, isAuthenticated)      │ │
│  │  │                                                 │ │
│  │  ├─ WebSocketInitializer ⭐ NEW                   │ │
│  │  │  ├─ Creates global WebSocket connection       │ │
│  │  │  ├─ Manages handler registry                  │ │
│  │  │  └─ Provides WebSocketContext                 │ │
│  │  │      │                                         │ │
│  │  │      └─ App Components                        │ │
│  │  │         ├─ ChatWindow                         │ │
│  │  │         │  └─ useWebSocketContext()          │ │
│  │  │         ├─ NotificationCenter                │ │
│  │  │         │  └─ useWebSocketProps()            │ │
│  │  │         └─ CustomComponent                   │ │
│  │  │            └─ withWebSocket(Component)       │ │
│  │  │                                                │ │
│  │  └─ </AppProviders>                              │ │
│  └────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓ WebSocket Connection
                          │
     ┌────────────────────┴─────────────────────┐
     │                                           │
     ↓                                           ↓
╔═══════════════╗                      ╔═══════════════╗
║   /ws/user/   ║                      ║   HTTP APIs   ║
║   {userUUID}  ║ (Real-time events)   ║ (CRUD ops)    ║
╚═══════════════╝                      ╚═══════════════╝
     │                                           
     ↓ Message Flow                              
     │                                           
  Backend Server                                 
  (FastAPI)                                      
```

## Provider Hierarchy (Correct Order ⭐)

```
AppProviders
│
├── 1. LanguageProvider
│   └─ Provides i18n context
│
├── 2. ThemeProvider
│   └─ Provides theme context (light/dark)
│
├── 3. ThemeInitializer
│   └─ Initializes theme from localStorage
│
├── 4. ReduxProvider
│   └─ Wraps Redux store
│       │
│       └─ Redux State:
│          ├─ auth { user, tokens, isAuthenticated }
│          ├─ conversation { messages, currentConv }
│          └─ other slices...
│
├── 5. AuthInitializer ⚡ Auth restoration
│   └─ Reads localStorage
│       └─ Calls getCurrentUser() API
│           └─ Dispatches auth data to Redux
│
├── 6. AuthProvider
│   └─ Provides auth methods (login, logout, etc)
│       └─ Reads user from Redux (via AuthInitializer)
│
├── 7. WebSocketInitializer ⭐ WebSocket setup
│   └─ Reads user from Redux (via AuthProvider)
│       └─ Reads token from localStorage
│           └─ Calls useWebSocket hook
│               └─ Establishes WebSocket connection
│                   └─ Provides WebSocketContext
│
└── 8. App Content
    └─ Components can now:
       ├─ useWebSocketContext() ✅
       ├─ useWebSocketConversation() ✅
       ├─ withWebSocket(Component) ✅
       └─ useWebSocketProps() ✅
```

## Connection Lifecycle Flow

```
┌────────────────────────────────────────────────────────┐
│               CONNECTION LIFECYCLE                      │
└────────────────────────────────────────────────────────┘

START
  │
  ├─ App loads (index page)
  │
  ├─ AppProviders renders
  │
  ├─ AuthInitializer:
  │  └─ Checks localStorage for tokens
  │  └─ If found: calls getCurrentUser() API
  │  └─ Dispatches user to Redux
  │  └─ Redux state.auth.user = user object
  │
  ├─ WebSocketInitializer:
  │  └─ Reads user from Redux: ✅ Available
  │  └─ Reads token from localStorage: ✅ Available
  │  └─ Both available? → autoConnect = true
  │
  ├─ useWebSocket hook called with autoConnect=true
  │  └─ Builds WebSocket URL: wss://host/ws/user/{uuid}?token=...
  │  └─ Creates WebSocket connection
  │  └─ Sends request to backend
  │
  ├─ Backend validates:
  │  ├─ Decodes UUID ✓
  │  ├─ Validates token ✓
  │  ├─ Checks user permissions ✓
  │  └─ Opens WebSocket connection
  │
  ├─ Backend sends: { type: 'connection_established' }
  │
  ├─ Frontend receives message:
  │  ├─ Parses JSON
  │  ├─ Calls defaultHandler for CONNECTION_ESTABLISHED
  │  └─ WebSocket connection ready!
  │
  ├─ Components mount:
  │  ├─ ChatWindow component
  │  ├─ Calls useWebSocketContext()
  │  ├─ Gets context
  │  ├─ Calls registerHandlers({ 'message_generate': handler })
  │  └─ Handlers stored in WebSocketInitializer state
  │
  └─ READY: WebSocket receiving messages ✅


USER LOGS OUT:
  │
  ├─ logout() called
  │  ├─ Clears Redux auth state
  │  └─ Clears localStorage tokens
  │
  ├─ WebSocketInitializer detects auth change
  │  ├─ user becomes null
  │  ├─ token becomes null
  │  └─ Calls disconnect()
  │
  ├─ WebSocket closes
  │  └─ Backend closes connection
  │
  └─ DISCONNECTED: No more events ✅


NETWORK ERROR:
  │
  ├─ WebSocket connection breaks
  │  └─ onclose handler triggered
  │
  ├─ useWebSocket schedules reconnect
  │  ├─ Attempt 1: wait 1 second
  │  ├─ Attempt 2: wait 2 seconds
  │  ├─ Attempt 3: wait 4 seconds (exponential backoff)
  │  ├─ Attempt 4: wait 8 seconds
  │  └─ Max 10 attempts
  │
  ├─ Each reconnect attempt:
  │  ├─ Creates new WebSocket
  │  ├─ Sends same auth token
  │  └─ Tries to connect
  │
  ├─ Connection restores:
  │  ├─ Backend validates again
  │  └─ Opens connection
  │
  └─ RECONNECTED: Back to receiving events ✅
```

## Message Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│              MESSAGE DELIVERY FLOW                      │
└────────────────────────────────────────────────────────┘

BACKEND (Server)
  │
  ├─ AI generates response
  ├─ Saves message to database
  ├─ Creates WebSocket event:
  │  ├─ event_type: MessageEventType.MESSAGE_GENERATE
  │  ├─ message_data: { uuid, content, sender_uuid, ... }
  │  ├─ status: 'pending'
  │  ├─ scheduled_at: now()
  │  └─ sent_at: null
  │
  ├─ Sends command: send_websocket_messages
  │  └─ Processes pending events
  │
  ├─ For each pending event:
  │  ├─ Gets user's WebSocket connection
  │  ├─ Sends JSON message:
  │  │  ├─ type: 'message_generate'
  │  │  ├─ message: { uuid, content, ... }
  │  │  └─ response_message: { conversation_uuid, ... }
  │  │
  │  └─ Updates event: sent_at = now(), status = 'sent'
  │
  └─ WebSocket sends over network
     │
     ↓ (Network)
     │
  FRONTEND (Browser)
     │
     ├─ WebSocket onmessage triggered
     ├─ Event data received
     ├─ JSON.parse(event.data)
     │
     ├─ handleMessage(parsedData)
     │  ├─ message type = 'message_generate'
     │  ├─ Check registered handlers
     │  └─ Merge with default handlers
     │
     ├─ Call matched handler:
     │  ├─ Handler: (data) => {
     │  │  ├─ Check if message for current conversation
     │  │  ├─ dispatch(addMessage(data.message))
     │  │  └─ Redux store updated
     │  │ }
     │
     ├─ Redux state updates
     │  ├─ conversation.messages.push(newMessage)
     │  └─ Selectors re-run
     │
     ├─ Connected components re-render:
     │  ├─ ChatMessages component
     │  ├─ Uses selector: messages = state.conversation.messages
     │  ├─ Re-renders with new message
     │  └─ New message appears in UI
     │
     └─ USER SEES MESSAGE ✅
```

## Component Integration Patterns

```
┌────────────────────────────────────────────────────────┐
│            THREE USAGE PATTERNS                         │
└────────────────────────────────────────────────────────┘

PATTERN 1: Hook (useWebSocketContext) ⭐ Recommended
┌────────────────────────────────────────────────────────┐
│ const MyComponent = () => {                            │
│   const { isConnected, registerHandlers } =            │
│     useWebSocketContext()                              │
│                                                        │
│   useEffect(() => {                                    │
│     return registerHandlers({                          │
│       'message_generate': handleMessage,               │
│     })                                                 │
│   }, [registerHandlers])                               │
│                                                        │
│   return <div>{isConnected ? '✅' : '❌'}</div>       │
│ }                                                      │
└────────────────────────────────────────────────────────┘
         │
         ├─ Direct context access
         ├─ No wrapper component
         ├─ Cleanest syntax
         └─ Recommended for most cases


PATTERN 2: HOC (withWebSocket) 
┌────────────────────────────────────────────────────────┐
│ const MyComponent = ({ websocket }) => {               │
│   useEffect(() => {                                    │
│     return websocket.registerHandlers({...})           │
│   }, [websocket])                                      │
│                                                        │
│   return <div>{websocket.isConnected ? '✅' : '❌'}</d>│
│ }                                                      │
│                                                        │
│ export default withWebSocket(MyComponent)             │
└────────────────────────────────────────────────────────┘
         │
         ├─ Wraps component with HOC
         ├─ Injects as props
         ├─ Good for class components
         └─ Explicit dependency tracking


PATTERN 3: useWebSocketProps Hook
┌────────────────────────────────────────────────────────┐
│ const MyComponent = () => {                            │
│   const websocket = useWebSocketProps()                │
│                                                        │
│   useEffect(() => {                                    │
│     return websocket.registerHandlers({...})           │
│   }, [websocket])                                      │
│                                                        │
│   return <div>{websocket.isConnected ? '✅' : '❌'}</d>│
│ }                                                      │
└────────────────────────────────────────────────────────┘
         │
         ├─ Hook alternative to HOC
         ├─ Returns WebSocketProps directly
         ├─ Cleaner than HOC for functions
         └─ Best of both worlds
```

## Handler Registration Flow

```
┌────────────────────────────────────────────────────────┐
│          HANDLER REGISTRATION LIFECYCLE                │
└────────────────────────────────────────────────────────┘

COMPONENT MOUNTS
  │
  ├─ useEffect(() => { ... }, [registerHandlers])
  │
  ├─ Calls: registerHandlers({
  │   'message_generate': handleMessage,
  │   'error': handleError,
  │ })
  │
  ├─ WebSocketInitializer receives:
  │  ├─ Adds handlers to customHandlers state
  │  └─ Triggers useEffect in useWebSocket hook
  │
  ├─ useWebSocket merges handlers:
  │  ├─ defaultHandlers (CONNECTION_ESTABLISHED, PONG, etc)
  │  ├─ customHandlers (from all mounted components)
  │  └─ allHandlers = { ...defaultHandlers, ...customHandlers }
  │
  ├─ Server sends message:
  │  ├─ type: 'message_generate'
  │  └─ data: { message, ... }
  │
  ├─ Frontend receives:
  │  ├─ Parses JSON
  │  ├─ Gets type = 'message_generate'
  │  ├─ Looks up handler in allHandlers
  │  ├─ Handler found! ✅
  │  └─ Calls: allHandlers['message_generate'](data)
  │
  ├─ Handler executes:
  │  ├─ handleMessage(data)
  │  ├─ Processes data
  │  ├─ dispatch(addMessage(data))
  │  └─ Redux updated
  │
  ├─ Component re-renders with new data
  │
  └─ USER SEES UPDATED UI ✅


COMPONENT UNMOUNTS
  │
  ├─ useEffect returns unregister function
  │
  ├─ unregister() called:
  │  ├─ Removes handlers from customHandlers state
  │  └─ Triggers useEffect in useWebSocket hook
  │
  ├─ useWebSocket re-merges handlers:
  │  ├─ defaultHandlers (unchanged)
  │  ├─ customHandlers (handlers removed)
  │  └─ allHandlers updated (no more message_generate)
  │
  ├─ Server sends message:
  │  ├─ No registered handler for 'message_generate'
  │  ├─ Message ignored or logged as warning
  │  └─ No crash! ✅
  │
  └─ CLEANUP COMPLETE ✅
```

## Redux Integration (Conversation)

```
┌────────────────────────────────────────────────────────┐
│       REDUX INTEGRATION: MESSAGE FLOW                  │
└────────────────────────────────────────────────────────┘

WebSocket Receives:
  {
    type: 'message_generate',
    message: {
      uuid: '123-abc',
      content: 'Hello',
      sender_uuid: 'user-456',
      created_at: '2024-01-28T...',
      ...
    },
    response_message: {
      conversation_uuid: 'conv-789',
      ...
    }
  }
     │
     ↓ Handler called:
     │
  useWebSocketConversation hook
     │
     ├─ Handler: (data) => {
     │  ├─ Check if data.message exists
     │  ├─ Get conversation_uuid from data.response_message
     │  ├─ Check if matches currentConversation
     │  │
     │  ├─ If matches:
     │  │  └─ dispatch(addMessage({
     │  │     conversationUuid: 'conv-789',
     │  │     message: data.message,
     │  │   }))
     │  │
     │  └─ If not matches:
     │     └─ Log: "Message for non-active conversation"
     │ }
     │
     ↓ Redux Action: addMessage
     │
  conversationSlice reducer
     │
     ├─ Finds conversation: conv-789
     ├─ Adds message to conversation.messages array
     ├─ Returns updated state
     └─ Triggers selectors
        │
        ↓ Connected components re-render
        │
     ChatMessages component
        │
     ├─ Uses selector:
     │  └─ messages = state.conversation.messages
     │
     ├─ Re-renders with new message
     │
     └─ NEW MESSAGE VISIBLE IN UI ✅
```

## Error Handling Flow

```
┌────────────────────────────────────────────────────────┐
│              ERROR HANDLING FLOW                        │
└────────────────────────────────────────────────────────┘

CONNECTION ERROR
  │
  ├─ WebSocket connection fails (network error)
  │
  ├─ onclose handler triggered
  │  └─ isConnectedRef.current = false
  │
  ├─ scheduleReconnect() called
  │  ├─ Calculate delay: reconnectAttempts * 1000
  │  ├─ Set timeout for reconnection
  │  └─ Increment reconnectAttempts
  │
  ├─ UI shows: "Reconnecting... (attempt 1)"
  │
  ├─ After delay, tries to reconnect
  │  ├─ Creates new WebSocket
  │  ├─ Attempts connection
  │  └─ If succeeds: reset attempts, re-register handlers
  │
  └─ CONNECTION RESTORED ✅


MESSAGE HANDLER ERROR
  │
  ├─ Handler function throws error
  │  ├─ try {
  │  │   handler(message)
  │  │ } catch (error) {
  │  │   console.error('Handler error:', error)
  │  │ }
  │
  ├─ Error logged to console
  ├─ onError callback called (if provided)
  └─ App continues running ✅


AUTHENTICATION ERROR
  │
  ├─ Backend rejects connection (invalid token)
  │  └─ WebSocket.close(4002) - INVALID_TOKEN
  │
  ├─ Frontend detects close code
  │  ├─ Logs error: "Authentication failed"
  │  ├─ Calls onError callback
  │  └─ Does NOT attempt reconnection (auth error)
  │
  ├─ User automatically logged out
  │  ├─ Redux auth state cleared
  │  ├─ localStorage tokens cleared
  │  └─ Redirected to login page
  │
  └─ USER MUST RE-LOGIN ✅


PARSE ERROR
  │
  ├─ Message received cannot be parsed as JSON
  │
  ├─ catch (error) {
  │   console.error('Error parsing message:', error)
  │ }
  │
  ├─ Error logged
  ├─ Next message processed normally
  └─ No crash! ✅
```

## State Management

```
┌────────────────────────────────────────────────────────┐
│        WEBSOCKET STATE MANAGEMENT                      │
└────────────────────────────────────────────────────────┘

WebSocketInitializer State:
┌─────────────────────────────────────────────────────────┐
│ {                                                       │
│   customHandlers: {                                     │
│     'message_generate': (msg) => {...},                │
│     'error': (msg) => {...},                           │
│     ...                                                 │
│   }                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
            │
            ├─ Updated when:
            │  ├─ registerHandlers() called
            │  ├─ unregisterHandlers() called
            │  └─ Triggers re-merge with default handlers
            │
            └─ Passed to useWebSocket as option

Redux State (from AuthProvider):
┌─────────────────────────────────────────────────────────┐
│ {                                                       │
│   auth: {                                               │
│     user: { uuid, email, ... },                        │
│     isAuthenticated: true,                              │
│     accessToken: 'jwt_token...',                       │
│     refreshToken: 'refresh_token...'                   │
│   }                                                     │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
            │
            ├─ Read by:
            │  ├─ WebSocketInitializer (gets user & token)
            │  ├─ useWebSocketConversation (gets context)
            │  └─ Other components
            │
            └─ Updated when:
               ├─ User logs in
               ├─ User logs out
               └─ Token refreshed

localStorage:
┌─────────────────────────────────────────────────────────┐
│ {                                                       │
│   'access_token': 'jwt_token...',                      │
│   'refresh_token': 'refresh_token...'                  │
│ }                                                       │
└─────────────────────────────────────────────────────────┘
            │
            ├─ Read by:
            │  ├─ AuthInitializer (restore on app load)
            │  └─ WebSocketInitializer (pass token)
            │
            └─ Updated when:
               ├─ User logs in
               ├─ User logs out
               └─ Token refreshed
```

## Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│          DEPLOYMENT ARCHITECTURE                        │
└────────────────────────────────────────────────────────┘

User Browser
  │
  ├─ HTTPS/TLS
  │
  ├─ HTTP Requests
  │  └─ REST API: /api/...
  │     ├─ GET /api/conversations
  │     ├─ POST /api/messages
  │     └─ etc.
  │
  └─ WebSocket (WSS)
     └─ Real-time events: /ws/user/{uuid}
        ├─ message_generate
        ├─ message_regenerate
        ├─ notifications
        └─ etc.
           │
           ↓
        
Backend Server (FastAPI)
  │
  ├─ HTTP Endpoints
  │  ├─ /api/conversations
  │  ├─ /api/messages
  │  └─ etc.
  │
  ├─ WebSocket Endpoint
  │  └─ /ws/user/{encoded_user_uuid}
  │     ├─ Accepts connection
  │     ├─ Validates JWT token
  │     ├─ Registers user in connection manager
  │     ├─ Listens for client messages
  │     ├─ Sends queued events
  │     └─ Closes on logout
  │
  ├─ Command: send_websocket_messages
  │  ├─ Runs periodically (every 30 seconds)
  │  ├─ Processes pending WebSocket events
  │  ├─ Gets user's WebSocket connection
  │  └─ Sends message to client
  │
  └─ Database
     └─ Tables:
        ├─ messages (stores all messages)
        ├─ websocket_message_events
        │  ├─ event_type
        │  ├─ message_data (JSON)
        │  ├─ status (pending, sent)
        │  ├─ scheduled_at
        │  └─ sent_at
        └─ other tables...
```

---

All diagrams show the complete architecture and flows for understanding WebSocket integration.

