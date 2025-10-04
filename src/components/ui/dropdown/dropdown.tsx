'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowDownSm } from '@/icons'

interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  image?: string
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  icon?: React.ReactNode
  modeText?: string
  openUpward?: boolean
  variant?: 'default' | 'model-selector'
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  className = '',
  disabled = false,
  icon,
  modeText,
  openUpward = false,
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const getButtonClasses = () => {
    if (variant === 'model-selector') {
      return `
        inline-flex items-center justify-between w-full px-3 py-2 
        bg-[color:var(--tokens-color-surface-surface-primary)] 
        border border-[color:var(--tokens-color-border-border-subtle)] 
        rounded-[var(--premitives-corner-radius-corner-radius-2)]
        text-left cursor-pointer transition-colors duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[color:var(--tokens-color-surface-surface-secondary)]'}
      `
    }
    
    return `
      inline-flex items-center justify-between w-full px-3 py-2 
      bg-[color:var(--tokens-color-surface-surface-button-pressed)] 
      border border-transparent rounded-[var(--premitives-corner-radius-corner-radius-2)]
      text-left cursor-pointer transition-colors duration-200 h-[25px]
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'}
    `
  }

  const getDropdownClasses = () => {
    const baseClasses = "absolute left-0 right-0 mt-1 bg-[color:var(--tokens-color-surface-surface-button-pressed)] border border-[color:var(--tokens-color-border-border-subtle)] rounded-[var(--premitives-corner-radius-corner-radius-2)] shadow-lg z-50 max-h-60 overflow-y-auto"
    
    if (openUpward) {
      return `${baseClasses} bottom-full mb-1`
    }
    
    return `${baseClasses} top-full`
  }

  const getButtonContent = () => {
    if (variant === 'model-selector') {
      return (
        <div className="flex items-center gap-2 mr-[10px]">
          <span className="font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
            {selectedOption?.label || placeholder}
          </span>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-2 mr-[10px]">
        {modeText && (
          <span className="font-text-small font-[number:var(--text-small-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
            {modeText}
          </span>
        )}
        {selectedOption?.icon && (
          <div className="flex-shrink-0">
            {selectedOption.icon}
          </div>
        )}
        {selectedOption?.image && (
          <img
            src={selectedOption.image}
            alt={selectedOption.label}
            className="w-4 h-4 rounded flex-shrink-0"
          />
        )}
        <span className="font-text-small font-[number:var(--text-small-font-weight)] text-tokens-color-text-text-neutral text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
          {selectedOption?.label || placeholder}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className={getButtonClasses()}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        {getButtonContent()}
        <ArrowDownSm 
          color={variant === 'model-selector' ? "#6B4392" : "#FFFFFF"} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={getDropdownClasses()}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`
                w-full px-3 py-2 text-left flex items-center gap-2 
                hover:bg-[color:var(--tokens-color-surface-surface-secondary)]
                transition-colors duration-200
                ${option.value === value ? 'bg-[color:var(--tokens-color-surface-surface-secondary)]' : ''}
              `}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.icon && (
                <div className="flex-shrink-0">
                  {option.icon}
                </div>
              )}
              {option.image && (
                <img
                  src={option.image}
                  alt={option.label}
                  className="w-4 h-4 rounded flex-shrink-0"
                />
              )}
              <span className="font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-neutral)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)]">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
