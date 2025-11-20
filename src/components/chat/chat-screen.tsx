'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { NavigationSidebar } from './sections/navigation-sidebar'
import { ChatInterface } from './sections/chat-interface'
import { ConversationContainer } from './sections/conversation-container'
import { ChatHeader } from './sections/chat-header'
import { useConversation } from '@/hooks/use-conversation'
import { useAIModels } from '@/hooks'

interface Project {
  id: string
  name: string
  category?: string
}

export const ChatScreen: React.FC = () => {
  const [hasFiles, setHasFiles] = useState(false)
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const {
    currentConversation,
    conversations,
    selectConversation,
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

  // Load project from URL on mount
  useEffect(() => {
    const projectId = searchParams.get('project')
    if (projectId) {
      // Load project from localStorage
      const storedFolders = localStorage.getItem('userProjects')
      if (storedFolders) {
        const folders: Project[] = JSON.parse(storedFolders)
        const project = folders.find(f => f.id === projectId)
        if (project) {
          setSelectedProject(project)
        }
      }
    } else {
      setSelectedProject(null)
    }
  }, [searchParams])

  const handleProjectSelect = (project: Project | null) => {
    setSelectedProject(project)
    if (project) {
      // Update URL with project ID
      const params = new URLSearchParams(searchParams.toString())
      params.set('project', project.id)
      router.push(`/chat?${params.toString()}`, { scroll: false })
      // Start new chat in project context
      startNewChat()
    } else {
      // Clear project from URL
      const params = new URLSearchParams(searchParams.toString())
      params.delete('project')
      router.push(`/chat?${params.toString()}`, { scroll: false })
    }
  }

  const handleSendMessage = async (message: string, modelUuid?: string, fileUuids?: string[], uploadedFiles?: any[]) => {
    await sendMessage(message, modelUuid, undefined, fileUuids, uploadedFiles, selectedProject?.id)
  }

  return (
    <div className="min-h-screen flex bg-[color:var(--tokens-color-surface-surface-primary)]">
      <NavigationSidebar 
        isOpen={true} 
        onClose={() => {}}
        onNewChat={() => {
          handleProjectSelect(null)
          startNewChat()
          setIsCanvasOpen(false)
        }}
        showFullSidebar={!isCanvasOpen}
        selectedProjectId={selectedProject?.id}
        onProjectSelect={handleProjectSelect}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {currentConversation ? (
          <>
            {!isCanvasOpen && <ChatHeader />}
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
                  onSendMessage={handleSendMessage}
                  isCompact={true}
                  isStreaming={isStreaming}
                  onFilesChange={setHasFiles}
                  selectedProject={selectedProject}
                />
              </div>
            )}
          </>
        ) : (
          <ChatInterface 
            onSendMessage={handleSendMessage}
            isCompact={false}
            isStreaming={isStreaming}
            selectedProject={selectedProject}
            conversations={conversations}
            selectConversation={selectConversation}
          />
        )}
      </div>
    </div>
  )
}
