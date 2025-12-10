'use client'

import React from 'react'
import { useTheme } from '@/hooks/use-theme'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  className = ''
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {label && (
        <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-inactive-2)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-brand)] focus:ring-offset-2 ${
          checked
            ? isDark
              ? ''
              : 'bg-[color:var(--premitives-color-dropdown-icon)]'
            : isDark
              ? ''
              : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={isDark ? {
          backgroundColor: checked 
            ? 'rgba(40, 199, 162, 0.2)' 
            : 'rgba(255, 255, 255, 0.2)'
        } : {}}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full ${isDark ? 'bg-[#30D5C8]' : 'bg-white'} bg-white transition-transform shadow-sm ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

