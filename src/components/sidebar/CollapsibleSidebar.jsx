// src/components/sidebar/CollapsibleSidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ChatBubbleLeftRightIcon,
  WrenchScrewdriverIcon,
  PhotoIcon,
  MagnifyingGlassIcon,
  MusicalNoteIcon,
  QuestionMarkCircleIcon,
  PlusIcon,
  ChevronLeftIcon,
  HomeIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  SparklesIcon,
  QuestionMarkCircleIcon as HelpIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  PaintBrushIcon,
  EllipsisHorizontalIcon,
  ShareIcon,
  PencilIcon,
  FolderPlusIcon,
  ArchiveBoxIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { authHelpers, apiHelpers } from '../../services/authHelpers';

// Chat Menu Component - FINAL PORTAL VERSION
const ChatMenu = ({
  chat,
  onShare,
  onRename,
  onAddToProject,
  onArchive,
  onDelete,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRenameInput, setShowRenameInput] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title || '');

  // State to hold the calculated position for the portal
  const [menuStyle, setMenuStyle] = useState({});
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // 1. Calculate the menu's position when it opens
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();

      const menuHeight = 220; // Estimated height of your menu
      const menuWidth = 160;  // Estimated width of your menu
      const spaceBelow = window.innerHeight - rect.bottom;
      const opensUp = spaceBelow < menuHeight;

      // Set the style for the portal. We use fixed positioning to escape all containers.
      setMenuStyle({
        position: 'fixed',
        top: opensUp ? `${rect.top - menuHeight}px` : `${rect.bottom + 4}px`,
        left: `${rect.right - menuWidth}px`,
        minWidth: `${menuWidth}px`,
        zIndex: 1000,
      });
    }
  }, [isOpen]);

  // 2. Handle clicks outside to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
        buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowRenameInput(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (action, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (action === 'rename') {
      setShowRenameInput(true);
      setIsOpen(false);
      return;
    }
    setIsOpen(false);
    switch (action) {
      case 'share': onShare?.(chat); break;
      case 'addToProject': onAddToProject?.(chat); break;
      case 'archive': onArchive?.(chat); break;
      case 'delete': onDelete?.(chat); break;
    }
  };

  const handleRenameSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (newTitle.trim() && newTitle !== chat.title) {
      onRename?.(chat, newTitle.trim());
    }
    setShowRenameInput(false);
  };

  const handleRenameCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNewTitle(chat.title || '');
    setShowRenameInput(false);
  };

  const menuItems = [
    { icon: ShareIcon, label: 'Share', action: 'share', className: 'text-gray-700 hover:text-gray-900' },
    { icon: PencilIcon, label: 'Rename', action: 'rename', className: 'text-gray-700 hover:text-gray-900' },
    { icon: FolderPlusIcon, label: 'Add to project', action: 'addToProject', className: 'text-gray-700 hover:text-gray-900' },
    { icon: ArchiveBoxIcon, label: 'Archive', action: 'archive', className: 'text-gray-700 hover:text-gray-900' },
    { icon: TrashIcon, label: 'Delete', action: 'delete', className: 'text-red-600 hover:text-red-700' }
  ];

  if (showRenameInput) {
    return (
      <div className={`flex items-center w-full ${className}`}>
        <form onSubmit={handleRenameSubmit} className="flex-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleRenameCancel}
            onKeyDown={(e) => { if (e.key === 'Escape') { handleRenameCancel(e); } }}
            className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
            maxLength={100}
          />
        </form>
      </div>
    );
  }

  // 3. Define the menu content to be rendered in the portal
  const MenuContent = (
    <div ref={menuRef} style={menuStyle} className="bg-white border border-gray-200 rounded-lg shadow-lg py-1">
      {menuItems.map((item) => (
        <button
          key={item.action}
          onClick={(e) => handleMenuItemClick(item.action, e)}
          className={`w-full flex items-center px-3 py-2 text-sm transition-colors text-left hover:bg-gray-50 ${item.className}`}
        >
          <item.icon className="w-4 h-4 mr-3" />
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleMenuClick}
        className={`p-1 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 ${className}`}
        title="Chat options"
      >
        <EllipsisHorizontalIcon className="w-4 h-4 text-gray-500" />
      </button>

      {/* 4. Use createPortal to render the menu at the top level of the document */}
      {isOpen && createPortal(MenuContent, document.body)}
    </>
  );
};

const CollapsibleSidebar = ({ isCollapsed, onToggle, onNavigate, currentPath, onNewChat, onSessionLoad, refreshTrigger }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [lastRefreshTrigger, setLastRefreshTrigger] = useState(0);
  const dropdownRef = useRef(null);

  // Load user data when component mounts
  useEffect(() => {
    const user = authHelpers.getCurrentUser();
    setCurrentUser(user);
    loadChatSessions();
  }, []);

  // FIXED: Better refresh trigger handling
  useEffect(() => {
    if (refreshTrigger > 0 && refreshTrigger !== lastRefreshTrigger) {
      console.log('🔄 Sidebar refresh triggered:', refreshTrigger);
      setLastRefreshTrigger(refreshTrigger);

      // Immediate refresh without debouncing for responsiveness
      loadChatSessions();
    }
  }, [refreshTrigger, lastRefreshTrigger]);

  // FIXED: Helper function to safely try dynamic imports with multiple paths
  const tryImportChatStorageService = async () => {
    const importPaths = [
      '../features/chatPersistence/services/chatStorageService',
      '../features/chatPersistence/services/chatStorageService.js',
      '../../features/chatPersistence/services/chatStorageService',
      '../../features/chatPersistence/services/chatStorageService.js',
      './chatStorageService',
      './chatStorageService.js'
    ];

    for (const path of importPaths) {
      try {
        console.log(`🔍 Trying import path: ${path}`);
        const serviceModule = await import(/* @vite-ignore */ path);
        const chatStorageService = serviceModule.chatStorageService || serviceModule.default;

        if (chatStorageService && typeof chatStorageService === 'object') {
          console.log(`✅ Successfully imported from: ${path}`);
          console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(chatStorageService)));
          return chatStorageService;
        }
      } catch (error) {
        console.warn(`⚠️ Import failed for path ${path}:`, error.message);
      }
    }

    throw new Error('Could not import chatStorageService from any path');
  };

  // FIXED: Robust loadChatSessions with multiple fallback methods
  const loadChatSessions = async () => {
    try {
      setLoading(true);
      console.log('📡 Loading chat sessions...');

      // Check authentication first
      if (!authHelpers.isAuthenticated()) {
        console.log('🔍 User not authenticated');
        setChatHistory([]);
        return;
      }

      let sessions = [];

      // FIXED: Try multiple methods to load sessions with better error handling
      try {
        // Method 1: Try apiHelpers.chatPersistenceApi
        if (apiHelpers?.chatPersistenceApi?.loadSessions) {
          console.log('📡 Using apiHelpers.chatPersistenceApi.loadSessions');
          sessions = await apiHelpers.chatPersistenceApi.loadSessions(50, 0);
          console.log('✅ apiHelpers method succeeded');
        }
        // Method 2: Try to dynamically import and use chatStorageService
        else {
          console.log('📡 Trying to import chatStorageService dynamically...');
          try {
            const chatStorageService = await tryImportChatStorageService();

            // Try different method names that might exist
            const methodsToTry = ['loadSessions', 'getSessions', 'loadChats', 'getChats'];
            let methodWorked = false;

            for (const methodName of methodsToTry) {
              if (chatStorageService[methodName] && typeof chatStorageService[methodName] === 'function') {
                console.log(`📡 Using dynamically imported chatStorageService.${methodName}`);
                sessions = await chatStorageService[methodName](50, 0);
                methodWorked = true;
                break;
              }
            }

            if (!methodWorked) {
              throw new Error(`No compatible method found. Available methods: ${Object.getOwnPropertyNames(Object.getPrototypeOf(chatStorageService))}`);
            }
          } catch (importError) {
            console.warn('⚠️ Dynamic import failed:', importError);
            throw importError;
          }
        }
      } catch (apiError) {
        console.error('❌ API Error loading sessions:', apiError);

        // Method 3: Direct API call as fallback
        console.log('📡 Using direct API call fallback');
        const token = authHelpers.getToken();

        if (!token) {
          throw new Error('No authentication token available');
        }

        // Try multiple API endpoints
        const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
        const endpoints = [
          `${baseUrl}/api/v1/chat-persistence/sessions`,
          `${baseUrl}/api/v1/chat-sessions`,
          `${baseUrl}/api/v1/endpoints/chat_persistence`,
          `${baseUrl}/api/sessions`,
          '/api/v1/chat-persistence/sessions',
          '/api/v1/chat-sessions',
          '/api/v1/endpoints/chat_persistence',
          '/api/sessions'
        ];

        let apiSuccess = false;
        for (const endpoint of endpoints) {
          try {
            console.log(`🌐 Trying endpoint: ${endpoint}`);
            const response = await fetch(`${endpoint}?limit=50&offset=0`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            sessions = data.sessions || data.data || data || [];
            console.log(`✅ Direct API call succeeded with ${endpoint}`);
            apiSuccess = true;
            break;
          } catch (endpointError) {
            console.warn(`⚠️ ${endpoint} failed:`, endpointError.message);
          }
        }

        if (!apiSuccess) {
          // Method 4: Try localStorage as final fallback
          const localSessions = localStorage.getItem('askwise_chats') || localStorage.getItem('chatSessions');
          if (localSessions) {
            console.log('📦 Using localStorage fallback');
            const parsedSessions = JSON.parse(localSessions);
            // Convert local format to expected format
            sessions = parsedSessions.map(chat => ({
              id: chat.id,
              title: chat.title || 'New Chat',
              created_at: chat.lastModified || new Date().toISOString(),
              updated_at: chat.lastModified || new Date().toISOString(),
              model_name: chat.model || 'default',
              message_count: chat.messages?.length || 0
            }));
          } else {
            console.warn('⚠️ All session loading methods failed, returning empty array');
            sessions = [];
          }
        }
      }

      console.log('📊 Raw sessions data:', sessions);
      console.log('📊 Number of sessions:', sessions?.length || 0);

      // FIXED: Better session formatting with error handling
      const formattedSessions = (sessions || []).map(session => {
        try {
          return {
            id: session.id || session.session_id || `temp_${Date.now()}_${Math.random()}`,
            title: session.title || session.name || 'New Chat',
            timestamp: formatTimestamp(session.created_at || session.updated_at || session.timestamp || new Date()),
            sessionData: session
          };
        } catch (formatError) {
          console.warn('⚠️ Error formatting session:', session, formatError);
          return {
            id: `error_${Date.now()}_${Math.random()}`,
            title: 'New Chat',
            timestamp: 'Today',
            sessionData: session || {}
          };
        }
      }).filter(session => session.id && session.id !== null && session.id !== undefined);

      // Sort by creation/update date (newest first)
      formattedSessions.sort((a, b) => {
        try {
          const dateA = new Date(a.sessionData.updated_at || a.sessionData.created_at || 0);
          const dateB = new Date(b.sessionData.updated_at || b.sessionData.created_at || 0);
          return dateB - dateA;
        } catch (sortError) {
          console.warn('⚠️ Error sorting sessions:', sortError);
          return 0;
        }
      });

      setChatHistory(formattedSessions);
      console.log('✅ Chat sessions loaded successfully:', formattedSessions.length);

      // FIXED: Update localStorage cache
      try {
        if (sessions && sessions.length > 0) {
          localStorage.setItem('chatSessions', JSON.stringify(sessions));
          localStorage.setItem('chatSessionsTimestamp', Date.now().toString());
        }
      } catch (storageError) {
        console.warn('⚠️ Could not update localStorage cache:', storageError);
      }

    } catch (error) {
      console.error('❌ Failed to load chat sessions:', error);

      // If it's an auth error, clear the history
      if (error.message.includes('401') || error.message.includes('Authentication') || error.message.includes('token')) {
        console.log('🔓 Authentication error detected, clearing chat history');
        setChatHistory([]);
        // Optionally redirect to login
        // onNavigate?.('/login');
      } else {
        // For other errors, try to load from localStorage as final fallback
        try {
          const localSessions = localStorage.getItem('askwise_chats') || localStorage.getItem('chatSessions');
          if (localSessions) {
            console.log('📦 Loading from localStorage as error fallback');
            const parsedSessions = JSON.parse(localSessions);
            const formattedSessions = parsedSessions.map(chat => ({
              id: chat.id || `local_${Date.now()}_${Math.random()}`,
              title: chat.title || 'New Chat',
              timestamp: formatTimestamp(chat.lastModified || new Date()),
              sessionData: chat
            }));
            setChatHistory(formattedSessions);
          } else {
            setChatHistory([]);
          }
        } catch (localError) {
          console.warn('⚠️ localStorage fallback also failed:', localError);
          setChatHistory([]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);

      if (diffInHours < 24) {
        return 'Today';
      } else if (diffInHours < 48) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      console.warn('⚠️ Error formatting timestamp:', timestamp, error);
      return 'Recently';
    }
  };

  // Chat Menu Handlers
  const handleShareChat = async (chat) => {
    try {
      // Create a shareable link
      const shareUrl = `${window.location.origin}/chat/${chat.id}`;

      if (navigator.share) {
        // Use native sharing if available
        await navigator.share({
          title: chat.title,
          text: `Check out this chat: ${chat.title}`,
          url: shareUrl
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        alert('Chat link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing chat:', error);
      alert('Failed to share chat');
    }
  };

  // FIXED: Enhanced rename handler with robust dynamic imports
  const handleRenameChat = async (chat, newTitle) => {
    try {
      console.log('🏷️ Renaming chat:', chat.id, 'to:', newTitle);

      // Try multiple API methods with dynamic imports
      let success = false;

      if (apiHelpers?.chatPersistenceApi?.updateSession) {
        await apiHelpers.chatPersistenceApi.updateSession(chat.id, { title: newTitle });
        success = true;
      } else {
        try {
          const chatStorageService = await tryImportChatStorageService();
          const methodsToTry = ['updateSession', 'updateChat', 'saveChat'];

          for (const methodName of methodsToTry) {
            if (chatStorageService[methodName] && typeof chatStorageService[methodName] === 'function') {
              if (methodName === 'saveChat') {
                // For saveChat, we need to pass the full chat object
                const updatedChat = { ...chat.sessionData, title: newTitle };
                await chatStorageService[methodName](updatedChat);
              } else {
                await chatStorageService[methodName](chat.id, { title: newTitle });
              }
              success = true;
              break;
            }
          }
        } catch (importError) {
          console.warn('⚠️ Dynamic import failed for rename:', importError);
        }
      }

      if (!success) {
        // Direct API call fallback
        const token = authHelpers.getToken();
        const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
        const endpoints = [
          `${baseUrl}/api/v1/chat-persistence/sessions/${chat.id}`,
          `${baseUrl}/api/v1/chat-sessions/${chat.id}`,
          `/api/v1/chat-sessions/${chat.id}`,
          `/api/sessions/${chat.id}`
        ];

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ title: newTitle })
            });

            if (response.ok) {
              success = true;
              break;
            }
          } catch (endpointError) {
            console.warn(`⚠️ Rename endpoint ${endpoint} failed:`, endpointError);
          }
        }
      }

      if (success) {
        // Force immediate refresh
        await loadChatSessions();
        console.log('✅ Chat renamed successfully');
      } else {
        throw new Error('All rename methods failed');
      }

    } catch (error) {
      console.error('❌ Error renaming chat:', error);
      alert('Failed to rename chat');
    }
  };

  const handleAddToProject = (chat) => {
    // Placeholder for future project functionality
    console.log('📁 Add to project:', chat.title);
    alert('Add to project feature coming soon!');
  };

  // FIXED: Enhanced archive handler with robust dynamic imports
  const handleArchiveChat = async (chat) => {
    try {
      console.log('📦 Archiving chat:', chat.id);

      const confirmed = confirm(`Archive "${chat.title}"? This will remove it from your chat list.`);

      if (confirmed) {
        let success = false;

        // Try multiple API methods
        if (apiHelpers?.chatPersistenceApi?.deleteSession) {
          await apiHelpers.chatPersistenceApi.deleteSession(chat.id);
          success = true;
        } else {
          try {
            const chatStorageService = await tryImportChatStorageService();
            const methodsToTry = ['deleteSession', 'deleteChat'];

            for (const methodName of methodsToTry) {
              if (chatStorageService[methodName] && typeof chatStorageService[methodName] === 'function') {
                await chatStorageService[methodName](chat.id);
                success = true;
                break;
              }
            }
          } catch (importError) {
            console.warn('⚠️ Dynamic import failed for archive:', importError);
          }
        }

        if (!success) {
          // Direct API call fallback
          const token = authHelpers.getToken();
          const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
          const endpoints = [
            `${baseUrl}/api/v1/chat-persistence/sessions/${chat.id}`,
            `${baseUrl}/api/v1/chat-sessions/${chat.id}`,
            `/api/v1/chat-sessions/${chat.id}`,
            `/api/sessions/${chat.id}`
          ];

          for (const endpoint of endpoints) {
            try {
              const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                success = true;
                break;
              }
            } catch (endpointError) {
              console.warn(`⚠️ Archive endpoint ${endpoint} failed:`, endpointError);
            }
          }
        }

        if (success) {
          // Force immediate refresh
          await loadChatSessions();
          console.log('✅ Chat archived successfully');
        } else {
          throw new Error('All archive methods failed');
        }
      }
    } catch (error) {
      console.error('❌ Error archiving chat:', error);
      alert('Failed to archive chat');
    }
  };

  // FIXED: Enhanced delete handler with robust dynamic imports
  const handleDeleteChat = async (chat) => {
    try {
      console.log('🗑️ Deleting chat:', chat.id);

      const confirmed = confirm(`Delete "${chat.title}"? This action cannot be undone.`);

      if (confirmed) {
        let success = false;

        // Try multiple API methods (same as archive for now)
        if (apiHelpers?.chatPersistenceApi?.deleteSession) {
          await apiHelpers.chatPersistenceApi.deleteSession(chat.id);
          success = true;
        } else {
          try {
            const chatStorageService = await tryImportChatStorageService();
            const methodsToTry = ['deleteSession', 'deleteChat'];

            for (const methodName of methodsToTry) {
              if (chatStorageService[methodName] && typeof chatStorageService[methodName] === 'function') {
                await chatStorageService[methodName](chat.id);
                success = true;
                break;
              }
            }
          } catch (importError) {
            console.warn('⚠️ Dynamic import failed for delete:', importError);
          }
        }

        if (!success) {
          // Direct API call fallback
          const token = authHelpers.getToken();
          const baseUrl = import.meta.env.VITE_API_BASE_URL || window.location.origin;
          const endpoints = [
            `${baseUrl}/api/v1/chat-persistence/sessions/${chat.id}`,
            `${baseUrl}/api/v1/chat-sessions/${chat.id}`,
            `/api/v1/chat-sessions/${chat.id}`,
            `/api/sessions/${chat.id}`
          ];

          for (const endpoint of endpoints) {
            try {
              const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.ok) {
                success = true;
                break;
              }
            } catch (endpointError) {
              console.warn(`⚠️ Delete endpoint ${endpoint} failed:`, endpointError);
            }
          }
        }

        if (success) {
          // Force immediate refresh
          await loadChatSessions();
          console.log('✅ Chat deleted successfully');
        } else {
          throw new Error('All delete methods failed');
        }
      }
    } catch (error) {
      console.error('❌ Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  const navigationItems = [
    {
      icon: ChatBubbleLeftRightIcon,
      label: 'AI Chat',
      path: '/chat',
      active: currentPath === '/chat' || currentPath.startsWith('/chat')
    },
    {
      icon: PhotoIcon,
      label: 'Image Generation',
      path: '/image-generation',
      active: currentPath === '/image-generation'
    },
    {
      icon: MagnifyingGlassIcon,
      label: 'AI Search Engine',
      path: '/search',
      active: currentPath === '/search'
    },
    {
      icon: MusicalNoteIcon,
      label: 'Stoick Investment Tool',
      path: '/investment',
      active: currentPath === '/investment'
    }
  ];

  const bottomItems = [
    {
      icon: HomeIcon,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      icon: QuestionMarkCircleIcon,
      label: 'Help & FAQ',
      path: '/help'
    },
    {
      icon: WrenchScrewdriverIcon,
      label: 'Explore Tools',
      path: '/tools'
    }
  ];

  // FIXED: Enhanced handleNewChatClick with better error handling and refresh
  const handleNewChatClick = async () => {
    console.log('🆕 New chat button clicked');

    if (onNewChat) {
      try {
        // Create the new chat
        console.log('🔨 Creating new chat...');
        const result = await onNewChat();
        console.log('✅ New chat created successfully:', result);

        // Wait for backend to process (shorter delay for better UX)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Force refresh the sidebar with multiple attempts
        console.log('🔄 Force refreshing sidebar after new chat...');
        await loadChatSessions();

        // If the first refresh doesn't show the new chat, try again
        setTimeout(async () => {
          console.log('🔄 Secondary refresh check...');
          await loadChatSessions();
        }, 1000);

      } catch (error) {
        console.error('❌ Error creating new chat:', error);
        // Still try to refresh in case the chat was created but we got an error
        setTimeout(() => loadChatSessions(), 1000);
      }
    }
  };

  // FIXED: Enhanced manual refresh with loading state
  const forceRefresh = async () => {
    console.log('🔧 Force refresh triggered');
    await loadChatSessions();
  };

  const handleLogout = async () => {
    try {
      await authHelpers.logout();
      onNavigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      onNavigate('/login');
    }
  };

  const handleSessionClick = (chat) => {
    console.log('🎯 Session clicked:', chat.id);
    if (onSessionLoad) {
      // Pass the chat ID to onSessionLoad, assuming ChatLayout will then use loadChatById
      onSessionLoad(chat.id); // Changed from chat.sessionData
    }
  };

  // Book Icon Component (Claude-style)
  const BookIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 6.5A2.5 2.5 0 0 1 4.5 4H20v16H4.5A2.5 2.5 0 0 1 2 17.5v-11z" />
      <path d="M7 4v16" />
    </svg>
  );

  // Get user display info
  const getUserDisplayInfo = () => {
    if (currentUser) {
      return {
        initials: (currentUser.name || currentUser.email || 'U').charAt(0).toUpperCase(),
        email: currentUser.email || 'No email',
        name: currentUser.name || 'User'
      };
    }
    return {
      initials: 'U',
      email: 'Not logged in',
      name: 'User'
    };
  };

  const userInfo = getUserDisplayInfo();

  // User Profile Dropdown Component
  const UserProfileDropdown = ({ userInfo, onNavigate, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };

      if (isDropdownOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isDropdownOpen]);

    const profileMenuItems = [
      {
        icon: UserIcon,
        label: userInfo.email,
        action: null,
        isEmail: true
      },
      {
        icon: SparklesIcon,
        label: 'Upgrade plan',
        action: () => onNavigate('/upgrade')
      },
      {
        icon: PaintBrushIcon,
        label: 'Customize ChatGPT',
        action: () => onNavigate('/customize')
      },
      {
        icon: Cog6ToothIcon,
        label: 'Settings',
        action: () => onNavigate('/settings')
      },
      {
        icon: HelpIcon,
        label: 'Help',
        action: () => onNavigate('/help'),
        hasArrow: true
      },
      {
        icon: ArrowRightOnRectangleIcon,
        label: 'Log out',
        action: onLogout,
        isDanger: true
      }
    ];

    const handleToggleDropdown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDropdownOpen(!isDropdownOpen);
    };

    const handleItemClick = (e, item) => {
      e.preventDefault();
      e.stopPropagation();

      if (item.action) {
        item.action();
      }
      setIsDropdownOpen(false);
    };

    return (
      <div className="mt-3 pt-3 border-t border-gray-200 relative" ref={dropdownRef}>
        <button
          onClick={handleToggleDropdown}
          className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 transition-colors"
          type="button"
        >
          <div className="flex items-center">
            <div className="w-7 h-7 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{userInfo.initials}</span>
            </div>
            <div className="ml-2.5 flex-1 min-w-0">
              <div className="sidebar-user-email truncate">
                {userInfo.email}
              </div>
            </div>
          </div>
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-2">
            {profileMenuItems.map((item, index) => (
              <button
                key={index}
                onClick={(e) => handleItemClick(e, item)}
                disabled={item.isEmail}
                type="button"
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                  ${item.isEmail
                    ? 'cursor-default'
                    : item.isDanger
                      ? 'hover:bg-red-50 text-red-600 hover:text-red-700'
                      : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                  }
                `}
              >
                <div className="flex items-center">
                  <item.icon className={`w-4 h-4 mr-3 ${item.isDanger ? 'text-red-600' : 'text-gray-500'}`} />
                  <span className={`text-sm ${item.isEmail ? 'font-medium text-gray-900' : ''}`}>
                    {item.label}
                  </span>
                </div>
                {item.hasArrow && (
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:relative lg:z-auto
      `}>

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="sidebar-title">AskWise AI Assistant</h2>
          )}
          <button
            onClick={onToggle}
            className={`
              w-8 h-8 rounded-lg border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50
              flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md
              ${isCollapsed ? 'mx-auto' : ''}
            `}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <BookIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* New Chat Button - Purple Style */}
        <div className="p-3">
          <button
            onClick={handleNewChatClick}
            disabled={loading}
            className={`
              w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 hover:border-purple-400 rounded-lg transition-all duration-200 hover:bg-purple-50 text-gray-700 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed
              ${isCollapsed ? 'px-2' : 'px-3'}
            `}
          >
            <div className="w-5 h-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <PlusIcon className="w-3 h-3 text-white" />
            </div>
            {!isCollapsed && <span className="text-sm font-normal">{loading ? 'Creating...' : 'New chat'}</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 mb-4">
          {!isCollapsed && (
            <h3 className="sidebar-section-header mb-2">
              My Tools
            </h3>
          )}

          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`
                  w-full flex items-center px-2.5 py-2 rounded-lg transition-all duration-200 text-left
                  ${item.active
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 border-r-2 border-purple-600'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                  }
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="sidebar-nav-item ml-2.5">{item.label}</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Chat History with 3-dot menus */}
        {!isCollapsed && (
          <div className="px-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="sidebar-section-header">
                Chats
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {chatHistory.length}
                </span>
                <button
                  onClick={forceRefresh}
                  disabled={loading}
                  className="text-xs text-purple-600 hover:text-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Refresh chat list"
                >
                  {loading ? '...' : '↻'}
                </button>
              </div>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto">
              {loading ? (
                <div className="text-xs text-gray-500 px-2.5 py-2">Loading chats...</div>
              ) : chatHistory.length > 0 ? (
                chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className="group flex items-center w-full hover:bg-gray-100 rounded-md transition-colors"
                  >
                    <button
                      onClick={() => handleSessionClick(chat)}
                      className="flex-1 text-left px-2.5 py-2 min-w-0"
                    >
                      <div className="sidebar-chat-title truncate mb-0.5">
                        {chat.title}
                      </div>
                      <div className="sidebar-chat-time">
                        {chat.timestamp}
                      </div>
                    </button>

                    <ChatMenu
                      chat={chat}
                      onShare={handleShareChat}
                      onRename={handleRenameChat}
                      onAddToProject={handleAddToProject}
                      onArchive={handleArchiveChat}
                      onDelete={handleDeleteChat}
                      className="flex-shrink-0 mr-2"
                    />
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 px-2.5 py-2">No chats yet</div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-3 border-t border-gray-200 bg-white">
          <div className="space-y-1">
            {bottomItems.map((item) => (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`
                  w-full flex items-center px-2.5 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-left
                  ${isCollapsed ? 'justify-center' : ''}
                  ${item.path === '/dashboard' ? 'hover:bg-purple-50 hover:text-purple-600' : ''}
                `}
                title={isCollapsed ? item.label : ''}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="sidebar-nav-item ml-2.5">{item.label}</span>
                )}
              </button>
            ))}
          </div>

          {/* User Profile */}
          {!isCollapsed && (
            <UserProfileDropdown
              userInfo={userInfo}
              onNavigate={onNavigate}
              onLogout={handleLogout}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CollapsibleSidebar;