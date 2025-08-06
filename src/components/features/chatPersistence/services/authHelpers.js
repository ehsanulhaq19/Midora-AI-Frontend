// src/components/features/chatPersistence/services/authHelpers.js
// Simple fallback auth helpers if import fails

export const authHelpers = {
  // Get authentication token
  getToken: () => {
    return localStorage.getItem('authToken') ||
           localStorage.getItem('token') ||
           sessionStorage.getItem('authToken') ||
           sessionStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = authHelpers.getToken();
    return !!token && token.length > 0;
  },

  // Get current user (if stored)
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.warn('Failed to parse current user:', error);
      return null;
    }
  },

  // Logout helper
  logout: async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
  }
};