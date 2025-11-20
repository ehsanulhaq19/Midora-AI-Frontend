"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FolderOpen,
  Search02,
  Plus01_5,
  DownArrow,
  PersonFace,
  MoreOptions,
  LogoText,
  MinusSquare,
  LogoOnly,
  FoldersIcon,
  FolderOpen01,
  Logout,
} from "@/icons";
import { Tooltip, ConversationMenu } from "@/components/ui";
import { NewProjectModal } from "./new-project-modal";
import Image from "next/image";
import { t } from "@/i18n";
import { useAuthRedux } from "@/hooks/use-auth-redux";
import { useConversation } from "@/hooks/use-conversation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { chat } from "@/i18n/languages/en/chat";

const translateWithFallback = (key: string, fallback: string) => {
  const translated = t(key);
  return translated === key ? fallback : translated;
};

interface ChatListItemProps {
  text: string;
  isSelected: boolean;
  onClick: () => void;
  conversationUuid?: string;
  onShare?: (conversationUuid: string) => void;
  onRemoveFromFolder?: (conversationUuid: string) => void;
  onArchive?: (conversationUuid: string) => void;
  onDelete?: (conversationUuid: string) => void;
}

const ChatListItem: React.FC<ChatListItemProps> = ({
  text,
  isSelected,
  onClick,
  conversationUuid,
  onShare,
  onRemoveFromFolder,
  onArchive,
  onDelete,
}) => (
  <div
    className={`w-full flex items-center gap-2.5 px-5 py-2 transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] ${
      isSelected
        ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-brand)]"
        : "text-[color:var(--tokens-color-text-text-conversation)] hover:bg-[color:var(--tokens-color-surface-surface-secondary)]"
    }`}
  >
    <button
      onClick={onClick}
      className="flex-1 text-left"
    >
      <div className="font-h02-heading02 text-[color:var(--light-mode-colors-dark-gray-900)] flex-1 tracking-[var(--text-small-letter-spacing)] text-[14px] [font-style:var(--text-small-font-style)] font-[number:var(--text-small-font-weight)] leading-[var(--text-small-line-height)] truncate">
        {text}
      </div>
    </button>
    {isSelected && conversationUuid && (
      <ConversationMenu
        onShare={onShare ? () => onShare(conversationUuid) : undefined}
        onRemoveFromFolder={onRemoveFromFolder ? () => onRemoveFromFolder(conversationUuid) : undefined}
        onArchive={onArchive ? () => onArchive(conversationUuid) : undefined}
        onDelete={onDelete ? () => onDelete(conversationUuid) : undefined}
      />
    )}
  </div>
);

interface ProjectFolderItemProps {
  title: string;
  chats: string[];
  isExpanded: boolean;
  onToggle: () => void;
}

