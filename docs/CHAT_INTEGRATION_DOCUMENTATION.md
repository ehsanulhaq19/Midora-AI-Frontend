# Chat Integration Documentation

## Overview

This document describes the chat integration implementation in the Midora.ai frontend, including the conversation management system, real-time streaming, and UI components.

## Architecture

### Components Structure

```
src/components/chat/
├── chat-screen.tsx              # Main chat screen container
├── sections/
│   ├── chat-interface.tsx       # Chat input interface
│   ├── conversation-container.tsx # Message display container
│   ├── message-input.tsx        # Message input component
│   ├── model-selection.tsx      # AI model selection
│   └── navigation-sidebar.tsx   # Sidebar with conversations
```

### State Management

The chat system uses Redux for state management with the following structure:

```typescript
interface ConversationState {
  conversations: Conversation[]           // List of all conversations
  currentConversation: Conversation | null // Currently active conversation
  messages: { [conversationUuid: string]: Message[] } // Messages by conversation
  isLoading: boolean                     // Loading state
  error: string | null                   // Error state
  isStreaming: boolean                   // Streaming state
  streamingContent: string               // Current streaming content
  aiModels: AIModel[]                    // Available AI models
  selectedModel: AIModel | null          // Selected AI model
}
```

## Key Features

### 1. Real-time Streaming

The chat interface supports real-time streaming of AI responses using Server-Sent Events (SSE):

- **Streaming Display**: Content appears character by character as it's generated
- **Typing Indicator**: Shows "AI is typing..." during generation
- **Error Handling**: Graceful error handling for streaming failures
- **Completion Handling**: Proper cleanup when streaming completes

### 2. Conversation Management

- **Auto-creation**: Conversations are automatically created when sending the first message
- **Conversation History**: Recent conversations are displayed in the sidebar
- **Message Persistence**: All messages are saved and retrieved from the backend
- **Conversation Switching**: Users can switch between different conversations

### 3. Message Display

- **User Messages**: Displayed on the right side with user styling
- **AI Messages**: Displayed on the left side with markdown rendering
- **Copy Functionality**: Each message has a copy button for easy copying
- **Timestamps**: Messages show creation time
- **Responsive Design**: Messages adapt to different screen sizes

## API Integration

### Conversation API

```typescript
// Get all conversations
const conversations = await conversationApi.getConversations(page, perPage)

// Create new conversation
const conversation = await conversationApi.createConversation({ name })

// Get messages for conversation
const messages = await conversationApi.getMessages(conversationUuid, page, perPage)

// Send message
const message = await conversationApi.createMessage(conversationUuid, { content })
```

### Streaming API

```typescript
// Generate content with streaming
await conversationApi.generateContentStream(
  { query, conversation_uuid, stream: true },
  onChunk,      // Handle streaming chunks
  onComplete,   // Handle completion
  onError       // Handle errors
)
```

## Components

### ChatScreen

Main container component that orchestrates the entire chat experience:

- Manages sidebar state
- Handles conversation loading
- Coordinates between different chat components
- Provides responsive layout

### ConversationContainer

Displays messages for the current conversation:

- **Message Bubbles**: Different styling for user vs AI messages
- **Markdown Rendering**: AI responses are rendered as markdown
- **Auto-scroll**: Automatically scrolls to new messages
- **Copy Functionality**: Copy button for each message
- **Streaming Display**: Shows real-time streaming content

### NavigationSidebar

Sidebar with conversation management:

- **Recent Conversations**: List of recent conversations
- **New Chat Button**: Creates new conversations
- **Conversation Selection**: Click to switch conversations
- **Search Functionality**: Search through conversations
- **Responsive Design**: Collapsible on mobile

### MessageInput

Input component for sending messages:

- **Text Area**: Multi-line text input
- **Send Button**: Submit messages
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- **Attachment Support**: File attachment buttons
- **Validation**: Prevents empty message sending

## Hooks

### useConversation

Custom hook for conversation management:

