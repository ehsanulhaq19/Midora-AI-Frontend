'use client'

import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useConversation } from '@/hooks/use-conversation'
import { Message, LinkedFile } from '@/api/conversation/types'
import { Copy, LogoOnly, CheckBroken, Regenerate } from '@/icons'
import { IconButton } from '@/components/ui/buttons'
import { Spinner } from '@/components/ui/loaders'
import { Tooltip } from '@/components/ui/tooltip'
import { t } from '@/i18n'
import { MarkdownRenderer } from '@/components/markdown'
import { markdownToTextSync } from '@/lib/markdown-utils'
import { useRegenerate } from '@/hooks/use-regenerate'
import './style.css'
import { useAuthRedux } from '@/hooks/use-auth-redux'
import { useAIModels } from '@/hooks/use-ai-models'
import { MessageVersionNavigation } from './message-version-navigation'
import { LinkedFilesPreview } from './linked-files-preview'

interface ConversationContainerProps {
  conversationUuid: string | null
  className?: string
}

interface MessageBubbleProps {
  message: Message
  isUser: boolean,
  textClassName?: string
  isLastMessage?: boolean
  conversationUuid?: string
  onRegenerate?: (messageUuid: string) => void
  isRegenerating?: boolean
  isStreaming?: boolean
  streamingContent?: string
  streamingMetadata?: {
    selected_model?: string;
    selected_provider?: string;
    query_category?: string;
    rank?: number;
    message_type?: string;
    linked_files?: Array<{
      uuid: string;
      filename: string;
      file_extension: string;
      file_type: string;
      file_size: number;
      storage_type: string;
    }>;
  }
  isThisMessageRegenerating?: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isUser, 
  textClassName = "",
  isLastMessage = false,
  conversationUuid,
  onRegenerate,
  isRegenerating = false,
  isStreaming = false,
  streamingContent = '',
  streamingMetadata = null,
  isThisMessageRegenerating = false
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const { switchMessageVersion } = useRegenerate()

