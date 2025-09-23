# Logout Functionality Implementation

## Overview

This document describes the implementation of the logout functionality in the Midora AI frontend application. The logout feature allows users to securely sign out of their accounts by clearing authentication tokens and calling the backend logout API.

## Components

### 1. Logout Icon (`/src/icons/logout.tsx`)

A custom SVG icon component for the logout button.

**Features:**
- Customizable color and opacity
- Responsive design
- Consistent with other icons in the application

**Props:**
- `className?: string` - Additional CSS classes
- `color?: string` - Icon color (default: '#1F1740')
- `opacity?: string` - Icon opacity (default: '1')

### 2. Logout Button (`/src/components/ui/buttons/logout-button.tsx`)

A reusable button component specifically designed for logout functionality.

**Features:**
- Integrates with the `useLogout` hook
- Customizable appearance (variant, size)
- Optional icon and text display
- Hover effects with red color scheme
- Full width layout for sidebar usage

**Props:**
- `className?: string` - Additional CSS classes
- `variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'` - Button variant
- `size?: 'default' | 'lg' | 'sm' | 'icon'` - Button size
- `showIcon?: boolean` - Show/hide logout icon (default: true)
- `showText?: boolean` - Show/hide logout text (default: true)

### 3. useLogout Hook (`/src/hooks/useLogout.ts`)

A custom React hook that handles the logout process.

**Features:**
- Calls backend logout API
- Clears Redux authentication state
- Clears authentication cookies
- Redirects to signup page
- Error handling with user feedback

**Returns:**
- `logoutUser: () => Promise<void>` - Function to trigger logout

## Integration

### Sidebar Integration

The logout button is integrated into the chat screen sidebar (`/src/components/chat/sidebar/main-container.tsx`) at the bottom left corner, positioned below the user profile information.

**Implementation:**
```tsx
<LogoutButton
  variant="ghost"
  size="default"
  className="w-full justify-start px-3 py-2 text-left"
/>
```

## Authentication Flow

### Logout Process

1. **User Interaction**: User clicks the logout button
2. **API Call**: Frontend calls `/api/v1/auth/logout` endpoint
3. **Token Clearing**: 
   - Clears Redux authentication state
   - Removes authentication cookies (access token, refresh token, user data)
4. **Redirect**: User is redirected to the signup page
5. **Error Handling**: Any errors are logged and displayed to the user

### Backend Integration

The logout functionality integrates with the existing backend API:

- **Endpoint**: `POST /api/v1/auth/logout`
- **Authentication**: Requires valid access token
- **Response**: Success/error status
- **Side Effects**: Backend invalidates the user's tokens

## Internationalization

The logout button text is internationalized using the i18n system:

- **Key**: `auth.logout`
- **Default Text**: "Logout"
- **Location**: `/src/i18n/languages/en/auth.ts`

## Error Handling

The logout functionality includes comprehensive error handling:

1. **Backend API Errors**: If the logout API call fails, the process continues to clear local state
2. **Network Errors**: Handled gracefully with user feedback
3. **Token Clearing Errors**: Logged but don't prevent logout completion

## Security Considerations

1. **Token Invalidation**: Backend API call ensures server-side token invalidation
2. **Local Cleanup**: All local authentication data is cleared
3. **Redirect**: User is redirected to a safe page (signup)
4. **Error Logging**: Security-relevant errors are logged for monitoring

## Testing

### Unit Tests

The logout functionality includes comprehensive unit tests:

- **File**: `/tests/components/ui/LogoutButton.test.tsx`
- **Coverage**: Button rendering, click handling, prop variations
- **Mocking**: useLogout hook and i18n system

### Test Scenarios

1. **Rendering**: Button renders with correct text and icon
2. **Click Handling**: Clicking button triggers logout function
3. **Variants**: Different button variants work correctly
4. **Customization**: Icon and text can be hidden/shown

## Usage Examples

### Basic Usage

```tsx
import { LogoutButton } from '@/components/ui/buttons'

function MyComponent() {
  return <LogoutButton />
}
```

### Customized Usage

```tsx
import { LogoutButton } from '@/components/ui/buttons'

function MyComponent() {
  return (
    <LogoutButton
      variant="destructive"
      size="sm"
      showIcon={false}
      className="custom-class"
    />
  )
}
```

### Using the Hook Directly

```tsx
import { useLogout } from '@/hooks/useLogout'

function MyComponent() {
  const { logoutUser } = useLogout()
  
  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  return <button onClick={handleLogout}>Logout</button>
}
```

## Dependencies

- **React**: Component framework
- **Next.js**: Router for navigation
- **Redux Toolkit**: State management
- **Tailwind CSS**: Styling
- **Class Variance Authority**: Button variants
- **Custom Icons**: Logout icon component

## Future Enhancements

1. **Confirmation Dialog**: Add confirmation before logout
2. **Session Timeout**: Automatic logout on session expiry
3. **Multi-device Logout**: Logout from all devices option
4. **Logout History**: Track logout events for security
5. **Custom Redirect**: Allow custom redirect URL after logout

## Troubleshooting

### Common Issues

1. **Logout Button Not Appearing**: Check if user is authenticated
2. **Logout Not Working**: Verify API endpoint and authentication
3. **Redirect Issues**: Check router configuration
4. **Token Not Cleared**: Verify cookie clearing implementation

### Debug Steps

1. Check browser console for errors
2. Verify network requests to logout API
3. Check Redux state after logout
4. Verify cookie clearing in browser dev tools
5. Check router navigation logs
