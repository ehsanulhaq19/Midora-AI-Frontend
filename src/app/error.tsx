'use client'

import { useEffect } from 'react'
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'

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
    <div className="min-h-screen flex items-center justify-center">
      <ErrorDisplay 
        error={error} 
        onReset={reset}
        title="Something went wrong!"
        message="We encountered an unexpected error. Please try again."
      />
    </div>
  )
}
