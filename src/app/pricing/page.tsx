'use client'

import React from 'react'
import { PricingScreen } from '@/components/pricing/pricing-screen'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { LoadingWrapper } from '@/components/ui/loaders'

export default function PricingPage() {
  return (
    <AuthGuard>
      <LoadingWrapper 
        message="Loading pricing..."
        minLoadingTime={400}
        showInitially={true}
      >
        <PricingScreen />
      </LoadingWrapper>
    </AuthGuard>
  )
}