```typescript
const {
  conversations,           // All conversations
  currentConversation,     // Current conversation
  messages,               // Messages for current conversation
  isLoading,              // Loading state
  error,                  // Error state
  isStreaming,            // Streaming state
  streamingContent,       // Current streaming content
  aiModels,               // Available AI models
  loadConversations,      // Load conversations
  createConversation,     // Create new conversation
  selectConversation,     // Select conversation
  sendMessage,            // Send message
  loadAIModels,           // Load AI models
  startNewChat,           // Start new chat
  clearError              // Clear errors
} = useConversation()
```

## State Flow

### Sending a Message

1. User types message and clicks send
2. `sendMessage` is called from `useConversation` hook
3. If no conversation exists, create new conversation
4. Add user message to Redux state immediately
5. Start streaming AI response
6. Stream content chunks to UI in real-time
7. Complete streaming and save AI message
8. Update conversation in sidebar

### Loading Conversations

1. `loadConversations` is called on component mount
2. API request to get conversations
3. Update Redux state with conversations
4. Sidebar displays conversation list
5. User can click to select conversation

### Switching Conversations

1. User clicks conversation in sidebar
2. `selectConversation` is called
3. Load messages for selected conversation
4. Update current conversation in state
5. Display messages in conversation container

## Error Handling

### API Errors

- Network errors are caught and displayed to user
- Authentication errors redirect to login
- Rate limiting errors show appropriate messages
- Server errors show generic error message

### Streaming Errors

- Connection errors are handled gracefully
- Partial content is preserved on error
- User can retry failed requests
- Error messages are user-friendly

## Performance Considerations

### Optimization Strategies

- **Lazy Loading**: Messages are loaded on demand
- **Pagination**: Large conversation lists are paginated
- **Debouncing**: Search input is debounced
- **Memoization**: Components are memoized to prevent unnecessary re-renders
- **Virtual Scrolling**: For very long conversation lists (future enhancement)

### Memory Management

- **State Cleanup**: Old conversations are removed from memory
- **Message Limits**: Limit number of messages loaded per conversation
- **Streaming Cleanup**: Proper cleanup of streaming connections

## Responsive Design

### Mobile Support

- **Collapsible Sidebar**: Sidebar collapses on mobile
- **Touch-friendly**: Large touch targets for mobile
- **Responsive Messages**: Messages adapt to screen size
- **Mobile Navigation**: Easy navigation on small screens

### Desktop Features

- **Keyboard Shortcuts**: Full keyboard support
- **Drag and Drop**: File attachment support
- **Multi-window**: Support for multiple chat windows (future)

## Accessibility

### WCAG Compliance

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: Proper ARIA labels and roles
- **Color Contrast**: Sufficient color contrast ratios
- **Focus Management**: Proper focus management

### Features

- **Alt Text**: Images have proper alt text
- **ARIA Labels**: Interactive elements have ARIA labels
- **Focus Indicators**: Clear focus indicators
- **Error Announcements**: Errors are announced to screen readers

## Testing

### Unit Tests

- Component rendering tests
- Hook functionality tests
- API integration tests
- State management tests

### Integration Tests

- End-to-end chat flow
- Streaming functionality
- Error handling
- Responsive behavior

### Performance Tests

- Large conversation handling
- Streaming performance
- Memory usage
- Load time optimization

## Future Enhancements

### Planned Features

- **File Attachments**: Support for file uploads
- **Voice Messages**: Voice message support
- **Message Reactions**: Emoji reactions to messages
- **Message Threading**: Reply to specific messages
- **Search**: Full-text search across conversations
- **Export**: Export conversations to various formats
- **Sharing**: Share conversations with other users
- **Collaboration**: Multi-user conversations

### Technical Improvements

- **WebSocket Support**: Real-time bidirectional communication
- **Offline Support**: Offline message queuing
- **Push Notifications**: Real-time notifications
- **Message Encryption**: End-to-end encryption
- **Advanced Search**: AI-powered search
- **Message Analytics**: Usage analytics and insights
