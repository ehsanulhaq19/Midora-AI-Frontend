'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FullNameStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/contexts/signup-context'
import { authApi } from '@/api/auth/api'
import { handleApiError } from '@/lib/error-handler'
import { t } from '@/i18n'

export default function FullNamePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateData, data } = useSignupData()
  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSSOOnboarding, setIsSSOOnboarding] = useState(false)

  useEffect(() => {
    const onboardingType = searchParams.get('type')
    if (onboardingType === 'sso') {
      setIsSSOOnboarding(true)
      fetchUserData()
    } else {
      // Check if user has completed previous steps for regular signup
      if (!data.email) {
        router.push('/signup')
      }
    }
  }, [data, router, searchParams])

  const fetchUserData = async () => {
    setIsLoading(true)
    try {
      const response = await authApi.getCurrentUser()
      if (response.data) {
        setUserData(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error)
      router.push('/signup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = (fullName: string) => {
    if (isSSOOnboarding) {
      // Store the full name in session storage for the next step
      sessionStorage.setItem('sso_onboarding_full_name', fullName)
      router.push('/signup/profession?type=sso')
    } else {
      updateData({ fullName })
      router.push('/signup/profession')
    }
  }

  const handleBack = () => {
    if (isSSOOnboarding) {
      router.push('/signup/welcome?type=sso')
    } else {
      router.push('/signup/welcome')
    }
  }

  if (isLoading) {
    return (
      <main className="w-full flex justify-center px-4 sm:px-6 lg:px-8 h-full">
        <div className="w-full max-w-[450px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('auth.ssoOnboardingLoading')}</p>
          </div>
        </div>
      </main>
    )
  }

  // Pre-fill with user's current name if available for SSO onboarding
  const initialName = isSSOOnboarding && userData ? `${userData.first_name} ${userData.last_name}`.trim() : ''

  return (
    <main className="w-full flex justify-center px-4 sm:px-6 lg:px-8 h-full">
      <div className="w-full max-w-[450px]">
        <FullNameStep 
          onNext={handleNext} 
          onBack={handleBack}
          initialName={initialName}
        />
      </div>
    </main>
  )
}
