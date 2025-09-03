'use client'

import { ErrorDisplay } from '@/components/ui/ErrorDisplay'
import { AuthLandingPage } from '@/components/auth/AuthLandingPage'

export default function SignupError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <AuthLandingPage>
      <div className="w-full max-w-md">
        <ErrorDisplay 
          error={error}
          resetError={reset}
        />
      </div>
    </AuthLandingPage>
  )
}
