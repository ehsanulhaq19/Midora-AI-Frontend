import { Button } from './Button'

interface ErrorDisplayProps {
  error: Error
  onReset: () => void
  title?: string
  message?: string
}

export function ErrorDisplay({ error, onReset, title, message }: ErrorDisplayProps) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold text-secondary-900 mb-4">
        {title || 'Something went wrong!'}
      </h1>
      
      <p className="text-secondary-600 mb-6 max-w-md mx-auto">
        {message || 'We encountered an unexpected error. Please try again.'}
      </p>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mb-6 text-left max-w-md mx-auto">
          <summary className="cursor-pointer text-sm text-secondary-500 hover:text-secondary-700">
            Error details (development only)
          </summary>
          <pre className="mt-2 p-3 bg-secondary-100 rounded text-xs text-secondary-700 overflow-auto">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        </details>
      )}
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onReset} variant="primary">
          Try Again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go Home
        </Button>
      </div>
    </div>
  )
}
