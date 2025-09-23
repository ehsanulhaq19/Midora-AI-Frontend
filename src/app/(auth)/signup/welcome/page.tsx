'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { WelcomeStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/contexts/signup-context'

export default function WelcomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data } = useSignupData()

  // Check if this is SSO onboarding or regular signup
  React.useEffect(() => {
    const onboardingType = searchParams.get('type')
    if (onboardingType === 'sso') {
      // For SSO onboarding, we don't need to check email from signup data
      // The user is already authenticated via SSO
      return
    } else {
      // For regular signup, check if user has completed email step
      if (!data.email) {
        router.push('/signup')
      }
    }
  }, [data, router, searchParams])

  const handleContinue = () => {
    const onboardingType = searchParams.get('type')
    if (onboardingType === 'sso') {
      router.push('/signup/full-name?type=sso')
    } else {
      router.push('/signup/full-name')
    }
  }

  return (
    <main className="w-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[408px]">
        <WelcomeStep 
          onNext={handleContinue}
        />
      </div>
    </main>
  )
}
