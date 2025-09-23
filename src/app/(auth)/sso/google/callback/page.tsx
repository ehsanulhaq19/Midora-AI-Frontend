'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSSO } from '@/hooks/useSSO'
import { Spinner } from '@/components/ui/loaders'

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams()
  const { handleSSOCallback } = useSSO()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('Google OAuth error:', error)
      // Redirect to signup page with error
      window.location.href = '/signup?error=oauth_error'
      return
    }

    if (code) {
      handleSSOCallback('google', code, state || undefined)
    } else {
      // No code received, redirect to signup
      window.location.href = '/signup?error=no_code'
    }
  }, [searchParams, handleSSOCallback])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Completing Google sign-in...</p>
      </div>
    </div>
  )
}
