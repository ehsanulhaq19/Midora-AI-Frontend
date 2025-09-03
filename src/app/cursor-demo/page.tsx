'use client'

import { CursorToggle } from '@/components/ui/CursorToggle'
import { useCustomCursor } from '@/hooks/useCustomCursor'

export default function CursorDemoPage() {
  const { isEnabled, enable, disable } = useCustomCursor()

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 p-8">
      {/* Header with toggle */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary-900">
            Custom Cursor Demo
          </h1>
          <CursorToggle />
        </div>
        
        <p className="text-lg text-primary-700 mb-6">
          Experience the custom mouse cursor with a mid-size dot and round circle design.
          Use the toggle button to enable/disable the custom cursor.
        </p>
      </div>

      {/* Interactive demo sections */}
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Cursor Controls */}
        <section className="bg-white rounded-2xl p-8 shadow-lg border border-primary-100">
          <h2 className="text-2xl font-semibold text-primary-800 mb-6">
            Cursor Controls
          </h2>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={enable}
              disabled={isEnabled}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors"
            >
              Enable Custom Cursor
            </button>
            
            <button
              onClick={disable}
              disabled={!isEnabled}
              className="px-6 py-3 bg-neutral-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-700 transition-colors"
            >
              Disable Custom Cursor
            </button>
            
            <div className="flex items-center gap-3 px-4 py-2 bg-primary-50 rounded-lg">
              <span className="text-sm font-medium text-primary-700">Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isEnabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="bg-white rounded-2xl p-8 shadow-lg border border-primary-100">
          <h2 className="text-2xl font-semibold text-primary-800 mb-6">
            Interactive Elements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hover Effects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary-700">Hover Effects</h3>
              <div className="space-y-3">
                <div className="p-4 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors cursor-pointer">
                  Hover over me
                </div>
                <div className="p-4 bg-secondary-100 rounded-lg hover:bg-secondary-200 transition-colors cursor-pointer">
                  Another hover target
                </div>
              </div>
            </div>

            {/* Clickable Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-primary-700">Clickable Items</h3>
              <div className="space-y-3">
                <button className="w-full p-4 bg-accent-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Click me
                </button>
                <button className="w-full p-4 bg-accent-green text-white rounded-lg hover:bg-green-600 transition-colors">
                  Another button
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cursor Features */}
        <section className="bg-white rounded-2xl p-8 shadow-lg border border-primary-100">
          <h2 className="text-2xl font-semibold text-primary-800 mb-6">
            Cursor Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl">
              <div className="w-16 h-16 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full"></div>
              </div>
              <h3 className="font-semibold text-primary-800 mb-2">Mid-size Dot</h3>
              <p className="text-sm text-primary-600">8px purple dot with white border</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl">
              <div className="w-16 h-16 border-2 border-secondary-400 bg-secondary-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-6 h-6 bg-secondary-500 rounded-full"></div>
              </div>
              <h3 className="font-semibold text-secondary-800 mb-2">Round Circle</h3>
              <p className="text-sm text-secondary-600">32px circle with subtle border</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-accent-blue/10 to-accent-blue/20 rounded-xl">
              <div className="w-16 h-16 bg-accent-blue/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-accent-blue rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-semibold text-accent-blue mb-2">Smooth Animation</h3>
              <p className="text-sm text-accent-blue">150ms transitions with easing</p>
            </div>
          </div>
        </section>

        {/* Instructions */}
        <section className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
          <div className="space-y-3 text-primary-100">
            <p>• Move your mouse around to see the custom cursor in action</p>
            <p>• Use the toggle button to enable/disable the custom cursor</p>
            <p>• Hover over interactive elements to see cursor behavior</p>
            <p>• Your preference is automatically saved to localStorage</p>
            <p>• The cursor follows the platform's purple color scheme</p>
          </div>
        </section>
      </div>
    </div>
  )
}
