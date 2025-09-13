'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ProfessionStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/contexts/signup-context'

export default function ProfessionPage() {
  const router = useRouter()
  const { data, updateData } = useSignupData()

  // Check if user has completed previous steps
  React.useEffect(() => {
    if (!data.email || !data.fullName) {
      router.push('/signup')
    }
  }, [data, router])

  const handleNext = (profession: string) => {
    updateData({ profession })
    router.push('/signup/password')
  }

  const handleBack = () => {
    router.push('/signup/full-name')
  }

  return (
    <main className="w-full flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[628px]">
        <ProfessionStep onNext={handleNext} onBack={handleBack} />
      </div>
    </main>
  )
}
