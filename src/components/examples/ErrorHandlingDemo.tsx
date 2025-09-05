/**
 * Error Handling Demo Component
 * Demonstrates how the new error handling system works
 */

'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { processError, errorHandler } from '@/lib/error-handler'

export function ErrorHandlingDemo() {
  const [error, setError] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<string | null>(null)

  const simulateBackendError = (errorType: string) => {
    const backendError = {
      success: false,
      error_type: errorType,
      error_message: `Backend error: ${errorType}`,
      details: { timestamp: new Date().toISOString() }
    }

    const processedError = processError(backendError, 400)
    setError(processedError.message)
    setErrorType(processedError.type)
  }

  const simulateNetworkError = () => {
    const networkError = new Error('Failed to fetch')
    const processedError = processError(networkError)
    setError(processedError.message)
    setErrorType(processedError.type)
  }

  const simulateTimeoutError = () => {
    const timeoutError = new Error('Request timeout')
    const processedError = processError(timeoutError)
    setError(processedError.message)
    setErrorType(processedError.type)
  }

  const simulateGenericError = () => {
    const genericError = 'Something went wrong'
    const processedError = processError(genericError, 500)
    setError(processedError.message)
    setErrorType(processedError.type)
  }

  const clearError = () => {
    setError(null)
    setErrorType(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Error Handling System Demo</CardTitle>
          <p className="text-gray-600">
            This demo shows how the new error handling system processes different types of errors
            and converts them into user-friendly messages.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-red-800">Error Message:</h4>
                  <p className="text-red-700 mt-1">{error}</p>
                  <p className="text-sm text-red-600 mt-2">Type: {errorType}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Demo Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => simulateBackendError('INVALID_CREDENTIALS')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <span className="font-medium">Invalid Credentials</span>
              <span className="text-xs text-gray-500">Backend Error</span>
            </Button>

            <Button
              onClick={() => simulateBackendError('EMAIL_ALREADY_REGISTERED')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <span className="font-medium">Email Exists</span>
              <span className="text-xs text-gray-500">Backend Error</span>
            </Button>

            <Button
              onClick={() => simulateBackendError('PLAN_LIMIT_EXCEEDED')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <span className="font-medium">Plan Limit</span>
              <span className="text-xs text-gray-500">Backend Error</span>
            </Button>

            <Button
              onClick={() => simulateBackendError('AI_SERVICE_UNAVAILABLE')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <span className="font-medium">AI Service Down</span>
              <span className="text-xs text-gray-500">Backend Error</span>
            </Button>

            <Button
              onClick={simulateNetworkError}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <span className="font-medium">Network Error</span>
              <span className="text-xs text-gray-500">Generic Error</span>
            </Button>

            <Button
              onClick={simulateTimeoutError}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <span className="font-medium">Timeout</span>
              <span className="text-xs text-gray-500">Generic Error</span>
            </Button>

            <Button
              onClick={simulateGenericError}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <span className="font-medium">Generic Error</span>
              <span className="text-xs text-gray-500">String Error</span>
            </Button>

            <Button
              onClick={() => simulateBackendError('UNKNOWN_ERROR_TYPE')}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <span className="font-medium">Unknown Type</span>
              <span className="text-xs text-gray-500">Fallback</span>
            </Button>
          </div>

          {/* Explanation */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Backend Errors:</strong> Processed using error_type to get user-friendly message</li>
              <li>• <strong>Network Errors:</strong> Automatically detected and converted to user-friendly message</li>
              <li>• <strong>Timeout Errors:</strong> Detected and handled with appropriate message</li>
              <li>• <strong>Unknown Types:</strong> Fall back to generic error message</li>
              <li>• <strong>All Messages:</strong> Localized and user-friendly, not technical</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorHandlingDemo
