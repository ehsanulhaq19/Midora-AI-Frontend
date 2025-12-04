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
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NewProjectModal } from "./new-project-modal";
import Image from "next/image";
import { t } from "@/i18n";
import { useAuthRedux } from "@/hooks/use-auth-redux";
import { useConversation } from "@/hooks/use-conversation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "@/hooks/use-theme";
import { chat } from "@/i18n/languages/en/chat";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  addProject,
  setSelectedProject,
  Project,
} from "@/store/slices/projectsSlice";
import { useProjects } from "@/hooks/use-projects";

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
    className={`sidebar-menu-item group w-full flex items-center gap-2.5 px-5 py-2 transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius)] dark:hover:bg-white/10 ${
      isSelected
        ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] dark:bg-white/10"
        : "hover:bg-[color:var(--tokens-color-surface-surface-secondary)]"
    }`}
  >
    <button onClick={onClick} className="flex-1 text-left max-w-[160px]">
      <div
        className="font-h02-heading02 flex-1 tracking-[var(--text-small-letter-spacing)] text-[14px] [font-style:var(--text-small-font-style)] font-[number:var(--text-small-font-weight)] leading-[var(--text-small-line-height)] truncate max-w-[160px]"
        style={{
          color: isSelected
            ? "var(--tokens-color-text-text-brand)"
            : "var(--tokens-color-text-text-conversation)",
        }}
      >
        {text}
      </div>
    </button>
    {conversationUuid && (
      <ConversationMenu
        className={`opacity-0 group-hover:opacity-100 transition-opacity duration-150 ${
          isSelected ? "opacity-100" : ""
        }`}
        onShare={onShare ? () => onShare(conversationUuid) : undefined}
        onRemoveFromFolder={
          onRemoveFromFolder
            ? () => onRemoveFromFolder(conversationUuid)
            : undefined
        }
        onArchive={onArchive ? () => onArchive(conversationUuid) : undefined}
        onDelete={onDelete ? () => onDelete(conversationUuid) : undefined}
      />
    )}
  </div>
);

