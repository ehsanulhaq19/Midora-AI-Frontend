// frontend/src/services/authHelpers.js - Unified Auth System
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:8443';

// Define different auth endpoints
const AUTH_ENDPOINTS = {
  MAIN: '/api/auth',                           // Main authentication
  CHAT_PERSISTENCE: '/api/v1/chat-persistence'  // Chat persistence (no separate auth)
};

// Get the base URL without any path
const getBaseUrl = () => {
  if (API_BASE_URL.startsWith('http')) {
    return API_BASE_URL;
  }
  // If it's a relative path, we need the full URL
  return window.location.protocol + '//' + window.location.host;
};

const BASE_URL = getBaseUrl();

// Authentication helper functions
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Set auth data
  setAuthData: (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Generic API call helper
  makeAuthCall: async (endpoint, method, body = null) => {
    const token = authHelpers.getToken();
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return response.json();
  },

  // Main login function - uses MAIN auth endpoint
  login: async (email, password) => {
    try {
      console.log('🔐 Attempting main login...');
      const data = await authHelpers.makeAuthCall(
        `${AUTH_ENDPOINTS.MAIN}/login`,
        'POST',
        { email, password }
      );

      if (data.success && data.token && data.user) {
        authHelpers.setAuthData(data.token, data.user);
        console.log('✅ Main login successful');
        return data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('❌ Main login failed:', error);
      throw error;
    }
  },

  // Register function - uses MAIN auth endpoint
  register: async (email, password, name) => {
    try {
      console.log('📝 Attempting registration...');
      const data = await authHelpers.makeAuthCall(
        `${AUTH_ENDPOINTS.MAIN}/register`,
        'POST',
        { email, password, name }
      );

      console.log('✅ Registration successful');
      return data;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      throw error;
    }
  },

  // Logout function - calls main endpoint
  logout: async () => {
    try {
      const token = authHelpers.getToken();

      if (token) {
        // Try to logout from main system
        try {
          await authHelpers.makeAuthCall(`${AUTH_ENDPOINTS.MAIN}/logout`, 'POST');
        } catch (error) {
          console.warn('Main logout API call failed:', error);
        }
      }

      authHelpers.clearAuthData();
      console.log('✅ Logout successful');
      return true;
    } catch (error) {
      console.error('⚠️ Logout error:', error);
      authHelpers.clearAuthData();
      return true;
    }
  }
};

// Chat Persistence specific auth helpers
export const chatPersistenceAuth = {
  // Get token for chat persistence (uses main auth token)
  getChatPersistenceToken: async () => {
    const mainToken = authHelpers.getToken();

    if (!mainToken) {
      throw new Error('No authentication token available');
    }

    // Chat persistence uses the same token as main auth
    return mainToken;
  },

  // Validate token specifically for chat persistence
  validateChatPersistenceToken: async () => {
    try {
      const token = authHelpers.getToken();

      if (!token) {
        return false;
      }

      // The chat persistence API uses the same auth as main API
      // So we just need to check if we have a valid token
      return authHelpers.isAuthenticated();
    } catch (error) {
      console.warn('Chat persistence token validation failed:', error);
      return false;
    }
  }
};

// API helpers for different services
export const apiHelpers = {
  // Main API calls (user management, etc.)
  mainApi: {
    call: async (endpoint, method, body = null) => {
      return authHelpers.makeAuthCall(`${AUTH_ENDPOINTS.MAIN}${endpoint}`, method, body);
    }
  },

  // Chat persistence API calls - UPDATED
  chatPersistenceApi: {
    call: async (endpoint, method, body = null) => {
      // Use the correct base endpoint for chat persistence
      return authHelpers.makeAuthCall(`${AUTH_ENDPOINTS.CHAT_PERSISTENCE}${endpoint}`, method, body);
    },

    // Create session
    createSession: async (sessionData) => {
      try {
        return await apiHelpers.chatPersistenceApi.call('/sessions', 'POST', sessionData);
      } catch (error) {
        console.error('Failed to create session:', error);
        throw error;
      }
    },

    // Load sessions
    loadSessions: async (limit = 100, offset = 0) => {
      try {
        return await apiHelpers.chatPersistenceApi.call(`/sessions?limit=${limit}&offset=${offset}`, 'GET');
      } catch (error) {
        console.error('Failed to load sessions:', error);
        throw error;
      }
    },

    // Load session with messages
    loadSessionById: async (sessionId) => {
      try {
        return await apiHelpers.chatPersistenceApi.call(`/sessions/${sessionId}`, 'GET');
      } catch (error) {
        console.error('Failed to load session:', error);
        throw error;
      }
    },

    // Delete session
    deleteSession: async (sessionId) => {
      try {
        return await apiHelpers.chatPersistenceApi.call(`/sessions/${sessionId}`, 'DELETE');
      } catch (error) {
        console.error('Failed to delete session:', error);
        throw error;
      }
    },

    // Save messages to session
    saveMessages: async (sessionId, messages) => {
      try {
        return await apiHelpers.chatPersistenceApi.call(`/sessions/${sessionId}/messages/batch`, 'POST', { messages });
      } catch (error) {
        console.error('Failed to save messages:', error);
        throw error;
      }
    },

    // Update session
    updateSession: async (sessionId, updateData) => {
      try {
        return await apiHelpers.chatPersistenceApi.call(`/sessions/${sessionId}`, 'PATCH', updateData);
      } catch (error) {
        console.error('Failed to update session:', error);
        throw error;
      }
    },

    // Save single message
    saveMessage: async (sessionId, messageData) => {
      try {
        return await apiHelpers.chatPersistenceApi.call(`/sessions/${sessionId}/messages`, 'POST', messageData);
      } catch (error) {
        console.error('Failed to save message:', error);
        throw error;
      }
    },

    // Get user stats
    getUserStats: async () => {
      try {
        return await apiHelpers.chatPersistenceApi.call('/stats', 'GET');
      } catch (error) {
        console.error('Failed to get user stats:', error);
        throw error;
      }
    }
  }
};

// Export individual functions for backward compatibility
export const {
  isAuthenticated,
  getCurrentUser,
  getToken,
  setAuthData,
  clearAuthData,
  login,
  register,
  logout
} = authHelpers;

export default authHelpers;