const ProjectFolderItem: React.FC<ProjectFolderItemProps> = ({
  title,
  chats,
  isExpanded,
  onToggle,
}) => (
  <div className="flex flex-col items-start relative w-full">
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-5 py-2 relative w-full transition-colors rounded-[var(--premitives-corner-radius-corner-radius)] ${
        isExpanded
          ? "bg-[color:var(--tokens-color-surface-surface-tertiary)]"
          : "hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
      }`}
    >
      <FolderOpen className="w-5 h-5" />
      <div
        className={`relative flex items-center justify-center flex-1 mt-[-1.00px] font-h02-heading02 font-[number:var(--text-small-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)] text-left ${
          isExpanded
            ? "text-[color:var(--tokens-color-text-text-brand)]"
            : "text-[color:var(--tokens-color-text-text-seconary)]"
        }`}
      >
        {title}
      </div>
      {isExpanded && <MoreOptions className="w-4 h-4" />}
    </button>

    {isExpanded && (
      <div className="flex flex-col items-start relative w-full pl-2">
        {chats.map((chat, index) => (
          <ChatListItem
            key={index}
            text={chat}
            isSelected={false}
            onClick={() => {}}
          />
        ))}
      </div>
    )}
  </div>
);

interface Project {
  id: string;
  name: string;
  category?: string;
}

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat?: () => void;
  showFullSidebar?: boolean;
  selectedProjectId?: string;
  onProjectSelect?: (project: Project | null) => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  showFullSidebar = true,
  selectedProjectId,
  onProjectSelect,
}) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<
    Record<number, boolean>
  >({});
  const [searchHovered, setSearchHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [isManuallyShrunk, setIsManuallyShrunk] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [userFolders, setUserFolders] = useState<Array<{ id: string; name: string; category?: string }>>([]);
  const [expandedUserProjects, setExpandedUserProjects] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const conversationsContainerRef = useRef<HTMLDivElement>(null);
  const { userName } = useAuthRedux();
  const { logout } = useAuth();
  const router = useRouter();

  // Load folders from localStorage on mount
  useEffect(() => {
    const storedFolders = localStorage.getItem('userProjects');
    if (storedFolders) {
      setUserFolders(JSON.parse(storedFolders));
    }
    
    // Auto-expand selected project
    if (selectedProjectId) {
      setExpandedUserProjects(prev => ({ ...prev, [selectedProjectId]: true }));
    }
  }, [selectedProjectId]);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userProjects', JSON.stringify(userFolders));
  }, [userFolders]);
  
  const brandNameLabel = translateWithFallback("chat.brandName", "Midora");
  const expandSidebarLabel = translateWithFallback(
    "chat.expandSidebar",
    "Expand sidebar"
  );
  const shrinkSidebarLabel = translateWithFallback(
    "chat.shrinkSidebar",
    "Collapse sidebar"
  );

  // Determine if sidebar should be shrunk
  // Sidebar is shrunk if: canvas is open (!showFullSidebar) OR manually shrunk by user
  const isShrunk = !showFullSidebar || isManuallyShrunk;

  // When canvas closes (showFullSidebar becomes true), don't reset manual shrink
  // User's manual preference is preserved
  // When canvas opens (showFullSidebar becomes false), sidebar will shrink regardless of manual state

  const handleToggleSidebar = () => {
    setIsManuallyShrunk(!isManuallyShrunk);
  };
  const {
    conversations,
    currentConversation,
    selectConversation,
    startNewChat,
    loadMoreConversations,
    conversationPagination,
    isLoadingMoreConversations,
  } = useConversation();

  // Get conversations for a project
  const getProjectConversations = useCallback((projectId: string) => {
    const projectConversations = JSON.parse(localStorage.getItem('projectConversations') || '{}');
    const conversationUuids = projectConversations[projectId] || [];
    return conversations.filter(conv => conversationUuids.includes(conv.uuid));
  }, [conversations]);
  
  const toggleUserProject = (projectId: string) => {
    setExpandedUserProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleNewChat = () => {
    setIsManuallyShrunk(false);
    startNewChat();
    onNewChat?.();
  };

  const handleSelectChat = (conversationUuid: string) => {
    selectConversation(conversationUuid);
    setSelectedChat(
      conversations.findIndex((conv) => conv.uuid === conversationUuid)
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Handle scroll to load more conversations
  const handleConversationsScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Check if scrolled to bottom (with a small threshold)
      const threshold = 10;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (
        isNearBottom &&
        !isLoadingMoreConversations &&
        conversationPagination &&
        conversationPagination.page < conversationPagination.total_pages
      ) {
        loadMoreConversations();
      }
    },
    [isLoadingMoreConversations, conversationPagination, loadMoreConversations]
  );

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const projects = [
    {
      title: "Project Discussion",
      chats: [
        "Image to watercolor painting",
        "Image to digital sketch",
        "Image to oil painting",
      ],
    },
    {
      title: "Main Stream Media",
      chats: ["Media analysis", "Content strategy", "Brand guidelines"],
    },
  ];

  const toggleProject = (index: number) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && !isShrunk && (
        <div
          className="fixed inset-0 z-50 lg:hidden "
          onClick={() => {
            setIsManuallyShrunk(true);
            onClose();
          }}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:relative top-0 left-0 z-50 transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isShrunk ? "w-[70px] lg:w-[70px]" : "w-[258px]"}
        ${
          isShrunk
            ? "bg-[color:var(--tokens-color-surface-surface-sidebar-shrunk)]"
            : "bg-[color:var(--tokens-color-surface-surface-neutral)]"
        }
        flex flex-col h-[100vh] relative
      `}
      >
        {/* Header */}
        <div
          className={`flex flex-col items-start flex-shrink-0 pb-6 ${
            isShrunk ? "gap-" : "gap-"
          }`}
        >
          <div
            className={`flex items-center mt-4 py-0 relative w-full transition-all duration-300 ${
              isShrunk ? "px-2 justify-center" : "px-5 justify-between"
            }`}
          >
            {isShrunk ? (
              <Tooltip content={expandSidebarLabel} position="right">
                <button
                  type="button"
                  onClick={handleToggleSidebar}
                  onMouseEnter={() => setLogoHovered(true)}
                  onMouseLeave={() => setLogoHovered(false)}
                  className="group relative flex items-center justify-center rounded-lg p-2 transition-all duration-200 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--tokens-color-text-text-brand)]"
                  aria-label={expandSidebarLabel}
                >
                  {logoHovered ? (
                    <MinusSquare className="w-5 h-5 transition-transform group-hover:scale-105" />
                  ) : (
                    <LogoOnly className="w-5 h-5 transition-transform group-hover:scale-105" />
                  )}
                </button>
              </Tooltip>
            ) : (
              <>
                <LogoText className="relative aspect-[1]" />
                <Tooltip content={shrinkSidebarLabel} position="right">
                  <button
                    type="button"
                    onClick={handleToggleSidebar}
                    className="p-1 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--tokens-color-text-text-brand)]"
                    aria-label={shrinkSidebarLabel}
                  >
                    <MinusSquare className="w-5 h-5" />
                  </button>
                </Tooltip>
              </>
            )}
          </div>

          <div
            className={`flex flex-col items-start relative w-full ${
              isShrunk ? "px-2 items-center" : ""
            }`}
          >
            {isShrunk ? (
              <>
                <button
                  onClick={handleNewChat}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  title={t("chat.newChat")}
                >
                  <div className="w-6 h-6 flex items-center justify-center gap-2.5 rounded-[4px] bg-[color:var(--tokens-color-icon-surface-icon-inactive-brand)] text-white">
                    <Plus01_5 className="w-5 h-5" color="#ffffff" />
                  </div>
                </button>
                <button
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  title={t("chat.searchChat")}
                >
                  <Search02 className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleNewChat}
                  className="flex items-center gap-2 py-2 relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors px-5"
                  title={t("chat.newChat")}
                >
                  <div className="w-6 h-6 flex items-center justify-center gap-2.5 rounded-[4px] bg-[color:var(--tokens-color-icon-surface-icon-inactive-brand)] text-white">
                    <Plus01_5 className="w-5 h-5" color="#ffffff" />
                  </div>
                  <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[color:var(--tokens-color-text-text-brand)] text-[14px] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
                    {t("chat.newChat")}
                  </div>
                </button>
                <button
                  className={`w-full flex items-center rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors px-5 py-2 gap-2 ${
                    searchHovered
                      ? "bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                      : ""
                  }`}
                  onMouseEnter={() => setSearchHovered(true)}
                  onMouseLeave={() => setSearchHovered(false)}
                  title={t("chat.searchChat")}
                >
                  <Search02 className="w-5 h-5" />
                  <div className="font-h02-heading02 w-fit flex tracking-[var(--text-letter-spacing)] text-center text-[14px] relative [font-style:var(--text-font-style)]">
                    {t("chat.searchChat")}
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden overflow-y-auto flex flex-col">
          {/* Tools Section */}
          <div className="flex flex-col items-start relative w-full flex-shrink-0">
            {!isShrunk && (
              <div className="relative flex items-center justify-center w-fit mb-[8px] mt-[-1.00px] font-h02-heading02 font-[number:var(--text-small-font-weight)]  text-[14px] tracking-[var(--text-small-letter-spacing)] [color:var(--tokens-color-text-text-inactive-2)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)] px-5">
                Midoras
              </div>
            )}
            {isShrunk ? (
              <div className="flex flex-col items-center relative w-full px-2">
                <button
                  className="w-10 h-10 rounded-lg  flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  title="Midoras"
                >
                  <Plus01_5 className="relative w-5 h-5" color="#1F1740" />
                </button>
                <button
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  title="AI Detection"
                >
                  <img
                    alt="AI Humanizer"
                    src="/img/ai-detection.png"
                    className="w-5 h-5"
                  />
                </button>
                <button
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  title="AI Humanizer"
                >
                  <img
                    alt="AI Humanizer"
                    src="/img/ai-image.png"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            ) : (
              <>
                <button
                  className="flex items-center relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors px-5 py-2 gap-2"
                  title="Midoras"
                >
                  <Plus01_5 className="relative w-5 h-5" color="#1F1740" />
                  <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    Explore
                  </div>
                </button>

                <button
                  className="flex items-center relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors px-5 py-2 gap-2"
                  title="AI Detection"
                >
                  <PersonFace className="w-5 h-5" />
                  <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    AI Detection
                  </div>
                </button>

                <button
                  className="flex items-center relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors px-5 py-2 gap-2"
                  title="AI Humanizer"
                >
                  <img alt="AI Humanizer" src="/img/ai-image.png" />
                  <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    AI Humanizer
                  </div>
                </button>
              </>
            )}
          </div>

          {/* Projects Section */}
          <div
            className={`flex flex-col items-start relative w-full flex-shrink-0 ${
              isShrunk ? "mt-6 items-center px-2" : "mt-6"
            }`}
          >
            {!isShrunk && (
              <div className="relative flex items-center justify-center w-fit mb-[8px] font-h02-heading02 font-[number:var(--text-small-font-weight)] [color:var(--tokens-color-text-text-inactive-2)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)] px-5">
                Projects
              </div>
            )}
            {isShrunk ? (
              <button
                onClick={() => setIsNewFolderModalOpen(true)}
                className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                title={t("chat.newFolder")}
              >
                <FoldersIcon />
              </button>
            ) : (
              <button
                onClick={() => setIsNewFolderModalOpen(true)}
                className="flex items-center relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors px-5 py-2 gap-2"
                title={t("chat.newFolder")}
              >
                <FoldersIcon />
                <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                  {t("chat.newFolder")}
                </div>
              </button>
            )}

            {!isShrunk && (
              <div className="flex flex-col items-start relative w-full max-h-48 overflow-y-auto scrollbar-hide scroll-smooth">
                {/* User Created Folders */}
                {userFolders.map((folder) => {
                  const isSelected = selectedProjectId === folder.id;
                  const isExpanded = expandedUserProjects[folder.id] || isSelected;
                  const projectConversations = getProjectConversations(folder.id);
                  
                  return (
                    <div key={folder.id} className="w-full">
                      <button
                        type="button"
                        onClick={() => {
                          toggleUserProject(folder.id);
                          if (onProjectSelect) {
                            onProjectSelect(folder);
                          }
                        }}
                        className={`w-full pt-[5px] pb-[8px] px-2 gap-[8px] flex items-center pl-5 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors ${
                          isSelected
                            ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-brand)]"
                            : ""
                        }`}
                      >
                        <FolderOpen01 
                          className={`w-5 h-5 transition-transform ${
                            isExpanded ? "rotate-6" : "rotate-0"
                          } ${isSelected ? "text-[color:var(--tokens-color-text-text-brand)]" : ""}`} 
                        />
                        <span className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)] ${
                          isSelected
                            ? "text-[color:var(--tokens-color-text-text-brand)]"
                            : "text-[color:var(--light-mode-colors-dark-gray-900)]"
                        }`}>
                          {folder.name}
                        </span>
                      </button>
                      
                      {/* Project Conversations */}
                      {isExpanded && projectConversations.length > 0 && (
                        <div className="ml-11 mt-1 flex flex-col gap-1">
                          {projectConversations
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((conversation) => (
                              <button
                                key={conversation.uuid}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectChat(conversation.uuid);
                                }}
                                className={`text-left text-[13px] transition-colors px-2 py-1 rounded hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] ${
                                  currentConversation?.uuid === conversation.uuid
                                    ? "text-[color:var(--tokens-color-text-text-brand)] font-medium"
                                    : "text-[color:var(--tokens-color-text-text-inactive-2)] hover:text-[color:var(--light-mode-colors-dark-gray-900)]"
                                }`}
                              >
                                <div className="truncate">{conversation.name}</div>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {/* Existing Projects */}
                {projects.map((project, index) => (
                  <div key={project.title + index} className="w-full">
                    <button
                      type="button"
                      onClick={() => toggleProject(index)}
                      className="w-full pt-[5px] pb-[8px] px-2 gap-[8px] flex items-center pl-5 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded"
                      aria-expanded={!!expandedProjects[index]}
                    >
                      <FolderOpen01
                        className={`w-5 h-5 transition-transform ${
                          expandedProjects[index] ? "rotate-6" : "rotate-0"
                        }`}
                      />
                      <span className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                        {project.title}
                      </span>
                    </button>
                    {expandedProjects[index] && (
                      <div className="ml-11 mt-1 flex flex-col gap-1">
                        {project.chats.map((chat) => (
                          <button
                            key={chat}
                            type="button"
                            className="text-left text-[13px] text-[color:var(--tokens-color-text-text-inactive-2)] hover:text-[color:var(--light-mode-colors-dark-gray-900)] transition-colors"
                          >
                            {chat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recents Section - Takes remaining space */}
          <div className="flex flex-col items-start relative w-full flex-1 mt-6 min-h-0">
            {!isShrunk && (
              <div className="flex items-center gap-2.5 px-5 py-0 relative w-full">
                <div className="relative flex items-center justify-center w-fit mb-[8px] font-h02-heading02 font-[number:var(--text-small-font-weight)] text-[color:var(--tokens-color-text-text-section-header)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]">
                  {t("chat.recents")}
                </div>
              </div>
            )}

            {isShrunk ? (
              // Icon-only view for conversations
              <div
                ref={conversationsContainerRef}
                className="flex flex-col items-center relative w-full overflow-y-auto scroll-smooth px-2"
                style={{
                  maxHeight: "var(--sidebar-conversations-max-height)",
                  minHeight: "200px",
                }}
                onScroll={handleConversationsScroll}
              >
                {conversations.length > 0 ? (
                  <>
                    {conversations
                      .sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      )
                      .slice(0, 10)
                      .map((conversation) => (
                        <button
                          key={conversation.uuid}
                          onClick={() => handleSelectChat(conversation.uuid)}
                          className={`w-10 h-10 rounded-lg mb-2 flex items-center justify-center transition-colors ${
                            currentConversation?.uuid === conversation.uuid
                              ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-brand)]"
                              : "hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-conversation)]"
                          }`}
                          title={conversation.name}
                        >
                          <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                            {conversation.name.charAt(0).toUpperCase()}
                          </div>
                        </button>
                      ))}
                  </>
                ) : (
                  <div className="w-full p-3 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                    <div className="w-8 h-8 rounded bg-gray-200 mx-auto"></div>
                  </div>
                )}
              </div>
            ) : (
              <div
                ref={conversationsContainerRef}
                className="flex flex-col items-start relative w-full overflow-y-auto scroll-smooth"
                style={{
                  maxHeight: "var(--sidebar-conversations-max-height)",
                  minHeight: "200px",
                }}
                onScroll={handleConversationsScroll}
              >
                {conversations.length > 0 ? (
                  <>
                    {conversations
                      .sort(
                        (a, b) =>
                          new Date(b.created_at).getTime() -
                          new Date(a.created_at).getTime()
                      )
                      .map((conversation, index) => (
                        <ChatListItem
                          key={conversation.uuid}
                          text={conversation.name}
                          isSelected={
                            currentConversation?.uuid === conversation.uuid
                          }
                          onClick={() => handleSelectChat(conversation.uuid)}
                          conversationUuid={conversation.uuid}
                          onShare={(uuid) => {
                            // TODO: Implement share functionality
                            console.log('Share conversation:', uuid);
                          }}
                          onRemoveFromFolder={(uuid) => {
                            // TODO: Implement remove from folder functionality
                            console.log('Remove from folder:', uuid);
                          }}
                          onArchive={(uuid) => {
                            // TODO: Implement archive functionality
                            console.log('Archive conversation:', uuid);
                          }}
                          onDelete={(uuid) => {
                            // TODO: Implement delete functionality
                            console.log('Delete conversation:', uuid);
                          }}
                        />
                      ))}
                    {/* Loading indicator for more conversations */}
                    {isLoadingMoreConversations && (
                      <div className="w-full p-3 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--tokens-color-text-text-inactive-2)]"></div>
                          <span className="text-[14px]">
                            {t("chat.loadingMoreConversations")}
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full p-3 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                    {t("chat.noConversations")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Profile Section */}
        <div
          className={`flex flex-col w-full items-start gap-2.5 flex-shrink-0 relative ${
            isShrunk ? "p-2 items-center" : "p-2.5"
          }`}
          ref={dropdownRef}
        >
          {isShrunk ? (
            <button
              onClick={toggleDropdown}
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] bg-[color:var(--tokens-color-surface-surface-primary)]"
              title={userName || "User"}
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
            </button>
          ) : (
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--premitives-corner-radius-corner-radius-5)] relative w-full bg-[color:var(--tokens-color-surface-surface-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
              title={userName || "User"}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col items-start grow gap-1 flex-1 relative">
                <div className="font-h02-heading02 w-fit tracking-[var(--h05-heading05-letter-spacing)] text-[16px] [font-style:var(--h05-heading05-font-style)] text-[color:var(--tokens-color-text-text-brand)] font-[number:var(--h02-heading02-font-weight)] text-center whitespace-nowrap leading-[var(--h05-heading05-line-height)] relative">
                  {userName || "User"}
                </div>
                <div className="font-h02-heading02 w-fit tracking-[var(--text-small-letter-spacing)] text-[14px] [font-style:var(--text-small-font-style)] text-[color:var(--tokens-color-text-text-inactive-2)] font-[number:var(--text-small-font-weight)] text-center whitespace-nowrap leading-[var(--text-small-line-height)] relative">
                  Plus Member
                </div>
              </div>
              <DownArrow
                className={` transition-transform flex-shrink-0 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          )}

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className={`absolute bottom-full mb-2 bg-[color:var(--tokens-color-surface-surface-primary)] border border-[color:var(--tokens-color-border-border-primary)] rounded-[var(--premitives-corner-radius-corner-radius)] shadow-lg z-50 ${
                isShrunk ? "left-2 right-2" : "left-2.5 right-2.5"
              }`}
            >
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 w-full text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors first:rounded-t-[var(--premitives-corner-radius-corner-radius)] last:rounded-b-[var(--premitives-corner-radius-corner-radius)] ${
                  isShrunk ? "px-3 py-2 justify-center" : "px-5 py-2.5"
                }`}
              >
                <Logout className="w-4 h-4 text-[color:var(--tokens-color-text-text-inactive-2)] flex-shrink-0" />
                {!isShrunk && (
                  <span className="font-text font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-seconary)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    Logout
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onConfirm={(newProject) => {
          const updatedFolders = [...userFolders, newProject];
          setUserFolders(updatedFolders);
          // Save immediately to localStorage
          localStorage.setItem('userProjects', JSON.stringify(updatedFolders));
          // Select the newly created project
          if (onProjectSelect) {
            onProjectSelect(newProject);
          }
          // Start new chat in project context
          startNewChat();
        }}
      />
    </>
  );
};
