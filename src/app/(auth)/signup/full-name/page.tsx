'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { FullNameStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/contexts/signup-context'

export default function FullNamePage() {
  const router = useRouter()
  const { updateData, data } = useSignupData()

  // Check if user has completed previous steps
  React.useEffect(() => {
    if (!data.email) {
      router.push('/signup')
    }
  }, [data, router])

  const handleNext = (fullName: string) => {
    updateData({ fullName })
    router.push('/signup/profession')
  }

  const handleBack = () => {
    router.push('/signup/welcome')
  }

  return (
    <main className="w-full flex justify-center spx-4 sm:px-6 lg:px-8 h-full">
      <div className="w-full max-w-[450px]">
        <FullNameStep onNext={handleNext} onBack={handleBack} />
      </div>
    </main>
  )
}
