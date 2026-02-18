'use client'

import { ErrorScreen } from '@/components/errors'

export default function SignupError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <ErrorScreen 
      onRetry={reset}
      onGoHome={() => window.location.href = '/signup'}
    />
  )
}
