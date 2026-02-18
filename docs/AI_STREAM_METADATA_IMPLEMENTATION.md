# AI Stream Metadata Implementation

## Overview
This document describes the implementation of AI stream metadata handling in the chat interface. The feature displays real-time status messages during AI response generation and provides visual feedback to users about what the AI is currently processing.

## Features Implemented

### 1. AI Status Messages (i18n)
Added comprehensive AI status messages in English translations (`src/i18n/languages/en/chat.ts`):

```typescript
aiStatus: {
  analyzing_query: 'Analyzing your query...',
  understanding_request: 'Understanding your request...',
  processing_input: 'Processing input...',
  // ... 50+ status messages for different AI processing stages
}
```

These messages cover different phases of AI processing:
- **Query Analysis**: analyzing_query, understanding_request, processing_input, etc.
- **Categorization**: categorizing_query, finding_topic, identifying_intent, etc.
- **Model Selection**: picking_best_model, selecting_suitable_ai, routing_to_model, etc.
- **Response Generation**: generating_reply, crafting_answer, building_response, etc.
- **Progress Indicators**: working_on_it, almost_done, please_wait, etc.

### 2. Streaming Metadata State Management

#### Type Definitions
Added `streamingMetadata` to the conversation state (`src/types/conversation.ts`):

```typescript
export interface ConversationState {
  // ... existing fields
  streamingMetadata: { message_type?: string } | null
}
```

#### Redux Store Updates
Updated `conversationSlice` (`src/store/slices/conversationSlice.ts`):

- Added `streamingMetadata: null` to initial state
- Created `setStreamingMetadata` action to update metadata state
- Reset metadata in `startStreaming`, `stopStreaming`, `completeStreaming`, and `clearConversations` actions
- Exported `setStreamingMetadata` action

### 3. API Stream Response Handling

#### Stream Response Types
The API now handles `metadata` type stream responses (`src/api/ai/api.ts`):

```typescript
case 'metadata':
  // Handle metadata stream responses (don't add to content)
  onChunk('', 'metadata', eventData)
  break
```

Key behaviors:
- Metadata responses don't add to content stream
- Pass empty string for chunk with type 'metadata'
- Include full eventData for metadata extraction

### 4. Hook Integration

#### useConversation Hook
Updated `useConversation` hook (`src/hooks/useConversation.ts`):

```typescript
(chunk: string, type: string, metadata?: any) => {
  if (type === 'metadata') {
    // Handle metadata stream responses - update metadata state only
    if (metadata?.message_type) {
      dispatch(setStreamingMetadata({ message_type: metadata.message_type }))
    }
  } else {
    // Handle regular content chunks
    accumulatedContent += chunk
    streamingBuffer += chunk
    // ... throttled UI updates
  }
}
```

- Added `streamingMetadata` to hook return value
- Separated metadata handling from content streaming
- Metadata updates don't affect content accumulation

### 5. UI Components

#### StreamingMessage Component
Enhanced streaming message display (`src/components/chat/sections/conversation-container.tsx`):

**Before Content Arrives:**
- Shows animated LogoOnly icon with circular rotation
- Displays status message from metadata

**After Content Starts:**
- Shows markdown-rendered content
- Displays blinking cursor at end of content
- Updates status message based on metadata

```typescript
const StreamingMessage: React.FC<{ content: string; messageType?: string }> = ({ 
  content, 
  messageType 
}) => {
  const hasContent = content.length > 0
  
  return (
    <div>
      {!hasContent ? (
        <div className="animate-spin">
          <LogoOnly className="w-6 h-6" />
        </div>
      ) : (
        <>
          <MarkdownRenderer content={content} />
          <StreamingCursor />
        </>
      )}
      <div>
        <AnimatedDot />
        <StatusMessage messageType={messageType} />
      </div>
    </div>
  )
}
```

#### ConversationContainer Component
Updated to pass metadata to StreamingMessage:

```typescript
{isStreaming && (
  <StreamingMessage 
    content={streamingContent} 
    messageType={streamingMetadata?.message_type} 
  />
)}
```

## Data Flow

### 1. Stream Response Reception
```
Backend → API Client → generateContentStream
```

### 2. Metadata Processing
```
API parses 'metadata' type → onChunk callback with type='metadata' 
→ useConversation detects metadata type → dispatch(setStreamingMetadata)
→ Redux store updated
```

