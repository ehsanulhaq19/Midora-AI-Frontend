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
import { appConfig } from '@/config/app'
import { baseApiClient } from '@/api/base'
import { Canvas } from './canvas'
import { CanvasToggleButton } from './canvas-toggle-button'
import { countWords, exceedsWordThreshold, truncateMarkdown, getFirstLine } from '@/lib/content-utils'
import { MessageInput, MessageInputHandle } from './message-input'

interface ConversationContainerProps {
  conversationUuid: string | null
  className?: string
  onCanvasStateChange?: (isOpen: boolean) => void
  onSendMessage?: (message: string, modelUuid?: string, fileUuids?: string[], uploadedFiles?: any[]) => void
  isStreaming?: boolean
  onFilesChange?: (hasFiles: boolean) => void
  hasFiles?: boolean
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
  onMarkdownLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>, href?: string) => void
  isCanvasOpen?: boolean
  activeCanvasMessageUuid?: string | null
  onCanvasToggle?: (messageUuid: string) => void
  showInChat?: boolean
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
  isThisMessageRegenerating = false,
  onMarkdownLinkClick,
  isCanvasOpen = false,
  activeCanvasMessageUuid = null,
  onCanvasToggle,
  showInChat = true
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const { switchMessageVersion } = useRegenerate()
  
  // Determine content to display
  const displayContent = isThisMessageRegenerating && isStreaming 
    ? (streamingContent || message.content)
    : message.content
  
  // Check if message should show canvas button (threshold: 100 words)
  const wordCount = countWords(displayContent)
  const shouldShowCanvas = !isUser && exceedsWordThreshold(displayContent, 100)
  
  // Get truncated content for chat display
  const { truncated: truncatedContent, wasTruncated } = shouldShowCanvas && showInChat
    ? truncateMarkdown(displayContent, 50)
    : { truncated: displayContent, wasTruncated: false }
  
  // Check if this message is active in canvas
  const isActiveInCanvas = isCanvasOpen && activeCanvasMessageUuid === message.uuid
  
  // Handle canvas toggle
  const handleCanvasToggle = () => {
    if (onCanvasToggle) {
      onCanvasToggle(message.uuid)
    }
  }

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
                      <MarkdownRenderer 
                        content={streamingContent || message.content} 
                        onLinkClick={onMarkdownLinkClick}
                      />
                      <StreamingCursor />
                    </>
                  )}
                </>
              ) : (
                <MarkdownRenderer 
                  content={truncatedContent || ''} 
                  onLinkClick={onMarkdownLinkClick}
                />
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
          
          {/* Canvas Toggle Button - shown for messages over 100 words - full width */}
          {shouldShowCanvas && onCanvasToggle && (
            <div className="mt-3 mb-2 -mx-4 px-4">
              <CanvasToggleButton
                isCanvasOpen={isCanvasOpen}
                isActive={isActiveInCanvas}
                onClick={handleCanvasToggle}
                disabled={false}
                content={displayContent}
              />
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
  initialContent?: string
  messageType?: string
  selectedModel?: string
  linkedFiles?: LinkedFile[]
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>, href?: string) => void
  isCanvasOpen?: boolean
  activeCanvasMessageUuid?: string | null
  onCanvasToggle?: (messageUuid: string) => void
  messageUuid?: string
}

const StreamingMessage: React.FC<StreamingMessageProps> = ({ 
  content, 
  initialContent = '', 
  messageType, 
  selectedModel, 
  linkedFiles, 
  onLinkClick,
  isCanvasOpen = false,
  activeCanvasMessageUuid = null,
  onCanvasToggle,
  messageUuid
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const [isHidingInitialContent, setIsHidingInitialContent] = useState(false)
  const hasContent = content.length > 0
  const hasInitialContent = initialContent.length > 0
  
  // Check if content should show canvas (threshold: 100 words)
  const displayContent = content || initialContent
  const shouldShowCanvas = exceedsWordThreshold(displayContent, 100)
  const { truncated: truncatedContent, wasTruncated } = shouldShowCanvas
    ? truncateMarkdown(displayContent, 50)
    : { truncated: displayContent, wasTruncated: false }
  
  // Check if this message is active in canvas
  const isActiveInCanvas = isCanvasOpen && activeCanvasMessageUuid === messageUuid
  
  // Handle canvas toggle
  const handleCanvasToggle = () => {
    if (onCanvasToggle && messageUuid) {
      onCanvasToggle(messageUuid)
    }
  }
  
  // Hide initial content with slide-up effect when real content starts appearing
  useEffect(() => {
    if (hasContent && hasInitialContent && !isHidingInitialContent) {
      // Trigger slide-out animation
      setIsHidingInitialContent(true)
    } else if (!hasContent && hasInitialContent) {
      // Reset when only initial content is present
      setIsHidingInitialContent(false)
    }
  }, [hasContent, hasInitialContent, isHidingInitialContent])
  
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
        <div className="px-4 py-3 rounded-lg rounded-bl-sm bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] text-sm relative">
          {!hasContent && !hasInitialContent ? (
            // Show loading animation before content arrives
            <div className="flex items-center gap-3">
              <div className="animate-spin" style={{ animation: 'spin 2s linear infinite' }}>
                <LogoOnly className="w-6 h-6" />
              </div>
            </div>
          ) : (
            <div className="relative overflow-hidden">
              {/* Initial content (from local model) - shown with low opacity, slides up when hiding */}
              {hasInitialContent && (
                <div 
                  className={`text-sm app-text-tertiary transition-all duration-500 ease-in-out ${
                    isHidingInitialContent ? 'opacity-0' : 'opacity-30'
                  }`}
                  style={{ 
                    transform: isHidingInitialContent ? 'translateY(-100%)' : 'translateY(0)',
                    transition: 'opacity 500ms ease-in-out, transform 500ms ease-in-out',
                  }}
                >
                  <MarkdownRenderer 
                    content={initialContent} 
                    onLinkClick={onLinkClick}
                  />
                </div>
              )}
              
              {/* Real content (from actual AI model) - fades in smoothly */}
              {hasContent && (
                <div 
                  className={`text-sm transition-opacity duration-300 ${
                    isHidingInitialContent || !hasInitialContent ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    ...(hasInitialContent && !isHidingInitialContent ? { 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0,
                      padding: '12px 16px'
                    } : {})
                  }}
                >
                  <MarkdownRenderer 
                    content={truncatedContent} 
                    onLinkClick={onLinkClick}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Display selected model name if available */}
          {selectedModel && (
            <div className="flex items-center gap-1 pl-[3px] mt-1">
              <span className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                {selectedModel}
              </span>
            </div>
          )}
          
          {/* Canvas Toggle Button - shown for streaming messages over 100 words - full width */}
          {shouldShowCanvas && onCanvasToggle && messageUuid && (
            <div className="mt-3 mb-2 -mx-4 px-4">
              <CanvasToggleButton
                isCanvasOpen={isCanvasOpen}
                isActive={isActiveInCanvas}
                onClick={handleCanvasToggle}
                disabled={false}
                content={displayContent}
              />
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
  className = '',
  onCanvasStateChange,
  onSendMessage,
  isStreaming: externalIsStreaming,
  onFilesChange,
  hasFiles
}) => {
  const { 
    messages, 
    isLoading, 
    isStreaming: internalIsStreaming, 
    streamingContent,
    initialContent,
    streamingMetadata, 
    selectConversation, 
    loadMoreMessages, 
    pagination, 
    isLoadingMore 
  } = useConversation()
  
  // Use external isStreaming if provided, otherwise use internal
  const isStreaming = externalIsStreaming !== undefined ? externalIsStreaming : internalIsStreaming
  
  const messageInputRef = useRef<MessageInputHandle>(null)
  const { user } = useAuthRedux()
  const { regenerateMessage, isRegenerating } = useRegenerate()
  
  // Track which message is being regenerated
  const [regeneratingMessageUuid, setRegeneratingMessageUuid] = useState<string | null>(null)
  
  // Canvas state management
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [activeCanvasMessageUuid, setActiveCanvasMessageUuid] = useState<string | null>(null)
  const [streamingMessageUuid, setStreamingMessageUuid] = useState<string | null>(null)
  const [hasAutoOpenedCanvas, setHasAutoOpenedCanvas] = useState(false)
  // Store last streaming content to use as fallback after streaming completes
  const [lastStreamingContent, setLastStreamingContent] = useState<string>('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const isLoadingMoreRef = useRef(false)
  const shouldAutoScrollRef = useRef(true)
  const userScrolledRef = useRef(false)
  const scrollRafRef = useRef<number | null>(null)
  const prevIsStreamingRef = useRef<boolean>(false)

  const {
    isAutoMode,
    selectedModel
  } = useAIModels()
  
  // Store last streaming content when streaming is active
  useEffect(() => {
    if (isStreaming && streamingContent) {
      setLastStreamingContent(streamingContent)
    }
  }, [isStreaming, streamingContent])
  
  // Track streaming message UUID when streaming starts
  useEffect(() => {
    if (isStreaming && !isRegenerating && streamingContent) {
      // Find the last AI message (non-user message) - this should be the streaming message
      const lastAIMessage = [...messages].reverse().find((m: Message) => m.sender?.uuid !== user?.uuid)
      
      if (lastAIMessage) {
        // Use the actual message UUID if found
        if (!streamingMessageUuid || streamingMessageUuid !== lastAIMessage.uuid) {
          // New streaming message detected - clear previous canvas selection
          // This ensures new streaming content becomes the active canvas by default
          if (streamingMessageUuid && streamingMessageUuid !== lastAIMessage.uuid && isCanvasOpen) {
            // Previous streaming message exists and is different - clear its selection
            // Switch canvas to new streaming message immediately (will be confirmed at 100 words)
            // This ensures the new message's canvas button shows as active
            setActiveCanvasMessageUuid(lastAIMessage.uuid)
          }
          setStreamingMessageUuid(lastAIMessage.uuid)
        }
      } else if (!streamingMessageUuid) {
        // Create temporary UUID only if no message found and no UUID set yet
        const tempUuid = `streaming-${Date.now()}`
        setStreamingMessageUuid(tempUuid)
        // If canvas is open, switch to new streaming message
        if (isCanvasOpen) {
          setActiveCanvasMessageUuid(tempUuid)
        }
      }
    } else if (!isStreaming) {
      // When streaming stops, try to find the message in the array
      if (streamingMessageUuid) {
        const message = messages.find((m: Message) => m.uuid === streamingMessageUuid)
        if (message) {
          // Message found, keep using its UUID
          // Keep activeCanvasMessageUuid pointing to this message if canvas is open
          if (isCanvasOpen && activeCanvasMessageUuid === streamingMessageUuid) {
            // Canvas is open with this message - keep it active
            // The message content will be updated automatically from messages array
            // Do nothing, activeCanvasMessageUuid is already correct
          } else if (isCanvasOpen && hasAutoOpenedCanvas) {
            // Canvas was auto-opened for this streaming message - ensure it stays active
            setActiveCanvasMessageUuid(streamingMessageUuid)
          }
        } else if (streamingMessageUuid.startsWith('streaming-')) {
          // Temporary UUID was used, try to find the last AI message
          const lastAIMessage = [...messages].reverse().find((m: Message) => m.sender?.uuid !== user?.uuid)
          if (lastAIMessage) {
            // Update to use the actual message UUID
            const newUuid = lastAIMessage.uuid
            setStreamingMessageUuid(newUuid)
            // Update active canvas message UUID if canvas is open
            // This ensures canvas stays on the newly generated message
            if (isCanvasOpen) {
              // If canvas was auto-opened for streaming, keep it on the new message
              if (hasAutoOpenedCanvas || activeCanvasMessageUuid === streamingMessageUuid) {
                setActiveCanvasMessageUuid(newUuid)
              }
            }
          }
        } else {
          // Streaming UUID is not temporary and message not found yet
          // Wait for message to appear in array - this can happen if streaming just completed
          // Keep activeCanvasMessageUuid as is to avoid switching to wrong message
        }
      }
      // Reset auto-open flag when streaming stops
      setHasAutoOpenedCanvas(false)
    }
  }, [isStreaming, streamingContent, isRegenerating, messages, user, isCanvasOpen, activeCanvasMessageUuid, streamingMessageUuid, hasAutoOpenedCanvas])
  
  // Auto-open or switch canvas to streaming content when it exceeds 100 words
  // This ensures canvas shows new streaming content when user types a new query
  // When new streaming starts, clear previous selection and make new message active by default
  useEffect(() => {
    if (isStreaming && streamingContent && streamingMessageUuid) {
      const wordCount = countWords(streamingContent)
      if (wordCount > 100) {
        // If canvas is not open, open it with the new streaming message
        if (!isCanvasOpen) {
          setIsCanvasOpen(true)
          setActiveCanvasMessageUuid(streamingMessageUuid)
          setHasAutoOpenedCanvas(true)
        } else if (activeCanvasMessageUuid !== streamingMessageUuid) {
          // If canvas is open but showing a different message, switch to streaming message
          // This handles the case where user types new query while canvas shows previous message
          // Clear previous selection and make new streaming message active
          setActiveCanvasMessageUuid(streamingMessageUuid)
          setHasAutoOpenedCanvas(true)
        } else {
          // Canvas is already open and showing streaming message - ensure it stays active
          setHasAutoOpenedCanvas(true)
        }
      }
    }
  }, [isStreaming, streamingContent, streamingMessageUuid, hasAutoOpenedCanvas, isCanvasOpen, activeCanvasMessageUuid])
  
  // Ensure canvas stays on streamed message after streaming completes
  // This prevents canvas from switching back to previously selected messages
  useEffect(() => {
    // When streaming stops, if canvas is open and showing the streaming message,
    // make sure we keep it showing the same message by finding it in messages array
    if (!isStreaming && streamingMessageUuid && isCanvasOpen) {
      // If canvas was auto-opened for streaming, ensure it stays on the new message
      if (hasAutoOpenedCanvas || activeCanvasMessageUuid === streamingMessageUuid) {
        // Try to find the message in messages array by UUID
        let message = messages.find((m: Message) => m.uuid === streamingMessageUuid)
        
        if (message) {
          // Message found by UUID - activeCanvasMessageUuid is already correct
          // Canvas will show the message content from messages array
          // Ensure it stays active (in case it was reset somehow)
          if (activeCanvasMessageUuid !== streamingMessageUuid) {
            setActiveCanvasMessageUuid(streamingMessageUuid)
          }
        } else if (streamingMessageUuid.startsWith('streaming-')) {
          // Temporary UUID was used, find the last AI message
          const lastAIMessage = [...messages].reverse().find((m: Message) => m.sender?.uuid !== user?.uuid)
          if (lastAIMessage) {
            // Update to use actual message UUID
            setStreamingMessageUuid(lastAIMessage.uuid)
            setActiveCanvasMessageUuid(lastAIMessage.uuid)
          }
        } else {
          // Message UUID is not temporary but message not found yet
          // This can happen if streaming just completed and message is still being saved
          // Keep activeCanvasMessageUuid as is - getCanvasContent will use lastStreamingContent
          // Also check if a new message was added that might be our streamed message
          const lastAIMessage = [...messages].reverse().find((m: Message) => m.sender?.uuid !== user?.uuid)
          if (lastAIMessage && lastAIMessage.content && lastStreamingContent) {
            // Compare content to see if this is our streamed message
            // If the last AI message content matches our last streaming content (approximately),
            // update to use this message's UUID
            const messageContentStart = lastAIMessage.content.substring(0, 100).trim()
            const streamingContentStart = lastStreamingContent.substring(0, 100).trim()
            if (messageContentStart === streamingContentStart || 
                (messageContentStart.length > 50 && streamingContentStart.length > 50 &&
                 messageContentStart.substring(0, 50) === streamingContentStart.substring(0, 50))) {
              // This is likely our streamed message - update UUIDs
              setStreamingMessageUuid(lastAIMessage.uuid)
              setActiveCanvasMessageUuid(lastAIMessage.uuid)
            }
          }
        }
      }
    }
  }, [isStreaming, streamingMessageUuid, isCanvasOpen, activeCanvasMessageUuid, messages, user, lastStreamingContent, hasAutoOpenedCanvas])
  
  // Watch for new messages when streaming completes to update canvas
  // This ensures the newly generated message's canvas button is selected by default
  // Users can still manually select previous message canvases if they want
  useEffect(() => {
    // Detect when streaming just completed (transitioned from true to false)
    const wasStreaming = prevIsStreamingRef.current
    const streamingJustCompleted = wasStreaming && !isStreaming && !isRegenerating
    
    // Update ref for next render
    prevIsStreamingRef.current = isStreaming
    
    // When streaming completes, find the most recent AI message and select its canvas
    // This only happens once when streaming completes - users can then manually select other messages
    if (streamingJustCompleted && messages.length > 0) {
      // Find the most recent AI message (last non-user message)
      const lastAIMessage = [...messages].reverse().find((m: Message) => m.sender?.uuid !== user?.uuid)
      
      if (lastAIMessage && lastAIMessage.uuid) {
        // Auto-select the most recent message when streaming completes
        // This ensures the newest message's canvas button is active by default
        // Setting activeCanvasMessageUuid will automatically unselect all other canvas buttons
        // Users can still manually select previous message canvases afterward
        setActiveCanvasMessageUuid(lastAIMessage.uuid)
        
        // Update streamingMessageUuid to match the most recent message
        setStreamingMessageUuid(lastAIMessage.uuid)
      }
    }
  }, [isStreaming, isRegenerating, messages, user])
  
  // Notify parent of canvas state changes
  useEffect(() => {
    if (onCanvasStateChange) {
      onCanvasStateChange(isCanvasOpen)
    }
  }, [isCanvasOpen, onCanvasStateChange])
  
  // Handle canvas toggle
  const handleCanvasToggle = useCallback((messageUuid: string) => {
    if (isCanvasOpen && activeCanvasMessageUuid === messageUuid) {
      // Close canvas if it's already open with this message
      setIsCanvasOpen(false)
      setActiveCanvasMessageUuid(null)
    } else {
      // Open canvas or switch to this message
      setIsCanvasOpen(true)
      setActiveCanvasMessageUuid(messageUuid)
    }
  }, [isCanvasOpen, activeCanvasMessageUuid])
  
  // Handle canvas close
  const handleCanvasClose = useCallback(() => {
    setIsCanvasOpen(false)
    setActiveCanvasMessageUuid(null)
  }, [])
  
  // Get canvas content
  const getCanvasContent = useCallback(() => {
    if (!activeCanvasMessageUuid) return ''
    
    // Priority 1: If canvas is showing the streaming message
    if (activeCanvasMessageUuid === streamingMessageUuid) {
      // If currently streaming, always use streaming content
      if (isStreaming && streamingContent) {
        return streamingContent
      }
      
      // If streaming completed, first try to find the message in messages array
      const message = messages.find((m: Message) => m.uuid === activeCanvasMessageUuid)
      if (message && message.content) {
        // Message found with content - use it (this is the completed streamed content)
        return message.content
      }
      
      // Message not found yet or has no content - use last known streaming content
      // This prevents canvas from showing empty or wrong message while message is being saved
      if (lastStreamingContent) {
        return lastStreamingContent
      }
      if (streamingContent) {
        return streamingContent
      }
    }
    
    // Priority 2: Find message by UUID in messages array (for non-streaming messages)
    const message = messages.find((m: Message) => m.uuid === activeCanvasMessageUuid)
    if (message) {
      // Check if this message is being regenerated
      if (regeneratingMessageUuid === message.uuid && isStreaming && streamingContent) {
        return streamingContent || message.content || ''
      }
      
      // Return the message content
      return message.content || ''
    }
    
    // Priority 3: Fallback - if we have last streaming content and UUID matches, use it
    if (lastStreamingContent && activeCanvasMessageUuid === streamingMessageUuid) {
      return lastStreamingContent
    }
    if (streamingContent && activeCanvasMessageUuid === streamingMessageUuid) {
      return streamingContent
    }
    
    return ''
  }, [activeCanvasMessageUuid, messages, isStreaming, streamingContent, isRegenerating, regeneratingMessageUuid, streamingMessageUuid, lastStreamingContent])

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

  const handleMarkdownLinkClick = async (event: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (!href) {
      return
    }

    const backendUrl = appConfig.backendUrl.replace(/\/$/, '')

    if (href.startsWith(backendUrl) && href.includes('/api/v1/files/download')) {
      event.preventDefault()
      event.stopPropagation()

      try {
        const downloadUrl = new URL(href)
        const endpoint = `${downloadUrl.pathname}${downloadUrl.search}`
        const downloadResponse = await baseApiClient.downloadFile(endpoint)
        const blobUrl = window.URL.createObjectURL(downloadResponse.data)

        const pathSegments = downloadUrl.pathname.split('/')
        const fallbackFilename = decodeURIComponent(pathSegments[pathSegments.length - 1] || 'download')
        const filename = downloadResponse.filename || fallbackFilename || 'download'

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      } catch (error) {
        console.error('Failed to download file from conversation link:', error)
      }
    }
  }


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
    <div className={`flex flex-row relative ${className}`} style={{ height: '100%' }}>
      {/* Chat Container */}
      <div 
        className={`flex-1 transition-all duration-300 ease-in-out overflow-hidden flex flex-col relative ${
          isCanvasOpen ? 'w-1/2' : 'w-full'
        } ${isCanvasOpen ? 'bg-[color:var(--tokens-color-surface-surface-conversation-canvas)]' : ''}`}
        style={{ height: '100%' }}
      >
        {/* Chat messages container with darker background when canvas is open */}
        <div 
          ref={messagesContainerRef}
          className={`flex-1 overflow-y-auto p-6 space-y-2 relative z-0 transition-colors duration-300 ${
            isCanvasOpen ? '' : 'bg-[color:var(--tokens-color-surface-surface-primary)]'
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
                onMarkdownLinkClick={handleMarkdownLinkClick}
                  isCanvasOpen={isCanvasOpen}
                  activeCanvasMessageUuid={activeCanvasMessageUuid}
                  onCanvasToggle={handleCanvasToggle}
                  showInChat={true}
              />
            </div>
          ))}
          
          {isStreaming && !isRegenerating && (
            <StreamingMessage 
              content={streamingContent}
              initialContent={initialContent}
              messageType={streamingMetadata?.message_type}
              selectedModel={streamingMetadata?.selected_model}
              linkedFiles={streamingMetadata?.linked_files}
              onLinkClick={handleMarkdownLinkClick}
                isCanvasOpen={isCanvasOpen}
                activeCanvasMessageUuid={activeCanvasMessageUuid}
                onCanvasToggle={handleCanvasToggle}
                messageUuid={streamingMessageUuid || (sortedMessages.length > 0 ? sortedMessages[sortedMessages.length - 1]?.uuid : undefined)}
            />
          )}
          
          <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Message Input - shown inside conversation container when canvas is open */}
        {isCanvasOpen && onSendMessage && (
          <div className="flex-shrink-0 p-4 border-t border-[color:var(--tokens-color-border-border-inactive)]">
            <div className="max-w-full px-2">
              <MessageInput
                ref={messageInputRef}
                onSend={onSendMessage}
                isStreaming={isStreaming}
                onFilesChange={onFilesChange}
                className={`w-full max-w-full ${isCanvasOpen ? '!bg-[color:var(--tokens-color-surface-surface-input-canvas)]' : ''}`}
                textAreaClassName="!app-text-lg"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Canvas Sidebar */}
      {isCanvasOpen && (
        <div className="relative z-50 flex-shrink-0 w-1/2" style={{ height: '100%' }}>
          <Canvas
            isOpen={isCanvasOpen}
            content={getCanvasContent()}
            messageUuid={activeCanvasMessageUuid || undefined}
            onClose={handleCanvasClose}
            className="flex-shrink-0 h-full"
            onLinkClick={handleMarkdownLinkClick}
          />
        </div>
      )}
    </div>
  )
}
