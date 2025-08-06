// frontend/src/hooks/useChat.js - Enhanced with Chat Persistence
import { useState, useCallback, useEffect } from 'react';
import { apiService } from '../services/api';

export const useChat = (
  // NEW: Additional parameters for persistence
  initialMessages = [],
  sessionId = null,
  onMessageSent = null
) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // NEW: Load initial messages when they change (from saved sessions)
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setMessages(initialMessages);
      console.log('📥 Loaded', initialMessages.length, 'messages from session');
    } else {
      setMessages([]);
    }
  }, [initialMessages]);

  const sendMessage = useCallback(async (message, selectedModel, options = {}) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);

    // NEW: Notify parent about message sent (for auto-save)
    if (onMessageSent) {
      onMessageSent('user', message, selectedModel);
    }

    setIsLoading(true);
    setError(null);

    try {
      // Enhanced API call with session ID
      const response = await apiService.sendMessage(message, selectedModel, {
        ...options,
        sessionId: sessionId // NEW: Include session ID in request
      });

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.message || response.content || response.text,
        timestamp: new Date(),
        model: response.modelUsed || selectedModel,
        usage: response.usage
      };

      setMessages(prev => [...prev, assistantMessage]);

      // NEW: Notify parent about assistant response (for auto-save)
      if (onMessageSent) {
        onMessageSent('assistant', assistantMessage.content, assistantMessage.model);
      }

      // If a different model was used, show a notification
      if (response.modelUsed && response.modelUsed !== selectedModel) {
        const notificationMessage = {
          id: Date.now() + 2,
          type: 'system',
          content: `Note: Used ${response.modelUsed} instead of ${selectedModel} due to availability.`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, notificationMessage]);
      }

      return response;

    } catch (error) {
      console.error('Error sending message:', error);

      let errorMessage = 'Failed to send message. ';

      if (error.message.includes('not_found_error')) {
        errorMessage += `The model "${selectedModel}" is not available. Please select a different model.`;
      } else if (error.message.includes('401')) {
        errorMessage += 'Authentication failed. Please check your API keys.';
      } else if (error.message.includes('429')) {
        errorMessage += 'Rate limit exceeded. Please try again later.';
      } else {
        errorMessage += error.message;
      }

      setError(errorMessage);

      // Add error message to chat
      const errorChatMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: errorMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorChatMessage]);

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, onMessageSent]); // NEW: Added dependencies

  const sendMessageStream = useCallback(async (message, selectedModel, onChunk, options = {}) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      model: selectedModel
    };

    setMessages(prev => [...prev, userMessage]);

    // NEW: Notify parent about user message (for auto-save)
    if (onMessageSent) {
      onMessageSent('user', message, selectedModel);
    }

    setIsLoading(true);
    setError(null);

    // Create placeholder assistant message for streaming
    const assistantMessageId = Date.now() + 1;
    const assistantMessage = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
      model: selectedModel,
      streaming: true
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      let finalContent = '';

      await apiService.sendMessageStream(
        message,
        selectedModel,
        (chunk) => {
          const chunkContent = chunk.content || chunk.text || '';
          finalContent += chunkContent;

          // Update the assistant message with new content
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunkContent }
              : msg
          ));

          // Call the provided onChunk callback
          if (onChunk) {
            onChunk(chunk);
          }
        },
        {
          ...options,
          sessionId: sessionId // NEW: Include session ID
        }
      );

      // Mark streaming as complete
      setMessages(prev => prev.map(msg =>
        msg.id === assistantMessageId
          ? { ...msg, streaming: false }
          : msg
      ));

      // NEW: Notify parent about complete assistant response (for auto-save)
      if (onMessageSent && finalContent) {
        onMessageSent('assistant', finalContent, selectedModel);
      }

    } catch (error) {
      console.error('Error streaming message:', error);
      setError(error.message);

      // Remove the placeholder message and add error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== assistantMessageId);
        return [...filtered, {
          id: Date.now() + 2,
          type: 'error',
          content: `Streaming failed: ${error.message}`,
          timestamp: new Date()
        }];
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, onMessageSent]); // NEW: Added dependencies

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const removeMessage = useCallback((messageId) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find(msg => msg.type === 'user');
    if (lastUserMessage) {
      // Remove messages after the last user message
      const lastUserIndex = messages.findIndex(msg => msg.id === lastUserMessage.id);
      setMessages(messages.slice(0, lastUserIndex + 1));

      // Get the model from the last user message or use a default
      return { message: lastUserMessage.content, model: lastUserMessage.model };
    }
    return null;
  }, [messages]);

  // NEW: Get conversation in format suitable for saving
  const getConversation = useCallback(() => {
    return messages
      .filter(msg => msg.type === 'user' || msg.type === 'assistant') // Exclude system/error messages
      .map(msg => ({
        role: msg.type, // 'user' or 'assistant'
        content: msg.content
      }));
  }, [messages]);

  // NEW: Save current conversation to persistence
  const saveConversation = useCallback(async (title = null) => {
    if (onMessageSent && typeof onMessageSent.saveConversation === 'function') {
      const conversation = getConversation();
      if (conversation.length > 0) {
        try {
          await onMessageSent.saveConversation(conversation, sessionId, title);
          console.log('💾 Conversation saved with', conversation.length, 'messages');
        } catch (error) {
          console.error('Failed to save conversation:', error);
        }
      }
    }
  }, [messages, sessionId, onMessageSent, getConversation]);

  // NEW: Load messages from a conversation
  const loadConversation = useCallback((conversationMessages) => {
    if (Array.isArray(conversationMessages)) {
      const formattedMessages = conversationMessages.map((msg, index) => ({
        id: Date.now() + index,
        type: msg.role || msg.type,
        content: msg.content,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
        model: msg.model || 'unknown'
      }));

      setMessages(formattedMessages);
      console.log('📖 Loaded conversation with', formattedMessages.length, 'messages');
    }
  }, []);

  return {
    // Existing returns
    messages,
    isLoading,
    error,
    sendMessage,
    sendMessageStream,
    clearMessages,
    removeMessage,
    retryLastMessage,
    setError,

    // NEW: Chat persistence returns
    getConversation,
    saveConversation,
    loadConversation,
    sessionId, // Expose current session ID
    messageCount: messages.length
  };
};