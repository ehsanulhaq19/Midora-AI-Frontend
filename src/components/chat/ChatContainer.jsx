// src/components/chat/ChatContainer.jsx
import React, { useState, useRef, useEffect } from 'react';
import ModelIcon from '../ui/ModelIcon';

const ChatContainer = ({
  messages = [],
  isLoading = false,
  selectedModel,
  onSendMessage,
  onNewChat,
  initialMessages = [],
  onMessageSent,
  sessionId
}) => {
  const [inputValue, setInputValue] = useState('');
  const [allMessages, setAllMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize messages from props
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setAllMessages(initialMessages);
    } else if (messages && messages.length > 0) {
      setAllMessages(messages);
    }
  }, [initialMessages, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: inputValue,
      type: 'user', // Using 'type' to match your existing format
      timestamp: new Date()
    };

    // Add user message immediately
    setAllMessages(prev => [...prev, newMessage]);

    // Call onMessageSent for persistence if available
    if (onMessageSent) {
      onMessageSent('user', inputValue, selectedModel);
    }

    // Call the main onSendMessage handler
    if (onSendMessage) {
      onSendMessage(inputValue);
    }

    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {allMessages.length === 0 ? (
            // Empty state
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-500">Ask me anything! I'm here to help.</p>
            </div>
          ) : (
            // Messages
            <div className="space-y-6">
              {allMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                      {message.type === 'user' ? (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">U</span>
                        </div>
                      ) : (
                        <ModelIcon modelId={message.model || selectedModel} className="w-8 h-8" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-3xl">
                    <div className="mr-3">
                      <ModelIcon modelId={selectedModel} className="w-8 h-8" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            {/* Attachment Button */}
            <button className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            {/* Input Field */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="flex-shrink-0 p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          {/* Model Info */}
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <div className="flex items-center">
              <ModelIcon modelId={selectedModel} className="w-4 h-4 mr-2" />
              <span>Using {selectedModel}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{allMessages.length} messages</span>
              {onNewChat && (
                <button
                  onClick={onNewChat}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  New Chat
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;