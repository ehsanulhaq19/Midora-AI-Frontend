# Error Handling Implementation

## Overview

This document describes the implementation of structured error handling across all API calls in the frontend application. The system ensures that all errors are returned as structured objects containing system-defined error types and backend error responses.

## Error Object Structure

All errors are now returned as structured objects with the following format:

```typescript
interface ErrorObject {
  error_type: string        // System-defined error type
  error_message: string     // Backend error response
  error_id?: string        // Backend error ID for tracking
  status?: number          // HTTP status code
}
```

## Implementation Details

### 1. Base API Client Updates

The base API client (`src/api/base.ts`) has been updated to:

- Include `processedError` field in `ApiResponse` interface
- Process backend error responses and create structured error objects
- Handle different error scenarios (network errors, timeouts, etc.)

### 2. API Type Definitions

Each API module now includes error object types:

- `src/api/auth/types.ts` - `AuthErrorObject`
- `src/api/ai/types.ts` - `AIErrorObject` 
- `src/api/conversation/types.ts` - `ConversationErrorObject`

### 3. Hook Updates

All hooks have been updated to throw structured error objects:

#### useAuth Hook (`src/hooks/use-auth.ts`)
- All API calls now throw structured error objects
- Error types include: `LOGIN_FAILED`, `USER_DATA_FETCH_FAILED`, `SSO_AUTH_URL_FAILED`, etc.

#### useConversation Hook (`src/hooks/useConversation.ts`)
- Error handling for conversation and AI operations
- Error types include: `CONVERSATIONS_LOAD_FAILED`, `CONVERSATION_CREATION_FAILED`, `AI_MODELS_LOAD_FAILED`, etc.

### 4. Error Handler Updates

The error handler (`src/lib/error-handler.ts`) has been enhanced to:

- Parse JSON stringified error objects from Error instances
- Map backend error types to user-friendly messages using i18n
- Provide fallback handling for unknown error types

### 5. Component Updates

Components have been updated to use structured error handling:

- `src/components/auth/signup-steps/multi-step-container.tsx`
- `src/components/auth/signup-form-section.tsx`
- `src/components/auth/signup-steps/success-step.tsx`

### 6. Internationalization

New error messages have been added to `src/i18n/languages/en/errors.ts`:

```typescript
// New error types for structured error handling
TOKEN_REFRESH_FAILED: 'Session refresh failed. Please sign in again',
USER_DATA_FETCH_FAILED: 'Failed to load user information. Please try again',
SSO_AUTH_URL_FAILED: 'Failed to get authorization URL. Please try again',
// ... and many more
```

## Error Flow

1. **API Call**: Backend returns error response
2. **Base Client**: Processes error and creates structured error object
3. **Hook**: Throws Error with JSON stringified error object
4. **Error Handler**: Parses error object and maps to user-friendly message
5. **Component**: Displays localized error message to user

## Error Types

### Authentication Errors
- `UNAUTHENTICATED` - User not signed in
- `UNAUTHORIZED` - Insufficient permissions
- `INVALID_TOKEN` - Token expired or invalid
- `LOGIN_FAILED` - Login attempt failed
- `USER_DATA_FETCH_FAILED` - Failed to load user information

### SSO Errors
- `SSO_AUTH_URL_FAILED` - Failed to get authorization URL
- `INVALID_STATE_PARAMETER` - Invalid CSRF state parameter
- `UNSUPPORTED_SSO_PROVIDER` - Provider not supported
- `INVALID_SSO_RESPONSE` - Invalid response from provider

### Conversation Errors
- `CONVERSATIONS_LOAD_FAILED` - Failed to load conversations
- `CONVERSATION_CREATION_FAILED` - Failed to create conversation
- `MESSAGES_LOAD_FAILED` - Failed to load messages

### AI Service Errors
- `AI_MODELS_LOAD_FAILED` - Failed to load AI models
- `AI_SERVICE_UNAVAILABLE` - AI service temporarily unavailable
- `AI_PROVIDER_ERROR` - AI provider error occurred

### Validation Errors
- `INVALID_INPUT` - Invalid input provided
- `MISSING_REQUIRED_FIELD` - Required field missing
- `INVALID_EMAIL_FORMAT` - Invalid email format
- `PASSWORD_TOO_WEAK` - Password doesn't meet requirements

## Usage Examples

### In Hooks

```typescript
// Before
if (response.error) {
  throw new Error(response.error)
}

// After
if (response.error) {
  const errorObject = response.processedError || {
    error_type: 'OPERATION_FAILED',
    error_message: response.error,
    status: response.status
  }
  throw new Error(JSON.stringify(errorObject))
}
```

### In Components

```typescript
try {
  await someApiCall()
} catch (error) {
  // handleApiError automatically parses structured error objects
  const userMessage = handleApiError(error)
  showErrorToast('Operation Failed', userMessage)
}
```

## Benefits

1. **Consistency**: All errors follow the same structure
2. **Localization**: Error messages are properly internationalized
3. **Debugging**: Structured error types make debugging easier
4. **User Experience**: Users see consistent, helpful error messages
5. **Maintainability**: Centralized error handling logic

## Backend Integration

The frontend expects backend error responses in this format:

```json
{
  "success": false,
  "error_type": "NOT_VERIFIED_USER",
  "error_message": "Please verify your email before accessing this feature.",
  "error_id": "LOGIN_003"
}
```

The `error_type` should match the constants defined in `midora.ai-backend/app/constants/error_types.py`.

## Migration Notes

- All existing error handling continues to work
- New structured errors are backward compatible
- Error messages are automatically localized
- No breaking changes to component APIs

## Future Enhancements

1. Add error tracking and analytics
2. Implement retry mechanisms for specific error types
3. Add error recovery suggestions
4. Enhance error logging for debugging