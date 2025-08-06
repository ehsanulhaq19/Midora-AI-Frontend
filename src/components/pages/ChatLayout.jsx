// src/components/pages/ChatLayout.jsx - Final version with full context awareness and dynamic models
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import CollapsibleSidebar from '../sidebar/CollapsibleSidebar';
import ChatWelcomeState from '../chat/ChatWelcomeState';
import ChatContainer from '../chat/ChatContainer';
import { useChatPersistence } from '../features/chatPersistence'; // This hook is still useful for auto-save toggle and createNewSession
import { useModel } from '../../context/ModelProvider';
import { autoNamingService } from '../../services/autoNamingService';
import { chatStorageService } from '../features/chatPersistence/services/chatStorageService'; // Correct import for chatStorageService
import { authHelpers } from '../../services/authHelpers';
import { modelService } from '../../services/modelService'; // NEW: Dynamic model service

const ChatLayout = () => {
  const { chatKey, setChatKey } = useModel();
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionTitle, setSessionTitle] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null); // CHANGED: Start with null for dynamic loading
  const [availableModels, setAvailableModels] = useState([]); // NEW: Store available models
  const [hasActiveChat, setHasActiveChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarRefreshKey, setSidebarRefreshKey] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // We still use useChatPersistence for autoSaveEnabled and createNewSession
  const {
    createNewSession,
    autoSaveEnabled,
    setAutoSaveEnabled,
    // Removed loadSession from here, as we'll use chatStorageService.loadChatById directly
  } = useChatPersistence();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // NEW: Load default model from backend
  useEffect(() => {
    const loadDefaultModel = async () => {
      try {
        if (!selectedModel) {
          const recommended = await modelService.getRecommendedModel();
          console.log('Setting default model:', recommended.modelId);
          setSelectedModel(recommended.modelId);
        }
      } catch (error) {
        console.error('Failed to load default model:', error);
        setSelectedModel('gpt-4o-mini'); // Fallback
      }
    };

    loadDefaultModel();
  }, [selectedModel]);

  // NEW: Load available models from backend
  useEffect(() => {
    const loadAvailableModels = async () => {
      try {
        const models = await modelService.getModelData();
        setAvailableModels(models);
        console.log('Loaded available models:', models);
      } catch (error) {
        console.error('Failed to load available models:', error);
      }
    };

    loadAvailableModels();
  }, []);

  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  const handleNavigation = (path) => {
    navigate(path);
    if (window.innerWidth < 1024) setIsSidebarCollapsed(true);
  };

  const handleModelSelect = (modelId) => setSelectedModel(modelId);

  const handleQuickAction = (action) => {
    const actionPrompts = {
      write: "Help me write something creative.",
      learn: "I'd like to learn about a new topic.",
      image: "Create an image for me.",
      analyze: "Analyze this image.",
      more: "Show me more options."
    };
    if (actionPrompts[action]) handleSendMessage(actionPrompts[action]);
  };

  const getAuthHeaders = () => {
    const token = authHelpers.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const handleSendMessage = async (content) => {
    // --- ADD THIS VALIDATION BLOCK AT THE TOP ---
    // Set a reasonable character limit for messages. 100,000 chars is about 100-200KB.
    const MAX_MESSAGE_LENGTH = 100000;

    if (content.length > MAX_MESSAGE_LENGTH) {
      // Provide immediate feedback to the user and stop the function.
      alert(`Message is too long. Please limit your messages to ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }
    // --- END VALIDATION BLOCK ---

    if (!content.trim()) return;

    const newMessage = { id: Date.now(), content, type: 'user', timestamp: new Date() };
    // Create the next state of messages to be sent to the API
    const updatedMessages = [...messages, newMessage];

    // Update the UI immediately for a responsive feel
    setMessages(updatedMessages);
    setHasActiveChat(true);
    setIsLoading(true);

    let sessionId = currentSessionId;

    if (autoSaveEnabled && !sessionId) {
      try {
        const smartTitle = autoNamingService.generateChatTitle(content, selectedModel);
        const newSession = await createNewSession(selectedModel, smartTitle);
        setCurrentSessionId(newSession.id);
        setSessionTitle(smartTitle);
        sessionId = newSession.id;
        setSidebarRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('❌ Failed to create session:', error);
        setIsLoading(false);
        setMessages(prev => [...prev, { id: 'error', content: 'Could not start a new chat session. Please try again.', type: 'ai', isError: true }]);
        return;
      }
    }

    // Call handleMessageSent for the user's message
    await handleMessageSent('user', content, sessionId, updatedMessages); // Pass updatedMessages

    try {
      // --- THIS IS THE KEY CHANGE FOR CONTEXT AWARENESS ---
      // 1. Prepare the entire message history in the format the backend expects.
      const historyForApi = updatedMessages.map(msg => ({
        role: msg.type === 'ai' ? 'assistant' : 'user',
        content: msg.content
      }));

      // CHANGED: Get the real backend model ID
      const backendModelId = await modelService.getBackendModelId(selectedModel);
      console.log(`Using model: ${selectedModel} -> backend: ${backendModelId}`);

      // 2. Send the full history to the chat endpoint.
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          messages: historyForApi, // <-- Sending the array of messages
          model: backendModelId, // CHANGED: Use real backend model ID
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Request failed with status ${response.status}`);
      }

      const responseData = await response.json();
      const aiResponse = {
        id: Date.now() + 1,
        content: responseData.content,
        type: 'ai',
        timestamp: new Date(),
        model: responseData.modelUsed || backendModelId,
      };
      // Update messages state with AI response
      setMessages(prev => [...prev, aiResponse]);

      // Call handleMessageSent for the AI's message, ensuring 'messages' is the latest state
      await handleMessageSent('ai', aiResponse.content, sessionId, [...updatedMessages, aiResponse]); // Pass latest messages

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorResponse = {
        id: 'error-' + Date.now(),
        content: `Sorry, I encountered an error: ${error.message}`,
        type: 'ai',
        isError: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      if (autoSaveEnabled) {
        const newSession = await createNewSession(selectedModel, 'New Chat');
        setCurrentSessionId(newSession.id);
        setSessionTitle('New Chat');
        setSidebarRefreshKey(prev => prev + 1);
      } else {
        setCurrentSessionId(null);
        setSessionTitle(null);
      }
      setMessages([]);
      setHasActiveChat(false);
      setIsLoading(false);
      if (setChatKey) setChatKey(Date.now().toString());
      if (location.pathname !== '/chat') navigate('/chat');
    } catch (error) {
      console.error('❌ Failed to create new chat:', error);
      setMessages([]);
      setHasActiveChat(false);
      setCurrentSessionId(null);
      setSessionTitle(null);
    }
  };

  // FIXED: Updated handleMessageSent to use chatStorageService.saveChat
  const handleMessageSent = async (type, content, sessionId, currentMessages) => {
    if (autoSaveEnabled && sessionId) {
      try {
        const role = type === 'user' ? 'user' : 'assistant';
        // Construct the chatData object as expected by saveChat
        // Find the current session's title. If not found, use a default.
        const title = sessionTitle || 'New Chat';

        // Filter messages to only include those relevant to the current session (optional but good practice)
        // For simplicity, we'll just use the `currentMessages` array passed from `handleSendMessage`
        const messagesToSave = currentMessages.map(msg => ({
            role: msg.type === 'ai' ? 'assistant' : 'user',
            content: msg.content,
            // Include other properties if your backend expects them, e.g., created_at
            created_at: msg.timestamp ? msg.timestamp.toISOString() : new Date().toISOString()
        }));

        const chatDataToSave = {
            id: sessionId,
            title: title,
            model: selectedModel,
            messages: messagesToSave,
            lastModified: new Date().toISOString(),
            isNew: false // Mark as not new for updates
        };

        await chatStorageService.saveChat(chatDataToSave); // Use saveChat
        console.log(`💾 Message (${role}) auto-saved to session:`, sessionId);
      } catch (error) {
        console.warn('⚠️ Auto-save failed:', error, error.stack); // Log stack for deeper insight
      }
    }
  };

  // FIXED: Updated handleSessionLoad to use chatStorageService.loadChatById
  const handleSessionLoad = async (sessionId) => { // Now expects a single ID
    try {
      setIsLoading(true);
      console.log('Attempting to load full session data for ID:', sessionId);
      const fullSessionData = await chatStorageService.loadChatById(sessionId); // Use loadChatById

      if (!fullSessionData) {
        throw new Error(`Session data not found for ID: ${sessionId}`);
      }

      setCurrentSessionId(fullSessionData.id);
      setSessionTitle(fullSessionData.title);

      if (fullSessionData.messages?.length > 0) {
        const formattedMessages = fullSessionData.messages.map(msg => ({
          id: msg.id,
          type: msg.role === 'assistant' ? 'ai' : 'user',
          content: msg.content,
          timestamp: new Date(msg.created_at || msg.timestamp), // Added fallback for timestamp
          model: fullSessionData.model_name || selectedModel, // Added fallback for model
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }

      setHasActiveChat(true);
      if (setChatKey) setChatKey(Date.now().toString());
      if (location.pathname !== '/chat') navigate('/chat');

      console.log('✅ Session loaded successfully:', fullSessionData.title);

    } catch (error) {
      console.error("❌ Failed to load session:", error);
      setMessages([{ id: 'error', content: `Could not load chat: ${error.message}`, type: 'ai', isError: true }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <CollapsibleSidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
        onNavigate={handleNavigation}
        currentPath={location.pathname}
        onNewChat={handleNewChat}
        onSessionLoad={handleSessionLoad}
        refreshTrigger={sidebarRefreshKey}
      />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-64'} lg:ml-0`}>
        {hasActiveChat && (
          <div className="flex items-center justify-end px-4 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-1.5 auto-save-label">
                <input
                  type="checkbox"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                />
                <span>Auto-save</span>
              </label>
              <div className="relative">
                <select
                  value={selectedModel || ''}
                  onChange={(e) => handleModelSelect(e.target.value)}
                  className="model-selector appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableModels.length > 0 ? (
                    availableModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} {model.recommended ? '⭐' : ''}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading models...</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-1.5 pointer-events-none">
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          {!hasActiveChat ? (
            <ChatWelcomeState
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
              onQuickAction={handleQuickAction}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <ChatContainer
              key={chatKey}
              messages={messages}
              isLoading={isLoading}
              selectedModel={selectedModel}
              onSendMessage={handleSendMessage}
              onNewChat={handleNewChat}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;