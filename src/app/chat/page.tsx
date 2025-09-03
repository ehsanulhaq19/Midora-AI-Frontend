'use client'

import { useEffect, useState } from 'react'

export default function ChatPage() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center space-y-8">
          {/* Main Title */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
              Midora AI
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto">
              Your intelligent companion for the future
            </p>
          </div>

          {/* Simple Welcome Steps */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Welcome to Midora AI', icon: '👋' },
              { title: 'AI-Powered Experience', icon: '🚀' },
              { title: 'Advanced Features', icon: '✨' },
              { title: 'Ready to Serve', icon: '🤖' },
              { title: 'Coming Soon', icon: '⏳' }
            ].map((step, index) => (
              <div
                key={index}
                className={`
                  p-6 rounded-2xl border-2 transition-all duration-500
                  ${index <= currentStep 
                    ? 'border-primary-200 bg-white shadow-lg' 
                    : 'border-neutral-200 bg-neutral-50 opacity-50'
                  }
                `}
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-neutral-600">
                  Step {index + 1} of the welcome sequence
                </p>
              </div>
            ))}
          </div>

          {/* Completion Message */}
          {currentStep >= 4 && (
            <div className="mt-12 p-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl text-white shadow-xl">
              <h2 className="text-2xl font-bold mb-2">🎉 Welcome Complete!</h2>
              <p className="text-lg opacity-90">
                You're all set! Our AI features will be launching soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
