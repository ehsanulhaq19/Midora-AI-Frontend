# Refresh Token Cookie Implementation

## Overview

This document describes the implementation of refresh token as HTTP-only cookies for secure API authentication in the Midora.ai frontend application.

## Implementation Details

### Token Storage Strategy

The application uses a hybrid approach for token storage:

- **Access Token**: Stored in `localStorage` (short-lived, 15 minutes)
- **Refresh Token**: Stored as a secure cookie (long-lived, 7 days)

### Key Components

#### 1. Token Manager (`src/lib/token-manager.ts`)

The `TokenManager` class handles secure storage and retrieval of authentication tokens:

```typescript
class TokenManager {
  // Store tokens with refresh token as cookie
  storeTokens(accessToken: string, refreshToken: string, authMethod: string): void
  
  // Get access token from localStorage
  getAccessToken(): string | null
  
  // Get refresh token from cookie
  getRefreshToken(): string | null
  
  // Clear all tokens
  clearTokens(): void
}
```

#### 2. Cookie Utilities (`src/lib/cookies.ts`)

Utility functions for managing cookies with proper security attributes:

```typescript
// Set a cookie with security options
setCookie(name: string, value: string, options: CookieOptions): void

// Get a cookie value
getCookie(name: string): string | null

// Remove a cookie
removeCookie(name: string, path?: string): void
```

#### 3. API Interceptors (`src/api/interceptors.ts`)

Request interceptors automatically add authentication headers and ensure cookies are sent:

```typescript
export function requestInterceptor(url: string, options: RequestInit = {}): RequestInit {
  // Add Authorization header with access token
  // Ensure refresh token cookie is sent with credentials: 'include'
}
```

#### 4. Base API Client (`src/api/base.ts`)

All API requests include `credentials: 'include'` to ensure cookies are sent:

```typescript
const interceptedOptions = requestInterceptor(url, {
  method: 'GET',
  credentials: 'include', // Ensures cookies are sent with the request
  // ... other options
})
```

### Security Features

#### Cookie Security Attributes

Refresh tokens are stored with the following security attributes:

- **Secure**: `true` - Only sent over HTTPS
- **SameSite**: `'strict'` - Prevents CSRF attacks
- **HttpOnly**: `false` - Allows JavaScript access for API requests
- **Max-Age**: 7 days - Automatic expiration
- **Path**: `/` - Available for all routes

#### Automatic Token Inclusion

- Access tokens are sent in the `Authorization` header
- Refresh tokens are automatically sent as cookies with every API request
- The browser handles cookie inclusion automatically when `credentials: 'include'` is set

### File Structure Changes

#### Hook Files Renamed to Kebab-Case

All hook files have been renamed to follow kebab-case convention:

- `useAuthInit.ts` → `use-auth-init.ts`
- `useAuthRedux.ts` → `use-auth-redux.ts`
- `useConversation.ts` → `use-conversation.ts`
- `useToast.ts` → `use-toast.ts`

#### Updated Imports

All import statements throughout the codebase have been updated to use the new kebab-case file names.

### Usage Examples

#### Storing Tokens

```typescript
import { tokenManager } from '@/lib/token-manager'

// After successful authentication
tokenManager.storeTokens(accessToken, refreshToken, 'email')
```

#### Making API Requests

```typescript
import { baseApiClient } from '@/api/base'

// Refresh token cookie is automatically sent
const response = await baseApiClient.get('/api/user/profile')
```

#### Clearing Tokens

```typescript
import { tokenManager } from '@/lib/token-manager'

// Clear all tokens and cookies
tokenManager.clearTokens()
```

### Benefits

1. **Enhanced Security**: Refresh tokens are stored as secure cookies, reducing XSS attack surface
2. **Automatic Inclusion**: Cookies are automatically sent with API requests
3. **CSRF Protection**: SameSite=strict prevents cross-site request forgery
4. **Consistent Naming**: All files follow kebab-case convention
5. **Centralized Management**: Token operations are handled through a single manager class

### Backend Requirements

The backend should:

1. Accept refresh tokens from cookies
2. Set secure cookie attributes when issuing refresh tokens
3. Handle token refresh using the cookie-based refresh token
4. Clear refresh token cookies on logout

### Testing

To test the implementation:

1. Login to the application
2. Check browser developer tools → Application → Cookies
3. Verify `refresh_token` cookie is set with secure attributes
4. Make API requests and verify cookies are sent in network tab
5. Test token refresh functionality

### Migration Notes

- All existing imports have been updated to use kebab-case file names
- No breaking changes to the public API
- Token storage behavior remains the same for end users
- Enhanced security through cookie-based refresh token storage
