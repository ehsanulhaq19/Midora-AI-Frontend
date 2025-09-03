'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { AuthLandingPage } from '@/components/auth/AuthLandingPage'

export default function LoginPage() {
  const handleLogin = (credentials: { email: string; password: string }) => {
    // TODO: Implement login logic
    console.log('Login attempt:', credentials)
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login attempt')
  }

  const handleSignupClick = () => {
    // TODO: Navigate to signup page
    window.location.href = '/signup'
  }

  return (
    <AuthLandingPage>
      <div className="w-full max-w-md">
        <LoginForm
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onSignupClick={handleSignupClick}
        />
      </div>
    </AuthLandingPage>
  )
}
