'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { PageTransition } from '@/components/ui/page-transition'
import OnboardingLayout from './onboarding-layout'
import { SignupProvider } from '@/contexts/signup-context'

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Don't apply PageTransition to the main signup page (/signup)
  // Only apply it to onboarding pages (/signup/welcome, /signup/full-name, etc.)
  const isOnboardingPage = pathname !== '/signup'
  
  const content = (
    <SignupProvider>
      <div className="relative min-h-screen w-full bg-[color:var(--tokens-color-surface-surface-primary)]">
        {children}
      </div>
    </SignupProvider>
  )
  
  if (isOnboardingPage) {
    return (
      <SignupProvider>
        <div className="relative min-h-screen w-full bg-[color:var(--tokens-color-surface-surface-primary)]">
          <PageTransition>
            <OnboardingLayout>
              {children}
            </OnboardingLayout>
          </PageTransition>
        </div>
      </SignupProvider>
    )
  }
  
  return content
}
