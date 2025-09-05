# Forgot Password Feature Implementation

## Overview

The Forgot Password feature allows users to reset their password when they forget it. This implementation provides a seamless two-step process: requesting a password reset code via email and then resetting the password using the received OTP code.

## Features

- **Email-based Password Reset**: Users can request a password reset by providing their email address
- **OTP Verification**: Secure OTP-based verification for password reset
- **Two-Step Process**: Separate forms for requesting reset and actually resetting the password
- **Responsive Design**: Mobile-first design that works across all devices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Internationalization**: Full i18n support for all text content
- **Consistent Styling**: Matches the existing authentication pages design

## File Structure

```
src/
├── app/(auth)/forgot-password/
│   ├── page.tsx              # Main forgot password page
│   ├── loading.tsx           # Loading state component
│   └── error.tsx             # Error state component
├── components/auth/
│   ├── ForgotPasswordForm.tsx    # Form for requesting password reset
│   └── ResetPasswordForm.tsx     # Form for resetting password with OTP
└── i18n/languages/en/
    └── auth.ts               # English translations for forgot password
```

## Components

### 1. ForgotPasswordForm

**Location**: `src/components/auth/ForgotPasswordForm.tsx`

**Purpose**: Handles the initial step of the forgot password process where users enter their email address.

**Features**:
- Email validation
- API integration with forgot password endpoint
- Success state display
- Error handling
- Loading states

**Props**:
```typescript
interface ForgotPasswordFormProps {
  className?: string
  onBackToLogin?: () => void
  onSuccess?: (email: string) => void
}
```

### 2. ResetPasswordForm

**Location**: `src/components/auth/ResetPasswordForm.tsx`

**Purpose**: Handles the second step where users enter the OTP code and new password.

**Features**:
- OTP code validation (6 digits)
- Password validation and confirmation
- API integration with reset password endpoint
- Success state display
- Error handling
- Loading states

**Props**:
```typescript
interface ResetPasswordFormProps {
  className?: string
  email: string
  onBackToLogin?: () => void
  onSuccess?: () => void
}
```

### 3. ForgotPasswordPage

**Location**: `src/app/(auth)/forgot-password/page.tsx`

**Purpose**: Main page component that manages the flow between forgot password and reset password forms.

**Features**:
- State management for the two-step process
- Navigation between forms
- Integration with Next.js router

## API Integration

The forgot password feature integrates with the following backend endpoints:

### 1. Forgot Password Request

**Endpoint**: `POST /api/v1/auth/forgot-password`

**Request**:
```typescript
{
  email: string
}
```

**Response**:
```typescript
{
  success: true,
  message: string,
  email: string
}
```

### 2. Reset Password

**Endpoint**: `POST /api/v1/auth/reset-password`

**Request**:
```typescript
{
  email: string,
  otp_code: string,
  new_password: string
}
```

**Response**:
```typescript
{
  success: true,
  message: string
}
```

## User Flow

1. **Access Forgot Password**: User clicks "Forgot Password?" link on the login page
2. **Enter Email**: User enters their email address in the forgot password form
3. **Request Reset**: System sends OTP code to user's email
4. **Success Message**: User sees confirmation that reset code was sent
5. **Enter OTP & New Password**: User enters the OTP code and new password
6. **Reset Password**: System validates OTP and updates password
7. **Success & Redirect**: User sees success message and is redirected to login

## Error Handling

The implementation handles various error scenarios:

### Frontend Validation Errors
- Empty email field
- Invalid email format
- Empty OTP code
- OTP code length validation (6 digits)
- Empty password fields
- Password confirmation mismatch
- Password minimum length validation

### Backend API Errors
- Email not found
- Invalid OTP code
- Expired OTP
- Password reset failed
- Network errors

### Error Display
- Form-level validation errors are displayed below the respective input fields
- API errors are displayed in a prominent error banner
- All errors are cleared when user starts typing

## Styling

The forgot password feature follows the established design system:

