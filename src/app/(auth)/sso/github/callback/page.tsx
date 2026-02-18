'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Spinner } from '@/components/ui/loaders'

export default function GitHubCallbackPage() {
  const searchParams = useSearchParams()
  const { handleSSOCallback } = useAuth()

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    if (error) {
      console.error('GitHub OAuth error:', error)
      // Redirect to signup page with error
      window.location.href = '/signup?error=oauth_error'
      return
    }

    if (code) {
      handleSSOCallback('github', code, state || undefined)
    } else {
      // No code received, redirect to signup
      window.location.href = '/signup?error=no_code'
    }
  }, [searchParams, handleSSOCallback])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600">Completing GitHub sign-in...</p>
      </div>
    </div>
  )
}
