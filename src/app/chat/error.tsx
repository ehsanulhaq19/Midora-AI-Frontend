'use client'

import { useEffect } from 'react'

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Chat page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl mb-4">😔</div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Oops! Something went wrong
        </h1>
        <p className="text-neutral-600">
          We encountered an error while loading your chat experience. Please try again.
        </p>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-neutral-200 text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
