'use client'

import React from 'react'
import { t } from '@/i18n'

interface MessageVersionNavigationProps {
  hasMultipleVersions: boolean
  currentVersionIndex: number
  totalVersions: number
  canGoPrevious: boolean
  canGoNext: boolean
  onPrevious: () => void
  onNext: () => void
}

export const MessageVersionNavigation: React.FC<MessageVersionNavigationProps> = ({
  hasMultipleVersions,
  currentVersionIndex,
  totalVersions,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext
}) => {
  if (!hasMultipleVersions) {
    return null
  }

  return (
    <div className="flex items-center gap-1 mr-2">
      <button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        className={`p-1 rounded text-xs ${
          canGoPrevious 
            ? 'text-[color:var(--tokens-color-text-text-primary)] hover:bg-gray-200' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
        aria-label={t('chat.previousVersion')}
      >
        &lt;
      </button>
      <span className="text-xs text-[color:var(--tokens-color-text-text-inactive-2)] px-1">
        {currentVersionIndex + 1}/{totalVersions}
      </span>
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`p-1 rounded text-xs ${
          canGoNext 
            ? 'text-[color:var(--tokens-color-text-text-primary)] hover:bg-gray-200' 
            : 'text-gray-400 cursor-not-allowed'
        }`}
        aria-label={t('chat.nextVersion')}
      >
        &gt;
      </button>
    </div>
  )
}
