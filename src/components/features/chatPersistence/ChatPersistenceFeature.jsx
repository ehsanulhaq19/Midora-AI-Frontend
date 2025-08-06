// src/components/features/chatPersistence/ChatPersistenceFeature.jsx
import React, { useState, useEffect } from 'react';
import { useChatPersistence } from './hooks/useChatPersistence';

const ChatPersistenceFeature = ({
  onSessionLoad,
  onNewChat,
  currentSessionId,
  isVisible = true,
  className = "",
  selectedModel // Add selectedModel as a prop if it's defined in parent (e.g., ChatLayout)
}) => {
  const [showHistory, setShowHistory] = useState(false);
  const {
    chatHistory,
    loadChatHistory,
    loadSession, // This is now an alias for loadChatById
    createNewSession,
    isLoading,
    error
  } = useChatPersistence();

  useEffect(() => {
    // Load chat history on mount
    loadChatHistory();
  }, [loadChatHistory]);

  const handleSessionSelect = async (session) => {
    try {
      // FIXED: Use loadSession (which is loadChatById)
      const sessionData = await loadSession(session.id); // This calls the aliased loadChatById

      // Pass the loaded session data to parent component
      if (onSessionLoad) {
        onSessionLoad({
          sessionId: session.id,
          title: sessionData.title,
          messages: sessionData.messages,
          modelName: sessionData.model // Changed from model_name to model, assuming backend consistency
        });
      }

      // Hide history panel on mobile after selection
      if (window.innerWidth < 768) {
        setShowHistory(false);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const handleNewChat = async () => {
    try {
      // FIXED: Pass model and a default title to createNewSession
      const newSession = await createNewSession(selectedModel, "New Chat"); // Pass selectedModel

      if (onNewChat) {
        onNewChat({
          sessionId: newSession.id,
          title: newSession.title,
          messages: [],
          modelName: newSession.model // Changed from model_name to model
        });
      }

      // Hide history panel after creating new chat
      setShowHistory(false);
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Mobile toggle button */}
      <div className="md:hidden p-3 border-b border-gray-200 bg-white">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6H7a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1H9.5l-2-2H12z" />
          </svg>
          <span>Chat History ({chatHistory.length})</span>
          <svg
            className={`h-4 w-4 transition-transform ${showHistory ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Desktop header with New Chat button */}
      <div className="hidden md:block p-3 border-b border-gray-200 bg-white">
        <button
          onClick={handleNewChat}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      {/* Chat History Panel */}
      <div className={`flex-1 ${showHistory || window.innerWidth >= 768 ? 'block' : 'hidden'} md:block`}>
        <ChatHistoryPanel
          onSessionSelect={handleSessionSelect}
          currentSessionId={currentSessionId}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 border-t border-gray-200 bg-red-50">
          <p className="text-red-700 text-xs">{error}</p>
        </div>
      )}

      {/* Status indicator */}
      <div className="p-2 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {isLoading ? 'Loading...' : `${chatHistory.length} conversations`}
          </span>
          <div className="flex items-center space-x-1">
            <div className={`h-2 w-2 rounded-full ${error ? 'bg-red-400' : 'bg-green-400'}`}></div>
            <span>{error ? 'Offline' : 'Synced'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPersistenceFeature;