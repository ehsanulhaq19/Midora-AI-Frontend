import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { AuthLandingPage } from '@/components/auth/AuthLandingPage'

export default function SignupLoading() {
  return (
    <AuthLandingPage>
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-lg text-neutral-600">Loading signup page...</p>
      </div>
    </AuthLandingPage>
  )
}
