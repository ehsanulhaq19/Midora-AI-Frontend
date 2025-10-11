'use client'

import React, { useState } from 'react'
import { ArrowUpSm, Plus01_5, Microphone, Filters } from '@/icons'
import { IconButton } from '@/components/ui/buttons'
import { TextareaInput } from '@/components/ui/inputs'
import { Dropdown } from '@/components/ui'
import { useAIModels } from '@/hooks'
import { t } from '@/i18n'

interface MessageInputProps {
  onSend: (message: string, modelUuid?: string) => void
  isStreaming?: boolean
  className?: string
  textAreaClassName?: string
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend, isStreaming = false, className = '', textAreaClassName = '' }) => {
  const [message, setMessage] = useState('')
  // Using t function from i18n
  const {
    selectedProviderModels,
    selectedModel,
    isAutoMode,
    selectModel
  } = useAIModels()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isStreaming) {
      const modelUuid = isAutoMode ? undefined : selectedModel?.uuid
      onSend(message, modelUuid)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleModelChange = (modelUuid: string) => {
    const model = selectedProviderModels.find(m => m.uuid === modelUuid)
    selectModel(model || null)
  }

  const getModelOptions = () => {
    return selectedProviderModels.map(model => ({
      value: model.uuid,
      label: model.model_name
    }))
  }

  return (
    <div className={`relative w-full max-w-[698px] max-h-[152px] mx-auto bg-[color:var(--tokens-color-surface-surface-neutral)] rounded-[var(--premitives-corner-radius-corner-radius-3)] min-h-[120px] ${className}`}>
      <form onSubmit={handleSubmit} className="relative w-full h-full">
        {/* Textarea covering the whole component */}
        <TextareaInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isStreaming ? t('chat.waitingForResponse') : t('chat.howCanIHelp')}
          className={`w-full border-none h-full px-4 pt-4 pb-16 text-lg lg:text-xl font-text-large font-[number:var(--text-large-font-weight)] text-[color:var(--tokens-color-text-text-primary)] placeholder-[color:var(--tokens-color-text-text-brand)] [font-style:var(--text-large-font-style)] min-h-[120px] max-h-[200px] resize-none ${textAreaClassName}`}
          variant="outline"
          disabled={isStreaming}
        />
        
        {/* Bottom buttons container */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
          {/* Left side buttons */}
          <div className="flex items-center gap-[13px]">
            <IconButton
              type="button"
              variant="outline"
              size="lg"
              icon={<Plus01_5 className="w-5 h-5" color="#6B4392" />}
              aria-label="Add attachment"
              className="border-[color:var(--tokens-color-border-border-subtle)] bg-[#F4F5F5]"
              disabled={isStreaming}
            />

            <IconButton
              type="button"
              variant="outline"
              size="lg"
              icon={<Filters className="w-7 h-7" color="#6B4392" />}
              aria-label="Voice input"
              className="border-[color:var(--tokens-color-border-border-subtle)] bg-[#F4F5F5]"
              disabled={isStreaming}
            />
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
                className="min-w-[80px]"
                openUpward={true}
                variant="model-selector"
                disabled={isStreaming}
              />
            )}
            
            <IconButton
              type="submit"
              disabled={!message.trim() || isStreaming}
              variant="primary"
              size="lg"
              icon={<ArrowUpSm className="w-6 h-6" color="white" />}
              aria-label={isStreaming ? t('chat.waitingForResponse') : t('chat.sendMessage')}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
