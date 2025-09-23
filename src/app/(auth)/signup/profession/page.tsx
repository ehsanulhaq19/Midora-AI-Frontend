'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProfessionStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/contexts/signup-context'
import { authApi } from '@/api/auth/api'
import { handleApiError } from '@/lib/error-handler'

export default function ProfessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data, updateData } = useSignupData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSSOOnboarding, setIsSSOOnboarding] = useState(false)

  React.useEffect(() => {
    const onboardingType = searchParams.get('type')
    if (onboardingType === 'sso') {
      setIsSSOOnboarding(true)
      // For SSO onboarding, check if we have the full name in session storage
      const fullName = sessionStorage.getItem('sso_onboarding_full_name')
      if (!fullName) {
        router.push('/signup/full-name?type=sso')
      }
    } else {
      // Check if user has completed previous steps for regular signup
      if (!data.email || !data.fullName) {
        router.push('/signup')
      }
    }
  }, [data, router, searchParams])

  const handleNext = async (profession: string) => {
    if (isSSOOnboarding) {
      setIsSubmitting(true)
      
      try {
        // Get the full name from session storage
        const fullName = sessionStorage.getItem('sso_onboarding_full_name')
        
        if (!fullName) {
          // If no full name, redirect back to full name step
          router.push('/signup/full-name?type=sso')
          return
        }

        // Call the SSO onboarding API
        const response = await authApi.onboardSSOUser({
          full_name: fullName,
          profession: profession
        })

        if (response.data) {
          // Clear session storage
          sessionStorage.removeItem('sso_onboarding_full_name')
          
          // Redirect to completion page
          router.push('/signup/sso-complete')
        } else {
          throw new Error('Failed to complete onboarding')
        }
      } catch (error) {
        console.error('SSO onboarding error:', error)
        const errorMessage = handleApiError(error)
        alert(errorMessage) // You might want to use a proper toast notification here
      } finally {
        setIsSubmitting(false)
      }
    } else {
      updateData({ profession })
      router.push('/signup/password')
    }
  }

  const handleBack = () => {
    if (isSSOOnboarding) {
      router.push('/signup/full-name?type=sso')
    } else {
      router.push('/signup/full-name')
    }
  }

  return (
    <main className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[628px]">
        <ProfessionStep onNext={handleNext} onBack={handleBack} />
      </div>
    </main>
  )
}
