# Chat Screen Implementation

## Overview

This document describes the implementation of the new chat screen for the Midora AI frontend application. The chat screen has been completely recreated based on the source chatscreen folder, following modern React patterns and TypeScript best practices.

## Architecture

### Component Structure

```
src/components/chat/
├── chat-screen.tsx                 # Main chat screen component
└── sections/
    ├── chat-interface.tsx          # Main chat interface with header and welcome section
    ├── model-selection.tsx         # Model selection dropdown component
    ├── message-input.tsx           # Message input form with attachments
    └── navigation-sidebar.tsx      # Sidebar with chat history and tools
```

### UI Components

The chat screen utilizes reusable UI components from `src/components/ui/`:

- **IconButton**: Reusable button component with icon support
- **TextareaInput**: Textarea input with variants and error handling
- **Buttons**: Various button types (primary, secondary, outline, ghost)

### Icons

New icons have been added to `src/icons/`:

- `folder-plus.tsx` - Add new folder icon
- `folder-open.tsx` - Open folder icon
- `chevron-down.tsx` - Dropdown chevron
- `microphone.tsx` - Voice input icon
- `close.tsx` - Close/cancel icon
- `more-options.tsx` - More options menu icon
- `collapse.tsx` - Collapse sidebar icon

## Features

### Chat Interface

- **Responsive Design**: Mobile-first approach with collapsible sidebar
- **Model Selection**: Dropdown to select AI model (Manual/Claude)
- **Welcome Section**: Personalized greeting with user name
- **Message Input**: Rich text input with attachment and voice input options
- **Streaming Protection**: Input is disabled during AI response streaming to prevent interruption

### Navigation Sidebar

- **Chat History**: List of recent conversations
- **Project Organization**: Folders for organizing chats
- **AI Tools**: Quick access to Midoras, AI Detection, and AI Humanizer
- **User Profile**: User information and membership status
- **Search**: Search functionality for chat history

### Mobile Support

- **Hamburger Menu**: Mobile menu button for sidebar access
- **Overlay**: Dark overlay when sidebar is open on mobile
- **Responsive Layout**: Adapts to different screen sizes

## Implementation Details

### State Management

The chat screen uses React's built-in state management:

```typescript
const [sidebarOpen, setSidebarOpen] = useState(false)
const [selectedChat, setSelectedChat] = useState<number | null>(null)
const [expandedProjects, setExpandedProjects] = useState<Record<number, boolean>>({})
```

### Event Handling

- **Menu Toggle**: Opens/closes sidebar on mobile
- **Message Sending**: Handles form submission and Enter key
- **Project Expansion**: Toggles project folder visibility
- **Chat Selection**: Manages selected chat state

### Styling

The implementation uses Tailwind CSS with custom design tokens:

- **Color Tokens**: `tokens-color-surface-surface-*`, `tokens-color-text-text-*`
- **Typography**: Custom font classes with design system variables
- **Spacing**: Consistent spacing using design system values
- **Responsive**: Mobile-first responsive design

## Internationalization

All text content is internationalized using the i18n system:

```typescript
import { t } from '@/i18n'

// Usage
{t('chat.welcomeBack', { name: userName })}
{t('chat.howCanIHelp')}
{t('chat.newChat')}
```

## API Integration

The chat screen is prepared for API integration:

```typescript
const handleSendMessage = (message: string) => {
  console.log('Sending message:', message)
  // TODO: Implement message sending logic here
}
```

## Streaming Response Management

The chat interface implements streaming response protection to ensure a smooth user experience:

### Message Submission Control

When an AI response is being streamed (`isStreaming = true`), the following controls are disabled:

- **Text Input**: The message textarea is disabled to prevent new input
- **Submit Button**: The send button is disabled and shows "Waiting for AI response..."
- **Attachment Buttons**: Add attachment and voice input buttons are disabled
- **Model Selection**: The model dropdown is disabled to prevent changes during streaming
- **Keyboard Submission**: Enter key submission is blocked during streaming

### Implementation Details

```typescript
// MessageInput component receives isStreaming prop
interface MessageInputProps {
  onSend: (message: string, modelUuid?: string) => void
  isStreaming?: boolean
}

// Streaming state flows from Redux store through component hierarchy
ChatScreen -> ChatInterface -> MessageInput
```

### User Experience

- **Visual Feedback**: Placeholder text changes to "Waiting for AI response..." during streaming
- **Disabled State**: All interactive elements show disabled styling
- **Accessibility**: Proper ARIA labels indicate the waiting state
- **Prevention**: Users cannot interrupt ongoing AI responses by submitting new messages

### State Management

The streaming state is managed in the Redux store (`conversationSlice`):

- `isStreaming: boolean` - Indicates if AI response is being streamed
- `startStreaming()` - Action to begin streaming state
- `completeStreaming()` - Action to end streaming state
- `stopStreaming()` - Action to stop streaming (error case)

## File Structure

### Components

- **ChatScreen**: Main container component
- **ChatInterface**: Main chat area with header and input
- **NavigationSidebar**: Sidebar with navigation and history
- **ModelSelection**: Model selection dropdown
- **MessageInput**: Message input form

### Assets

- **Icons**: SVG icons in `src/icons/`
- **Images**: Static images in `public/img/`
- **Styles**: Tailwind CSS with custom design tokens

## Usage

The chat screen is used in the main chat page:

```typescript
// src/app/chat/page.tsx
import { ChatScreen } from '@/components/chat/chat-screen'
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function ChatPage() {
  return (
    <AuthGuard>
      <ChatScreen />
    </AuthGuard>
  )
}
```

## Future Enhancements

1. **Real-time Messaging**: WebSocket integration for real-time chat
2. **File Attachments**: Support for file uploads and attachments
3. **Voice Input**: Integration with speech-to-text APIs
4. **Chat Persistence**: Save and load chat history
5. **Search Functionality**: Implement chat search
6. **Export Features**: Export chat conversations
7. **Themes**: Dark/light theme support

## Dependencies

- React 18+
- Next.js 13+
- TypeScript
- Tailwind CSS
- Custom design system tokens
- i18n for internationalization

## Testing

The implementation follows testing best practices:

- TypeScript for type safety
- Component composition for testability
- Separation of concerns
- Reusable components

## Performance Considerations

- **Lazy Loading**: Components can be lazy-loaded if needed
- **Memoization**: React.memo can be added for performance optimization
- **Virtual Scrolling**: For large chat histories
- **Image Optimization**: Next.js Image component for optimized images