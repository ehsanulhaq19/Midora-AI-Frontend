'use client'

import { useCustomCursor } from '@/hooks/useCustomCursor'
import { theme } from '@/lib/theme'

interface CursorToggleProps {
  className?: string
  showLabel?: boolean
}

export function CursorToggle({ className = '', showLabel = true }: CursorToggleProps) {
  const { isEnabled, toggle } = useCustomCursor()

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isEnabled
          ? 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
          : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus:ring-neutral-500'
      } ${className}`}
      title={isEnabled ? 'Disable custom cursor' : 'Enable custom cursor'}
    >
      {/* Cursor icon */}
      <div className="relative w-4 h-4">
        {isEnabled ? (
          <>
            {/* Custom cursor representation */}
            <div className="absolute inset-0 rounded-full border-2 border-white bg-primary-500" />
            <div className="absolute inset-1 rounded-full border border-primary-400/40 bg-primary-500/20" />
          </>
        ) : (
          <>
            {/* Default cursor representation */}
            <div className="absolute top-0 left-0 w-0 h-0 border-l-2 border-b-2 border-neutral-600 transform rotate-45" />
            <div className="absolute top-1 left-1 w-1 h-1 bg-neutral-600 rounded-full" />
          </>
        )}
      </div>
      
      {showLabel && (
        <span className="text-sm font-medium">
          {isEnabled ? 'Custom Cursor' : 'Default Cursor'}
        </span>
      )}
    </button>
  )
}
