# New Message Structure Implementation

## Overview

This document describes the implementation of the new message response structure from the backend API. The new structure supports both single messages and multi-message groups (for regenerated messages with multiple versions).

## New Response Structure

The backend now returns messages in the following format:

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "type": "multi_message",
        "messages": [
          {
            "content": "1 + 1 = 2",
            "uuid": "824dccbe-73ef-4545-b430-0836d8f337a1",
            "sender": {
              "email": "bot@midora.ai",
              "first_name": "Midora",
              "last_name": "Bot",
              "uuid": "af45679d-c913-ca64-f6d9-e8ed12bb7ec7",
              "username": "midora_bot",
              "is_active": true,
              "is_verified": true,
              "is_onboarded": false,
              "meta_data": null
            },
            "model_name": "DeepSeek-Chat (V3)",
            "created_at": "2025-10-17T10:04:31.154052Z",
            "updated_at": null
          }
        ],
        "parent_message_uuid": "b3c3e9c0-1b54-7764-e04a-eeb200fef498"
      },
      {
        "type": "single_message",
        "messages": [
          {
            "content": "What is 1+1",
            "uuid": "0c9e3c3b-45b1-4677-a40e-894fef002bee",
            "sender": {
              "email": "ehsanulhaq042@gmail.com",
              "first_name": "ehsan",
              "last_name": "ul haq",
              "uuid": "fb00ce6f-4ba5-5e64-dce9-4faf7e514515",
              "username": "ehsanulhaq539",
              "is_active": true,
              "is_verified": true,
              "is_onboarded": true,
              "meta_data": {
                "sso_created": true,
                "created_via": "sso"
              }
            },
            "model_name": null,
            "created_at": "2025-10-17T10:04:30.955213Z",
            "updated_at": null
          }
        ],
        "parent_message_uuid": null
      }
    ],
    "total": 4,
    "page": 1,
    "per_page": 50,
    "total_pages": 1
  }
}
```

## Key Changes

### 1. Message Types

- **Single Message**: Regular messages with `type: "single_message"`
- **Multi Message**: Messages with multiple versions (regenerated messages) with `type: "multi_message"`

### 2. Sender Structure

The sender object now includes additional fields:
- `username`: User's username
- `is_active`: Whether the user account is active
- `is_verified`: Whether the user account is verified
- `is_onboarded`: Whether the user has completed onboarding
- `meta_data`: Additional metadata including SSO information

### 3. Message Structure

Messages now have:
- `model_name`: Can be `null` for user messages or contain the AI model name
- `updated_at`: Can be `null` for new messages

## Implementation Details

### 1. Type Definitions (`src/api/conversation/types.ts`)

```typescript
// Sender types
export interface Sender {
  email: string
  first_name: string
  last_name: string
  uuid: string
  username: string
  is_active: boolean
  is_verified: boolean
  is_onboarded: boolean
  meta_data: {
    sso_created?: boolean
    created_via?: string
  } | null
}

// Message types
export interface Message {
  content: string
  uuid: string
  sender: Sender
  model_name: string | null
  created_at: string
  updated_at: string | null
  // Versioning support for regeneration
  versions?: Message[]
  currentVersionIndex?: number
}

// Message group types for new response structure
export interface MessageGroup {
  type: 'single_message' | 'multi_message'
  messages: Message[]
  parent_message_uuid: string | null
}
```

### 2. API Transformation (`src/api/conversation/api.ts`)

The `transformMessageGroups` method converts the new response structure into individual messages with versioning support:

- **Single messages**: Added directly to the messages array
- **Multi messages**: Grouped by `parent_message_uuid` and set up with version arrays
- **Versioning**: Messages with multiple versions are handled with `versions` array and `currentVersionIndex`

### 3. Redux Store Updates (`src/store/slices/conversationSlice.ts`)

New action added:
- `addMessageVersions`: Handles adding multiple message versions for the new response structure

### 4. UI Components

The conversation container and message components now properly handle:
- New sender structure for user identification
- Model name display for AI messages
- Version navigation for multi-message groups

### 5. Regenerate Functionality

The regenerate functionality has been updated to:
- Follow the new message structure pattern
- Properly handle version creation and navigation
- Maintain compatibility with the existing UI components

## Usage

### Loading Messages

```typescript
const response = await conversationApi.getMessages(conversationUuid)
// Messages are automatically transformed and ready for display
```

### Handling Multi-Message Groups

Multi-message groups are automatically converted to individual messages with version arrays:

```typescript
// A multi-message group becomes:
{
  uuid: "parent-message-uuid",
  content: "Latest version content",
  versions: [
    { uuid: "version-1", content: "First version" },
    { uuid: "version-2", content: "Second version" }
  ],
  currentVersionIndex: 1
}
```

### Version Navigation

Users can navigate between message versions using the version navigation component:

```typescript
// Switch to a specific version
dispatch(setCurrentMessageVersion({
  conversationUuid,
  messageUuid,
  versionIndex: 0
}))
```

## Benefits

1. **Backward Compatibility**: Existing functionality continues to work
2. **Version Support**: Proper handling of regenerated messages with multiple versions
3. **Enhanced User Info**: More detailed sender information
4. **Flexible Structure**: Support for both single and multi-message responses
5. **Type Safety**: Full TypeScript support with proper type definitions

## Testing

The implementation has been tested to ensure:
- Proper message transformation from API response
- Correct version handling for regenerated messages
- UI components display messages correctly
- User identification works with new sender structure
- Model names are displayed appropriately

## Migration Notes

- No breaking changes to existing components
- All existing functionality preserved
- New features are additive and optional
- Backward compatibility maintained for single messages
