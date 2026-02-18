'use client'

import React from 'react'
import { FileUpload } from '@/icons'
import { t } from '@/i18n'

interface DragDropOverlayProps {
  isVisible: boolean
  className?: string
}

export const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ isVisible, className = '' }) => {
  if (!isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 bg-black/40 flex items-center justify-center ${className}`}>
      <div className="bg-[color:var(--tokens-color-surface-surface-primary)] rounded-[var(--premitives-corner-radius-corner-radius-3)] p-8 flex flex-col items-center gap-4 border-2 border-dashed border-[color:var(--tokens-color-border-border-brand)] shadow-lg">
        <FileUpload className="w-16 h-16 text-[color:var(--tokens-color-text-text-brand)]" />
        <p className="app-text-lg app-text-primary font-medium">
          {t('common.fileUpload.dropHere')}
        </p>
      </div>
    </div>
  )
}
