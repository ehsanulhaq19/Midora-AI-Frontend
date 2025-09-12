'use client'

import { NotFoundScreen } from '@/components/errors'

export default function NotFound() {
  return (
    <NotFoundScreen 
      onGoHome={() => window.location.href = '/'}
    />
  )
}
