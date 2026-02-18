# SSO Authentication Implementation

## Overview

This document describes the implementation of Single Sign-On (SSO) authentication in the Midora AI frontend application. The implementation supports authentication via Google, Microsoft, and GitHub OAuth providers, alongside traditional email/password authentication.

## Architecture

### Components

1. **Authentication API Client** (`/src/api/auth/api.ts`)
   - Handles all authentication-related API calls
   - Includes SSO URL generation and callback handling
   - Supports Google, Microsoft, and GitHub OAuth flows

2. **Redux Store** (`/src/store/slices/authSlice.ts`)
   - Manages authentication state
   - Tracks authentication method (email, Google, Microsoft, GitHub)
   - Handles user data, tokens, and authentication status

3. **SSO Hook** (`/src/hooks/useSSO.ts`)
   - Provides SSO authentication functionality
   - Handles OAuth flow initiation and callback processing
   - Manages state parameter for CSRF protection

4. **Authentication Guard** (`/src/components/auth/AuthGuard.tsx`)
   - Protects routes that require authentication
   - Redirects unauthenticated users to signup page
   - Shows loading state during authentication checks

5. **Auth Initializer** (`/src/components/auth/AuthInitializer.tsx`)
   - Initializes authentication state on app startup
   - Restores auth state from localStorage
   - Validates stored tokens

## Authentication Flow

### SSO Authentication Flow

1. **Initiation**
   - User clicks SSO provider button (Google, Microsoft, GitHub)
   - `useSSO` hook generates random state parameter for CSRF protection
   - State is stored in sessionStorage
   - User is redirected to provider's OAuth authorization URL

2. **Callback Processing**
   - Provider redirects to callback page with authorization code
   - Callback page extracts code and state from URL parameters
   - State is verified against stored value for CSRF protection
   - Authorization code is exchanged for access token via backend API
   - User data is retrieved and onboarding status is checked
   - If user is not onboarded, redirect to signup page for onboarding flow
   - If user is onboarded, store data in Redux and redirect to chat page

3. **Token Management**
   - Access and refresh tokens are stored in localStorage
   - Authentication method is tracked in Redux store
   - Tokens are automatically included in API requests via interceptors

4. **SSO Onboarding Flow**
   - For new SSO users, a streamlined onboarding process is triggered
   - User sees: Welcome → Full Name (pre-filled) → Profession → Success
   - Full name is automatically populated from SSO provider data
   - No password or email verification steps required
   - Onboarding completion calls `completeOnboarding` API with profile data
   - User is redirected to chat page after successful onboarding

### Email/Password Authentication Flow

1. **Login Process**
   - User enters email and password
   - Credentials are validated via backend API
   - User data and tokens are stored in Redux and localStorage
   - User is redirected to chat page

2. **Registration Process**
   - User enters email for signup
   - System checks if email exists
   - If exists, user is prompted for password (login flow)
   - If new, user proceeds through multi-step registration

## Onboarding Flows

The application supports two distinct onboarding flows depending on how the user authenticates:

### 1. Email Signup Onboarding Flow
For users who sign up with email and password:
1. **Welcome Screen** - Introduction to the platform
2. **Full Name Screen** - User enters their full name
3. **Profession Screen** - User selects their profession
4. **Password Screen** - User sets their password
5. **Email Verification Screen** - User verifies email with OTP
6. **Success Screen** - Account setup complete, redirect to chat

### 2. SSO Onboarding Flow
For users who authenticate via SSO providers (Google, Microsoft, GitHub):
1. **Welcome Screen** - Introduction to the platform
2. **Full Name Screen** - Pre-filled with SSO provider data, user can edit
3. **Profession Screen** - User selects their profession
4. **Success Screen** - Profile complete, redirect to chat

**Key Differences:**
- SSO users skip password and email verification steps
- Full name is automatically populated from SSO provider
- Streamlined 4-step process vs 6-step email signup process
- Both flows end with the same success screen and chat redirect

## API Endpoints

### SSO Endpoints

- `GET /api/v1/auth/google/auth-url` - Get Google OAuth authorization URL
- `GET /api/v1/auth/microsoft/auth-url` - Get Microsoft OAuth authorization URL
- `GET /api/v1/auth/github/auth-url` - Get GitHub OAuth authorization URL
- `GET /api/v1/auth/google/callback` - Handle Google OAuth callback
- `GET /api/v1/auth/microsoft/callback` - Handle Microsoft OAuth callback
- `GET /api/v1/auth/github/callback` - Handle GitHub OAuth callback

### Traditional Auth Endpoints

- `POST /api/v1/auth/login` - Email/password login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user information
- `POST /api/v1/auth/refresh` - Refresh access token

## State Management

### Redux Store Structure

```typescript
interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  authMethod: 'email' | 'google' | 'microsoft' | 'github' | null
}
```

### Actions

- `loginSuccess` - Set user data and tokens after successful authentication
- `logout` - Clear all authentication data
- `setLoading` - Set loading state
- `setError` - Set error state
- `clearError` - Clear error state
- `initializeAuth` - Initialize auth state from stored data

## Security Features

### CSRF Protection

- Random state parameter generated for each SSO flow
- State stored in sessionStorage during OAuth flow
- State verified on callback to prevent CSRF attacks

