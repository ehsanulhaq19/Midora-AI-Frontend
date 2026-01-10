'use client'

import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { Copy, CheckBroken } from '@/icons'
import { IconButton } from '@/components/ui/buttons'
import { Spinner } from '@/components/ui/loaders'
import { Tooltip } from '@/components/ui/tooltip'
import { t } from '@/i18n'
import { MarkdownRenderer } from '@/components/markdown'
import { markdownToTextSync, markdownToHtmlSync } from '@/lib/markdown-utils'
import { useTheme } from '@/hooks/use-theme'
import { MessageVersionNavigation } from './message-version-navigation'

interface MessageItem {
  content: string
  uuid: string
  sender: {
    email: string
    first_name: string
    last_name: string
    uuid: string
    username: string
    is_active: boolean
    is_verified: boolean
    is_onboarded: boolean
    meta_data?: Record<string, any> | null
    profile_picture?: string | null
    language?: string | null
  } | null
  model_name?: string | null
  linked_files?: any[]
  created_at: string
  updated_at?: string | null
}

interface MessageGroup {
  type: 'single_message' | 'multi_message'
  messages: MessageItem[]
  parent_message_uuid: string | null
  sender: any | null
}

interface TransformedMessage extends MessageItem {
  versions?: MessageItem[]
  currentVersionIndex?: number
}

interface PublicConversationContainerProps {
  messages: TransformedMessage[] // Already transformed messages with versioning support
  isLoading: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
  currentPage: number
  totalPages: number
  className?: string
}

interface PublicMessageBubbleProps {
  message: MessageItem
  isUser: boolean
  textClassName?: string
  isLastMessage?: boolean
  totalVersions?: number
  currentVersionIndex?: number
  onVersionPrev?: () => void
  onVersionNext?: () => void
  onMarkdownLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>, href?: string) => void
}

