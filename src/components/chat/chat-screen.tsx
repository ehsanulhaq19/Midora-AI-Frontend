'use client'

import React, { useState, useEffect } from 'react'
import { NavigationSidebar } from './sections/navigation-sidebar'
import { ChatInterface } from './sections/chat-interface'
import { ConversationContainer } from './sections/conversation-container'
import { ChatHeader } from './sections/chat-header'
import { useConversation } from '@/hooks/useConversation'

export const ChatScreen: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    currentConversation,
    loadConversations,
    loadAIModels,
    sendMessage,
    startNewChat,
    isLoading,
    error,
  } = useConversation()

  useEffect(() => {
    // Load initial data
    loadConversations()
    loadAIModels()
  }, [loadConversations, loadAIModels])

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const handleSendMessage = async (message: string) => {
    await sendMessage(message)
  }

  return (
    <div className="min-h-screen flex bg-[color:var(--tokens-color-surface-surface-primary)]">
      <NavigationSidebar 
        isOpen={sidebarOpen} 
        onClose={handleCloseSidebar}
        onNewChat={() => {
          startNewChat()
          setSidebarOpen(false)
        }}
      />
      
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            <ChatHeader onMenuClick={handleMenuClick} />
            <ConversationContainer 
              conversationUuid={currentConversation.uuid}
              className="flex-1"
            />
            <div className="border-t border-[color:var(--tokens-color-border-border-subtle)]">
              <ChatInterface 
                onMenuClick={handleMenuClick} 
                onSendMessage={handleSendMessage}
                isCompact={true}
              />
            </div>
          </>
        ) : (
          <ChatInterface 
            onMenuClick={handleMenuClick} 
            onSendMessage={handleSendMessage}
            isCompact={false}
          />
        )}
      </div>
    </div>
  )
}
