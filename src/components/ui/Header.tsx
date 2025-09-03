'use client'

import { Button } from './Button'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary-950 border-b border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Text Only */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">midora.ai</span>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary-950">
              Log in
            </Button>
            <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-primary-950">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