### Token Management

- Access tokens stored in localStorage for persistence
- Tokens automatically included in API requests via interceptors
- Token validation on app startup
- Automatic cleanup on logout

### Route Protection

- Authentication guard component protects sensitive routes
- Automatic redirect to signup page for unauthenticated users
- Loading states during authentication checks

## File Structure

```
src/
├── api/
│   └── auth/
│       ├── api.ts              # Authentication API client
│       └── types.ts            # Authentication type definitions
├── components/
│   └── auth/
│       ├── AuthGuard.tsx       # Route protection component
│       ├── AuthInitializer.tsx # Auth state initialization
│       ├── signup-form-section.tsx # Signup form with SSO buttons
│       └── signup-steps/       # Onboarding flow components
│           ├── multi-step-container.tsx # Main onboarding container
│           ├── welcome-step.tsx         # Welcome screen
│           ├── full-name-step.tsx       # Full name input
│           ├── profession-step.tsx      # Profession selection
│           ├── password-step.tsx        # Password setup
│           ├── otp-verification-step.tsx # Email verification
│           └── success-step.tsx         # Completion screen
├── hooks/
│   ├── use-auth.ts            # Main authentication hook with SSO support
│   ├── useAuthInit.ts         # Auth state initialization hook
│   └── useAuthRedux.ts        # Redux authentication hook
├── store/
│   └── slices/
│       └── authSlice.ts       # Redux authentication slice
└── app/
    └── (auth)/
        └── sso/
            ├── google/
            │   └── callback/
            │       └── page.tsx
            ├── microsoft/
            │   └── callback/
            │       └── page.tsx
            └── github/
                └── callback/
                    └── page.tsx
```

## Usage Examples

### Using SSO Authentication

```typescript
import { useAuth } from '@/hooks/use-auth'

const { signInWithGoogle, signInWithMicrosoft, signInWithGitHub } = useAuth()

// Initiate Google SSO
const handleGoogleSignIn = () => {
  signInWithGoogle()
}
```

### Using Authentication Guard

```typescript
import { AuthGuard } from '@/components/auth/AuthGuard'

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>Protected content</div>
    </AuthGuard>
  )
}
```

### Using Logout

```typescript
import { useAuth } from '@/hooks/use-auth'

const { logout } = useAuth()

const handleLogout = () => {
  logout()
}
```

## Error Handling

### SSO Errors

- Invalid state parameter
- Missing authorization code
- Provider authentication failures
- Network errors during token exchange

### General Auth Errors

- Invalid credentials
- Token expiration
- Network connectivity issues
- Server errors

All errors are handled consistently through the error handler utility and displayed to users with appropriate messaging.

## Internationalization

SSO-related messages are stored in the i18n system:

```typescript
// src/i18n/languages/en/auth.ts
export const auth = {
  signInWithGoogle: 'Continue with Google',
  signInWithMicrosoft: 'Continue with Microsoft',
  signInWithGitHub: 'Continue with GitHub',
  ssoError: 'SSO authentication failed',
  // ... other messages
}
```

## Testing Considerations

### Unit Tests

- Test SSO hook functionality
- Test Redux actions and reducers
- Test API client methods
- Test authentication guard behavior

### Integration Tests

- Test complete SSO flows
- Test authentication state persistence
- Test route protection
- Test error scenarios

### E2E Tests

- Test user authentication journeys
- Test SSO provider integrations
- Test logout functionality
- Test protected route access

## Deployment Considerations

### Environment Variables

Ensure the following environment variables are configured:

- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_MICROSOFT_CLIENT_ID`
- `NEXT_PUBLIC_GITHUB_CLIENT_ID`
- `NEXT_PUBLIC_BACKEND_URL`

### OAuth Provider Configuration

Configure OAuth providers with correct redirect URIs:

- Google: `https://yourdomain.com/sso/google/callback`
- Microsoft: `https://yourdomain.com/sso/microsoft/callback`
- GitHub: `https://yourdomain.com/sso/github/callback`

## Future Enhancements

1. **Token Refresh**: Implement automatic token refresh before expiration
2. **Multi-Factor Authentication**: Add MFA support for enhanced security
3. **Session Management**: Implement session timeout and management
4. **Audit Logging**: Add authentication event logging
5. **Social Profile Integration**: Enhanced profile data from SSO providers

## Troubleshooting

### Common Issues

1. **SSO Callback Failures**
   - Check OAuth provider configuration
   - Verify redirect URIs match exactly
   - Check state parameter handling

2. **Token Storage Issues**
   - Verify localStorage is available
   - Check for browser security restrictions
   - Ensure proper token format

3. **Authentication State Issues**
   - Check Redux store initialization
   - Verify token validation logic
   - Check for race conditions in auth initialization

4. **SSO Onboarding Issues**
   - Verify user data is properly fetched from `getCurrentUser` API
   - Check if `is_onboarded` flag is correctly set in user data
   - Ensure full name is properly populated from SSO provider data
   - Verify `completeOnboarding` API call includes correct profile data
   - Check for proper token storage before onboarding flow starts

### Debug Tools

- Browser developer tools for network requests
- Redux DevTools for state inspection
- Console logging for authentication flow debugging
