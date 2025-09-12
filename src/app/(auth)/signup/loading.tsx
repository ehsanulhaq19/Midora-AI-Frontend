import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function SignupLoading() {
  return (
    <div className="min-h-screen w-full bg-[color:var(--tokens-color-surface-surface-primary)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-lg text-neutral-600">Loading signup page...</p>
      </div>
    </div>
  )
}
