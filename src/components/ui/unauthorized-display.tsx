'use client'

import { Button } from '@/components/ui/buttons'
import { Card, CardContent } from '@/components/ui/Card'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface UnauthorizedDisplayProps {
  className?: string
  title?: string
  message?: string
  showLoginButton?: boolean
  showHomeButton?: boolean
  onLoginClick?: () => void
  onHomeClick?: () => void
}

export function UnauthorizedDisplay({
  className,
  title = 'Access Denied',
  message = 'You need to be logged in to access this page.',
  showLoginButton = true,
  showHomeButton = true,
  onLoginClick,
  onHomeClick
}: UnauthorizedDisplayProps) {
  const router = useRouter()

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick()
    } else {
      router.push('/signup')
    }
  }

  const handleHomeClick = () => {
    if (onHomeClick) {
      onHomeClick()
    } else {
      router.push('/')
    }
  }

  return (
    <div className={cn('min-h-screen flex items-center justify-center bg-gray-50 px-4', className)}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white rounded-xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                  />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-gray-600 leading-relaxed">
                {message}
              </p>
            </div>

            <div className="space-y-3">
              {showLoginButton && (
                <Button
                  onClick={handleLoginClick}
                  className="w-full h-12 text-base font-medium bg-purple-800 text-white hover:bg-purple-900 rounded-lg transition-colors"
                >
                  Sign Up
                </Button>
              )}
              
              {showHomeButton && (
                <Button
                  variant="outline"
                  onClick={handleHomeClick}
                  className="w-full h-12 text-base font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 rounded-lg transition-colors"
                >
                  Go to Home
                </Button>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help?{' '}
                <a
                  href="mailto:support@midora.ai"
                  className="text-purple-600 hover:text-purple-700 font-medium underline underline-offset-2"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
