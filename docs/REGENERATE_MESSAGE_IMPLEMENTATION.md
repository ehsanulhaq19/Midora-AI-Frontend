# Regenerate Message Implementation

## Overview

This document describes the implementation of the regenerate message functionality in the Midora AI frontend application. The feature allows users to regenerate AI responses for the last message in a conversation, with support for message versioning and navigation.

## Features

### Core Functionality
- **Regenerate Button**: Appears only on the last AI message in a conversation
- **Message Versioning**: Maintains multiple versions of regenerated messages
- **Version Navigation**: Users can navigate between different versions using arrow buttons
- **Streaming Support**: Regenerated content streams in real-time with loading animations
- **Tooltips**: Helpful tooltips for all interactive elements

### UI Components
- **Regenerate Icon**: Custom SVG icon with proper theming support
- **Version Navigation**: `< 2/2 >` style navigation controls
- **Loading States**: Logo animation during regeneration
- **Copy Functionality**: Enhanced with tooltips

## Implementation Details

### 1. Icon System

#### Regenerate Icon (`src/icons/regenerate.tsx`)
```typescript
export const Regenerate: React.FC<RegenerateIconProps> = ({ className = "w-4 h-4" }) => {
  // Custom SVG with proper stroke and fill properties
  // Uses currentColor for theme compatibility
}
```

**Features:**
- Responsive sizing with className prop
- Theme-aware coloring using `currentColor`
- Proper stroke properties for crisp rendering

### 2. API Integration

#### Regenerate API Types (`src/api/ai/types.ts`)
```typescript
export interface RegenerateContentRequest {
  message_uuid: string
  ai_model_uuid: string
}
```

#### API Client Method (`src/api/ai/api.ts`)
```typescript
async regenerateContentStream(
  data: RegenerateContentRequest,
  onChunk: StreamingChunkCallback,
  onComplete: StreamingCompleteCallback,
  onError: StreamingErrorCallback
): Promise<void>
```

**Features:**
- Streaming response handling
- Error management
- Token-based authentication
- CORS-compliant request handling

### 3. State Management

#### Redux Actions (`src/store/slices/conversationSlice.ts`)
- `updateMessageContent`: Updates message content during regeneration
- `addMessageVersion`: Adds new version to message versions array
- `setCurrentMessageVersion`: Switches between message versions

#### Message Type Extension (`src/api/conversation/types.ts`)
```typescript
export interface Message {
  // ... existing properties
  versions?: Message[]
  currentVersionIndex?: number
}
```

### 4. Custom Hook

#### Regenerate Hook (`src/hooks/use-regenerate.ts`)
```typescript
export const useRegenerate = () => {
  const regenerateMessage = useCallback(async (
    messageUuid: string,
    aiModelUuid: string,
    conversationUuid: string
  ) => {
    // Handles regeneration logic with streaming
  }, [])

  const switchMessageVersion = useCallback((
    conversationUuid: string,
    messageUuid: string,
    versionIndex: number
  ) => {
    // Handles version switching
  }, [])

  return { regenerateMessage, switchMessageVersion, isRegenerating }
}
```

### 5. UI Components

#### Tooltip Component (`src/components/ui/tooltip/tooltip.tsx`)
- Configurable positioning (top, bottom, left, right)
- Delay-based show/hide
- Accessibility support with ARIA attributes
- Theme-aware styling

#### Enhanced MessageBubble Component
- Conditional regenerate button display
- Version navigation controls
- Tooltip integration
- Loading state handling

### 6. Internationalization

#### Chat Translations (`src/i18n/languages/en/chat.ts`)
```typescript
export const chat = {
  // ... existing translations
  regenerateMessage: 'Regenerate message',
  regenerating: 'Regenerating...',
  regenerateMessageError: 'Failed to regenerate message',
  messageVersions: 'Message versions',
  previousVersion: 'Previous version',
  nextVersion: 'Next version',
  currentVersion: 'Current version',
}
```

## User Experience Flow