const PublicMessageBubble: React.FC<PublicMessageBubbleProps> = ({
  message,
  isUser,
  textClassName = '',
  isLastMessage = false,
  totalVersions = 1,
  currentVersionIndex = 0,
  onVersionPrev,
  onVersionNext,
  onMarkdownLinkClick
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [isCopied, setIsCopied] = useState(false)

  // Get sender name - show for all messages
  const getSenderName = () => {
    if (message.sender) {
      const firstName = message.sender.first_name || ''
      const lastName = message.sender.last_name || ''
      const fullName = `${firstName} ${lastName}`.trim()
      return fullName || message.sender.username || 'User'
    }
    // If no sender info (AI message), return appropriate label
    return isUser ? null : 'Assistant'
  }

  const senderName = getSenderName()

  const handleCopy = async () => {
    if (isCopied) return

    try {
      if (isUser) {
        await navigator.clipboard.writeText(message.content)
      } else {
        const htmlContent = markdownToHtmlSync(message.content)
        const plainText = markdownToTextSync(message.content)

        const clipboardItems = [
          new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' })
          })
        ]

        await navigator.clipboard.write(clipboardItems)
      }

      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      try {
        const plainText = isUser ? message.content : markdownToTextSync(message.content)
        await navigator.clipboard.writeText(plainText)
        setIsCopied(true)
        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      } catch (fallbackErr) {
        console.error('Failed to copy text: ', fallbackErr)
      }
    }
  }

  // Check if message has multiple versions
  const hasMultipleVersions = totalVersions > 1
  const canGoPrevious = currentVersionIndex > 0
  const canGoNext = currentVersionIndex < totalVersions - 1

  return (
    <div className={`flex justify-start mb-6 px-4 message-bubble`}>
      <div className={`max-w-[75%]`}>
        {/* Always show sender name for non-user messages */}
        {senderName && (
          <div className="text-xs font-medium mb-1 text-[color:var(--tokens-color-text-text-secondary)]">
            {senderName}
          </div>
        )}

        <div
          className={`p-[6px] sm:p-[12px] rounded-lg break-words whitespace-pre-wrap ${textClassName} ${
            isUser
              ? `${isDark ? '' : 'bg-[#6B4392]/10'} ${isDark ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'} ${isDark ? '' : 'border border-[#6B4392]/20'}`
              : `${isDark ? 'text-white' : 'text-[color:var(--tokens-color-text-text-primary)]'} rounded-bl-sm`
          }`}
          style={isDark && isUser ? {
            backgroundColor: 'var(--tokens-color-surface-surface-card-default)'
          } : {}}
        >
          <div className="text-sm">
            <MarkdownRenderer
              content={message.content || ''}
              onLinkClick={onMarkdownLinkClick}
            />
          </div>
        </div>

        {/* Version Navigation and Copy Button */}
        <div className={`flex items-center gap-2 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {/* Version Navigation for messages with multiple versions */}
          {hasMultipleVersions && (
            <MessageVersionNavigation
              hasMultipleVersions={hasMultipleVersions}
              currentVersionIndex={currentVersionIndex}
              totalVersions={totalVersions}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              onPrevious={onVersionPrev || (() => {})}
              onNext={onVersionNext || (() => {})}
            />
          )}

          <div className='flex items-center gap-2'>
            {/* Copy Button */}
            <Tooltip content={isCopied ? t('chat.copied') : t('chat.copyMessage')}>
              <IconButton
                variant="outline"
                size="sm"
                icon={isCopied ? <CheckBroken className="w-4 h-4" /> : <Copy className="w-4 h-5" />}
                onClick={handleCopy}
                disabled={isCopied}
                aria-label={isCopied ? t('chat.copied') : t('chat.copyMessage')}
                className={!isUser ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export const PublicConversationContainer: React.FC<PublicConversationContainerProps> = ({
  messages,
  isLoading,
  isLoadingMore,
  onLoadMore,
  currentPage,
  totalPages,
  className = ''
}) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isLoadingMoreRef = useRef(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  
  // Messages are already transformed by the API with versioning support
  // No additional transformation needed - they're ready to display
  // Track current version being displayed for each message (by message uuid)
  const [currentVersionIndices, setCurrentVersionIndices] = useState<Record<string, number>>({})
  const hasInitializedRef = useRef(false)
  const userScrolledRef = useRef(false)

  const scrollToBottom = useCallback((instant: boolean = false) => {
    if (messagesContainerRef.current) {
      if (instant) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    const threshold = 50 // Allow some tolerance for scroll detection

    // Trigger load more when user scrolls to top (within threshold) and there are more pages
    // Don't load if already loading more or if we're on the last page
    if (scrollTop <= threshold && !isLoadingMoreRef.current && currentPage < totalPages) {
      isLoadingMoreRef.current = true
      onLoadMore()
    }
  }, [currentPage, totalPages, onLoadMore])

  // Reset loading flag when isLoadingMore changes
  useEffect(() => {
    if (!isLoadingMore) {
      isLoadingMoreRef.current = false
    }
  }, [isLoadingMore])

  // Only scroll to bottom on initial load, not when loading more messages
  useEffect(() => {
    if (!hasInitializedRef.current && messages.length > 0) {
      hasInitializedRef.current = true
      scrollToBottom(true) // Scroll to bottom on first render
    }
  }, [])

  if (isLoading) {
    return (
      <div className={`flex-1 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-[color:var(--tokens-color-text-text-primary)] mt-4">
            {t('chat.loadingConversation')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-row relative ${className}`} style={{ height: 'calc(100vh - 300px)' }}>
      <div
        className="flex-1 overflow-hidden flex flex-col relative w-full"
        style={{ height: '100%' }}
      >
        {/* Messages container */}
        <div
          ref={messagesContainerRef}
          className={`flex-1 overflow-y-auto p-6 space-y-2 relative z-0 transition-colors duration-300 ${
            isDark ? '' : 'bg-[color:var(--tokens-color-surface-surface-primary)]'
          }`}
          style={{ minHeight: 0 }}
          onScroll={handleScroll}
        >
          <div className="max-w-[808px] mx-auto w-full">
            {/* Top loader for loading more messages */}
            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2 text-[color:var(--tokens-color-text-text-inactive-2)]">
                  <Spinner size="sm" />
                  <span className="text-sm">{t('chat.loadingMoreMessages')}</span>
                </div>
              </div>
            )}

            {/* Messages - already sorted by created_at (oldest first) */}
            {messages && messages.length > 0 ? (
              messages.map((message, index) => {
                // Check if this message has versions (multi-message)
                const hasVersions = message.versions && message.versions.length > 1
                const totalVersions = message.versions?.length || 1
                const currentVersionIndex = currentVersionIndices[message.uuid] ?? (message.currentVersionIndex || 0)
                
                // Get the message to display (either current version or the message itself)
                const displayMessage = hasVersions && message.versions
                  ? message.versions[currentVersionIndex]
                  : message
                
                const handleVersionPrev = () => {
                  // Go to previous (older) version
                  if (currentVersionIndex > 0) {
                    setCurrentVersionIndices(prev => ({
                      ...prev,
                      [message.uuid]: currentVersionIndex - 1
                    }))
                  }
                }
                
                const handleVersionNext = () => {
                  // Go to next (newer) version
                  if (currentVersionIndex < totalVersions - 1) {
                    setCurrentVersionIndices(prev => ({
                      ...prev,
                      [message.uuid]: currentVersionIndex + 1
                    }))
                  }
                }
                
                const isUserMessage = !!displayMessage?.sender
                const canGoPrevious = currentVersionIndex > 0
                const canGoNext = currentVersionIndex < totalVersions - 1
                
                return (
                  <div key={message.uuid} className="group">
                    <PublicMessageBubble
                      message={displayMessage}
                      isUser={isUserMessage}
                      textClassName={displayMessage?.sender ? '' : 'pb-0'}
                      isLastMessage={index === messages.length - 1}
                      totalVersions={totalVersions}
                      currentVersionIndex={currentVersionIndex}
                      onVersionPrev={hasVersions && canGoPrevious ? handleVersionPrev : undefined}
                      onVersionNext={hasVersions && canGoNext ? handleVersionNext : undefined}
                    />
                  </div>
                )
              })
            ) : (
              <div className="flex items-center justify-center h-full py-12">
                <p className="text-[color:var(--tokens-color-text-text-secondary)]">
                  {t('chat.noMessages')}
                </p>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </div>
  )
}