### Design Elements
- **Logo**: Purple "M" logo matching the login page
- **Typography**: Serif font for headings, sans-serif for body text
- **Colors**: Purple primary color (#7C3AED), gray text, red for errors
- **Cards**: White cards with shadow and rounded corners
- **Buttons**: Purple primary buttons with hover effects
- **Inputs**: Consistent styling with focus states

### Responsive Design
- Mobile-first approach
- Maximum width of 448px (max-w-md)
- Proper spacing and padding for all screen sizes
- Touch-friendly button sizes (48px height)

## Internationalization

All text content is externalized to the i18n system:

### Translation Keys Added
```typescript
// Forgot Password
forgotPasswordTitle: 'Forgot Password?'
forgotPasswordSubtitle: 'No worries! Enter your email and we\'ll send you a reset code.'
enterEmailForReset: 'Enter your email address'
sendResetCode: 'Send Reset Code'
sendingResetCode: 'Sending reset code...'
resetCodeSent: 'Reset code sent successfully'
resetCodeSentMessage: 'We\'ve sent a reset code to your email address...'
backToLogin: 'Back to Sign In'
rememberPassword: 'Remember your password?'

// Reset Password
resetPasswordTitle: 'Reset Password'
resetPasswordSubtitle: 'Enter the code we sent to your email and your new password.'
enterResetCode: 'Enter reset code'
enterNewPassword: 'Enter new password'
confirmNewPassword: 'Confirm new password'
resetPassword: 'Reset Password'
resettingPassword: 'Resetting password...'
passwordResetSuccess: 'Password reset successfully'
passwordResetSuccessMessage: 'Your password has been reset successfully...'

// OTP Verification
otpCode: 'OTP Code'
enterOtpCode: 'Enter OTP code'
verifyOtp: 'Verify OTP'
verifyingOtp: 'Verifying OTP...'
resendOtp: 'Resend OTP'
resendingOtp: 'Resending OTP...'
otpVerified: 'OTP verified successfully'
otpExpired: 'OTP has expired'
invalidOtp: 'Invalid OTP code'
otpRequired: 'OTP code is required'
otpMinLength: 'OTP code must be 6 digits'
```

## Integration with Login Page

The forgot password feature is integrated with the login page through a "Forgot Password?" link:

```typescript
// Added to LoginForm component
<div className="text-right">
  <button
    type="button"
    onClick={() => window.location.href = '/forgot-password'}
    className="text-sm text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
  >
    {t('auth.forgotPassword')}
  </button>
</div>
```

## Loading and Error States

### Loading States
- **Page Loading**: `loading.tsx` shows a spinner while the page loads
- **Form Submission**: Buttons show loading text and are disabled during API calls
- **Spinner**: Consistent purple spinner matching the brand colors

### Error States
- **Page Errors**: `error.tsx` handles page-level errors with retry functionality
- **Form Errors**: Inline validation errors and API error banners
- **Network Errors**: Graceful handling of network failures

## Security Considerations

1. **OTP Expiration**: OTP codes have a limited lifespan (handled by backend)
2. **Rate Limiting**: Backend implements rate limiting for forgot password requests
3. **Email Validation**: Frontend validates email format before sending requests
4. **Password Strength**: Password validation ensures minimum security requirements
5. **No Sensitive Data**: No sensitive information is stored in frontend state

## Testing Considerations

### Unit Tests
- Form validation logic
- Error handling
- State management
- Component rendering

### Integration Tests
- API integration
- Navigation flow
- Error scenarios
- Success scenarios

### E2E Tests
- Complete forgot password flow
- Error handling scenarios
- Mobile responsiveness
- Cross-browser compatibility

## Future Enhancements

1. **OTP Resend**: Add ability to resend OTP codes
2. **Password Strength Indicator**: Visual feedback for password strength
3. **Remember Device**: Option to remember trusted devices
4. **Alternative Methods**: SMS-based OTP as alternative to email
5. **Security Questions**: Additional verification methods

## Dependencies

- React 18+
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Custom UI components (Button, Input, Card)
- AuthContext for API integration
- i18n system for translations

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- **Code Splitting**: Components are automatically code-split by Next.js
- **Lazy Loading**: Forms are loaded only when needed
- **Optimized Images**: SVG icons are optimized for web
- **Minimal Bundle**: No additional dependencies added

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Meets WCAG 2.1 AA standards
- **Focus Management**: Clear focus indicators and logical tab order
- **Error Announcements**: Screen reader announcements for errors

## Maintenance

### Code Organization
- Components are modular and reusable
- Clear separation of concerns
- Consistent naming conventions
- Comprehensive TypeScript types

### Documentation
- Inline code comments
- Component prop documentation
- API integration documentation
- User flow documentation

### Updates
- Regular dependency updates
- Security patch management
- Performance monitoring
- User feedback integration
