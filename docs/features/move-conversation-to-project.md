# Move Conversation to Project - Frontend Implementation

## Overview

This document outlines the frontend implementation of the "Move Conversation to Project" feature. This feature allows users to move conversations between projects with an intuitive UI consisting of action menus, modals, and confirmations.

## Features

- **Action Menu**: Three-dot menu on each conversation in the project screen
- **Project Selection Modal**: Searchable dropdown to select a destination project
- **Confirmation Modal**: Confirms the move operation before proceeding
- **Real-time Updates**: Conversation list updates after successful move
- **Error Handling**: User-friendly error messages with toast notifications
- **Loading States**: Proper loading indicators during API calls

## Architecture

### Components

#### 1. ConversationActionMenu (`conversation-action-menu.tsx`)

Three-dot menu button that appears on hover over each conversation.

**Props:**
- `onMoveToProject: () => void` - Callback when "Move to project" is clicked
- `className?: string` - Additional CSS classes

**Features:**
- Hover-triggered dropdown
- Click-outside detection to close menu
- Smooth transitions

**Usage:**
```typescript
<ConversationActionMenu
  onMoveToProject={() => handleOpenMoveModal(conversation)}
  className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
/>
```

#### 2. MoveConversationModal (`move-conversation-modal.tsx`)

Modal that displays a searchable list of projects (excluding the current project).

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `currentProjectUuid: string` - UUID of current project (to exclude from list)
- `onSelectProject: (project: Project) => void` - Callback when a project is selected
- `onClose: () => void` - Callback to close the modal

**Features:**
- Infinite scroll to load more projects
- Real-time search filtering
- Loading states
- Excludes current project from list

**Usage:**
```typescript
<MoveConversationModal
  isOpen={isMoveModalOpen}
  currentProjectUuid={project.id}
  onSelectProject={handleSelectProjectForMove}
  onClose={() => setIsMoveModalOpen(false)}
/>
```

#### 3. MoveConversationConfirmation (`move-conversation-confirmation.tsx`)

Confirmation modal before moving the conversation.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `conversationName: string` - Name of conversation being moved
- `projectName: string` - Name of destination project
- `onConfirm: () => void` - Callback to confirm the move
- `onCancel: () => void` - Callback to cancel the move
- `isLoading?: boolean` - Loading state indicator

**Features:**
- Clear information display
- Disabled state during API call
- Loading indicator on confirm button

**Usage:**
```typescript
<MoveConversationConfirmation
  isOpen={isMoveConfirmationOpen}
  conversationName={selectedConversationForMove?.name || ""}
  projectName={selectedProjectForMove?.name || ""}
  onConfirm={handleConfirmMove}
  onCancel={() => {
    setIsMoveConfirmationOpen(false);
    setSelectedConversationForMove(null);
    setSelectedProjectForMove(null);
  }}
  isLoading={isLinkingConversation}
/>
```

### Hooks

#### useLinkConversation (`use-link-conversation.ts`)

Custom hook for calling the link conversation API.

**Interface:**
```typescript
interface UseLinkConversationOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}
```

**Return Value:**
```typescript
{
  linkConversationToProject: (
    projectUuid: string,
    conversationUuid: string,
    token: string
  ) => Promise<boolean>;
  isLoading: boolean;
}
```

**Features:**
- Automatic toast notifications for success/error
- Callback hooks for custom handling
- Loading state management
- Error handling with fallback messages

**Usage:**
```typescript
const { linkConversationToProject, isLoading } = useLinkConversation({
  onSuccess: () => {
    // Handle success
  },
  onError: (error) => {
    // Handle error
  }
});

const success = await linkConversationToProject(
  projectUuid,
  conversationUuid,
  authToken
);
```

### Integration in ProjectScreen

#### State Management

```typescript
// Modal control states
const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
const [isMoveConfirmationOpen, setIsMoveConfirmationOpen] = useState(false);

// Selected data states
const [selectedConversationForMove, setSelectedConversationForMove] = useState<{ uuid: string; name: string } | null>(null);
const [selectedProjectForMove, setSelectedProjectForMove] = useState<{ uuid: string; name: string } | null>(null);

// API hook
const { linkConversationToProject, isLoading: isLinkingConversation } = useLinkConversation({
  onSuccess: () => {
    // Close modals and reload conversations
  }
});
```

#### Event Handlers

1. **handleOpenMoveModal**: Opens the project selection modal
2. **handleSelectProjectForMove**: Opens the confirmation modal with selected project
3. **handleConfirmMove**: Calls the API to move the conversation

#### UI Integration

