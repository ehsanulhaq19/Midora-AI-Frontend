'use client'

import React from 'react'
import { AuthRedirect } from '@/components/auth/AuthRedirect'

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthRedirect>
      {children}
    </AuthRedirect>
  )
}
