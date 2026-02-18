# Conversation Pagination Implementation

## Overview

This document describes the implementation of conversation pagination in the recent section of the navigation sidebar. Users can now scroll to the bottom of the conversations list to automatically fetch more conversations from the backend until all conversations are loaded.

## Features Implemented

### 1. **Automatic Pagination Loading**
- Scroll-to-bottom detection in the conversations list
- Automatic loading of next page when user reaches the bottom
- Loading indicator while fetching more conversations
- Prevents duplicate requests during loading

### 2. **State Management**
- Added conversation pagination state to Redux store
- Separate loading states for initial load and pagination load
- Maintains pagination metadata (current page, total pages, etc.)

### 3. **API Integration**
- Updated conversation API to return pagination information
- Supports configurable page size and ordering
- Handles pagination parameters correctly

## Implementation Details

### 1. Type Definitions Updates

**File**: `src/types/conversation.ts`

Added new state properties:
```typescript
export interface ConversationState {
  // ... existing properties
  conversationPagination: { page: number, per_page: number, total: number, total_pages: number } | null
  isLoadingMoreConversations: boolean
}
```

### 2. Redux Slice Updates

**File**: `src/store/slices/conversationSlice.ts`

#### New Actions Added:
- `setLoadingMoreConversations`: Controls loading state for pagination
- `appendConversations`: Adds new conversations to existing ones
- Updated `setConversations`: Now handles pagination metadata
- Updated `clearConversations`: Clears pagination state

#### State Structure:
```typescript
const initialState: ConversationState = {
  // ... existing state
  conversationPagination: null,
  isLoadingMoreConversations: false,
}
```

### 3. API Layer Updates

**File**: `src/api/conversation/api.ts`

#### Updated getConversations Method:
```typescript
async getConversations(page: number = 1, perPage: number = 20, orderBy: string = "-created_at"): 
  Promise<ApiResponse<{ conversations: Conversation[], pagination: PaginationInfo }>>
```

Returns both conversations and pagination metadata in a structured format.

### 4. Hook Implementation

**File**: `src/hooks/useConversation.ts`

#### New Functions:
- `loadMoreConversations()`: Fetches next page of conversations
- Updated `loadConversations()`: Handles new API response format

#### Return Values:
```typescript
return {
  // ... existing values
  conversationPagination,
  isLoadingMoreConversations,
  loadMoreConversations,
}
```

### 5. UI Component Updates

**File**: `src/components/chat/sections/navigation-sidebar.tsx`

#### Scroll Detection:
```typescript
const handleConversationsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
  const container = e.currentTarget
  const scrollTop = container.scrollTop
  const scrollHeight = container.scrollHeight
  const clientHeight = container.clientHeight
  
  const threshold = 10
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold
  
  if (isNearBottom && 
      !isLoadingMoreConversations && 
      conversationPagination && 
      conversationPagination.page < conversationPagination.total_pages) {
    loadMoreConversations()
  }
}, [isLoadingMoreConversations, conversationPagination, loadMoreConversations])
```

#### Loading Indicator:
```typescript
{isLoadingMoreConversations && (
  <div className="w-full p-3 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
    <div className="flex items-center justify-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--tokens-color-text-text-inactive-2)]"></div>
      <span className="text-sm">{t('chat.loadingMoreConversations')}</span>
    </div>
  </div>
)}
```

### 6. Internationalization

**File**: `src/i18n/languages/en/chat.ts`

Added new translation key:
```typescript
loadingMoreConversations: 'Loading more conversations...',
```

## Usage Flow

### 1. **Initial Load**
1. User opens the chat interface
2. `loadConversations()` is called with page 1
3. First 20 conversations are loaded and displayed
4. Pagination metadata is stored in state

### 2. **Pagination Loading**
1. User scrolls to the bottom of conversations list
2. `handleConversationsScroll` detects bottom scroll
3. Checks if more pages are available and not currently loading
4. Calls `loadMoreConversations()` to fetch next page
5. New conversations are appended to existing list
6. Loading indicator is shown during fetch
7. Process repeats until all conversations are loaded

### 3. **Error Handling**
- Network errors are caught and displayed
- Loading states are properly reset on error
- User can retry by scrolling again

## Configuration

### Pagination Parameters
- **Default Page Size**: 20 conversations per page
- **Scroll Threshold**: 10 pixels from bottom triggers load
- **Ordering**: Conversations ordered by `-created_at` (newest first)

### Customization Options
```typescript
// In conversationApi.getConversations()
page: number = 1           // Page number to fetch
perPage: number = 20       // Items per page
orderBy: string = "-created_at"  // Sort order
```

## Performance Considerations

### 1. **Efficient State Updates**
- Uses object-based conversation storage for O(1) lookups
- Appends new conversations without replacing existing ones
- Maintains conversation order for consistent display

### 2. **Scroll Optimization**
- Uses `useCallback` to prevent unnecessary re-renders
- Debounced scroll detection prevents excessive API calls
- Loading state prevents duplicate requests

### 3. **Memory Management**
- Conversations are stored in Redux state (persistent)
- No memory leaks from event listeners
- Proper cleanup on component unmount

## Testing Scenarios

### 1. **Basic Pagination**
- Load initial conversations
- Scroll to bottom
- Verify more conversations load
- Check loading indicator appears

### 2. **Edge Cases**
- No more conversations to load
- Network errors during pagination
- Rapid scrolling (should not trigger multiple requests)
- Empty conversation list

### 3. **State Management**
- Verify pagination state is maintained
- Check loading states are properly managed
- Ensure conversations are appended correctly

## Future Enhancements

### 1. **Advanced Features**
- Search within conversations
- Filter conversations by date/type
- Virtual scrolling for large conversation lists
- Conversation caching strategies

### 2. **Performance Improvements**
- Implement conversation virtualization
- Add conversation preloading
- Optimize scroll detection with Intersection Observer
- Add conversation indexing for faster searches

### 3. **User Experience**
- Add pull-to-refresh functionality
- Implement conversation sorting options
- Add conversation grouping/folders
- Show conversation previews

## Related Files

- `src/types/conversation.ts` - Type definitions
- `src/store/slices/conversationSlice.ts` - Redux state management
- `src/api/conversation/api.ts` - API layer
- `src/hooks/useConversation.ts` - Business logic hook
- `src/components/chat/sections/navigation-sidebar.tsx` - UI component
- `src/i18n/languages/en/chat.ts` - Translations

## Conclusion

The conversation pagination implementation provides a smooth, efficient way for users to browse through their conversation history. The implementation follows React and Redux best practices, includes proper error handling, and provides a good foundation for future enhancements.