Each conversation item now includes:
```tsx
<div className="flex items-center justify-between ...">
  <ActionButton
    onClick={() => onSelectConversation(conversation.uuid)}
    {...otherProps}
  >
    {/* Conversation info */}
  </ActionButton>
  <ConversationActionMenu
    onMoveToProject={() => handleOpenMoveModal(conversation)}
    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
  />
</div>
```

## Internationalization (i18n)

All text strings are stored in i18n files for multi-language support:

**Keys Added to all language files:**
- `chat.moveToProject` - "Move to project"
- `chat.selectProject` - "Select a project"
- `chat.moveConversation` - "Move conversation"
- `chat.moveConversationDescription` - "Choose a project to move this conversation to"
- `chat.confirmMove` - "Confirm move"
- `chat.movingConversation` - "Moving conversation..."
- `chat.conversationMovedSuccess` - "Conversation moved successfully"
- `chat.conversationMoveError` - "Failed to move conversation"
- `chat.noOtherProjects` - "No other projects available"
- `chat.loadingProjects` - "Loading projects..."
- `chat.search` - "Search"
- `chat.cancel` - "Cancel"
- `chat.move` - "Move"

## Data Flow

```
User Clicks Action Menu
    ↓
handleOpenMoveModal()
    ↓
Open MoveConversationModal
    ↓
User Selects Project
    ↓
handleSelectProjectForMove()
    ↓
Open MoveConversationConfirmation
    ↓
User Confirms Move
    ↓
handleConfirmMove()
    ↓
Call linkConversationToProject API
    ↓
Show Success/Error Toast
    ↓
Close Modals & Reload Conversation List
```

## API Integration

The frontend communicates with the backend API:

**Endpoint:** `POST /api/v1/projects/{projectUuid}/conversations/{conversationUuid}/link`

**Request:**
```typescript
const response = await fetch(
  `/api/v1/projects/${projectUuid}/conversations/${conversationUuid}/link`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
);
```

**Response:**
```typescript
{
  success: true,
  data: {
    uuid: "encoded_uuid",
    created_at: "2024-01-31T10:30:00Z",
    updated_at: "2024-01-31T10:30:00Z"
  }
}
```

## Error Handling

Errors are handled at multiple levels:

1. **Network Errors**: Caught and displayed as toast with generic message
2. **API Errors**: Backend error message displayed via toast
3. **Loading States**: Buttons disabled during API calls
4. **User Feedback**: Toast notifications for all outcomes

## Styling

All components use:
- Tailwind CSS utility classes
- Design system color variables (`--tokens-color-*`)
- Consistent spacing and typography from theme
- Hover and active states for interactivity
- Smooth transitions and animations

## Accessibility

- Keyboard navigation support
- Proper button types and labels
- Focus states visible
- Clear visual feedback for interactions
- Screen reader friendly text

## Performance Considerations

1. **Lazy Loading**: Projects loaded on-demand with infinite scroll
2. **Memoization**: Callbacks wrapped with useCallback to prevent unnecessary re-renders
3. **State Management**: Careful use of useState to minimize re-renders
4. **Search Filtering**: Client-side filtering with debouncing capability

## Testing

### Unit Tests

Test the following:
- Component renders correctly when open/closed
- Callbacks are called with correct parameters
- Loading states are displayed properly
- Modal can be closed with cancel button
- Search filtering works correctly
- Infinite scroll loads more projects

### Integration Tests

Test the complete flow:
1. Click action menu
2. Select project from modal
3. Confirm in confirmation modal
4. Verify API call is made
5. Verify success toast is shown
6. Verify conversation list is updated
7. Verify modals are closed

### E2E Tests

Test the full user journey in a real browser environment.

## Future Enhancements

1. **Drag and Drop**: Allow dragging conversations between projects
2. **Bulk Move**: Move multiple conversations at once
3. **Keyboard Shortcuts**: Add keyboard shortcuts for quick moves
4. **Move History**: Track and display move history
5. **Undo**: Allow undoing recent moves
6. **Favorites**: Mark frequently used projects for quick access

## Troubleshooting

### Issue: Modal doesn't close after moving

**Solution**: Ensure `onSuccess` callback is properly set in `useLinkConversation` hook to close modals.

### Issue: Project list is empty

**Solution**: Check that user has access to other projects and they are properly loaded via API.

### Issue: Token is undefined

**Solution**: Ensure user is properly authenticated and `authState.accessToken` is available from Redux store.

## Related Files

- Backend API: `/app/routes/v1/project_routes.py`
- Backend Service: `/app/services/project_conversation_service.py`
- Redux Auth State: `/store/slices/authSlice.ts`
- i18n Configuration: `/src/i18n/languages/*/chat.ts`
- Project API Hooks: `/src/hooks/use-projects.ts`

