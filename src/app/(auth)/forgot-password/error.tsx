'use client'

import { useEffect } from 'react'
import { AuthLandingPage } from '@/components/auth/AuthLandingPage'
import { Button } from '@/components/ui/Button'

export default function ForgotPasswordError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Forgot password page error:', error)
  }, [error])

  return (
    <AuthLandingPage>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-3">
            Something went wrong
          </h1>
          <p className="text-lg text-gray-700">
            We encountered an error while loading the forgot password page.
          </p>
        </div>

        <div className="shadow-lg border-0 bg-white rounded-xl p-8 space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Please try again or contact support if the problem persists.
            </p>
            <div className="space-y-3">
              <Button
                onClick={reset}
                className="w-full h-12 text-base font-medium bg-purple-800 text-white hover:bg-purple-900 rounded-lg transition-colors"
              >
                Try again
              </Button>
              <Button
                onClick={() => window.location.href = '/login'}
                variant="outline"
                className="w-full h-12 text-base font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-colors"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthLandingPage>
  )
}
