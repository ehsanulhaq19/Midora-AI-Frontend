'use client'

import React from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { PageTransition } from '@/components/ui/page-transition'
import { CheckoutContent } from '@/components/checkout/checkout-content'

export default function CheckoutPage() {
  return (
    <AuthGuard>
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-[color:var(--tokens-color-surface-surface-primary)]">
          <CheckoutContent />
        </div>
      </PageTransition>
    </AuthGuard>
  )
}