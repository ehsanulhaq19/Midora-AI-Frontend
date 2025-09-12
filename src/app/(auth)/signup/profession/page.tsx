'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ProfessionStep } from '@/components/auth/signup-steps'
import { useSignupData } from '@/hooks/use-signup-data'
import { PageTransition } from '@/components/ui/page-transition'

export default function ProfessionPage() {
  const router = useRouter()
  const { data, updateData, clearData } = useSignupData()

  const handleNext = (profession: string) => {
    updateData({ profession })
    
    console.log('Signup completed:', { ...data, profession })
    
    clearData()
    
    router.push('/signup/success')
  }

  const handleBack = () => {
    router.push('/signup/full-name')
  }

  return (
    <PageTransition>
      <div className="relative min-h-screen w-full bg-[color:var(--tokens-color-surface-surface-primary)]">
        <header className="absolute top-[37px] left-[44px] w-auto">
          <div className="max-w-7xl mx-auto ml-0">
            <div className="flex justify-start">
              <a 
                href="/" 
                className="flex flex-col w-[120px] sm:w-[140px] lg:w-[154px] items-start gap-2.5 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              >
                <img
                  className="relative self-stretch w-full aspect-[5.19] object-cover"
                  alt="Midora AI Logo"
                  src="/img/logo.png"
                />
              </a>
            </div>
          </div>
        </header>

        <main className="w-full flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-[408px]">
            <ProfessionStep onNext={handleNext} onBack={handleBack} />
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
