# Redux Store Implementation

This directory contains the Redux store configuration and slices for the Midora AI frontend application.

## Structure

```
src/store/
├── index.ts              # Store configuration and root state types
├── hooks.ts              # Typed Redux hooks (useAppDispatch, useAppSelector)
├── slices/
│   └── authSlice.ts      # Authentication state management
└── README.md             # This file
```

## Features

### Authentication Store (`authSlice.ts`)

The authentication slice manages:
- User data (from login/registration)
- Access and refresh tokens
- Authentication state (isAuthenticated, isLoading, error)
- Login, logout, and token refresh operations

### Available Actions

- `setLoading(boolean)` - Set loading state
- `setError(string | null)` - Set error message
- `clearError()` - Clear error state
- `loginSuccess({ user, accessToken, refreshToken })` - Set user data after successful login
- `updateUser(user)` - Update user information
- `updateTokens({ accessToken, refreshToken })` - Update authentication tokens
- `logout()` - Clear all authentication data
- `initializeAuth({ user, accessToken, refreshToken })` - Initialize auth state from stored data

## Usage

### Using Redux Hooks

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks'

// In a component
const dispatch = useAppDispatch()
const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
```

### Using Custom Auth Hook

```typescript
import { useAuthRedux } from '@/hooks/useAuthRedux'

// In a component
const { userName, userEmail, isAuthenticated } = useAuthRedux()
```

### Dispatching Actions

```typescript
import { useAppDispatch } from '@/store/hooks'
import { loginSuccess, logout } from '@/store/slices/authSlice'

const dispatch = useAppDispatch()

// Login success
dispatch(loginSuccess({
  user: userData,
  accessToken: 'token',
  refreshToken: 'refreshToken'
}))

// Logout
dispatch(logout())
```

## Integration with AuthContext

The Redux store is integrated with the existing `AuthContext` to maintain backward compatibility while providing centralized state management. The `AuthContext` now uses Redux actions to update the global state.

## Benefits

1. **Centralized State**: All authentication data is stored in one place
2. **Predictable Updates**: State changes follow Redux patterns
3. **Time Travel Debugging**: Redux DevTools support
4. **Type Safety**: Full TypeScript support with typed hooks
5. **Backward Compatibility**: Existing AuthContext continues to work
6. **Easy Testing**: Redux state is easily testable

## Example: Chat Screen

The chat screen now displays the user's first name from Redux:

```typescript
const { userName } = useAuthRedux()
return <h1>Welcome back, {userName}!</h1>
```

This automatically updates when the user logs in or when their data changes.

