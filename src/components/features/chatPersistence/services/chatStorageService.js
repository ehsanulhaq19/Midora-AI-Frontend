// frontend/src/components/features/chatPersistence/services/chatStorageService.js
import { authHelpers } from '../../../../services/authHelpers.js';

class ChatStorageService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8443';
    this.apiEndpoint = '/api/v1/chat-persistence';
    this.setupConnectionListeners();
  }

  setupConnectionListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('🌐 Connection restored - syncing pending chats...');
      this.syncPendingChats();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('📴 Connection lost - switching to local storage...');
    });
  }

  // Make authenticated API calls
  async makeApiCall(endpoint, method = 'GET', body = null) {
    const token = authHelpers.getToken();

    if (!token) {
      throw new Error('No authentication token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const url = `${this.baseUrl}${this.apiEndpoint}${endpoint}`;
    console.log(`🌐 API Call: ${method} ${url}`);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Check if user is authenticated for chat persistence
  isAuthenticatedForChat() {
    return authHelpers.isAuthenticated();
  }

  // FIXED: Add missing loadSessions method (this is what CollapsibleSidebar expects)
  async loadSessions(limit = 50, offset = 0) {
    console.log('📡 ChatStorageService.loadSessions called with limit:', limit, 'offset:', offset);

    try {
      const chats = await this.loadChats();

      // Apply pagination
      const startIndex = offset;
      const endIndex = startIndex + limit;
      const paginatedChats = chats.slice(startIndex, endIndex);

      // Convert to the format expected by CollapsibleSidebar
      const sessions = paginatedChats.map(chat => ({
        id: chat.id,
        title: chat.title || 'New Chat',
        created_at: chat.lastModified || new Date().toISOString(),
        updated_at: chat.lastModified || new Date().toISOString(),
        model_name: chat.model || 'default',
        message_count: chat.messages?.length || 0,
        user_id: chat.metadata?.user_id || authHelpers.getCurrentUser()?.id
      }));

      console.log('✅ loadSessions returning:', sessions.length, 'sessions');
      return sessions;

    } catch (error) {
      console.error('❌ loadSessions error:', error);
      throw error;
    }
  }

  // FIXED: Add missing getSessions method (alternative name)
  async getSessions(limit = 50, offset = 0) {
    return this.loadSessions(limit, offset);
  }

  // FIXED: Add missing updateSession method
  async updateSession(sessionId, updates) {
    console.log('🔄 ChatStorageService.updateSession called:', sessionId, updates);

    try {
      // Load the existing chat
      const existingChat = await this.loadChatById(sessionId);
      if (!existingChat) {
        throw new Error(`Session ${sessionId} not found`);
      }

      // Apply updates
      const updatedChat = {
        ...existingChat,
        ...updates,
        lastModified: new Date().toISOString()
      };

      // Save the updated chat
      const result = await this.saveChat({ ...updatedChat, isNew: false });
      console.log('✅ updateSession successful:', result);
      return result;

    } catch (error) {
      console.error('❌ updateSession error:', error);
      throw error;
    }
  }

  // FIXED: Add missing deleteSession method
  async deleteSession(sessionId) {
    console.log('🗑️ ChatStorageService.deleteSession called:', sessionId);

    try {
      const result = await this.deleteChat(sessionId);
      console.log('✅ deleteSession successful:', result);
      return result;

    } catch (error) {
      console.error('❌ deleteSession error:', error);
      throw error;
    }
  }

  // FIXED: Add missing createSession method
  async createSession(sessionData) {
    console.log('🆕 ChatStorageService.createSession called:', sessionData);

    try {
      const newChat = {
        ...sessionData,
        isNew: true,
        messages: sessionData.messages || [],
        lastModified: new Date().toISOString()
      };

      const result = await this.saveChat(newChat);
      console.log('✅ createSession successful:', result);
      return result;

    } catch (error) {
      console.error('❌ createSession error:', error);
      throw error;
    }
  }

  // Save chat session
  async saveChat(chatData) {
    const chatId = chatData.id || this.generateChatId();
    const chatWithId = {
      ...chatData,
      id: chatId,
      lastModified: new Date().toISOString(),
      user_id: authHelpers.getCurrentUser()?.id || 'anonymous'
    };

    try {
      // Always save locally first
      this.saveChatLocally(chatWithId);

      // Try to save remotely if authenticated and online
      if (this.isOnline && this.isAuthenticatedForChat()) {
        try {
          // Create or update session
          let sessionResult;

          // Check if this is a new session or update
          if (chatData.isNew !== false) {
            // Create new session
            sessionResult = await this.makeApiCall('/sessions', 'POST', {
              model_name: chatData.model || 'default',
              title: chatData.title || 'New Chat'
            });

            // Use the session ID returned by backend
            chatWithId.id = sessionResult.id;
          } else {
            // Update existing session
            sessionResult = await this.makeApiCall(`/sessions/${chatId}`, 'PATCH', {
              title: chatData.title,
              model_name: chatData.model
            });
          }

          // Save messages if any
          if (chatData.messages && chatData.messages.length > 0) {
            const messagesToSave = chatData.messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }));

            await this.makeApiCall(`/sessions/${sessionResult.id}/messages/batch`, 'POST', {
              messages: messagesToSave
            });
          }

          console.log('✅ Chat saved remotely:', sessionResult.id);
          this.markChatAsSynced(sessionResult.id);
          return { ...chatWithId, id: sessionResult.id, remote_id: sessionResult.id };
        } catch (error) {
          console.warn('⚠️ Remote save failed, keeping local copy:', error);
          this.markChatAsPending(chatId);
        }
      } else {
        this.markChatAsPending(chatId);
      }

      return chatWithId;
    } catch (error) {
      console.error('Failed to save chat:', error);
      throw error;
    }
  }

  // Load all chat sessions
  async loadChats() {
    try {
      let allChats = [];

      // Always load local chats first
      const localChats = this.loadChatsLocally();
      allChats = [...localChats];

      // Try to load remote chats if authenticated and online
      if (this.isOnline && this.isAuthenticatedForChat()) {
        try {
          // FIXED: Try multiple endpoints for better compatibility
          let remoteSessions = [];

          try {
            // Try the main endpoint first
            remoteSessions = await this.makeApiCall('/sessions?limit=100&offset=0');
          } catch (error) {
            console.warn('⚠️ Primary endpoint failed, trying alternatives...', error);

            // Try alternative endpoints
            try {
              const response = await this.makeApiCall('');
              remoteSessions = response.sessions || response.data || response;
            } catch (error2) {
              console.warn('⚠️ Alternative endpoints also failed:', error2);
              throw error; // Re-throw original error
            }
          }

          // Convert backend format to frontend format
          const convertedChats = remoteSessions.map(session => ({
            id: session.id,
            title: session.title || 'Untitled Chat',
            messages: [], // Messages are loaded separately
            lastModified: session.updated_at || session.created_at,
            model: session.model_name || 'default',
            metadata: {
              model_name: session.model_name,
              message_count: session.message_count || 0,
              user_id: session.user_id
            }
          }));

          // Merge remote chats with local, preferring newer versions
          const mergedChats = this.mergeChats(localChats, convertedChats);
          allChats = mergedChats;

          console.log('✅ Chats loaded from remote storage:', convertedChats.length);
        } catch (error) {
          console.warn('⚠️ Remote load failed, using local chats only:', error);
        }
      }

      return allChats.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
    } catch (error) {
      console.error('Failed to load chats:', error);
      return this.loadChatsLocally(); // Fallback to local only
    }
  }

  // Load specific chat session with messages
  async loadChatById(chatId) {
    try {
      // Try local first
      const localChats = this.loadChatsLocally();
      const localChat = localChats.find(chat => chat.id === chatId);

      // If we have it locally and are offline, return it
      if (localChat && !this.isOnline) {
        return localChat;
      }

      // Try remote if authenticated and online
      if (this.isOnline && this.isAuthenticatedForChat()) {
        try {
          const session = await this.makeApiCall(`/sessions/${chatId}`);

          // Convert backend format to frontend format
          const convertedChat = {
            id: session.id,
            title: session.title || 'Untitled Chat',
            messages: session.messages.map(msg => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              timestamp: msg.created_at,
              order: msg.message_order
            })),
            lastModified: session.updated_at || session.created_at,
            model: session.model_name || 'default',
            metadata: {
              model_name: session.model_name,
              message_count: session.message_count || session.messages.length,
              user_id: session.user_id
            }
          };

          // Update local storage with remote data
          this.saveChatLocally(convertedChat);

          return convertedChat;
        } catch (error) {
          console.warn('⚠️ Remote load by ID failed:', error);
          // Fall back to local if available
          if (localChat) {
            return localChat;
          }
        }
      }

      return localChat || null;
    } catch (error) {
      console.error('Failed to load chat by ID:', error);
      return null;
    }
  }

  // Delete chat session
  async deleteChat(chatId) {
    try {
      // Delete locally
      const chats = this.loadChatsLocally();
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      localStorage.setItem('askwise_chats', JSON.stringify(updatedChats));

      // Delete remotely if authenticated
      if (this.isOnline && this.isAuthenticatedForChat()) {
        try {
          await this.makeApiCall(`/sessions/${chatId}`, 'DELETE');
          console.log('✅ Chat deleted remotely:', chatId);
        } catch (error) {
          console.warn('⚠️ Remote delete failed:', error);
        }
      }

      // Remove from pending list
      this.markChatAsSynced(chatId);

      return true;
    } catch (error) {
      console.error('Failed to delete chat:', error);
      return false;
    }
  }

  // Local storage methods
  saveChatLocally(chatData) {
    try {
      const chats = this.loadChatsLocally();
      const existingIndex = chats.findIndex(chat => chat.id === chatData.id);

      if (existingIndex >= 0) {
        chats[existingIndex] = chatData;
      } else {
        chats.push(chatData);
      }

      localStorage.setItem('askwise_chats', JSON.stringify(chats));
      console.log('💾 Chat saved locally:', chatData.id);
    } catch (error) {
      console.error('Local save failed:', error);
    }
  }

  loadChatsLocally() {
    try {
      const chatsData = localStorage.getItem('askwise_chats');
      return chatsData ? JSON.parse(chatsData) : [];
    } catch (error) {
      console.error('Local load failed:', error);
      return [];
    }
  }

  // Sync management
  markChatAsPending(chatId) {
    const pending = this.getPendingChats();
    if (!pending.includes(chatId)) {
      pending.push(chatId);
      localStorage.setItem('askwise_pending_chats', JSON.stringify(pending));
    }
  }

  markChatAsSynced(chatId) {
    const pending = this.getPendingChats();
    const updatedPending = pending.filter(id => id !== chatId);
    localStorage.setItem('askwise_pending_chats', JSON.stringify(updatedPending));
  }

  getPendingChats() {
    try {
      const pending = localStorage.getItem('askwise_pending_chats');
      return pending ? JSON.parse(pending) : [];
    } catch {
      return [];
    }
  }

  // Sync pending chats when connection is restored
  async syncPendingChats() {
    if (!this.isAuthenticatedForChat()) {
      return;
    }

    const pendingIds = this.getPendingChats();
    const localChats = this.loadChatsLocally();

    for (const chatId of pendingIds) {
      const chat = localChats.find(c => c.id === chatId);
      if (chat) {
        try {
          await this.saveChat(chat);
          console.log('✅ Synced pending chat:', chatId);
        } catch (error) {
          console.warn('⚠️ Failed to sync chat:', chatId, error);
        }
      }
    }
  }

  // Merge local and remote chats, preferring newer versions
  mergeChats(localChats, remoteChats) {
    const merged = new Map();

    // Add all local chats
    localChats.forEach(chat => {
      merged.set(chat.id, chat);
    });

    // Add remote chats, only if newer or not present locally
    remoteChats.forEach(remoteChat => {
      const localChat = merged.get(remoteChat.id);
      if (!localChat || new Date(remoteChat.lastModified) > new Date(localChat.lastModified)) {
        merged.set(remoteChat.id, remoteChat);
      }
    });

    return Array.from(merged.values());
  }

  // Generate unique chat ID
  generateChatId() {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear all chats
  async clearAllChats() {
    try {
      localStorage.removeItem('askwise_chats');
      localStorage.removeItem('askwise_pending_chats');

      if (this.isOnline && this.isAuthenticatedForChat()) {
        try {
          // Delete all sessions
          const sessions = await this.makeApiCall('/sessions?limit=1000&offset=0');
          const allSessions = sessions.sessions || sessions.data || sessions;

          for (const session of allSessions) {
            await this.makeApiCall(`/sessions/${session.session_id || session.id}`, 'DELETE');
          }

          console.log('✅ All chats cleared remotely');
        } catch (error) {
          console.warn('⚠️ Remote clear failed:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Failed to clear chats:', error);
      return false;
    }
  }

  // FIXED: Add debug method to help troubleshoot
  debug() {
    console.log('🔍 ChatStorageService Debug Info:');
    console.log('- isOnline:', this.isOnline);
    console.log('- baseUrl:', this.baseUrl);
    console.log('- apiEndpoint:', this.apiEndpoint);
    console.log('- isAuthenticated:', this.isAuthenticatedForChat());
    console.log('- Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this)));

    const localChats = this.loadChatsLocally();
    console.log('- Local chats count:', localChats.length);

    const pendingChats = this.getPendingChats();
    console.log('- Pending chats:', pendingChats);

    return {
      isOnline: this.isOnline,
      baseUrl: this.baseUrl,
      apiEndpoint: this.apiEndpoint,
      isAuthenticated: this.isAuthenticatedForChat(),
      localChatsCount: localChats.length,
      pendingChats: pendingChats,
      methods: Object.getOwnPropertyNames(Object.getPrototypeOf(this))
    };
  }
}

// Export singleton instance
export const chatStorageService = new ChatStorageService();
export default chatStorageService;