  const handleCopy = async () => {
    if (isCopied) return // Prevent multiple copies while showing feedback
    
    try {
      // Convert markdown to plain text for copying
      const plainText = isUser ? message.content : markdownToTextSync(message.content)
      await navigator.clipboard.writeText(plainText)
      
      // Show feedback
      setIsCopied(true)
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleRegenerate = () => {
    if (onRegenerate && conversationUuid) {
      onRegenerate(message.uuid)
    }
  }

  const handleVersionNavigation = (direction: 'prev' | 'next') => {
    if (!message.versions || !conversationUuid) return
    
    const currentIndex = message.currentVersionIndex || 0
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1
    
    
    if (newIndex >= 0 && newIndex < message.versions.length) {
      switchMessageVersion(conversationUuid, message.uuid, newIndex)
    }
  }

  // Check if message has multiple versions
  const hasMultipleVersions = message.versions && message.versions.length > 1
  const currentVersionIndex = message.currentVersionIndex || 0
  const canGoPrevious = currentVersionIndex > 0
  const canGoNext = currentVersionIndex < (message.versions?.length || 1) - 1

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 px-4 message-blub`}>
      <div className={`max-w-[75%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`p-[12px] rounded-lg ${textClassName} ${
            isUser
              ? 'bg-[#6B4392]/10 text-[color:var(--tokens-color-text-text-primary)] border border-[#6B4392]/20'
              : 'text-[color:var(--tokens-color-text-text-primary)] rounded-bl-sm'
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm">{message.content}</p>
          ) : (
            <div className="text-sm">
              {isThisMessageRegenerating && isStreaming ? (
                <>
                  {!streamingContent && !message.content ? (
                    // Show loading animation before content arrives
                    <div className="flex items-center gap-3">
                      <div className="animate-spin" style={{ animation: 'spin 2s linear infinite' }}>
                        <LogoOnly className="w-6 h-6" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <MarkdownRenderer content={streamingContent || message.content} />
                      <StreamingCursor />
                    </>
                  )}
                </>
              ) : (
                <MarkdownRenderer content={message.content || ''} />
              )}
            </div>
          )}
        </div>

        {/* Linked Files Preview */}
        {message.linked_files && message.linked_files.length > 0 && (
          <LinkedFilesPreview linkedFiles={message.linked_files} isUser={isUser} />
        )}

        <div className="ml-2">
          {/* Display AI model name with copy button for AI messages */}
          {!isUser && message.model_name && !isThisMessageRegenerating && (
            <div className="flex items-center gap-1 pl-[3px]">
              <span className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                {message.model_name}
              </span>
            </div>
          )}
          
          {/* Display status messages during regeneration */}
          {!isUser && isThisMessageRegenerating && isStreaming && streamingMetadata?.message_type && (
            <div className="flex items-center gap-1 mt-1 pl-[3px]">
              <div className="w-2 h-2 bg-[color:var(--tokens-color-text-text-brand)] rounded-full animate-pulse"></div>
              <span className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                {streamingMetadata.message_type === 'thinking_through_query' && t('chat.thinking')}
                {streamingMetadata.message_type === 'evaluating_ai_options' && t('chat.evaluating')}
                {streamingMetadata.message_type === 'generating_response' && t('chat.generating')}
                {!['thinking_through_query', 'evaluating_ai_options', 'generating_response'].includes(streamingMetadata.message_type) && t('chat.typing')}
              </span>
            </div>
          )}
          
          <div className={`flex items-center gap-2 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            {/* Version Navigation for AI messages with multiple versions */}
            {!isUser && (
              <MessageVersionNavigation
                hasMultipleVersions={hasMultipleVersions}
                currentVersionIndex={currentVersionIndex}
                totalVersions={message.versions?.length || 1}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                onPrevious={() => handleVersionNavigation('prev')}
                onNext={() => handleVersionNavigation('next')}
              />
            )}

            <div>
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

              {/* Regenerate Button - only for AI messages that are the last message */}
              {!isUser && isLastMessage && onRegenerate && (
                <Tooltip content={t('chat.regenerateMessage')}>
                  <IconButton
                    variant="outline"
                    size="sm"
                    icon={<Regenerate className="w-4 h-5" />}
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                    aria-label={t('chat.regenerateMessage')}
                    className=""
                  />
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StreamingCursor: React.FC = () => {
  return (
    <span 
      className="inline-block w-0.5 h-4 bg-[color:var(--tokens-color-text-text-primary)] ml-1"
      style={{
        animation: 'blink 1s infinite'
      }}
    ></span>
  )
}

interface StreamingMessageProps {
  content: string
  messageType?: string
  selectedModel?: string
  linkedFiles?: LinkedFile[]
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({ content, messageType, selectedModel, linkedFiles }) => {
  const [isCopied, setIsCopied] = useState(false)
  const hasContent = content.length > 0
  
  // Get status message from i18n based on message_type
  const getStatusMessage = () => {
    if (messageType && t(`chat.aiStatus.${messageType}` as any)) {
      return t(`chat.aiStatus.${messageType}` as any)
    }
    return t('chat.typing')
  }

  const handleCopy = async () => {
    if (isCopied) return // Prevent multiple copies while showing feedback
    
    try {
      // Convert markdown to plain text for copying
      const plainText = markdownToTextSync(content)
      await navigator.clipboard.writeText(plainText)
      
      // Show feedback
      setIsCopied(true)
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }
  
  return (
    <div className="flex justify-start mb-6 px-4">
      <div className="max-w-[75%]">
        <div className="px-4 py-3 rounded-lg rounded-bl-sm bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] text-sm">
          {!hasContent ? (
            // Show loading animation before content arrives
            <div className="flex items-center gap-3">
              <div className="animate-spin" style={{ animation: 'spin 2s linear infinite' }}>
                <LogoOnly className="w-6 h-6" />
              </div>
            </div>
          ) : (
            // Show content with cursor when content is available
            <>
              <div className="text-sm">
                <MarkdownRenderer content={content} />
              </div>
              {/* <StreamingCursor /> */}
            </>
          )}
          
          {/* Display selected model name if available */}
          {selectedModel && (
            <div className="flex items-center gap-1 pl-[3px] mt-1">
              <span className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                {selectedModel}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-[color:var(--tokens-color-text-text-brand)] rounded-full animate-pulse"></div>
            <span className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
              {getStatusMessage()}
            </span>
          </div>
        </div>

        {/* Linked Files Preview for streaming message */}
        {linkedFiles && linkedFiles.length > 0 && (
          <LinkedFilesPreview linkedFiles={linkedFiles} isUser={false} />
        )}

        {/* Copy button for streaming content */}
        {hasContent && (
          <div className="flex items-center gap-2 mt-2">
            <IconButton
              variant="outline"
              size="sm"
              icon={isCopied ? <CheckBroken className="w-4 h-4" /> : <Copy className="w-4 h-5" />}
              onClick={handleCopy}
              disabled={isCopied}
              aria-label={isCopied ? t('chat.copied') : t('chat.copyMessage')}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export const ConversationContainer: React.FC<ConversationContainerProps> = ({
  conversationUuid,
  className = ''
}) => {
  const { 
    messages, 
    isLoading, 
    isStreaming, 
    streamingContent,
    streamingMetadata, 
    selectConversation, 
    loadMoreMessages, 
    pagination, 
    isLoadingMore 
  } = useConversation()
  const { user } = useAuthRedux()
  const { regenerateMessage, isRegenerating } = useRegenerate()
  
  // Track which message is being regenerated
  const [regeneratingMessageUuid, setRegeneratingMessageUuid] = useState<string | null>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isLoadingMoreRef = useRef(false)
  const shouldAutoScrollRef = useRef(true)
  const userScrolledRef = useRef(false)
  const scrollRafRef = useRef<number | null>(null)

  const {
    isAutoMode,
    selectedModel
  } = useAIModels()

  useEffect(() => {
    if (conversationUuid) {
      selectConversation(conversationUuid)
    }
  }, [conversationUuid, selectConversation])

  // Clear regenerating message UUID when regeneration is complete
  useEffect(() => {
    if (!isRegenerating && regeneratingMessageUuid) {
      setRegeneratingMessageUuid(null)
    }
  }, [isRegenerating, regeneratingMessageUuid])
  
  const scrollToBottom = useCallback((instant: boolean = false) => {
    if (messagesContainerRef.current) {
      if (instant) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [])

  const isAtBottom = useCallback(() => {
    if (!messagesContainerRef.current) return false
    const container = messagesContainerRef.current
    const threshold = 50
    const scrollBottom = container.scrollHeight - container.scrollTop - container.clientHeight
    return scrollBottom <= threshold
  }, [])

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    
    if (scrollTop === 0 && !isLoadingMoreRef.current && conversationUuid && pagination) {
      const { page, total_pages } = pagination
      if (page < total_pages) {
        isLoadingMoreRef.current = true
        loadMoreMessages(conversationUuid).finally(() => {
          isLoadingMoreRef.current = false
        })
      }
    }

    if (isStreaming) {
      const atBottom = isAtBottom()
      shouldAutoScrollRef.current = atBottom
      
      if (!atBottom && !userScrolledRef.current) {
        userScrolledRef.current = true
      } else if (atBottom && userScrolledRef.current) {
        userScrolledRef.current = false
      }
    }
  }, [conversationUuid, pagination, loadMoreMessages, isStreaming, isAtBottom])

  useEffect(() => {
    scrollToBottom(false)
  }, [messages, scrollToBottom])

  useEffect(() => {
    if (isStreaming) {
      shouldAutoScrollRef.current = true
      userScrolledRef.current = false
    }
  }, [isStreaming])

  useEffect(() => {
    if (isStreaming && streamingContent && shouldAutoScrollRef.current) {
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current)
      }
      
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollToBottom(true)
        scrollRafRef.current = null
      })

      return () => {
        if (scrollRafRef.current) {
          cancelAnimationFrame(scrollRafRef.current)
          scrollRafRef.current = null
        }
      }
    }
  }, [streamingContent, isStreaming, scrollToBottom])

  // Sort messages by created_at date (oldest first, newest last)
  // Filter out null/undefined messages before sorting
  const sortedMessages = [...messages]
    .filter(message => message != null)
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateA - dateB
    })


  const handleRegenerate = (messageUuid: string) => {
    if (conversationUuid) {
      setRegeneratingMessageUuid(messageUuid)
      const aiModelUuid = isAutoMode ? '' : selectedModel?.uuid
      regenerateMessage(messageUuid, aiModelUuid, conversationUuid)
    }
  }

  if (!conversationUuid) {
    return (
      <div className={`flex-1 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-[color:var(--tokens-color-text-text-inactive-2)] text-sm">
            {t('chat.selectConversation')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className}`}>
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-2 max-h-[calc(100vh-270px)]"
        onScroll={handleScroll}
      >
        <div className=" max-w-[808px] mx-auto w-full">
          {/* Top loader for loading more messages */}
          {isLoadingMore && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-[color:var(--tokens-color-text-text-inactive-2)]">
                <Spinner size="sm" />
                <span className="text-sm">{t('chat.loadingMoreMessages')}</span>
              </div>
            </div>
          )}
          
          {sortedMessages.map((message, index) => (
            <div key={message.uuid} className="group">
              <MessageBubble
                message={message}
                isUser={message?.sender?.uuid === user?.uuid}
                textClassName={message?.sender?.uuid === user?.uuid ? '' : 'pb-0'}
                isLastMessage={index === sortedMessages.length - 1}
                conversationUuid={conversationUuid}
                onRegenerate={handleRegenerate}
                isRegenerating={isRegenerating}
                isStreaming={isStreaming}
                streamingContent={streamingContent}
                streamingMetadata={streamingMetadata}
                isThisMessageRegenerating={regeneratingMessageUuid === message.uuid}
              />
            </div>
          ))}
          
          {isStreaming && !isRegenerating && (
            <StreamingMessage 
              content={streamingContent} 
              messageType={streamingMetadata?.message_type}
              selectedModel={streamingMetadata?.selected_model}
              linkedFiles={streamingMetadata?.linked_files}
            />
          )}
          
          <div ref={messagesEndRef} />
          </div>
      </div>
    </div>
  )
}
