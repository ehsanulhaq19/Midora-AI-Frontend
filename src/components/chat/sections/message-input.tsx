'use client'

import React, { useState } from 'react'
import { ArrowUpSm, Plus01_5, Microphone, Filters } from '@/icons'
import { IconButton } from '@/components/ui/buttons'
import { TextareaInput } from '@/components/ui/inputs'
import { t } from '@/i18n'

interface MessageInputProps {
  onSend: (message: string) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="relative w-full bg-[color:var(--tokens-color-surface-surface-neutral)] rounded-[var(--premitives-corner-radius-corner-radius-3)] min-h-[120px]">
      <form onSubmit={handleSubmit} className="relative w-full h-full">
        {/* Textarea covering the whole component */}
        <TextareaInput
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('chat.howCanIHelp')}
          className="w-full border-none h-full px-4 pt-4 pb-16 text-lg lg:text-xl font-text-large font-[number:var(--text-large-font-weight)] text-[color:var(--tokens-color-text-text-primary)] placeholder-[color:var(--tokens-color-text-text-brand)] [font-style:var(--text-large-font-style)] min-h-[120px] max-h-[200px] resize-none"
          variant="outline"
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
              className="border-[color:var(--tokens-color-border-border-subtle)]"
            />

            <IconButton
              type="button"
              variant="outline"
              size="lg"
              icon={<Filters className="w-7 h-7" color="#6B4392" />}
              aria-label="Voice input"
              className="border-[color:var(--tokens-color-border-border-subtle)]"
            />
          </div>

          {/* Right side button */}
          <IconButton
            type="submit"
            disabled={!message.trim()}
            variant="primary"
            size="lg"
            icon={<ArrowUpSm className="w-6 h-6" color="white" />}
            aria-label="Send message"
          />
        </div>
      </form>
    </div>
  )
}
