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
        'w-full px-4 py-3 rounded-[16px] border app-border-inactive transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed text-left cursor-pointer',
        isActive
          ? 'bg-[color:var(--tokens-color-surface-surface-conversation-canvas)] border border-[color:var(--tokens-color-text-text-brand)]'
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
              ' truncate mb-[5px]  font-h02-heading02 font-[number:var(--h05-heading05-font-weight)] text-[16px] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]',
              isActive 
                ? 'text-[color:var(--tokens-color-text-text-seconary)]' 
                : 'text-[color:var(--tokens-color-text-text-seconary)]'
            )}>
              {firstLine}
            </div>
          )}
          {/* Content type tag */}
          {contentType && (
            <div className={cn(
              ' truncate font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--h01-heading-01-line-height)] whitespace-nowrap [font-style:var(--h02-heading02-font-style)]',
              isActive
                ? 'text-[color:var(--tokens-color-text-text-brand)]'
                : 'text-[color:var(--tokens-color-text-text-brand)]'
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

