'use client'

import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react'
import { ArrowUpSm, Plus01_5, Microphone, Filters, FileUpload, Pencil } from '@/icons'
import { IconButton } from '@/components/ui/buttons'
import { TextareaInput } from '@/components/ui/inputs'
import { Dropdown } from '@/components/ui'
import { FilePreview } from '@/components/ui/file-preview'
import { useAIModels, useFileUpload, useToast } from '@/hooks'
import { useTheme } from '@/hooks/use-theme'
import { cn } from '@/lib/utils'
import { t } from '@/i18n'
import { useConversation } from '@/hooks/use-conversation'
import { ConversationLinkModal } from '@/components/chat/sections'

interface MessageInputProps {
  onSend: (message: string, modelUuid?: string, fileUuids?: string[], uploadedFiles?: any[]) => void
  isStreaming?: boolean
  className?: string
  textAreaClassName?: string
  onFilesChange?: (hasFiles: boolean) => void
  placeholder?: string
  disabled?: boolean
  disabledMessage?: string
}

export interface MessageInputHandle {
  uploadFile: (file: File) => Promise<void>
  validateFile: (file: File) => { isValid: boolean; error?: string }
}

export const MessageInput = forwardRef<MessageInputHandle, MessageInputProps>(({ onSend, isStreaming = false, className = '', textAreaClassName = '', onFilesChange, placeholder, disabled = false, disabledMessage }, ref) => {
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { error: showErrorToast, info: showInfoToast } = useToast()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  // Using t function from i18n
  const {
    selectedProviderModels,
    selectedModel,
    isAutoMode,
    selectModel
  } = useAIModels()

  const {
    files,
    isUploading,
    uploadFile,
    removeFile,
    clearFiles,
    validateFile
  } = useFileUpload()

  // Expose upload functions to parent via ref
  useImperativeHandle(ref, () => ({
    uploadFile,
    validateFile
  }), [uploadFile, validateFile])

  // Notify parent when files change
  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(files.length > 0)
    }
  }, [files.length, onFilesChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled) {
      if (disabledMessage) {
        showInfoToast('Credits Exhausted', disabledMessage)
      }
      return
    }
    // Require text message - if files are uploaded, text is still required
    if (message.trim() && !isStreaming && !isUploading) {
      const modelUuid = isAutoMode ? undefined : selectedModel?.uuid
      const fileUuids = files.map(f => f.uuid)
      onSend(message, modelUuid, fileUuids, files)
      setMessage('')
      clearFiles() // Clear files after sending message
    } else if (files.length > 0 && !message.trim()) {
      // Show error toast when trying to send with files but no text
      showInfoToast(
        'Message Required',
        'Please enter a message explaining what you want to do with the attached file(s).'
      )
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isStreaming && !isUploading) {
      const hasMessage = !!message.trim()
      const hasFiles = files.length > 0

      // When there is no message and no files, do nothing (no new line, no send)
      if (!hasMessage && !hasFiles) {
        e.preventDefault()
        return
      }

      // Prevent sending if files are uploaded but no text is entered
      if (hasFiles && !hasMessage) {
        e.preventDefault()
        showInfoToast(
          'Message Required',
          'Please enter a message explaining what you want to do with the attached file(s).'
        )
        return
      }

      // Only allow sending if there's text
      if (hasMessage) {
        e.preventDefault()
        handleSubmit(e)
      }
    }
  }

  const handleModelChange = (modelUuid: string) => {
    const model = selectedProviderModels.find(m => m.uuid === modelUuid)
    selectModel(model || null)
  }

  const getModelOptions = () => {
    return selectedProviderModels.map(model => ({
      value: model.uuid,
      label: model.model_name,
      disabled: model.available === false,
      disabledHint: model.available === false
        ? "You have exceeded your limit to use this model"
        : undefined,
      modelType: model.ai_model_type || undefined
    }))
  }

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return

    for (const file of Array.from(selectedFiles)) {
      try {
        await uploadFile(file)
      } catch (error) {
        showErrorToast(
          'Upload Failed',
          error instanceof Error ? error.message : t('common.fileUpload.uploadFailed')
        )
      }
    }
  }

  const handleAddAttachment = () => {
    fileInputRef.current?.click()
  }

  const { currentConversation } = useConversation()
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files)
    // Reset input value to allow selecting the same file again
    e.target.value = ''
  }

  return (
    <div className={`relative w-full max-w-[698px] mx-auto bg-[color:var(--tokens-color-surface-surface-darkgray-50)] rounded-[var(--premitives-corner-radius-corner-radius-3)] min-h-[120px] max-h-[400px] ${className} ${disabled ? 'opacity-60' : ''}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />
      
      <form onSubmit={handleSubmit} className="relative w-full h-full flex flex-col">
        {/* Disabled message overlay */}
        {disabled && disabledMessage && (
          <div className="absolute inset-0 bg-[color:var(--tokens-color-surface-surface-darkgray-50)]/80 rounded-[var(--premitives-corner-radius-corner-radius-3)] flex items-center justify-center z-20">
            <div className="text-center px-4">
              <p className="text-sm text-[color:var(--tokens-color-text-text-primary)] font-medium mb-2">
                {disabledMessage}
              </p>
              <button
                type="button"
                onClick={() => window.location.href = '/pricing'}
                className="text-sm text-[color:var(--tokens-color-text-text-brand)] hover:underline"
              >
                Upgrade Subscription
              </button>
            </div>
          </div>
        )}
        
        {/* Textarea covering the main area */}
        <div className="relative flex-1">
          <TextareaInput
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={!(disabled && disabledMessage) && (placeholder || (isStreaming ? t('chat.waitingForResponse') : t('chat.howCanIHelp')))}
            className={`w-full border-none h-full px-4 pt-4 pb-16 text-lg lg:text-xl font-h02-heading02 font-[number:var(--text-large-font-weight)] text-[color:var(--tokens-color-text-text-primary)] placeholder-[color:var(--tokens-color-text-text-brand)] [font-style:var(--text-large-font-style)] min-h-[120px] max-h-[200px] resize-none ${textAreaClassName}`}
            variant="outline"
            disabled={isStreaming || isUploading || disabled}
          />
          
          {/* Bottom buttons container - positioned relative to textarea */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
            {/* Left side buttons */}
            <div className="flex items-center gap-[13px]">
              <div className="relative">
                <IconButton
                  type="button"
                  variant="outline"
                  size="md"
                  icon={<Plus01_5 className="w-5 h-5" color="currentColor" />}
                  aria-label={t('chat.uploadFiles')}
                  className="border-[color:var(--tokens-color-border-border-subtle)] message-input-icon-button"
                  style={{
                    backgroundColor: isDark ? 'var(--tokens-color-surface-surface-card-default)' : '#F4F5F5'
                  }}
                  disabled={isStreaming || isUploading || disabled}
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                />

                {showOptionsMenu && (
                  <div className={cn(
                    "absolute bottom-10 right-0 z-50 w-[180px] border rounded shadow-md py-1 transition-colors duration-200",
                    isDark 
                      ? 'bg-[color:var(--tokens-color-surface-surface-card-default)] border-[color:var(--tokens-color-border-border-subtle)]'
                      : 'bg-white border-[color:var(--tokens-color-border-border-subtle)]'
                  )}>
                    <button
                      className={cn(
                        "w-full text-left px-3 py-2 flex items-center gap-2 transition-colors duration-150",
                        isDark
                          ? 'text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]'
                          : 'text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]'
                      )}
                      onClick={() => {
                        setShowOptionsMenu(false)
                        handleAddAttachment()
                      }}
                    >
                      <FileUpload className="w-4 h-4" />
                      <span>{t('chat.uploadFiles')}</span>
                    </button>
                    <button
                      className={cn(
                        "w-full text-left px-3 py-2 flex items-center gap-2 transition-colors duration-150",
                        (!currentConversation || !currentConversation.uuid) 
                          ? 'opacity-50 cursor-not-allowed' 
                          : isDark
                            ? 'text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]'
                            : 'text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]'
                      )}
                      onClick={() => {
                        if (!currentConversation || !currentConversation.uuid) return
                        setShowOptionsMenu(false)
                        setShowLinkModal(true)
                      }}
                      disabled={!currentConversation || !currentConversation.uuid}
                    >
                      <Pencil className="w-4 h-4" />
                      <span>{t('chat.linkChats')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* <IconButton
                type="button"
                variant="outline"
                size="md"
                icon={<Filters className="" color="currentColor" />}
                aria-label="Voice input"
                className="border-[color:var(--tokens-color-border-border-subtle)] message-input-icon-button"
                style={{
                  backgroundColor: '#F4F5F5'
                }}
                disabled={isStreaming || isUploading}
              /> */}
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-[13px]">
              {/* Models dropdown - only show when not in auto mode and provider is selected */}
              {!isAutoMode && selectedProviderModels.length > 0 && (
                <Dropdown
                  options={getModelOptions()}
                  value={selectedModel?.uuid || ''}
                  onChange={handleModelChange}
                  placeholder={t('chat.selectModel')}
                  className="min-w-[150px]"
                  openUpward={true}
                  variant="model-selector"
                  disabled={isStreaming || isUploading || disabled}
                />
              )}
              
              <IconButton
                type="submit"
                disabled={!message.trim() || isStreaming || isUploading || disabled}
                variant="primary"
                size="md"
                icon={<ArrowUpSm className="w-6 h-6" color="white" />}
                aria-label={isStreaming ? t('chat.waitingForResponse') : t('chat.sendMessage')}
              />
            </div>
          </div>
        </div>
        
        {/* File previews section - bottom scrollable area */}
        {files.length > 0 && (
          <div className="border-t border-[color:var(--tokens-color-border-border-subtle)] p-3 max-h-[200px] overflow-y-auto">
            <div className="flex gap-3 overflow-x-auto overflow-y-hidden pb-2 file-preview-scroll">
              {files.map((file) => (
                <FilePreview
                  key={file.uuid}
                  file={file}
                  onRemove={removeFile}
                />
              ))}
            </div>
          </div>
        )}
        {/* Link conversation modal */}
        {showLinkModal && currentConversation && currentConversation.uuid && (
          <ConversationLinkModal
            isOpen={showLinkModal}
            onClose={() => setShowLinkModal(false)}
            conversationUuid={currentConversation.uuid}
          />
        )}
      </form>
    </div>
  )
})

MessageInput.displayName = 'MessageInput'
