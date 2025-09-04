import { UnauthorizedDisplay } from '@/components/ui/UnauthorizedDisplay'

export default function UnauthorizedPage() {
  return (
    <UnauthorizedDisplay
      title="Access Denied"
      message="You need to be logged in to access this page. Please sign in to continue."
      showLoginButton={true}
      showHomeButton={true}
    />
  )
}
