import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/auth/LoginForm'

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

describe('LoginForm', () => {
  const mockOnLogin = jest.fn()
  const mockOnGoogleLogin = jest.fn()
  const mockOnSignupClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form with all elements', () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
      />
    )

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your Midora AI account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeInTheDocument()
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument()
  })

  it('shows validation errors for empty fields', async () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
      />
    )

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('shows validation error for invalid email', async () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
      />
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument()
    })
  })

  it('shows validation error for short password', async () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
      />
    )

    const passwordInput = screen.getByPlaceholderText('Enter your password')
    fireEvent.change(passwordInput, { target: { value: '123' } })

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument()
    })
  })

  it('calls onLogin with valid credentials', async () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
      />
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('calls onGoogleLogin when Google button is clicked', () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
      />
    )

    const googleButton = screen.getByRole('button', { name: 'Continue with Google' })
    fireEvent.click(googleButton)

    expect(mockOnGoogleLogin).toHaveBeenCalled()
  })

  it('calls onSignupClick when signup link is clicked', () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
      />
    )

    const signupLink = screen.getByText('Sign up')
    fireEvent.click(signupLink)

    expect(mockOnSignupClick).toHaveBeenCalled()
  })

  it('shows loading state when loading prop is true', () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
        loading={true}
      />
    )

    expect(screen.getByRole('button', { name: 'Signing in...' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled()
  })

  it('clears errors when user starts typing', async () => {
    render(
      <LoginForm
        onLogin={mockOnLogin}
        onGoogleLogin={mockOnGoogleLogin}
        onSignupClick={mockOnSignupClick}
      />
    )

    const submitButton = screen.getByRole('button', { name: 'Sign In' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
    })

    const emailInput = screen.getByPlaceholderText('Enter your email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })

    await waitFor(() => {
      expect(screen.queryByText('Email is required')).not.toBeInTheDocument()
    })
  })
})
