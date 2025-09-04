'use client'

import { SignupForm } from '@/components/auth/SignupForm'
import { AuthLandingPage } from '@/components/auth/AuthLandingPage'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  const handleGoogleSignup = () => {
    // TODO: Implement Google OAuth
    console.log('Google signup attempt')
  }

  const handleLoginClick = () => {
    router.push('/login')
  }

  return (
    <AuthLandingPage>
      <div className="w-full max-w-md">
        <SignupForm
          onGoogleSignup={handleGoogleSignup}
          onLoginClick={handleLoginClick}
        />
      </div>
    </AuthLandingPage>
  )
}
