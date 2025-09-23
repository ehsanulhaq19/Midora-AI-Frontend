# Chat UI Implementation

## Overview

This document describes the implementation of the new chat UI based on the Chat folder design. The implementation follows the established patterns in the midora.ai-frontend project and provides a modern, responsive chat interface.

## Architecture

### Component Structure

```
src/components/chat/
├── chat-screen.tsx              # Main chat screen component
├── model-selection.tsx          # Model selection dropdown
└── sidebar/
    ├── main-container.tsx       # Main sidebar container
    ├── new-chat.tsx            # New chat button component
    ├── search-chat.tsx         # Search chat functionality
    └── profile-info.tsx        # User profile information
```

### UI Components

```
src/components/ui/
└── avatar.tsx                  # Reusable avatar component
```

### Icons

```
src/icons/
├── arrow-up-sm.tsx             # Arrow up small icon
├── audio-settings.tsx          # Audio settings icon
├── down-arrow-sm.tsx           # Down arrow small icon
├── folder-open.tsx             # Folder open icon
├── folder-open-02.tsx          # Folder open variant 2
├── folders.tsx                 # Folders icon
├── midoras.tsx                 # Midoras brand icon
└── minus-square.tsx            # Minus square icon
```

## Features

### Main Chat Screen

The main chat screen (`ChatScreen`) provides:

- **Sidebar Navigation**: Complete sidebar with navigation menu, recent chats, and user profile
- **Model Selection**: Dropdown to select AI models (Claude, etc.)
- **Welcome Interface**: Welcome message with action buttons
- **Upgrade Prompt**: Pro+ upgrade button

### Sidebar Components

#### Main Container
- Logo and minimize button
- New chat functionality
- Search chat feature
- Navigation menu with:
  - Midoras
  - AI Detection
  - AI Humanizer
  - New Folder
  - Project Discussion (with sub-items)
  - Main Stream Media
- Recent chats list
- User profile information

#### New Chat Button
- Add new chat functionality
- Upload file functionality
- Proper icon states

#### Search Chat
- Interactive search functionality
- Hover states
- Proper styling

#### Profile Info
- User avatar display
- User name and membership status
- Dropdown arrow for profile menu
- Hover interactions

### Model Selection
- Manual model selection
- Current model display (Claude)
- Gradient background styling
- Dropdown functionality

## Styling

### Design Tokens

The implementation uses CSS custom properties (design tokens) for consistent styling:

- `--tokens-color-surface-surface-primary`
- `--tokens-color-surface-surface-secondary`
- `--tokens-color-surface-surface-tertiary`
- `--tokens-color-text-text-primary`
- `--tokens-color-text-text-secondary`
- `--tokens-color-text-text-brand`
- `--tokens-color-border-border-primary`
- `--tokens-color-border-border-inactive`

### Typography

- Font families: 'Poppins', Helvetica
- Font weights: normal, medium, bold
- Font sizes: text-small, text-large, h02-heading02, h05-heading05
- Line heights and letter spacing as per design system

### Layout

- Fixed width layout (1600px)
- Responsive sidebar (287px)
- Proper spacing and gaps
- Rounded corners using design tokens

## Internationalization

### Chat Translations

New translations added to `src/i18n/languages/en/chat.ts`:

- `welcomeBack`: Welcome message with user name
- `howCanIHelp`: Help prompt
- `searchChat`: Search functionality
- `midoras`: Brand name
- `aiDetection`: AI Detection feature
- `aiHumanizer`: AI Humanizer feature
- `newFolder`: New folder functionality
- `projectDiscussion`: Project discussion section
- `imageToPencilSketch`: Image conversion feature
- `mainStreamMedia`: Main stream media section
- `recents`: Recent chats
- `photoEnhancement`: Photo enhancement feature
- `realTimeColorization`: Real-time colorization
- `model3DGeneration`: 3D model generation
- `styleTransfer`: Style transfer feature
- `facialRecognition`: Facial recognition feature
- `manual`: Manual mode
- `claude`: Claude model name
- `upgradeToPro`: Upgrade prompt

## Static Assets

### Required Images

The following images need to be copied from the Chat folder to `public/img/`:

- `6122191-1-1.png` - AI Detection icon
- `6122191-1.png` - AI Detection icon variant
- `avatar-3.png` - Default user avatar
- `image-26-1.svg` - AI Humanizer icon
- `image-26-2.svg` - AI Humanizer icon variant
- `image-26.svg` - AI Humanizer icon
- `logo-2.png` - Logo variant 2
- `size-lg-type-image-indicator-none.png` - Avatar placeholder
- `vector.svg` - Vector icon for model selection

## Usage

### Basic Implementation

```tsx
import { ChatScreen } from '@/components/chat/chat-screen'

export default function ChatPage() {
  return <ChatScreen />
}
```

### Component Props

#### MainContainer
```tsx
interface MainContainerProps {
  className?: string
  headerClassName?: string
  imagesImage?: string
  profileInfoAvatarSizeLgTypeImageClassName?: string
  profileInfoIcon?: React.ReactNode
  property1?: 'expanded'
}
```

#### ModelSelection
```tsx
interface ModelSelectionProps {
  property1?: 'frame-105'
  className?: string
  divClassName?: string
}
```

#### NewChat
```tsx
interface NewChatProps {
  property1?: 'add' | 'upload'
  className?: string
}
```

#### SearchChat
```tsx
interface SearchChatProps {
  property1?: 'hovered' | 'idle'
  className?: string
}
```

#### ProfileInfo
```tsx
interface ProfileInfoProps {
  property1?: 'hovered' | 'idle'
  className?: string
  avatarSizeLgTypeImageClassName?: string
  icon?: React.ReactNode
}
```

## State Management

### Hover States

Components use `useReducer` for managing hover states:

```tsx
const [state, dispatch] = useReducer(reducer, {
  property1: 'idle'
})

// Mouse events
onMouseEnter={() => dispatch('mouse_enter')}
onMouseLeave={() => dispatch('mouse_leave')}
```

## Accessibility

- Proper ARIA labels
- Keyboard navigation support
- Focus management
- Screen reader compatibility
- Color contrast compliance

## Performance

- Optimized re-renders using React.memo where appropriate
- Efficient state management with useReducer
- Lazy loading for heavy components
- Image optimization with Next.js Image component

## Testing

### Unit Tests

Components should be tested for:

- Rendering with different props
- State changes (hover, click)
- Event handlers
- Accessibility features

### Integration Tests

- Full chat screen functionality
- Sidebar interactions
- Model selection
- Search functionality

## Future Enhancements

1. **Real-time Chat**: WebSocket integration for real-time messaging
2. **File Upload**: Drag and drop file upload functionality
3. **Chat History**: Persistent chat history storage
4. **Themes**: Dark/light theme support
5. **Responsive Design**: Mobile-first responsive layout
6. **Keyboard Shortcuts**: Keyboard shortcuts for common actions
7. **Voice Input**: Voice-to-text functionality
8. **Chat Export**: Export chat conversations

## Dependencies

- React 18+
- Next.js 13+
- TypeScript
- Tailwind CSS
- Next.js Image component
- Custom design tokens

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes

- All components are client-side rendered (`'use client'`)
- Icons are SVG-based for scalability
- Styling follows the established design system
- Internationalization is fully supported
- Components are reusable and modular
