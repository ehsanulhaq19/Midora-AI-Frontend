# 401 Error Handling with Reload Mechanism

## Overview

This document describes the implementation of automatic page reload on 401 Unauthorized errors with a retry limit mechanism to prevent infinite reload loops.

## Problem Statement

When a user's authentication token expires or becomes invalid, the backend API returns a 401 Unauthorized error. To handle this gracefully, the application should:

1. Automatically reload the page when a 401 error occurs
2. Limit the number of reload attempts to prevent infinite loops
3. Redirect to the login page if the maximum retry limit is reached

## Implementation

### 1. Reload Counter Utility (`src/lib/reload-counter.ts`)

The reload counter utility manages the number of reload attempts for 401 errors using localStorage.

#### Key Features:

- **Maximum Attempts**: Limited to 3 reload attempts
- **Counter Expiry**: Counter expires after 5 minutes
- **Automatic Reset**: Counter is reset on successful API requests
- **Graceful Degradation**: Redirects to login page after max attempts

#### Functions:

```typescript
getReloadCount(): number
```
- Returns the current reload attempt count
- Checks if counter has expired and resets if needed

```typescript
incrementReloadCount(): number
```
- Increments the reload counter
- Sets expiry time on first increment
- Returns the new count

```typescript
resetReloadCount(): void
```
- Resets the reload counter
- Removes expiry time
- Called on successful API requests

```typescript
canReload(): boolean
```
- Checks if reload is allowed based on current count
- Returns true if count < MAX_RELOAD_ATTEMPTS

```typescript
handle401WithReload(): boolean
```
- Main handler for 401 errors
- Checks if reload is allowed
- Initiates page reload or redirects to login
- Returns true if reload initiated, false if max attempts reached

#### Usage Example:

```typescript
import { handle401WithReload, resetReloadCount } from '@/lib/reload-counter'

// Handle 401 error
if (response.status === 401) {
  handle401WithReload()
}

// Reset counter on success
if (response.ok) {
  resetReloadCount()
}
```

### 2. API Interceptors (`src/api/interceptors.ts`)

The interceptors have been updated to handle 401 errors at the response level.

#### Enhanced Response Interceptor:

```typescript
export async function enhancedResponseInterceptor(response: Response): Promise<Response> {
  if (!response.ok) {
    // Handle 401 Unauthorized errors with reload logic
    if (response.status === 401) {
      console.error('401 Unauthorized error detected')
      handle401WithReload()
    }
  } else {
    // Reset reload counter on successful request
    if (response.status >= 200 && response.status < 300) {
      resetReloadCount()
    }
  }
  
  return response
}
```

### 3. Base API Client (`src/api/base.ts`)

All HTTP methods (GET, POST, PUT, DELETE) in the base API client have been updated to:

1. Check for 401 status codes
2. Trigger reload mechanism when 401 is detected
3. Reset reload counter on successful requests

#### Implementation Pattern:

```typescript
if (!response.ok) {
  // Handle 401 Unauthorized errors with reload logic
  if (response.status === 401) {
    console.error('401 Unauthorized error detected in [METHOD] request')
    handle401WithReload()
  }
  
  // ... error handling code
}

// Reset reload counter on successful request
resetReloadCount()
```

## Flow Diagram

```
API Request
    │
    ▼
Response Received
    │
    ├─── Success (2xx) ──────────► Reset Reload Counter
    │
    └─── 401 Unauthorized ──────► Check Reload Count
                                      │
                                      ├─── Count < 3 ──────► Increment Counter ──► Reload Page
                                      │
                                      └─── Count >= 3 ─────► Reset Counter ──────► Redirect to Login
```

## Configuration

### Constants (in `src/lib/reload-counter.ts`):

- `MAX_RELOAD_ATTEMPTS`: 3
- `COUNTER_EXPIRY_TIME`: 5 minutes (300,000 ms)
- `RELOAD_COUNTER_KEY`: 'auth_reload_count'
- `RELOAD_COUNTER_EXPIRY_KEY`: 'auth_reload_count_expiry'

## Error Scenarios

### Scenario 1: Token Expired
1. User makes API request
2. Backend returns 401 (token expired)
3. Counter incremented (1/3)
4. Page reloads
5. Auth system refreshes token
6. Request succeeds
7. Counter reset

### Scenario 2: Persistent 401 Error
1. User makes API request
2. Backend returns 401
3. Counter incremented (1/3) → Page reloads
4. Request fails again with 401
5. Counter incremented (2/3) → Page reloads
6. Request fails again with 401
7. Counter incremented (3/3) → Page reloads
8. Request fails again with 401
9. Max attempts reached → Counter reset → Redirect to login page

### Scenario 3: Successful Recovery
1. Counter at 2/3
2. User makes API request
3. Request succeeds (200)
4. Counter reset to 0

## Testing

### Manual Testing Steps:

1. **Test Basic 401 Handling:**
   - Clear localStorage
   - Make API request that returns 401
   - Verify page reloads
   - Check counter incremented in localStorage

2. **Test Max Retry Limit:**
   - Force API to return 401 consistently
   - Observe 3 reload attempts
   - Verify redirect to login page on 4th attempt

3. **Test Counter Reset:**
   - Trigger 401 error (counter = 1)
   - Make successful API request
   - Verify counter reset in localStorage

4. **Test Counter Expiry:**
   - Trigger 401 error (counter = 1)
   - Wait 5+ minutes
   - Trigger 401 error again
   - Verify counter started fresh from 1

### Automated Testing:

Create unit tests for reload-counter utility:

```typescript
describe('reload-counter', () => {
  it('should increment reload count', () => {
    expect(incrementReloadCount()).toBe(1)
    expect(incrementReloadCount()).toBe(2)
  })
  
  it('should reset reload count', () => {
    incrementReloadCount()
    resetReloadCount()
    expect(getReloadCount()).toBe(0)
  })
  
  it('should allow reload when under limit', () => {
    expect(canReload()).toBe(true)
  })
  
  it('should prevent reload when at limit', () => {
    incrementReloadCount() // 1
    incrementReloadCount() // 2
    incrementReloadCount() // 3
    expect(canReload()).toBe(false)
  })
})
```

## Security Considerations

1. **Counter Storage**: Using localStorage ensures counter persists across page reloads
2. **Expiry Mechanism**: 5-minute expiry prevents stale counters
3. **Max Attempts**: Limited to 3 to prevent infinite loops
4. **Automatic Redirect**: Ensures users are redirected to login after max attempts

## Future Enhancements

1. **Configurable Max Attempts**: Allow customization via environment variables
2. **User Notification**: Show toast/alert before redirecting to login
3. **Analytics**: Track 401 error frequency and reload patterns
4. **Retry Strategy**: Implement exponential backoff before reload
5. **Token Refresh**: Attempt token refresh before reload

## Related Files

- `/src/lib/reload-counter.ts` - Reload counter utility
- `/src/api/interceptors.ts` - API interceptors
- `/src/api/base.ts` - Base API client
- `/src/lib/error-handler.ts` - Error handling utilities
- `/src/lib/token-manager.ts` - Token management

## Changelog

### Version 1.0.0 (Current)
- Initial implementation of 401 error handling with reload mechanism
- Added reload counter utility
- Updated API interceptors and base client
- Set max reload attempts to 3
- Added counter expiry mechanism (5 minutes)


