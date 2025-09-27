'use client'

import React from 'react'
import { SignupProvider } from '@/contexts/signup-context'
import { AuthRedirect } from '@/components/auth/AuthRedirect'

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthRedirect>
      <SignupProvider>
        {children}
      </SignupProvider>
    </AuthRedirect>
  )
}
