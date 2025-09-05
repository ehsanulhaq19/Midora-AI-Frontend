'use client'

import { useState } from 'react'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { AuthLandingPage } from '@/components/auth/AuthLandingPage'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<'forgot' | 'reset'>('forgot')
  const [email, setEmail] = useState('')

  const handleBackToLogin = () => {
    router.push('/login')
  }

  const handleForgotPasswordSuccess = (userEmail: string) => {
    setEmail(userEmail)
    setStep('reset')
  }

  const handleResetPasswordSuccess = () => {
    // Redirect to login after successful password reset
    router.push('/login')
  }

  return (
    <AuthLandingPage>
      <div className="w-full max-w-md">
        {step === 'forgot' ? (
          <ForgotPasswordForm
            onBackToLogin={handleBackToLogin}
            onSuccess={() => handleForgotPasswordSuccess(email)}
          />
        ) : (
          <ResetPasswordForm
            email={email}
            onBackToLogin={handleBackToLogin}
            onSuccess={handleResetPasswordSuccess}
          />
        )}
      </div>
    </AuthLandingPage>
  )
}
