# Model Selection Display Implementation

## Overview
This document describes the implementation of displaying AI model names in chat messages. When the backend sends a `model_selection` stream response, the selected model name is captured and displayed under AI messages with a copy button.

## Features Implemented

### 1. Model Selection Stream Response Handling

#### Stream Response Format
The backend sends model selection information during streaming:

```json
{
  "type": "model_selection",
  "selected_model": "DeepSeek-Chat (V3)",
  "selected_provider": "DeepSeek",
  "query_category": "general",
  "rank": 0
}
```

### 2. Data Structure Updates

#### Message Interface
Added `model_name` field to Message interface (`src/api/conversation/types.ts`):

```typescript
export interface Message {
  uuid: string
  content: string
  sender_id: number
  conversation_uuid: string
  created_at: string
  updated_at: string
  model_name?: string  // New field
  sender?: {
    uuid: string
    email: string
    first_name: string
    last_name: string
  }
}
```

#### Streaming Metadata State
Extended streaming metadata to include model selection data (`src/types/conversation.ts`):

```typescript
streamingMetadata: { 
  message_type?: string
  selected_model?: string
  selected_provider?: string
  query_category?: string
  rank?: number
} | null
```

### 3. Stream Response Processing

#### API Handler
Added `model_selection` case in stream handler (`src/api/ai/api.ts`):

```typescript
case 'model_selection':
  // Handle model selection stream responses
  onChunk('', 'model_selection', eventData)
  break
```

#### Hook Processing
Updated `useConversation` hook to handle model selection (`src/hooks/useConversation.ts`):

```typescript
else if (type === 'model_selection') {
  // Handle model selection stream responses
  dispatch(setStreamingMetadata({
    selected_model: metadata?.selected_model,
    selected_provider: metadata?.selected_provider,
    query_category: metadata?.query_category,
    rank: metadata?.rank
  }))
}
```

#### Redux Store Integration
Updated `completeStreaming` reducer to attach model name to message (`src/store/slices/conversationSlice.ts`):

```typescript
completeStreaming: (state, action) => {
  // ... other code
  
  if (metadata.message) {
    const aiMessage: Message = metadata.message
    
    // Add model_name from streamingMetadata if available
    if (state.streamingMetadata?.selected_model) {
      aiMessage.model_name = state.streamingMetadata.selected_model
    }
    
    // ... add message to store
  }
}
```

### 4. UI Display

#### MessageBubble Component
Enhanced to display model name with copy functionality (`src/components/chat/sections/conversation-container.tsx`):

```typescript
const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  // Copy handler for model name
  const handleCopyModelName = async () => {
    try {
      if (message.model_name) {
        await navigator.clipboard.writeText(message.model_name)
      }
    } catch (err) {
      console.error('Failed to copy model name: ', err)
    }
  }

  return (
    <div>
      {/* Message content */}
      
      <div className="flex items-center gap-2 mt-2">
        {/* Copy message button */}
        
        {/* Display AI model name with copy button for AI messages */}
        {!isUser && message.model_name && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs text-[color:var(--tokens-color-text-text-inactive-2)]">
              {message.model_name}
            </span>
            <IconButton
              variant="outline"
              size="sm"
              icon={<Copy />}
              onClick={handleCopyModelName}
              aria-label="Copy model name"
              className="h-6 w-6"
            />
          </div>
        )}
      </div>
    </div>
  )
}
```

## Data Flow

### 1. Model Selection Received
```
Backend → model_selection stream → API Client → onChunk callback
```

### 2. Metadata Processing
```
onChunk with type='model_selection' → useConversation detects type
→ dispatch(setStreamingMetadata) with model data → Redux store updated
```

### 3. Completion with Model Name
```
Stream completes → completeStreaming reducer → Check streamingMetadata
→ Attach selected_model to message.model_name → Store message
```

### 4. UI Display
```
Message with model_name → MessageBubble component → Render model name
→ Show on hover with copy button
```

## Visual Behavior

### AI Message Display
- **Message content**: Rendered as markdown
- **Model name**: Displayed below message in small gray text
- **Copy buttons**: 
  - Message copy button (existing)
  - Model name copy button (new)
- **Visibility**: Both buttons appear on message hover

### User Message Display
- No model name displayed (only for AI messages)
- Only message copy button shown

## Backend Integration

### Expected Stream Sequence
1. **initial_metadata**: Message creation
2. **model_selection**: Model information (this is captured)
3. **metadata**: Status updates (optional)
4. **content**: Response chunks
5. **completion**: Stream end

### Model Selection Response Schema
```json
{
  "type": "model_selection",
  "selected_model": "string",      // Required - Display this
  "selected_provider": "string",   // Optional
  "query_category": "string",      // Optional
  "rank": number                   // Optional
}
```

## File Changes Summary

### Modified Files
1. `src/api/conversation/types.ts` - Added model_name to Message interface
2. `src/types/conversation.ts` - Extended streamingMetadata type
3. `src/api/ai/api.ts` - Added model_selection stream handling
4. `src/hooks/useConversation.ts` - Added model_selection processing
5. `src/store/slices/conversationSlice.ts` - Updated metadata type and completion logic
6. `src/components/chat/sections/conversation-container.tsx` - Added model name display with copy

## Testing Considerations

### Unit Tests
- Test model_name field in Message type
- Test model selection metadata update in Redux
- Test MessageBubble with/without model_name

### Integration Tests
- Test complete flow from model_selection stream to UI display
- Test copy functionality for model name
- Test model name visibility on hover

### Manual Testing
1. Start a chat conversation
2. Send a message
3. Verify model_selection stream is received
4. Observe AI response completion
5. Hover over AI message
6. Verify model name displays with copy button
7. Click copy button and verify clipboard

## Edge Cases Handled

### 1. Missing Model Name
- If `selected_model` is not in stream response, model name won't display
- UI gracefully handles undefined `model_name`

### 2. User Messages
- Model name never displays for user messages
- Only AI messages show model information

### 3. Stream Order
- Model selection can arrive at any point during streaming
- Latest model selection overwrites previous (uses last received)

### 4. Null Message Handling
- Works with existing null message protection
- Model name only attached if message exists

## Future Enhancements

1. **Provider Display**
   - Show both model and provider: "DeepSeek-Chat (V3) by DeepSeek"
   - Add provider icon/logo

2. **Category Badge**
   - Display query category as a badge
   - Different colors for different categories

3. **Model Rank Display**
   - Show confidence/rank indicator
   - Visual representation of selection quality

4. **Click to View Details**
   - Modal with full model selection details
   - Query category, provider, rank, etc.

5. **Model History**
   - Track which models were used in conversation
   - Show model usage statistics

## Notes

- Model name displays only for AI messages
- Copy button appears on hover alongside message copy button
- Model selection data stored in streaming metadata during stream
- Model name attached to message on completion
- Existing messages without model_name display normally
- The implementation uses existing Copy icon and IconButton components

