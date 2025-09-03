'use client'

import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { useState } from 'react'

export default function AuthDemoPage() {
  const [isLogin, setIsLogin] = useState(true)

  const handleLogin = (credentials: { email: string; password: string }) => {
    console.log('Login attempt:', credentials)
  }

  const handleGoogleLogin = () => {
    console.log('Google login attempt')
  }

  const handleSignup = (data: { email: string; password: string; confirmPassword: string; name: string }) => {
    console.log('Signup attempt:', data)
  }

  const handleGoogleSignup = () => {
    console.log('Google signup attempt')
  }

  const handleSignupClick = () => {
    setIsLogin(false)
  }

  const handleLoginClick = () => {
    setIsLogin(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toggle Buttons */}
      <div className="bg-white py-6">
        <div className="max-w-md mx-auto">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Signup
            </button>
          </div>
        </div>
      </div>

      {/* Form Display */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            {isLogin ? (
              <LoginForm
                onLogin={handleLogin}
                onGoogleLogin={handleGoogleLogin}
                onSignupClick={handleSignupClick}
              />
            ) : (
              <SignupForm
                onSignup={handleSignup}
                onGoogleSignup={handleGoogleSignup}
                onLoginClick={handleLoginClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Design Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Design Features
            </h2>
            <p className="text-lg text-gray-600">
              Clean two-column layout with automatic slider effect
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Two-Column Layout</h3>
              <p className="text-gray-600">Form on left (white), simple text slider on right (light purple)</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Text-Only Slider</h3>
              <p className="text-gray-600">Simple textual content with automatic hide/show transitions every 4 seconds</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Minimalist Design</h3>
              <p className="text-gray-600">No icons, logos, or headings - just clean text content with smooth transitions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