### 3. Content Processing
```
API parses 'content' type → onChunk callback with type='content'
→ useConversation accumulates content → dispatch(setStreamingContent)
→ Redux store updated
```

### 4. UI Update
```
Redux store update → useConversation selector → ConversationContainer
→ StreamingMessage component → UI renders with:
  - LogoOnly animation (before content)
  - Content + Cursor (after content)
  - Status message from i18n
```

## Backend Integration

### Expected Metadata Response Format
```json
{
  "type": "meta_data",
  "message_type": "analyzing_query",
  "conversation_uuid": "bc7dfb9e-abf8-f984-b01b-86773801a49d"
}
```

**Note**: The backend sends `type: "meta_data"` (with underscore). The frontend handles both `metadata` and `meta_data` for compatibility.

The `message_type` should match one of the keys defined in `chat.aiStatus` i18n translations.

### Null Message Handling
The system gracefully handles cases where `message: null` is received in stream responses:

**Initial Metadata Response:**
```json
{
  "type": "initial_metadata",
  "message": null
}
```

**Completion Response:**
```json
{
  "type": "completion",
  "message": null
}
```

When `message` is `null`, the system:
- Does not add the message to Redux store
- Does not cause errors in message rendering
- Filters out null messages during display sorting

### Type Name Compatibility
The API handler supports both naming conventions:
- Backend sends: `meta_data` (with underscore)
- Frontend also handles: `metadata` (without underscore)

Both are mapped to the same internal handler for backward compatibility.

### Stream Response Types
1. **initial_metadata**: Initial message creation
2. **meta_data** (or **metadata**): Status updates (doesn't affect content)
3. **model_selection**: AI model selection information (see [Model Selection Display](./MODEL_SELECTION_DISPLAY_IMPLEMENTATION.md))
4. **content**: Actual AI response chunks
5. **completion**: Stream completion
6. **error**: Error occurred
7. **unethical**: Content flagged

**Note**: Both `meta_data` and `metadata` are supported for backward compatibility.

## Visual Behavior

### Loading State (No Content)
- Rotating LogoOnly icon
- Status message: e.g., "Analyzing your query..."
- Pulsing dot indicator

### Streaming State (With Content)
- Markdown-rendered content
- Blinking cursor at end
- Status message: e.g., "Generating reply..."
- Pulsing dot indicator

### Completion State
- Full content displayed
- No cursor
- No status message

## File Changes Summary

### Modified Files
1. `src/i18n/languages/en/chat.ts` - Added AI status messages
2. `src/types/conversation.ts` - Added streamingMetadata type
3. `src/store/slices/conversationSlice.ts` - Added metadata state and actions, null message checks
4. `src/api/ai/api.ts` - Added metadata stream handling
5. `src/hooks/useConversation.ts` - Added metadata processing logic, null message checks
6. `src/components/chat/sections/conversation-container.tsx` - Updated UI components, null message filtering

### No New Files Created
All changes were modifications to existing files.

## Testing Considerations

### Unit Tests
- Test metadata state updates in conversationSlice
- Test metadata handling in useConversation hook
- Test StreamingMessage rendering with/without content

### Integration Tests
- Test complete streaming flow with metadata
- Verify i18n message lookup
- Test UI transitions (loading → streaming → complete)

### Manual Testing
1. Start a new chat conversation
2. Send a message
3. Observe:
   - LogoOnly animation before content
   - Status messages updating during stream
   - Content appearing with cursor
   - Final state after completion

## Future Enhancements

1. **Animation Improvements**
   - Smooth transitions between states
   - Custom animation for LogoOnly icon

2. **Additional Metadata Types**
   - Progress percentage
   - Estimated time remaining
   - Model confidence scores

3. **Error Handling**
   - Graceful degradation if message_type not found
   - Fallback messages for unknown states

4. **Performance Optimizations**
   - Debounce metadata updates
   - Reduce re-renders during rapid updates

## Notes

- Metadata responses are not saved to the Redux store as messages
- Metadata only updates the transient UI state during streaming
- Status messages automatically fall back to "AI is typing..." if message_type is not recognized
- The implementation uses Tailwind's `animate-spin` utility for the LogoOnly rotation
- **Null Message Handling**: The system safely handles `message: null` responses by:
  - Checking message existence before adding to Redux store in `addMessage` reducer
  - Checking message existence before adding in `initial_metadata` completion callback
  - Checking message existence before adding in `completeStreaming` reducer
  - Filtering out null messages in the UI `sortedMessages` computation

