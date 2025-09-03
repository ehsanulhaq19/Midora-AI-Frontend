import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SignupForm } from '@/components/auth/SignupForm'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

describe('SignupForm', () => {
  const mockOnSignup = jest.fn()
  const mockOnGoogleSignup = jest.fn()
  const mockOnLoginClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders signup form with all elements', () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByText('Join Midora AI and start your journey')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your full name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Create a password')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument()
    expect(screen.getByText('Already have an account?')).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
      expect(screen.getByText('Please confirm your password')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    const passwordInput = screen.getByPlaceholderText('Create a password')
    fireEvent.change(passwordInput, { target: { value: '123' } })

    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('shows validation error for mismatched passwords', async () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    const passwordInput = screen.getByPlaceholderText('Create a password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })

    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('calls onSignup with valid form data', async () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    const nameInput = screen.getByPlaceholderText('Enter your full name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Create a password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')

    fireEvent.change(nameInput, { target: { value: 'John Doe' } })
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSignup).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })
    })
  })

  it('calls onGoogleSignup when Google button is clicked', () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    const googleButton = screen.getByRole('button', { name: 'Continue with Google' })
    fireEvent.click(googleButton)

    expect(mockOnGoogleSignup).toHaveBeenCalled()
  })

  it('calls onLoginClick when login link is clicked', () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    const loginLink = screen.getByText('Sign in')
    fireEvent.click(loginLink)

    expect(mockOnLoginClick).toHaveBeenCalled()
  })

  it('shows loading state when loading prop is true', () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
        loading={true}
      />
    )

    expect(screen.getByRole('button', { name: 'Creating account...' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled()
  })

  it('clears errors when user starts typing', async () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
    })

    const nameInput = screen.getByPlaceholderText('Enter your full name')
    fireEvent.change(nameInput, { target: { value: 'John Doe' } })

    await waitFor(() => {
      expect(screen.queryByText('Name is required')).not.toBeInTheDocument()
    })
  })

  it('displays terms of service and privacy policy links', () => {
    render(
      <SignupForm
        onSignup={mockOnSignup}
        onGoogleSignup={mockOnGoogleSignup}
        onLoginClick={mockOnLoginClick}
      />
    )

    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText(/By creating an account, you agree to our/)).toBeInTheDocument()
  })
})
