'use client'

import { SignupForm } from '@/components/auth/SignupForm'
import { AuthLandingPage } from '@/components/auth/AuthLandingPage'

export default function SignupPage() {
  const handleSignup = (data: { email: string; password: string; confirmPassword: string; name: string }) => {
    // TODO: Implement signup logic
    console.log('Signup attempt:', data)
  }

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    console.log('Google signup attempt')
  }

  const handleLoginClick = () => {
    // TODO: Navigate to login page
    window.location.href = '/login'
  }

  return (
    <AuthLandingPage>
      <div className="w-full max-w-md">
        <SignupForm
          onSignup={handleSignup}
          onGoogleSignup={handleGoogleSignup}
          onLoginClick={handleLoginClick}
        />
      </div>
    </AuthLandingPage>
  )
}
