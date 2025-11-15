'use client'

import React, { useState, useEffect } from 'react'
import { NavigationSidebar } from './sections/navigation-sidebar'
import { ChatInterface } from './sections/chat-interface'
import { ConversationContainer } from './sections/conversation-container'
import { ChatHeader } from './sections/chat-header'
import { useConversation } from '@/hooks/use-conversation'
import { useAIModels } from '@/hooks'

export const ChatScreen: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hasFiles, setHasFiles] = useState(false)
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const {
    currentConversation,
    loadConversations,
    sendMessage,
    startNewChat,
    isLoading,
    error,
    isStreaming,
  } = useConversation()

  const { fetchServiceProviders } = useAIModels()
  
  const handleCanvasStateChange = (isOpen: boolean) => {
    setIsCanvasOpen(isOpen)
  }

  useEffect(() => {
    // Load initial data
    loadConversations()
    fetchServiceProviders()
  }, [loadConversations, fetchServiceProviders])

  const handleMenuClick = () => {
    setSidebarOpen(true)
  }

  const handleCloseSidebar = () => {
    setSidebarOpen(false)
  }

  const handleSendMessage = async (message: string, modelUuid?: string, fileUuids?: string[], uploadedFiles?: any[]) => {
    await sendMessage(message, modelUuid, undefined, fileUuids, uploadedFiles)
  }

  return (
    <div className="min-h-screen flex bg-[color:var(--tokens-color-surface-surface-primary)]">
      <NavigationSidebar 
        isOpen={sidebarOpen} 
        onClose={handleCloseSidebar}
        onNewChat={() => {
          startNewChat()
          setSidebarOpen(false)
          setIsCanvasOpen(false)
        }}
        showFullSidebar={!isCanvasOpen}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {currentConversation ? (
          <>
            {!isCanvasOpen && <ChatHeader onMenuClick={handleMenuClick} />}
            <ConversationContainer 
              conversationUuid={currentConversation.uuid}
              className={`flex-1 ${isCanvasOpen ? 'h-screen' : hasFiles ? 'max-h-[calc(100vh-380px)]' : 'max-h-[calc(100vh-270px)]'}`}
              onCanvasStateChange={handleCanvasStateChange}
              onSendMessage={isCanvasOpen ? handleSendMessage : undefined}
              isStreaming={isStreaming}
              onFilesChange={isCanvasOpen ? setHasFiles : undefined}
              hasFiles={hasFiles}
            />
            {!isCanvasOpen && (
              <div className="">
                <ChatInterface 
                  onMenuClick={handleMenuClick} 
                  onSendMessage={handleSendMessage}
                  isCompact={true}
                  isStreaming={isStreaming}
                  onFilesChange={setHasFiles}
                />
              </div>
            )}
          </>
        ) : (
          <ChatInterface 
            onMenuClick={handleMenuClick} 
            onSendMessage={handleSendMessage}
            isCompact={false}
            isStreaming={isStreaming}
          />
        )}
      </div>
    </div>
  )
}