### 1. Regeneration Process
1. User clicks regenerate button on last AI message
2. Message content is hidden and loading animation appears
3. New content streams in real-time
4. Version navigation appears after completion
5. User can navigate between versions using arrow buttons

### 2. Version Navigation
- **Previous Version**: `<` button to go to earlier version
- **Version Counter**: Shows current version (e.g., `2/2`)
- **Next Version**: `>` button to go to newer version
- **Disabled States**: Buttons are disabled when at version limits

### 3. Visual Feedback
- **Hover States**: Buttons appear on message hover
- **Loading States**: Logo animation during regeneration
- **Tooltips**: Contextual help for all interactive elements
- **Copy Feedback**: Visual confirmation when content is copied

## API Endpoints

### Regenerate Stream
```
POST /api/v1/ai/regenerate-stream
Content-Type: application/json
Authorization: Bearer <token>

{
  "message_uuid": "string",
  "ai_model_uuid": "string"
}
```

**Response**: Server-Sent Events (SSE) stream with same format as generate-stream

## Error Handling

### Client-Side Errors
- Network failures
- Authentication errors
- Invalid message UUIDs
- Streaming interruptions

### Error Display
- Toast notifications for user feedback
- Graceful fallback to original message
- Console logging for debugging

## Performance Considerations

### Streaming Optimization
- Throttled UI updates (50ms intervals)
- Efficient buffer management
- Memory cleanup on completion

### State Management
- Immutable state updates
- Efficient re-rendering
- Minimal Redux state changes

## Accessibility

### ARIA Support
- Proper button labels
- Tooltip accessibility
- Keyboard navigation support
- Screen reader compatibility

### Visual Accessibility
- High contrast support
- Focus indicators
- Disabled state styling
- Color-blind friendly design

## Testing Considerations

### Unit Tests
- Hook functionality
- Component rendering
- State management
- Error handling

### Integration Tests
- API communication
- Streaming behavior
- Version navigation
- User interactions

## Future Enhancements

### Potential Improvements
1. **Model Selection**: Allow users to choose different AI models for regeneration
2. **Batch Regeneration**: Regenerate multiple messages at once
3. **Version Comparison**: Side-by-side version comparison view
4. **Export Versions**: Export specific message versions
5. **Version History**: Detailed history of all regenerations

### Performance Optimizations
1. **Lazy Loading**: Load message versions on demand
2. **Caching**: Cache regenerated content
3. **Compression**: Compress version data
4. **Cleanup**: Automatic cleanup of old versions

## Dependencies

### New Dependencies
- No new external dependencies required
- Uses existing Redux, React, and TypeScript infrastructure

### Updated Dependencies
- All existing dependencies remain unchanged
- Backward compatible with current codebase

## Configuration

### Environment Variables
- No new environment variables required
- Uses existing API configuration

### Feature Flags
- Can be disabled via configuration if needed
- Graceful degradation when disabled

## Security Considerations

### Authentication
- Uses existing token-based authentication
- Respects user permissions
- Secure API communication

### Data Privacy
- Message versions stored locally in Redux
- No additional data persistence
- Respects existing privacy policies

## Deployment Notes

### Build Process
- No changes to build configuration
- TypeScript compilation includes new types
- No additional bundle size impact

### Backward Compatibility
- Fully backward compatible
- Existing conversations work unchanged
- Graceful handling of missing version data

## Troubleshooting

### Common Issues
1. **Regenerate Button Not Appearing**: Check if message is last AI message
2. **Version Navigation Not Working**: Verify message has multiple versions
3. **Streaming Issues**: Check network connectivity and API status
4. **Tooltip Not Showing**: Verify tooltip component is properly imported

### Debug Information
- Console logging for regeneration events
- Redux DevTools support
- Network request monitoring
- Error boundary integration

## Conclusion

The regenerate message functionality provides a seamless user experience for regenerating AI responses with full versioning support. The implementation follows established patterns in the codebase and maintains high standards for performance, accessibility, and user experience.
