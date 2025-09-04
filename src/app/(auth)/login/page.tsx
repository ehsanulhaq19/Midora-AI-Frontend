'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { AuthLandingPage } from '@/components/auth/AuthLandingPage'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login attempt')
  }

  const handleSignupClick = () => {
    router.push('/signup')
  }

  return (
    <AuthLandingPage>
      <div className="w-full max-w-md">
        <LoginForm
          onGoogleLogin={handleGoogleLogin}
          onSignupClick={handleSignupClick}
        />
      </div>
    </AuthLandingPage>
  )
}
