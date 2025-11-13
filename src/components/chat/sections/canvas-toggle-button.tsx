'use client'

import React from 'react'
import { Expand } from '@/icons'
import { cn } from '@/lib/utils'
import { t } from '@/i18n'
import { getFirstLine } from '@/lib/content-utils'

interface CanvasToggleButtonProps {
  isCanvasOpen: boolean
  isActive: boolean
  onClick: () => void
  disabled?: boolean
  className?: string
  content?: string
}

export const CanvasToggleButton: React.FC<CanvasToggleButtonProps> = ({
  isCanvasOpen,
  isActive,
  onClick,
  disabled = false,
  className = '',
  content = ''
}) => {
  // Get first line of content for preview
  const firstLine = content ? getFirstLine(content, 60) : ''
  
  // Determine content type (Code, Text, etc.) based on content
  const getContentType = (content: string): string => {
    if (!content) return ''
    // Check if content contains code blocks
    if (content.includes('```') || content.match(/`[^`]+`/)) {
      return 'Code'
    }
    // Check if content looks like a title/heading
    if (content.match(/^#{1,6}\s+/)) {
      return 'Document'
    }
    return 'Text'
  }
  
  const contentType = content ? getContentType(content) : ''
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full px-4 py-3 rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-left cursor-pointer',
        isActive
          ? 'bg-[color:var(--tokens-color-surface-surface-tertiary)] border-2 border-[color:var(--tokens-color-text-text-brand)] shadow-md'
          : 'bg-gray-100 hover:bg-gray-200/80 border-2 border-transparent hover:border-gray-200 shadow-sm',
        className
      )}
      aria-label={t('chat.viewInCanvas')}
      aria-expanded={isCanvasOpen && isActive}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* First line - title/content preview */}
          {firstLine && (
            <div className={cn(
              'font-bold text-sm truncate mb-1.5',
              isActive 
                ? 'text-[color:var(--tokens-color-text-text-brand)]' 
                : 'text-gray-900'
            )}>
              {firstLine}
            </div>
          )}
          {/* Content type tag */}
          {contentType && (
            <div className={cn(
              'text-xs font-medium',
              isActive
                ? 'text-[color:var(--tokens-color-text-text-brand)]'
                : 'text-purple-600'
            )}>
              {contentType}
            </div>
          )}
        </div>
        {/* Expand icon - only show when not active */}
        {!isActive && (
          <div className="flex-shrink-0">
            <Expand className="w-4 h-4 text-gray-500" />
          </div>
        )}
      </div>
    </button>
  )
}

