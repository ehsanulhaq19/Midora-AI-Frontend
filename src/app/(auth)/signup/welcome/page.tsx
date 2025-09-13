'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { WelcomeStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/contexts/signup-context'

export default function WelcomePage() {
  const router = useRouter()
  const { data } = useSignupData()

  // Check if user has completed email step
  React.useEffect(() => {
    if (!data.email) {
      router.push('/signup')
    }
  }, [data, router])

  const handleContinue = () => {
    router.push('/signup/full-name')
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
