'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { PublicConversationContainer } from './sections/public-conversation-container'
import { useAuthCallback } from '@/hooks/use-auth-callback'
import { conversationApi } from '@/api/conversation/api'
import { Buttons } from '@/components/ui'
import { t } from '@/i18n'

interface PublicChatScreenProps {
  conversationUuid: string
}

export const PublicChatScreen: React.FC<PublicChatScreenProps> = ({ conversationUuid }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [conversationName, setConversationName] = useState<string>('')
  const [publicMessages, setPublicMessages] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const hasInitialized = useRef(false)
  const { setCallbackUrl } = useAuthCallback()

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


  const handleLoginClick = useCallback(() => {
    try {
      // Save the current URL to redirect back after login
      if (typeof window !== 'undefined') {
        setCallbackUrl(window.location.pathname)
      }
      // Redirect to signup page
      window.location.href = `/signup?returnUrl=${encodeURIComponent(window.location.pathname)}`
    } catch (err) {
      console.error('Error redirecting to login:', err)
    }
  }, [setCallbackUrl])

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
    <div className="flex flex-col h-screen bg-[color:var(--tokens-color-surface-surface-primary)]">
      {/* Conversation Header */}
      <div className="flex-shrink-0 border-b border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--tokens-color-surface-surface-primary)] px-4 py-4">
        <div className="max-w-[808px] mx-auto">
          <h1 className="text-2xl font-semibold text-[color:var(--tokens-color-text-text-primary)]">
            {conversationName || 'Conversation'}
          </h1>
          <p className="text-sm text-[color:var(--tokens-color-text-text-secondary)] mt-1">
            Public preview
          </p>
        </div>
      </div>

      {/* Public Conversation Container - grows to fill available space */}
      <PublicConversationContainer
        messages={publicMessages}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        onLoadMore={() => loadPublicMessages(currentPage + 1)}
        currentPage={currentPage}
        totalPages={totalPages}
        className="flex-1"
      />

      {/* Login Button Footer - Sticky at bottom */}
      <div className="flex-shrink-0 border-t border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--tokens-color-surface-surface-primary)] p-4">
        <div className="max-w-[808px] mx-auto">
          <Buttons 
            property1="pressed" 
            className="mt-0"
            onClick={handleLoginClick}
            text={t('auth.loginToJoin')}
            disabled={false}
          />
        </div>
      </div>
    </div>
  )
}

