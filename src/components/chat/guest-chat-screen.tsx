'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { NavigationSidebar } from './sections/navigation-sidebar'
import { ChatHeader } from './sections/chat-header'
import { PublicConversationContainer } from './sections/public-conversation-container'
import { conversationApi } from '@/api/conversation/api'
import { Buttons } from '@/components/ui'
import { t } from '@/i18n'

interface GuestChatScreenProps {
  conversationUuid: string
}

export const GuestChatScreen: React.FC<GuestChatScreenProps> = ({ conversationUuid }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conversationName, setConversationName] = useState<string>('')
  const [publicMessages, setPublicMessages] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const hasInitialized = useRef(false)

  const loadPublicMessages = useCallback(async (page: number = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }
      setError(null)

      // Fetch public conversation messages via public API
      // API now returns transformed messages with versioning support
      const messagesResponse = await conversationApi.getPublicGroupedMessages(conversationUuid, page, 20)
      if (messagesResponse.error) {
        throw new Error(messagesResponse.error)
      }

      // API returns { messages: Message[], pagination: { ... } }
      // Messages are already transformed with versioning support
      const transformedMessages = messagesResponse.data?.messages || []
      const pagination = messagesResponse.data?.pagination || {}

      if (page === 1) {
        setPublicMessages(transformedMessages)
      } else {
        // Prepend older messages when loading more (chronological order)
        setPublicMessages((prev: any[]) => [...transformedMessages, ...prev])
      }

      setCurrentPage(pagination.page || page)
      setTotalPages(pagination.total_pages || 1)

      if (page === 1) {
        setIsLoading(false)
      } else {
        setIsLoadingMore(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load conversation'
      setError(errorMessage)
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [conversationUuid])

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true

      // Fetch conversation details using public API
      const fetchConversationDetails = async () => {
        try {
          const response = await conversationApi.getPublicConversationDetails(conversationUuid)
          if (!response.error && response.data) {
            setConversationName(response.data.name || 'Conversation')
          }
        } catch (err) {
          console.error('Failed to fetch conversation name:', err)
        }
      }

      fetchConversationDetails()
      loadPublicMessages(1)
    }
  }, [conversationUuid, loadPublicMessages])


  const handleJoinChat = useCallback(async () => {
    try {
      setIsJoining(true)
      const response = await conversationApi.joinConversation(conversationUuid)
      if (!response.error) {
        // Reload the page to show the full chat screen
        window.location.reload()
      } else {
        setError('Failed to join conversation')
      }
    } catch (err) {
      setError('Error joining conversation')
      console.error('Error joining conversation:', err)
    } finally {
      setIsJoining(false)
    }
  }, [conversationUuid])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--tokens-color-surface-surface-primary)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[color:var(--tokens-color-text-text-brand)] mx-auto mb-4"></div>
          <p className="text-[color:var(--tokens-color-text-text-primary)]">Loading conversation...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--tokens-color-surface-surface-primary)]">
        <div className="text-center">
          <p className="text-[color:var(--tokens-color-text-text-error)] mb-4">Failed to load conversation</p>
          <p className="text-[color:var(--tokens-color-text-text-secondary)] text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 rounded bg-[color:var(--tokens-color-text-text-brand)] text-white hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-[color:var(--tokens-color-surface-surface-primary)]">
      {/* Navigation Sidebar */}
      <NavigationSidebar
        isOpen={true}
        onClose={() => {}}
        onNewChat={() => {}}
        showFullSidebar={true}
        selectedProjectId={undefined}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-0 min-w-0">
        {/* Chat Header */}
        <ChatHeader />

        {/* Conversation Heading */}
        <div className="flex-shrink-0 border-b border-[color:var(--tokens-color-border-border-subtle)] px-4 py-4">
          <div className="max-w-[808px] mx-auto">
            <h1 className="text-2xl font-semibold text-[color:var(--tokens-color-text-text-primary)]">
              {conversationName || 'Conversation'}
            </h1>
            <p className="text-sm text-[color:var(--tokens-color-text-text-secondary)] mt-1">
              Guest preview
            </p>
          </div>
        </div>

        {/* Public Conversation Container */}
        <PublicConversationContainer
          messages={publicMessages}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          onLoadMore={() => loadPublicMessages(currentPage + 1)}
          currentPage={currentPage}
          totalPages={totalPages}
          className="flex-1"
        />

        {/* Join Chat Button - Fixed at Bottom */}
        <div className="flex-shrink-0 border-t border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--tokens-color-surface-surface-primary)] p-4">
          <div className="max-w-[808px] mx-auto">
            <Buttons
              property1="pressed"
              className="mt-0 w-full"
              onClick={handleJoinChat}
              text={isJoining ? 'Joining...' : 'Join Chat'}
              disabled={isJoining}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
