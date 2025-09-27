'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { 
  FolderPlus, 
  FolderOpen, 
  Search, 
  Search02,
  Plus01_5, 
  ChevronDown,
  Collapse,
  Close,
  MoreOptions,
  LogoOnly,
  MinusSquare,
  MidorasIcon,
  FoldersIcon,
  FolderOpen01,
  Logout
} from '@/icons'
import { IconButton } from '@/components/ui/buttons'
import Image from 'next/image'
import { t } from '@/i18n'
import { useAuthRedux } from '@/hooks/useAuthRedux'
import { useConversation } from '@/hooks/useConversation'
import { useAuth } from '@/contexts/AuthContext'

interface ChatListItemProps {
  text: string
  isSelected: boolean
  onClick: () => void
}

const ChatListItem: React.FC<ChatListItemProps> = ({ text, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors ${
      isSelected 
        ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-brand)]" 
        : "text-[color:var(--tokens-color-text-text-inactive-2)] hover:bg-[color:var(--tokens-color-surface-surface-secondary)]"
    }`}
  >
    <div className="font-text-small flex-1 mt-[-1.00px] tracking-[var(--text-small-letter-spacing)] text-[length:var(--text-small-font-size)] [font-style:var(--text-small-font-style)] font-[number:var(--text-small-font-weight)] leading-[var(--text-small-line-height)] truncate">
      {text}
    </div>
    {isSelected && <MoreOptions className="w-4 h-4" />}
  </button>
)

interface ProjectFolderItemProps {
  title: string
  chats: string[]
  isExpanded: boolean
  onToggle: () => void
}

const ProjectFolderItem: React.FC<ProjectFolderItemProps> = ({ 
  title, 
  chats, 
  isExpanded, 
  onToggle 
}) => (
  <div className="flex flex-col items-start relative w-full">
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-2 relative w-full transition-colors ${
        isExpanded 
          ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius)]" 
          : "hover:bg-[color:var(--tokens-color-surface-surface-secondary)]"
      }`}
    >
      <FolderOpen className="w-5 h-5" />
      <div className={`relative flex items-center justify-center flex-1 mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)] text-left ${
        isExpanded ? "text-[color:var(--tokens-color-text-text-brand)]" : "text-[color:var(--tokens-color-text-text-seconary)]"
      }`}>
        {title}
      </div>
      {isExpanded && <MoreOptions className="w-4 h-4" />}
    </button>

    {isExpanded && (
      <div className="flex flex-col items-start relative w-full pl-2">
        {chats.map((chat, index) => (
          <ChatListItem key={index} text={chat} isSelected={false} onClick={() => {}} />
        ))}
      </div>
    )}
  </div>
)

