'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowDownSm } from '@/icons'
import { useTheme } from '@/hooks/use-theme'
import { ActionButton } from './buttons/action-button'

interface DownloadOption {
  value: string
  label: string
  extension: string
}

interface DownloadDropdownProps {
  onDownload: (format: string) => void
  className?: string
}

const downloadOptions: DownloadOption[] = [
  { value: 'pdf', label: 'PDF', extension: '.pdf' },
  { value: 'excel', label: 'Excel', extension: '.xlsx' },
  { value: 'word', label: 'Word', extension: '.docx' },
  { value: 'text', label: 'Plain Text', extension: '.txt' },
]

export const DownloadDropdown: React.FC<DownloadDropdownProps> = ({
  onDownload,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleOptionClick = (format: string) => {
    onDownload(format)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <ActionButton
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        size="sm"
        className={`!px-3 !py-1.5 !text-sm !rounded-full !bg-[color:var(--tokens-color-surface-surface-tertiary)] hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)]`}
        aria-label="Download options"
        rightIcon={
          <ArrowDownSm
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            color="currentColor"
          />
        }
      >
        <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--h01-heading-01-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)] hidden lg:block">
          Download
        </span>
      </ActionButton>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-50 border border-[color:var(--tokens-color-border-border-subtle)]`}
          style={{
            backgroundColor: isDark ? 'var(--tokens-color-surface-surface-card-default)' : '#ffffff'
          }}
        >
          {downloadOptions.map((option) => (
            <div
              key={option.value}
              onMouseEnter={(e) => {
                if (isDark) {
                  e.currentTarget.style.backgroundColor = 'var(--tokens-color-surface-surface-card-hover)'
                } else {
                  e.currentTarget.style.backgroundColor = 'var(--tokens-color-surface-surface-tertiary)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              style={{
                backgroundColor: 'transparent',
              }}
            >
              <ActionButton
                type="button"
                onClick={() => handleOptionClick(option.value)}
                variant="ghost"
                size="sm"
                className="!w-full !px-4 !py-2.5 !text-left !justify-start !bg-transparent hover:!bg-transparent"
                fullWidth
              >
                <span className="font-h02-heading02 font-[number:var(--text-small-font-weight)] text-sm tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)]">
                  {option.label}
                </span>
              </ActionButton>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}