interface NavigationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat?: () => void;
  showFullSidebar?: boolean;
  selectedProjectId?: string;
  onProjectSelect?: (project: Project | null) => void;
  onAccountClick?: () => void;
  onNavigate?: () => void;
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  isOpen,
  onClose,
  onNewChat,
  showFullSidebar = true,
  selectedProjectId,
  onProjectSelect,
  onAccountClick,
  onNavigate,
}) => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [selectedProjectConversationUuid, setSelectedProjectConversationUuid] =
    useState<string | null>(null);
  const [searchHovered, setSearchHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);
  const [isManuallyShrunk, setIsManuallyShrunk] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const projectsListRef = useRef<HTMLDivElement>(null);
  const conversationsListRef = useRef<HTMLDivElement>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const { userName } = useAuthRedux();
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  // Get projects from Redux store
  const {
    projects,
    projectConversations,
    projectConversationsData,
    projectsPagination,
    isLoadingMoreProjects,
    selectedProjectId: reduxSelectedProjectId,
  } = useSelector((state: RootState) => state.projects);
  const userFolders = Object.keys(projects).map((key) => projects[key]);
  const { loadProjects, loadProjectConversations } = useProjects();
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const brandNameLabel = translateWithFallback("chat.brandName", "Midora");
  const expandSidebarLabel = translateWithFallback(
    "chat.expandSidebar",
    "Expand sidebar"
  );
  const shrinkSidebarLabel = translateWithFallback(
    "chat.shrinkSidebar",
    "Collapse sidebar"
  );

  const PROJECTS_MAX_HEIGHT = 200;
  const RECENTS_MAX_HEIGHT = 200;

  const [projectsOverflow, setProjectsOverflow] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [conversationsOverflow, setConversationsOverflow] = useState(false);
  const [showAllConversations, setShowAllConversations] = useState(false);

  useEffect(() => {
    if (projectsListRef.current) {
      setProjectsOverflow(
        projectsListRef.current.scrollHeight > PROJECTS_MAX_HEIGHT
      );
    }
  }, [
    userFolders.length,
    projectConversationsData,
    showAllProjects,
    selectedProjectConversationUuid,
  ]);

  // Determine if sidebar should be shrunk
  // Sidebar is shrunk if: canvas is open (!showFullSidebar) OR manually shrunk by user
  const isShrunk = !showFullSidebar || isManuallyShrunk;

  // When canvas closes (showFullSidebar becomes true), don't reset manual shrink
  // User's manual preference is preserved
  // When canvas opens (showFullSidebar becomes false), sidebar will shrink regardless of manual state

  const handleToggleSidebar = () => {
    setIsManuallyShrunk(!isManuallyShrunk);
  };

  const navigateToChat = useCallback(() => {
    if (pathname !== "/chat") {
      router.push("/chat");
    }
  }, [pathname, router]);

  const {
    conversations,
    currentConversation,
    selectConversation,
    startNewChat,
    loadMoreConversations,
    conversationPagination,
    isLoadingMoreConversations,
  } = useConversation();

  useEffect(() => {
    if (conversationsListRef.current) {
      setConversationsOverflow(
        conversationsListRef.current.scrollHeight > RECENTS_MAX_HEIGHT
      );
    }
  }, [
    conversations.length,
    showAllConversations,
    selectedProjectConversationUuid,
    reduxSelectedProjectId,
  ]);

  // Sync selectedProjectConversationUuid and selectedProjectId when currentConversation changes
  useEffect(() => {
    if (currentConversation) {
      // Check if current conversation is a project conversation
      const projectIds = Object.keys(projectConversationsData);
      let foundInProject = false;
      for (const projectId of projectIds) {
        const projectConvs = projectConversationsData[projectId] || [];
        const isProjectConv = projectConvs.some(
          (c: any) => c.uuid === currentConversation.uuid
        );
        if (isProjectConv) {
          setSelectedProjectConversationUuid(currentConversation.uuid);
          // Also ensure the project is selected
          if (reduxSelectedProjectId !== projectId) {
            dispatch(setSelectedProject(projectId));
          }
          foundInProject = true;
          break;
        }
      }
      // If not a project conversation, clear project conversation selection
      if (!foundInProject) {
        setSelectedProjectConversationUuid(null);
      }
    } else {
      setSelectedProjectConversationUuid(null);
    }
  }, [
    currentConversation,
    projectConversationsData,
    reduxSelectedProjectId,
    dispatch,
  ]);

  // Handle scroll to load more conversations
  const handleScrollableContentScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Check if we're near the bottom (within 100px)
      const threshold = 100;
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

  // Get conversations for a project from Redux store
  const getProjectConversations = useCallback(
    (projectId: string) => {
      // First try to get from projectConversationsData (full conversation objects)
      if (
        projectConversationsData[projectId] &&
        projectConversationsData[projectId].length > 0
      ) {
        return projectConversationsData[projectId];
      }
      // Fallback to conversationUuids and filter from conversations
      const conversationUuids = projectConversations[projectId] || [];
      return conversations.filter((conv) =>
        conversationUuids.includes(conv.uuid)
      );
    },
    [conversations, projectConversations, projectConversationsData]
  );

  // Handle scroll to load more projects
  const handleLoadMoreProjects = useCallback(() => {
    if (
      !isLoadingMoreProjects &&
      projectsPagination &&
      projectsPagination.page < projectsPagination.total_pages
    ) {
      loadProjects(projectsPagination.page + 1, projectsPagination.per_page);
    }
  }, [isLoadingMoreProjects, projectsPagination, loadProjects]);

  const handleNewChat = () => {
    setIsManuallyShrunk(false);
    startNewChat();
    onNewChat?.();
    onNavigate?.();
    navigateToChat();
  };

  const handleSelectChat = (conversationUuid: string) => {
    // Unselect project and project conversations
    dispatch(setSelectedProject(null));
    setSelectedProjectConversationUuid(null);

    // Select the conversation
    selectConversation(conversationUuid);
    setSelectedChat(
      conversations.findIndex((conv) => conv.uuid === conversationUuid)
    );
    onNavigate?.();
    navigateToChat();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleAccountClick = () => {
    onAccountClick?.();
    setIsDropdownOpen(false);
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
        fixed lg:relative top-0 left-0 z-[60] lg:z-auto transform transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isShrunk ? "w-[70px] lg:w-[70px]" : "w-[258px]"}
        ${
          isShrunk
            ? "bg-[color:var(--tokens-color-surface-surface-sidebar-shrunk)]"
            : "bg-[color:var(--tokens-color-surface-surface-neutral)]"
        }
        flex flex-col h-[100vh] relative pointer-events-auto
        border-r border-[color:var(--tokens-color-border-border-subtle)]
      `}
      >
        {/* Header */}
        <div
          className={`flex flex-col items-start flex-shrink-0 pb-6 ${
            isShrunk ? "gap-" : "gap-"
          }`}
        >
          <div
            className={`flex items-center mt-4 ${
              isShrunk ? "mb-2 " : "mb-6"
            } py-0 relative w-full transition-all duration-300 ${
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
                    <MinusSquare
                      className="w-5 h-5 transition-transform group-hover:scale-105"
                      color="currentColor"
                      style={{ color: "var(--tokens-color-text-text-primary)" }}
                    />
                  ) : (
                    <LogoOnly className="w-5 h-5 transition-transform group-hover:scale-105" />
                  )}
                </button>
              </Tooltip>
            ) : (
              <>
                {isDark ? (
                  <img src="/img/dark-logo-text.png" alt="Logo" className="!w-[89px] !h-[23px]" />
                ) : (
                  <LogoText className="relative aspect-[1]" />
                )}
                <Tooltip content={shrinkSidebarLabel} position="right">
                  <button
                    type="button"
                    onClick={handleToggleSidebar}
                    className="p-1 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--tokens-color-text-text-brand)]"
                    aria-label={shrinkSidebarLabel}
                  >
                    <MinusSquare
                      className="w-5 h-5"
                      color="currentColor"
                      style={{ color: "var(--tokens-color-text-text-primary)" }}
                    />
                  </button>
                </Tooltip>
              </>
            )}
          </div>

          <div
            className={`flex flex-col items-start relative w-full ${
              isShrunk ? "px-2 items-center" : "px-4"
            }`}
          >
            {isShrunk ? (
              <>
                <button
                  onClick={handleNewChat}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  title={t("chat.newChat")}
                >
                  <div
                    className={`first-letter:w-6 h-6 flex items-center justify-center gap-2.5 rounded-[4px] text-white ${
                      isDark
                        ? "bg-[color:var(--tokens-color-surface-surface-card-purple)]"
                        : " bg-[color:var(--tokens-color-surface-surface-brand)]"
                    }`}
                    // style={{ backgroundColor: '#6B4392' }}
                  >
                    <Plus01_5 className="w-5 h-5" color="#ffffff" />
                  </div>
                </button>
                <button
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                  title={t("chat.searchChat")}
                >
                  <Search02
                    className="w-5 h-5"
                    color="currentColor"
                    style={{ color: "var(--tokens-color-text-text-primary)" }}
                  />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleNewChat}
                  className="sidebar-menu-item flex items-center gap-2 py-2 relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors px-5 dark:hover:bg-white/10"
                  title={t("chat.newChat")}
                >
                  <div
                    className={`w-6 h-6 flex items-center justify-center gap-2.5 rounded-[4px] text-white ${
                      isDark
                        ? "bg-[color:var(--tokens-color-surface-surface-card-purple)]"
                        : " bg-[color:var(--tokens-color-surface-surface-brand)]"
                    }`}
                    // style={{ backgroundColor: '#6B4392' }}
                  >
                    <Plus01_5 className="w-5 h-5" color="#ffffff" />
                  </div>
                  <div
                    className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[14px] tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]"
                    style={{ color: "var(--tokens-color-text-text-brand)" }}
                  >
                    {t("chat.newChat")}
                  </div>
                </button>
                <button
                  className={`sidebar-menu-item w-full flex items-center rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors px-5 py-2 gap-2 ${
                    searchHovered
                      ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] dark:bg-white/10"
                      : ""
                  }`}
                  onMouseEnter={() => setSearchHovered(true)}
                  onMouseLeave={() => setSearchHovered(false)}
                  title={t("chat.searchChat")}
                >
                  <Search02
                    className="w-5 h-5"
                    color="currentColor"
                    style={{ color: "var(--tokens-color-text-text-primary)" }}
                  />
                  <div
                    className="font-h02-heading02 w-fit flex tracking-[var(--text-letter-spacing)] text-center text-[14px] relative [font-style:var(--text-font-style)]"
                    style={{ color: "var(--tokens-color-text-text-primary)" }}
                  >
                    {t("chat.searchChat")}
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          ref={scrollableContentRef}
          onScroll={handleScrollableContentScroll}
          className={`flex-1 overflow-hidden overflow-y-auto flex flex-col ${
            isShrunk ? "px-2" : "px-4"
          }`}
        >
          {/* Tools Section */}
          {/* <div className="flex mb-6 flex-col items-start relative w-full flex-shrink-0">
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
                  className="flex items-center relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius)]  transition-colors px-5 py-2 gap-2"
                  title="Midoras"
                >
                  <Plus01_5 className="relative w-5 h-5" color="#1F1740" />
                  <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    Explore
                  </div>
                </button>

                <button
                  className="flex items-center relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius)]  transition-colors px-5 py-2 gap-2"
                  title="AI Detection"
                >
                  <PersonFace className="w-5 h-5" />
                  <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    AI Detection
                  </div>
                </button>

                <button
                  className="flex items-center relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius)]  transition-colors px-5 py-2 gap-2"
                  title="AI Humanizer"
                >
                  <img alt="AI Humanizer" src="/img/ai-image.png" />
                  <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--light-mode-colors-dark-gray-900)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                    AI Humanizer
                  </div>
                </button>
              </>
            )}
          </div> */}

          {/* Projects Section */}
          <div
            className={`flex flex-col items-start relative w-full flex-shrink-0 ${
              isShrunk ? " items-center px-2" : ""
            }`}
          >
            {!isShrunk && (
              <>
                <div className="sidebar-separator w-full my-2" />
                <div
                  className="relative flex items-center justify-center w-fit mb-[8px] font-h02-heading02 font-[number:var(--text-small-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)] px-5"
                  style={{ color: "var(--tokens-color-text-text-inactive-2)" }}
                >
                  Projects
                </div>
              </>
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
                className="sidebar-menu-item flex items-center relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors px-5 py-2 gap-2 dark:hover:bg-white/10"
                title={t("chat.newFolder")}
              >
                <FoldersIcon
                  color="currentColor"
                  style={{ color: "var(--tokens-color-text-text-primary)" }}
                />
                <div className="relative flex items-center justify-center w-fit font-h02-heading02 font-[number:var(--text-font-weight)] text-[color:var(--tokens-color-text-text-primary)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)]">
                  {t("chat.newFolder")}
                </div>
              </button>
            )}

            {!isShrunk && (
              <>
                <div
                  className="flex flex-col items-start relative w-full gap-1 transition-all"
                  style={
                    !showAllProjects && projectsOverflow
                      ? { maxHeight: "190px", overflow: "hidden" }
                      : undefined
                  }
                >
                  <div
                    ref={projectsListRef}
                    className="flex flex-col w-full gap-1"
                  >
                    {/* User Created Projects */}
                    {userFolders.map((folder) => {
                      // Check if any conversation from this project is selected
                      const hasSelectedConversation =
                        projectConversationsData[folder.id]?.some(
                          (c: any) => c.uuid === selectedProjectConversationUuid
                        ) || false;

                      // Project is selected if:
                      // 1. It's the reduxSelectedProjectId AND no project conversation is selected, OR
                      // 2. A conversation from this project is selected
                      const isSelected =
                        (reduxSelectedProjectId === folder.id &&
                          selectedProjectConversationUuid === null) ||
                        hasSelectedConversation;
                      const projectConvs = getProjectConversations(folder.id);

                      return (
                        <div key={folder.id} className="w-full">
                          <button
                            type="button"
                            onClick={() => {
                              // Unselect recent chat conversations
                              setSelectedChat(null);
                              setSelectedProjectConversationUuid(null);

                              // Select the project
                              dispatch(setSelectedProject(folder.id));
                              if (onProjectSelect) {
                                onProjectSelect(folder);
                              }
                              // Load project conversations if not already loaded
                              if (
                                !projectConversationsData[folder.id] ||
                                projectConversationsData[folder.id].length === 0
                              ) {
                                loadProjectConversations(
                                  folder.id,
                                  1,
                                  10,
                                  false
                                );
                              }
                              onNavigate?.();
                              navigateToChat();
                            }}
                            className={`sidebar-menu-item w-full pt-[5px] pb-[8px] px-2 gap-[8px] flex items-center pl-5 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-[var(--premitives-corner-radius-corner-radius)] transition-colors dark:hover:bg-white/10 ${
                              isSelected
                                ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-brand)] dark:bg-white/10 dark:text-[color:var(--tokens-color-text-text-brand)]"
                                : ""
                            }`}
                          >
                            <FolderOpen01
                              className={`w-5 h-5 transition-transform ${
                                isSelected ? "rotate-6" : ""
                              }`}
                              color="currentColor"
                              style={{
                                color: "var(--tokens-color-text-text-primary)",
                              }}
                            />
                            <span
                              className={`font-h02-heading02 font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] whitespace-nowrap [font-style:var(--text-font-style)] truncate max-w-[160px] ${
                                isSelected
                                  ? "text-[color:var(--tokens-color-text-text-brand)]"
                                  : ""
                              }`}
                              style={{
                                color: isSelected
                                  ? "var(--tokens-color-text-text-brand)"
                                  : "var(--tokens-color-text-text-primary)",
                              }}
                            >
                              {folder.name}
                            </span>
                          </button>

                          {/* Show conversations under selected project - show if project is selected OR if a conversation from this project is selected */}
                          {isSelected && projectConvs.length > 0 && (
                            <div className="w-full pl-8 pr-2 py-1">
                              {projectConvs.map((conv: any) => {
                                const convUuid =
                                  typeof conv === "string" ? conv : conv.uuid;
                                const convName =
                                  typeof conv === "string"
                                    ? conversations.find((c) => c.uuid === conv)
                                        ?.name || "Conversation"
                                    : conv.name;
                                const isConvSelected =
                                  selectedProjectConversationUuid ===
                                    convUuid ||
                                  currentConversation?.uuid === convUuid;

                                return (
                                  <button
                                    key={convUuid}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Unselect recent chat conversations
                                      setSelectedChat(null);
                                      // Ensure project is selected (expanded) and mark conversation as selected
                                      if (
                                        reduxSelectedProjectId !== folder.id
                                      ) {
                                        dispatch(setSelectedProject(folder.id));
                                        if (onProjectSelect) {
                                          onProjectSelect(folder);
                                        }
                                      }
                                      // Select this project conversation
                                      setSelectedProjectConversationUuid(
                                        convUuid
                                      );
                                      // Select the conversation
                                      selectConversation(convUuid);
                                      onNavigate?.();
                                      navigateToChat();
                                    }}
                                    className={`sidebar-menu-item w-full py-1.5 px-2 rounded text-left hover:bg-[color:var(--tokens-color-surface-surface-secondary)] transition-colors ${
                                      selectedProjectConversationUuid ===
                                        convUuid || isConvSelected
                                        ? "bg-[color:var(--tokens-color-surface-surface-secondary)]"
                                        : ""
                                    }`}
                                    style={{
                                      backgroundColor:
                                        selectedProjectConversationUuid ===
                                          convUuid || isConvSelected
                                          ? "var(--tokens-color-surface-surface-secondary)"
                                          : undefined,
                                    }}
                                  >
                                    <div
                                      className="font-h02-heading02 text-[13px] tracking-[var(--text-small-letter-spacing)] [font-style:var(--text-small-font-style)] font-[number:var(--text-small-font-weight)] leading-[var(--text-small-line-height)] truncate max-w-[160px]"
                                      style={{
                                        color:
                                          selectedProjectConversationUuid ===
                                            convUuid || isConvSelected
                                            ? "var(--tokens-color-text-text-brand)"
                                            : "var(--tokens-color-text-text-conversation)",
                                      }}
                                    >
                                      {convName}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Loading indicator for more projects */}
                {isLoadingMoreProjects && (
                  <div className="w-full px-5 py-2 text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                    Loading...
                  </div>
                )}
                {(projectsOverflow && !showAllProjects) ||
                (projectsPagination &&
                  projectsPagination.page < projectsPagination.total_pages) ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (projectsOverflow && !showAllProjects) {
                        setShowAllProjects(true);
                      } else {
                        handleLoadMoreProjects();
                      }
                    }}
                    className="flex items-center gap-2 text-sm px-5 py-2 text-[color:var(--tokens-color-text-text-inactive-2)] hover:text-[color:var(--tokens-color-text-text-brand)] transition-colors"
                  >
                    {/* <span className="text-lg leading-none">…</span> */}
                    <span className="text-[color:var(--tokens-color-text-text-inactive-2)] hover:text-[color:var(--tokens-color-text-text-brand)]">
                      See more
                    </span>
                  </button>
                ) : null}
              </>
            )}
          </div>

          {/* Recents Section - Takes remaining space */}
          <div className="flex flex-col items-start relative w-full flex-1 mt-6 min-h-0">
            {!isShrunk && (
              <>
                <div className="sidebar-separator w-full my-2" />
                <div className="flex items-center gap-2.5 px-5 py-0 relative w-full">
                  <div
                    className="relative flex items-center justify-center w-fit mb-[8px] font-h02-heading02 font-[number:var(--text-small-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] whitespace-nowrap [font-style:var(--text-small-font-style)]"
                    style={{
                      color: "var(--tokens-color-text-text-section-header)",
                    }}
                  >
                    {t("chat.recents")}
                  </div>
                </div>
              </>
            )}

            {isShrunk ? (
              // Icon-only view for conversations
              <div className="flex flex-col items-center relative w-full px-2 gap-2">
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
                          className={`w-10 h-10 rounded-lg mb-2 flex items-center justify-center transition-colors dark:hover:bg-white/10 ${
                            currentConversation?.uuid === conversation.uuid &&
                            selectedProjectConversationUuid === null &&
                            reduxSelectedProjectId === null
                              ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] dark:bg-white/10"
                              : "hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
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
                  <div
                    className="w-full p-3 text-center"
                    style={{
                      color: "var(--tokens-color-text-text-inactive-2)",
                    }}
                  >
                    <div className="w-8 h-8 rounded bg-gray-200 mx-auto dark:bg-white/10"></div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div
                  className="flex flex-col items-start relative w-full gap-1 transition-all"
                  // Remove maxHeight restriction to allow scrolling and infinite scroll
                >
                  <div
                    ref={conversationsListRef}
                    className="flex flex-col w-full gap-1"
                  >
                    {conversations.length > 0 ? (
                      <>
                        {conversations
                          .sort(
                            (a, b) =>
                              new Date(b.created_at).getTime() -
                              new Date(a.created_at).getTime()
                          )
                          .map((conversation) => (
                            <ChatListItem
                              key={conversation.uuid}
                              text={conversation.name}
                              isSelected={
                                currentConversation?.uuid ===
                                  conversation.uuid &&
                                selectedProjectConversationUuid === null &&
                                reduxSelectedProjectId === null
                              }
                              onClick={() =>
                                handleSelectChat(conversation.uuid)
                              }
                              conversationUuid={conversation.uuid}
                              onShare={(uuid) => {
                                // TODO: Implement share functionality
                                console.log("Share conversation:", uuid);
                              }}
                              onRemoveFromFolder={(uuid) => {
                                // TODO: Implement remove from folder functionality
                                console.log("Remove from folder:", uuid);
                              }}
                              onArchive={(uuid) => {
                                // TODO: Implement archive functionality
                                console.log("Archive conversation:", uuid);
                              }}
                              onDelete={(uuid) => {
                                // TODO: Implement delete functionality
                                console.log("Delete conversation:", uuid);
                              }}
                            />
                          ))}
                      </>
                    ) : (
                      <div
                        className="w-full p-3 text-center"
                        style={{
                          color: "var(--tokens-color-text-text-inactive-2)",
                        }}
                      >
                        {t("chat.noConversations")}
                      </div>
                    )}
                  </div>
                </div>
                {/* Removed "See more" button - now using infinite scroll instead */}
                {/* Loading indicator for more conversations */}
                {isLoadingMoreConversations && (
                  <div
                    className="w-full p-3 text-center"
                    style={{
                      color: "var(--tokens-color-text-text-inactive-2)",
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="animate-spin rounded-full h-4 w-4 border-b-2"
                        style={{
                          borderColor:
                            "var(--tokens-color-text-text-inactive-2)",
                        }}
                      ></div>
                      <span className="text-[14px]">
                        {t("chat.loadingMoreConversations")}
                      </span>
                    </div>
                  </div>
                )}
              </>
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
          {/* Dark Mode Toggle */}
          {!isShrunk && (
            <div
              className="w-full px-3 py-2 flex items-center justify-between border-t"
              style={{
                borderColor: "var(--tokens-color-border-border-subtle)",
              }}
            >
              <span
                className="font-h02-heading02 text-[14px]"
                style={{
                  color: "var(--tokens-color-text-text-section-header)",
                }}
              >
                Theme
              </span>
              <ThemeToggle />
            </div>
          )}

          {isShrunk ? (
            <>
              <button
                onClick={handleAccountClick}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                style={{
                  backgroundColor:
                    "var(--tokens-color-surface-surface-primary)",
                }}
                title={userName || "User"}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                  {userName?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>
              <ThemeToggle />
            </>
          ) : (
            <button
              onClick={handleAccountClick}
              className="sidebar-menu-item flex items-center gap-2 px-3 py-2 rounded-[var(--premitives-corner-radius-corner-radius-5)] relative w-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
              style={{
                backgroundColor: "var(--tokens-color-surface-surface-primary)",
              }}
              title={userName || "User"}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                {userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col items-start grow gap-1 flex-1 relative">
                <div
                  className="font-h02-heading02 w-fit tracking-[var(--h05-heading05-letter-spacing)] [font-style:var(--h05-heading05-font-style)] font-[number:var(--h02-heading02-font-weight)] text-center whitespace-nowrap leading-[var(--h05-heading05-line-height)] relative"
                  style={{ color: "var(--tokens-color-text-text-brand)" }}
                >
                  {userName || "User"}
                </div>
                <div
                  className="font-h02-heading02 w-fit tracking-[var(--text-small-letter-spacing)] text-[14px] [font-style:var(--text-small-font-style)] font-[number:var(--text-small-font-weight)] text-center whitespace-nowrap leading-[var(--text-small-line-height)] relative"
                  style={{ color: "var(--tokens-color-text-text-inactive-2)" }}
                >
                  Plus Member
                </div>
              </div>
              <DownArrow
                className={`transition-transform flex-shrink-0 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                color="currentColor"
                style={{ color: "var(--tokens-color-text-text-primary)" }}
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
                className={`sidebar-menu-item flex items-center gap-3 w-full text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors first:rounded-t-[var(--premitives-corner-radius-corner-radius)] last:rounded-b-[var(--premitives-corner-radius-corner-radius)] dark:hover:bg-white/10 ${
                  isShrunk ? "px-3 py-2 justify-center" : "px-5 py-2.5"
                }`}
              >
                <Logout
                  className="w-4 h-4 flex-shrink-0"
                  color="currentColor"
                />
                {!isShrunk && (
                  <span
                    className="font-text font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
                    style={{ color: "var(--tokens-color-text-text-seconary)" }}
                  >
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
          // Add project to Redux store
          dispatch(addProject(newProject));
          dispatch(setSelectedProject(newProject.id));
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