interface NavigationSidebarProps {
  isOpen: boolean
  onClose: () => void
  onNewChat?: () => void
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({ 
  isOpen, 
  onClose,
  onNewChat
}) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null)
  const [expandedProjects, setExpandedProjects] = useState<Record<number, boolean>>({})
  const [searchHovered, setSearchHovered] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const conversationsContainerRef = useRef<HTMLDivElement>(null)
  const { userName } = useAuthRedux()
  const { logout } = useAuth()
  const { 
    conversations, 
    currentConversation, 
    selectConversation, 
    startNewChat,
    loadMoreConversations,
    conversationPagination,
    isLoadingMoreConversations
  } = useConversation()

  const handleNewChat = () => {
    startNewChat()
    onNewChat?.()
  }

  const handleSelectChat = (conversationUuid: string) => {
    selectConversation(conversationUuid)
    setSelectedChat(conversations.findIndex(conv => conv.uuid === conversationUuid))
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Handle scroll to load more conversations
  const handleConversationsScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    
    // Check if scrolled to bottom (with a small threshold)
    const threshold = 10
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold
    
    if (isNearBottom && 
        !isLoadingMoreConversations && 
        conversationPagination && 
        conversationPagination.page < conversationPagination.total_pages) {
      loadMoreConversations()
    }
  }, [isLoadingMoreConversations, conversationPagination, loadMoreConversations])

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const projects = [
    {
      title: "Project Discussion",
      chats: ["Image to watercolor painting", "Image to digital sketch", "Image to oil painting"]
    },
    {
      title: "Main Stream Media", 
      chats: ["Media analysis", "Content strategy", "Brand guidelines"]
    },
    {
      title: "Main Stream Media", 
      chats: ["Media analysis", "Content strategy", "Brand guidelines"]
    }
  ]

  const toggleProject = (index: number) => {
    setExpandedProjects(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 w-[282px] bg-[color:var(--tokens-color-surface-surface-neutral)] z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex flex-col items-start gap-3 flex-shrink-0">
          <div className="flex h-[68px] items-center justify-between px-5 py-0 relative w-full">
            <LogoOnly
              className="relative w-9 h-9 aspect-[1]"
            />

            <button className="p-1 hover:bg-gray-200 rounded transition-colors">
              <MinusSquare className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col h-[93px] items-start gap-2 relative w-full px-5 pb-2">
            <button 
              onClick={handleNewChat}
              className="flex items-center gap-2 py-2 relative w-full hover:bg-[color:var(--tokens-color-surface-surface-secondary)] rounded transition-colors"
            >
              <div className="w-9 h-9 flex items-center justify-center gap-2.5 p-2.5 rounded-[var(--premitives-corner-radius-corner-radius)] bg-[color:var(--tokens-color-icon-surface-icon-inactive-brand)] text-white">
                <Plus01_5 className="w-5 h-5" color="#ffffff" />
              </div>
              <div className="relative flex items-center justify-center w-fit font-h05-heading05 font-[number:var(--h05-heading05-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[length:var(--h05-heading05-font-size)] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
                {t('chat.newChat')}
              </div>
            </button>

            <button
              className={`w-full flex items-center gap-3 p-2 rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors ${
                searchHovered ? "bg-[color:var(--tokens-color-surface-surface-secondary)]" : ""
              }`}
              onMouseEnter={() => setSearchHovered(true)}
              onMouseLeave={() => setSearchHovered(false)}
            >
              <Search02 className="w-5 h-5" />
              <div className="font-text w-fit flex tracking-[var(--text-letter-spacing)] text-[length:var(--text-font-size)] items-center text-[color:var(--tokens-color-text-text-seconary)] font-[number:var(--text-font-weight)] leading-[var(--text-line-height)] whitespace-nowrap justify-center relative [font-style:var(--text-font-style)]">
                {t('chat.searchChat')}
              </div>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto scrollbar-hide px-3 py-6">
            <div className="flex flex-col items-start gap-6">
              {/* Tools Section */}
              <div className="flex flex-col items-start relative w-full">
                <button className="flex items-center gap-3 px-3 py-2 relative w-full">
                  <MidorasIcon className="w-6 h-6" color="#1F1740" />
                  <div className="relative flex items-center justify-center w-fit font-text font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    Midoras
                  </div>
                </button>

                <button className="flex items-center gap-3 px-3 py-2 relative w-full">
                  <MidorasIcon className="w-6 h-6" color="#1F1740" />
                  <div className="relative flex items-center justify-center w-fit font-text font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    AI Detection
                  </div>
                </button>

                <button className="flex items-center gap-3 px-3 py-2 relative w-full">
                  <MidorasIcon className="w-6 h-6" color="#1F1740" />
                  <div className="relative flex items-center justify-center w-fit font-text font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    AI Humanizer
                  </div>
                </button>
              </div>

              {/* Projects Section */}
              <div className="flex flex-col items-start relative w-full">
                <button className="flex items-center gap-3 px-3 py-2 relative w-full hover:bg-[color:var(--tokens-color-surface-surface-secondary)] rounded transition-colors">
                  <FoldersIcon />
                  <div className="relative flex items-center justify-center w-fit font-text font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    {t('chat.newFolder')}
                  </div>
                </button>

                <div className="flex flex-col items-start relative w-full max-h-48 overflow-y-auto scrollbar-hide ml-3">
                  {projects.map((project, index) => (
                    <button key={index} className="w-full mb-2 flex items-center gap-4">
                      <FolderOpen01
                        key={index}
                        title={project.title}
                        chats={project.chats}
                        isExpanded={expandedProjects[index]}
                        onToggle={() => toggleProject(index)}
                      />
                      <span className="font-text font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                        {project.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recents Section */}
              <div className="flex flex-col items-start gap-2 relative w-full">
                <div className="flex items-center gap-2.5 px-3 py-0 relative w-full">
                  <div className="relative flex items-center justify-center w-fit mt-[-1.00px] font-text-small font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                    {t('chat.recents')}
                  </div>
                </div>

                <div 
                  ref={conversationsContainerRef}
                  className="flex flex-col items-start relative w-full overflow-y-auto scrollbar-hide max-h-[330px]"
                  onScroll={handleConversationsScroll}
                >
                  {conversations.length > 0 ? (
                    <>
                      {conversations
                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                        .map((conversation, index) => (
                        <ChatListItem
                          key={conversation.uuid}
                          text={conversation.name}
                          isSelected={currentConversation?.uuid === conversation.uuid}
                          onClick={() => handleSelectChat(conversation.uuid)}
                        />
                      ))}
                      {/* Loading indicator for more conversations */}
                      {isLoadingMoreConversations && (
                        <div className="w-full p-3 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                          <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--tokens-color-text-text-inactive-2)]"></div>
                            <span className="text-sm">{t('chat.loadingMoreConversations')}</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full p-3 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                      {t('chat.noConversations')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col w-full h-[84px] items-start gap-2.5 p-2.5 flex-shrink-0 relative" ref={dropdownRef}>
          <button 
            onClick={toggleDropdown}
            className="flex items-center gap-2 p-2 rounded-[var(--premitives-corner-radius-corner-radius-5)] relative w-full bg-[color:var(--tokens-color-surface-surface-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
              {userName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col items-start grow gap-1 flex-1 relative">
              <div className="font-h05-heading05 w-fit mt-[-1.00px] tracking-[var(--h05-heading05-letter-spacing)] text-[length:var(--h05-heading05-font-size)] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-brand)] font-[number:var(--h05-heading05-font-weight)] text-center whitespace-nowrap leading-[var(--h05-heading05-line-height)] relative">
                {userName || 'User'}
              </div>
              <div className="font-text-small w-fit mt-[-1.00px] tracking-[var(--text-small-letter-spacing)] text-[length:var(--text-small-font-size)] [font-style:var(--text-small-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)] font-[number:var(--text-small-font-weight)] text-center whitespace-nowrap leading-[var(--text-small-line-height)] relative">
                Plus Member
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-2.5 right-2.5 mb-2 bg-[color:var(--tokens-color-surface-surface-primary)] border border-[color:var(--tokens-color-border-border-primary)] rounded-[var(--premitives-corner-radius-corner-radius)] shadow-lg z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-[color:var(--tokens-color-surface-surface-secondary)] transition-colors first:rounded-t-[var(--premitives-corner-radius-corner-radius)] last:rounded-b-[var(--premitives-corner-radius-corner-radius)]"
              >
                <Logout className="w-4 h-4 text-[color:var(--tokens-color-text-text-inactive-2)]" />
                <span className="font-text font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[length:var(--text-font-size)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
