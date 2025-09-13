'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { PasswordStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/contexts/signup-context'
import { authApi } from '@/api/auth/api'
import { handleApiError } from '@/lib/error-handler'

export default function PasswordPage() {
  const router = useRouter()
  const { updateData, data } = useSignupData()

  // Check if user has completed previous steps
  React.useEffect(() => {
    if (!data.email || !data.fullName || !data.profession) {
      router.push('/signup')
    }
  }, [data, router])

  const handleNext = async (password: string) => {
    try {
      updateData({ password })
      
      const [firstName, ...lastNameParts] = data.fullName.split(' ')
      const lastName = lastNameParts.join(' ') || ''
      
      const registerData = {
        email: data.email,
        first_name: firstName,
        last_name: lastName,
        password: password,
        meta_data: {
          profession: data.profession
        }
      }
      
      const registerResponse = await authApi.register(registerData)
      
      if (registerResponse.error) {
        throw new Error(registerResponse.error)
      }
      
      router.push('/signup/otp-verification')
    } catch (error: any) {
      const errorMessage = handleApiError(error)
      throw new Error(errorMessage)
    }
  }

  const handleBack = () => {
    router.push('/signup/profession')
  }

  return (
    <main className="w-full flex justify-center px-4 sm:px-6 lg:px-8 h-full">
      <div className="w-full max-w-[450px]">
        <PasswordStep onNext={handleNext} onBack={handleBack} />
      </div>
    </main>
  )
}
