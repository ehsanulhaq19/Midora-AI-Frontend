# Error Handling Implementation

This document describes the comprehensive error handling system implemented in the Midora AI frontend application.

## Overview

The error handling system provides:
- Centralized error processing for all API responses
- User-friendly error messages based on backend error types
- Internationalization support for error messages
- Automatic error categorization and handling
- Consistent error display across the application

## Architecture

### 1. Error Message Definitions (`src/i18n/languages/en/errors.ts`)

Contains user-friendly error messages for all possible backend error types:

```typescript
export const errors = {
  // Authentication errors
  UNAUTHENTICATED: 'Please sign in to continue',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Your session has expired. Please sign in again',
  
  // Validation errors
  INVALID_EMAIL_FORMAT: 'Please enter a valid email address',
  PASSWORD_TOO_WEAK: 'Password is too weak. Please use a stronger password',
  
  // Business logic errors
  PLAN_LIMIT_EXCEEDED: 'You have exceeded your plan limits',
  DAILY_QUOTA_EXCEEDED: 'Daily usage limit exceeded. Please try again tomorrow',
  
  // AI service errors
  AI_SERVICE_UNAVAILABLE: 'AI service is temporarily unavailable',
  AI_RATE_LIMIT_EXCEEDED: 'AI service rate limit exceeded. Please try again later',
  
  // System errors
  INTERNAL_SERVER_ERROR: 'An internal server error occurred. Please try again later',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable',
  
  // Generic fallback errors
  NETWORK_ERROR: 'Network error. Please check your connection',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again',
}
```

### 2. Error Handler Service (`src/lib/error-handler.ts`)

The core error processing service that:

#### Processes Backend Error Responses
```typescript
const backendError = {
  success: false,
  error_type: 'INVALID_CREDENTIALS',
  error_message: 'Invalid email or password provided'
}

const processedError = processBackendError(backendError, 401)
// Result: { message: 'Invalid email or password', type: 'INVALID_CREDENTIALS', ... }
```

#### Processes Generic Errors
```typescript
const networkError = new Error('Failed to fetch')
const processedError = processGenericError(networkError)
// Result: { message: 'Network error. Please check your connection', type: 'NETWORK_ERROR', ... }
```

#### Provides Error Utilities
- `shouldRetryError()` - Determines if an error should trigger automatic retry
- `requiresAuthentication()` - Checks if error requires user re-authentication
- `isValidationError()` - Identifies validation errors

### 3. Enhanced API Client (`src/api/base.ts`)

The base API client now includes comprehensive error handling:

```typescript
// Before: Generic error handling
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`)
}

// After: Processed error handling
if (!response.ok) {
  let errorData: any = null
  try {
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      errorData = await response.json()
    }
  } catch (parseError) {
    console.warn('Failed to parse error response:', parseError)
  }

  const processedError = errorHandler.handleResponseError(response, errorData)
  return { 
    error: processedError.message, 
    status: response.status,
    processedError
  }
}
```

### 4. Updated Auth Context (`src/contexts/AuthContext.tsx`)

The authentication context now uses processed error messages:

```typescript
const response = await authApi.login(credentials)

if (response.error) {
  // Use the processed error message if available, otherwise use the raw error
  const errorMessage = response.processedError?.message || response.error
  throw new Error(errorMessage)
}
```

## Error Categories

The system categorizes errors into the following types:

- **AUTHENTICATION** - Login, token, permission errors
- **VALIDATION** - Input validation, format errors
- **BUSINESS_LOGIC** - Plan limits, quotas, content policy
- **AI_SERVICES** - AI provider, model, rate limit errors
- **INFRASTRUCTURE** - Database, Redis, file system errors
- **SYSTEM** - Server, timeout, maintenance errors
- **SUBSCRIPTION** - Billing, plan, payment errors
- **PERMISSIONS** - Access control, role errors
- **API** - Rate limiting, version, integration errors
- **NETWORK** - Connection, timeout errors

## Usage Examples

### 1. In API Calls

```typescript
try {
  const response = await authApi.login(credentials)
  if (response.error) {
    // Error is already processed and user-friendly
    setError(response.error)
  }
} catch (error) {
  // Network or other errors are also processed
  setError(error.message)
}
```

### 2. In Components

```typescript
const { login, error } = useAuth()

const handleLogin = async (credentials) => {
  try {
    await login(credentials)
    // Success handling
  } catch (error) {
    // Error is already user-friendly and localized
    console.log('Login failed:', error.message)
  }
}

// Display error in UI
{error && (
  <div className="error-message">
    {error} {/* Already user-friendly and localized */}
  </div>
)}
```

### 3. Error Processing in Custom Hooks

```typescript
const useApiCall = () => {
  const [error, setError] = useState<string | null>(null)
  
  const makeApiCall = async () => {
    try {
      const response = await apiClient.get('/endpoint')
      if (response.error) {
        setError(response.error) // Already processed
      }
    } catch (error) {
      setError(error.message) // Already processed
    }
  }
  
  return { makeApiCall, error }
}
```

## Backend Error Response Format

The system expects backend errors in this format:

```json
{
  "success": false,
  "error_type": "INVALID_CREDENTIALS",
  "error_message": "Invalid email or password provided",
  "details": {
    "field": "email",
    "code": "AUTH_001"
  }
}
```

## Error Message Mapping

The system maps backend error types to user-friendly messages:

| Backend Error Type | User Message |
|-------------------|--------------|
| `INVALID_CREDENTIALS` | "Invalid email or password" |
| `EMAIL_ALREADY_REGISTERED` | "An account with this email already exists" |
| `TOKEN_EXPIRED` | "Your session has expired. Please sign in again" |
| `PLAN_LIMIT_EXCEEDED` | "You have exceeded your plan limits" |
| `AI_SERVICE_UNAVAILABLE` | "AI service is temporarily unavailable" |
| `NETWORK_ERROR` | "Network error. Please check your connection" |

## Benefits

1. **Consistent User Experience** - All errors are displayed in a user-friendly format
2. **Internationalization Ready** - Error messages are defined in i18n structure
3. **Centralized Management** - All error handling logic is in one place
4. **Type Safety** - Full TypeScript support with proper error types
5. **Automatic Processing** - No need to manually handle errors in components
6. **Extensible** - Easy to add new error types and messages
7. **Debugging Friendly** - Original error details are preserved for debugging

## Testing

The error handling system includes comprehensive tests in `src/lib/error-handler.test.ts` that demonstrate:

- Backend error processing
- Generic error handling
- Network error detection
- Error categorization
- Utility function behavior

## Future Enhancements

1. **Error Analytics** - Track error frequency and types
2. **Retry Logic** - Automatic retry for retryable errors
3. **Error Boundaries** - React error boundaries for component errors
4. **Toast Notifications** - Automatic error notifications
5. **Error Recovery** - Suggested actions for common errors

## Migration Guide

### Before (Old Error Handling)
```typescript
// Generic error messages
if (response.error) {
  setError('Login failed') // Generic message
}

// Manual error processing
catch (error) {
  if (error.message.includes('401')) {
    setError('Please sign in again')
  } else {
    setError('Something went wrong')
  }
}
```

### After (New Error Handling)
```typescript
// User-friendly, localized error messages
if (response.error) {
  setError(response.error) // Already processed and user-friendly
}

// Automatic error processing
catch (error) {
  setError(error.message) // Already processed and user-friendly
}
```

The new system automatically handles all error processing, providing consistent, user-friendly error messages throughout the application.
