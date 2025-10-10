'use client'

import React, { useEffect, useRef, useCallback } from 'react'
import { useConversation } from '@/hooks/useConversation'
import { Message } from '@/api/conversation/types'
import { Copy, LogoOnly } from '@/icons'
import { IconButton } from '@/components/ui/buttons'
import { Spinner } from '@/components/ui/loaders'
import { t } from '@/i18n'
import { MarkdownRenderer } from '@/components/markdown'
import './style.css'
import { useAuthRedux } from '@/hooks/useAuthRedux'

interface ConversationContainerProps {
  conversationUuid: string | null
  className?: string
}

interface MessageBubbleProps {
  message: Message
  isUser: boolean,
  textClassName?: string
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, textClassName = "" }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

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
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        <div className="ml-2">
          {/* Display AI model name with copy button for AI messages */}
          {!isUser && message.model_name && (
            <div className="flex items-center gap-1 pl-[3px]">
              <span className="!text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                {message.model_name}
              </span>
            </div>
          )}
          
          <div className={`flex items-center gap-2 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <IconButton
              variant="outline"
              size="sm"
              icon={<Copy />}
              onClick={handleCopy}
              aria-label={t('chat.copyMessage')}
              className={!isUser ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity'}
            />
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

const StreamingMessage: React.FC<{ content: string; messageType?: string }> = ({ content, messageType }) => {
  const hasContent = content.length > 0
  
  // Get status message from i18n based on message_type
  const getStatusMessage = () => {
    console.log("---------messageType-----------", messageType)
    if (messageType && t(`chat.aiStatus.${messageType}` as any)) {
      return t(`chat.aiStatus.${messageType}` as any)
    }
    return t('chat.typing')
  }
  
  return (
    <div className="flex justify-start mb-6 px-4">
      <div className="max-w-[75%]">
        <div className="px-4 py-3 rounded-lg rounded-bl-sm bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)]">
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
              <MarkdownRenderer content={content} />
              <StreamingCursor />
            </>
          )}
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 bg-[color:var(--tokens-color-text-text-brand)] rounded-full animate-pulse"></div>
            <span className="text-xs text-[color:var(--tokens-color-text-text-inactive-2)]">
              {getStatusMessage()}
            </span>
          </div>
        </div>
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isLoadingMoreRef = useRef(false)

  useEffect(() => {
    if (conversationUuid) {
      selectConversation(conversationUuid)
    }
  }, [conversationUuid, selectConversation])
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Handle scroll to load more messages
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    
    // Check if scrolled to top and not already loading
    if (scrollTop === 0 && !isLoadingMoreRef.current && conversationUuid && pagination) {
      const { page, total_pages } = pagination
      if (page < total_pages) {
        isLoadingMoreRef.current = true
        loadMoreMessages(conversationUuid).finally(() => {
          isLoadingMoreRef.current = false
        })
      }
    }
  }, [conversationUuid, pagination, loadMoreMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Scroll to bottom when streaming starts
  useEffect(() => {
    if (isStreaming) {
      scrollToBottom()
    }
  }, [isStreaming])

  // Throttled scroll for streaming content updates
  useEffect(() => {
    if (isStreaming && streamingContent) {
      // Use requestAnimationFrame for smoother scrolling
      const rafId = requestAnimationFrame(() => {
        scrollToBottom()
      })

      return () => cancelAnimationFrame(rafId)
    }
  }, [streamingContent, isStreaming])

  // Sort messages by created_at date (oldest first, newest last)
  // Filter out null/undefined messages before sorting
  const sortedMessages = [...messages]
    .filter(message => message != null)
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateA - dateB
    })

  if (!conversationUuid) {
    return (
      <div className={`flex-1 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <p className="text-[color:var(--tokens-color-text-text-inactive-2)] text-lg">
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
          
          {sortedMessages.map((message) => (
            <div key={message.uuid} className="group">
              <MessageBubble
                message={message}
                isUser={message?.sender?.uuid == user?.uuid}
                textClassName={message?.sender?.uuid == user?.uuid ? '' : 'pb-0'}
              />
            </div>
          ))}
          
          {isStreaming && (
            <StreamingMessage 
              content={streamingContent} 
              messageType={streamingMetadata?.message_type} 
            />
          )}
          
          <div ref={messagesEndRef} />
          </div>
      </div>
    </div>
  )
}
