'use client'

import React, { useEffect } from 'react'
import { ErrorScreen } from '@/components/errors'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <ErrorScreen 
      onRetry={reset}
      onGoHome={() => window.location.href = '/'}
    />
  )
}
