// src/components/features/chatPersistence/hooks/useChatPersistence.js
import { useState, useCallback, useRef } from 'react';
import { chatStorageService } from '../services/chatStorageService';
import { authHelpers } from '../../../../services/authHelpers'; // Assuming this path is correct

export const useChatPersistence = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Keep track of unsaved messages (if any, though `saveMessage` will be phased out)
  const pendingMessages = useRef([]);

  // Get chat history
  const loadChatHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!authHelpers.isAuthenticated()) {
        console.log("Not authenticated, skipping chat history load.");
        setChatHistory([]);
        return;
      }
      // FIXED: Changed getUserSessions to loadSessions
      const sessions = await chatStorageService.loadSessions();
      setChatHistory(sessions);
      console.log('✅ Chat history loaded in hook:', sessions.length, 'sessions');
      return sessions;
    } catch (err) {
      console.error('Failed to load chat history in hook:', err);
      setError(err.message);
      // Don't re-throw here, let the hook manage its own error state
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a new chat session
  const createNewSession = useCallback(async (modelName = 'default', title = 'New Chat') => {
    try {
      setIsLoading(true);
      setError(null);

      if (!authHelpers.isAuthenticated()) {
        throw new Error("Cannot create session: User not authenticated.");
      }

      // FIXED: Pass an object { model, title } to chatStorageService.createSession
      const session = await chatStorageService.createSession({ model: modelName, title: title });
      setCurrentSessionId(session.id);

      // CRITICAL: Reload chat history to ensure consistency
      await loadChatHistory();

      console.log('✅ New chat session created and history reloaded in hook:', session.id);
      return session;
    } catch (err) {
      console.error('Failed to create session in hook:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadChatHistory]);

  // --- REFACTORING NOTE ---
  // The chatStorageService.js primarily uses `saveChat` which expects a full chat object.
  // The `saveMessage` and `saveMessagesBatch` methods are NOT present in chatStorageService.js.
  // The `handleMessageSent` in ChatLayout.jsx is already doing the right thing by calling
  // `chatStorageService.saveChat` with the full `chatDataToSave`.
  // Therefore, the following methods in useChatPersistence.js (saveMessage, autoSaveMessage, saveConversation)
  // are either redundant, calling non-existent methods, or need a full re-architecture
  // to fetch the existing session, append/update messages, and then call `saveChat`.
  // For now, I'm modifying them to either use `saveChat` correctly where possible,
  // or explicitly state they are not directly supported.

  // Save a single message - This function should ideally NOT exist in this hook
  // as it doesn't align with chatStorageService.saveChat.
  // It's here for backward compatibility with existing calls, but will throw if not implemented correctly.
  const saveMessage = useCallback(async (role, content, sessionId = null) => {
    console.warn("useChatPersistence: saveMessage called. This method's direct use is being refactored. Use saveChat with full session data.");
    setError("Function not directly supported: saveMessage. Please update your code to use saveChat.");
    throw new Error("chatStorageService.saveMessage is not implemented directly. Use chatStorageService.saveChat with full session data.");
  }, []);

  // Auto-save message (debounced) - This should call the save mechanism from ChatLayout
  const autoSaveMessage = useCallback(async (role, content) => {
    // This function will likely be removed or refactored as auto-save is handled in ChatLayout.jsx's handleMessageSent
    // For now, it will rely on the (currently broken) saveMessage above.
    console.warn("useChatPersistence: autoSaveMessage called. This function's implementation needs review.");
    if (!autoSaveEnabled) return;
    try {
      // This should ideally trigger a save on the parent component or
      // construct the full session data to pass to chatStorageService.saveChat
      // await saveMessage(role, content); // This will currently throw an error
    } catch (err) {
      console.warn('Auto-save failed in hook (expected if saveMessage not implemented):', err);
    }
  }, [autoSaveEnabled]);


  // Save conversation batch - This also needs to be refactored to use chatStorageService.saveChat
  const saveConversation = useCallback(async (messagesToSave, sessionId = null, title = null) => {
    console.warn("useChatPersistence: saveConversation called. This method's direct use is being refactored. Use saveChat on the full session object.");
    try {
      setIsLoading(true);
      setError(null);

      let targetSessionId = sessionId || currentSessionId;

      if (!authHelpers.isAuthenticated()) {
        throw new Error("Cannot save conversation: User not authenticated.");
      }

      // If no session ID, create a new one first
      if (!targetSessionId) {
        const newSession = await createNewSession(null, title); // Default model for new session
        targetSessionId = newSession.id;
      }

      // FIXED: Fetch existing session, update messages, and save using saveChat
      const existingSession = await chatStorageService.loadChatById(targetSessionId);
      if (!existingSession) throw new Error(`Session ${targetSessionId} not found for saving conversation.`);

      const updatedChatData = {
        ...existingSession,
        title: title || existingSession.title,
        messages: messagesToSave.map(msg => ({
            role: msg.role,
            content: msg.content,
            created_at: msg.timestamp ? msg.timestamp.toISOString() : new Date().toISOString()
        })),
        lastModified: new Date().toISOString(),
        isNew: false // Mark as update
      };

      const savedChat = await chatStorageService.saveChat(updatedChatData);
      console.log('✅ Conversation saved via useChatPersistence.saveConversation:', savedChat.id);
      return { sessionId: savedChat.id, messages: savedChat.messages };

    } catch (err) {
      console.error('Failed to save conversation in hook:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, createNewSession]);

  // Load a chat session
  const loadSession = useCallback(async (sessionId) => {
    try {
      setIsLoading(true);
      setError(null);

      // FIXED: Changed loadSession to loadChatById
      const sessionData = await chatStorageService.loadChatById(sessionId);
      setCurrentSessionId(sessionId);

      console.log('✅ Session loaded in hook:', sessionData.title, '- Messages:', sessionData.messages.length);
      return sessionData;
    } catch (err) {
      console.error('Failed to load session in hook:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete a chat session
  const deleteSession = useCallback(async (sessionId) => {
    try {
      setIsLoading(true);
      setError(null);

      await chatStorageService.deleteSession(sessionId);

      // CRITICAL: Reload chat history after deletion to ensure consistency
      await loadChatHistory();

      // Clear current session if it was deleted
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
      }

      console.log('✅ Session deleted and history reloaded in hook:', sessionId);
      return true;
    } catch (err) {
      console.error('Failed to delete session in hook:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, loadChatHistory]);

  // Update session title
  const updateSessionTitle = useCallback(async (sessionId, newTitle) => {
    try {
      // FIXED: Pass updates as an object { title: newTitle }
      await chatStorageService.updateSession(sessionId, { title: newTitle });

      // CRITICAL: Reload chat history after title update to ensure consistency
      await loadChatHistory();

      console.log('✅ Session title updated and history reloaded in hook:', sessionId, newTitle);
      return true;
    } catch (err) {
      console.error('Failed to update session title in hook:', err);
      setError(err.message);
      throw err;
    }
  }, [loadChatHistory]);

  // Retry pending messages - needs re-evaluation based on `saveMessage` removal
  const retryPendingMessages = useCallback(async () => {
    if (pendingMessages.current.length === 0) return;

    // This logic needs to be revisited. If messages are part of a full session save,
    // then this should try to re-save the entire session the messages belong to.
    console.warn("Retry pending messages logic needs re-implementation after `saveMessage` removal.");
    pendingMessages.current = []; // Clear for now to prevent infinite loops.
    // throw new Error("Retry pending messages logic not fully implemented.");
  }, []);

  // Clear current session
  const clearCurrentSession = useCallback(() => {
    setCurrentSessionId(null);
    pendingMessages.current = [];
    console.log('🔄 Current session cleared in hook');
  }, []);

  return {
    // State
    currentSessionId,
    isLoading,
    error,
    chatHistory,
    autoSaveEnabled,
    pendingMessagesCount: pendingMessages.current.length,

    // Actions
    createNewSession,
    // saveMessage, // Consider removing this from the exposed actions if not directly supported
    autoSaveMessage, // Will be impacted by saveMessage change
    saveConversation, // Now calls saveChat internally
    loadSession, // This is an alias for loadChatById
    loadChatHistory,
    deleteSession,
    updateSessionTitle,
    retryPendingMessages,
    clearCurrentSession,
    setAutoSaveEnabled,

    // Utilities
    clearError: () => setError(null),
    hasCurrentSession: !!currentSessionId,
  };
};