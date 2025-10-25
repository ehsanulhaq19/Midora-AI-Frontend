'use client'

import React, { useState, useCallback } from 'react'
import { Menu } from '@/icons'
import { ModelSelection } from './model-selection'
import { MessageInput } from './message-input'
import { DragDropOverlay } from '@/components/ui/drag-drop-overlay'
import { LogoOnly } from '@/icons'
import { t, tWithParams } from '@/i18n'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import { useFileUpload, useToast } from '@/hooks'

interface ChatInterfaceProps {
  onMenuClick: () => void
  onSendMessage: (message: string, modelUuid?: string, fileUuids?: string[], uploadedFiles?: any[]) => void
  isCompact?: boolean
  isStreaming?: boolean
  onFilesChange?: (hasFiles: boolean) => void
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onMenuClick, 
  onSendMessage,
  isCompact = false,
  isStreaming = false,
  onFilesChange
}) => {
  const { userName } = useAuthRedux()
  const [isDragOver, setIsDragOver] = useState(false)
  const { error: showErrorToast } = useToast()
  const { uploadFile, validateFile } = useFileUpload()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    for (const file of files) {
      const validation = validateFile(file)
      if (!validation.isValid) {
        showErrorToast(
          'Upload Failed',
          validation.error || t('common.fileUpload.uploadFailed')
        )
        continue
      }

      try {
        await uploadFile(file)
      } catch (error) {
        showErrorToast(
          'Upload Failed',
          error instanceof Error ? error.message : t('common.fileUpload.uploadFailed')
        )
      }
    }
  }, [validateFile, uploadFile, showErrorToast])

  if (isCompact) {
    return (
      <div className="w-full max-w-[808px] max-h-[106px] mx-auto p-4">
        <MessageInput onSend={onSendMessage} isStreaming={isStreaming} className="max-w-[808px]" textAreaClassName="!app-text-lg" onFilesChange={onFilesChange}/>
      </div>
    )
  }

  return (
    <div 
      className="flex flex-col items-center gap-[246px] px-4 lg:px-0 py-6 relative flex-1 grow min-h-screen"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DragDropOverlay isVisible={isDragOver} />
      
      {/* Header */}
      <div className="flex items-start justify-between relative w-full px-[28px]">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-[color:var(--tokens-color-surface-surface-secondary)] rounded transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <ModelSelection />
        </div>

        <div className="flex items-center gap-2">
          {/* <button className="hidden sm:inline-flex items-center justify-center gap-2 p-3 bg-[color:var(--premitives-color-brand-purple-1000)] rounded-[var(--premitives-corner-radius-corner-radius-2)] hover:bg-[color:var(--tokens-color-surface-surface-button-pressed)] transition-colors">
            <div className="relative w-fit mt-[-1.00px] font-h05-heading05 app-text-sm app-text-primary tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
              {t('chat.upgradeToPro')}
            </div>
          </button> */}
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex flex-col w-full max-w-[808px] items-center gap-6 relative flex-[0_0_auto] mx-auto">
        <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
          <div className="flex flex-col w-[37px] h-9 items-start gap-2.5 relative aspect-[1.02]">
            <LogoOnly className="relative self-stretch w-full mb-[-0.45px] aspect-[1.02]" />
          </div>
          <p className="relative flex items-center justify-center w-fit mt-[-1.00px] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--h02-heading02-font-size)] tracking-[var(--h02-heading02-letter-spacing)] leading-[var(--h02-heading02-line-height)] text-center [font-style:var(--h02-heading02-font-style)]">
            {tWithParams('chat.welcomeBack', { name: userName })}
          </p>
        </div>

        <MessageInput onSend={onSendMessage} isStreaming={isStreaming} onFilesChange={onFilesChange} />
      </div>
    </div>
  )
}
