'use client'

import { Button } from './Button'

interface NotFoundDisplayProps {
  title?: string
  message?: string
  backUrl?: string
}

export function NotFoundDisplay({ title, message, backUrl }: NotFoundDisplayProps) {
  return (
    <div className="text-center">
      <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-12 h-12 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.665M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      
      <h1 className="text-2xl font-bold text-secondary-900 mb-4">
        {title || 'Page Not Found'}
      </h1>
      
      <p className="text-secondary-600 mb-6 max-w-md mx-auto">
        {message || "The page you're looking for doesn't exist or has been moved."}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button 
          onClick={() => window.history.back()} 
          variant="outline"
        >
          Go Back
        </Button>
        <Button 
          onClick={() => window.location.href = backUrl || '/'} 
          variant="primary"
        >
          Go Home
        </Button>
      </div>
    </div>
  )
}
