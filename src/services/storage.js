// services/storage.js
// Chat history and caching system

export const chatHistoryCache = {
  saveChat: function(chatId, messages) {
    const chatKey = `chat_${chatId}`;
    const chatData = {
      id: chatId,
      messages: messages,
      lastUpdated: Date.now(),
      messageCount: messages.length
    };
    localStorage.setItem(chatKey, JSON.stringify(chatData));

    // Update chat index
    const chatIndex = this.getChatIndex();
    chatIndex[chatId] = {
      id: chatId,
      lastUpdated: chatData.lastUpdated,
      messageCount: chatData.messageCount,
      title: messages.length > 0 ? (messages[0].text?.substring(0, 30) + '...' || 'New Chat') : 'New Chat'
    };
    localStorage.setItem('chat_index', JSON.stringify(chatIndex));
  },

  loadChat: function(chatId) {
    const chatKey = `chat_${chatId}`;
    const chatData = localStorage.getItem(chatKey);
    return chatData ? JSON.parse(chatData) : null;
  },

  getChatIndex: function() {
    const index = localStorage.getItem('chat_index');
    return index ? JSON.parse(index) : {};
  },

  getAllChats: function() {
    const index = this.getChatIndex();
    return Object.values(index).sort((a, b) => b.lastUpdated - a.lastUpdated);
  },

  deleteChat: function(chatId) {
    const chatKey = `chat_${chatId}`;
    localStorage.removeItem(chatKey);

    const chatIndex = this.getChatIndex();
    delete chatIndex[chatId];
    localStorage.setItem('chat_index', JSON.stringify(chatIndex));
  },

  exportChat: function(chatId) {
    const chatData = this.loadChat(chatId);
    if (!chatData) return null;

    const exportData = {
      id: chatData.id,
      title: chatData.messages[0]?.text?.substring(0, 30) + '...' || 'Exported Chat',
      exportDate: new Date().toISOString(),
      messages: chatData.messages.map(msg => ({
        type: msg.type,
        text: msg.text,
        model: msg.model,
        timestamp: msg.timestamp
      }))
    };

    return exportData;
  },

  importChat: function(exportData) {
    if (!exportData || !exportData.messages) return false;

    const newChatId = Date.now();
    const messages = exportData.messages.map((msg, index) => ({
      id: `${msg.type}-${newChatId}-${index}`,
      text: msg.text,
      type: msg.type,
      model: msg.model,
      timestamp: msg.timestamp || new Date().toISOString()
    }));

    this.saveChat(newChatId, messages);
    return newChatId;
  },

  getStorageStats: function() {
    const keys = Object.keys(localStorage);
    const chatKeys = keys.filter(key => key.startsWith('chat_'));
    let totalSize = 0;
    let totalMessages = 0;

    chatKeys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        totalSize += data.length;
        try {
          const parsed = JSON.parse(data);
          totalMessages += parsed.messageCount || 0;
        } catch (e) {
          // Skip invalid entries
        }
      }
    });

    return {
      chatCount: chatKeys.length - 1, // Subtract 1 for chat_index
      totalSize,
      totalMessages,
      averageMessagesPerChat: chatKeys.length > 1 ? totalMessages / (chatKeys.length - 1) : 0
    };
  }
};

// Context-aware prompt enhancement
export const contextualPrompts = {
  enhancePrompt: function(currentPrompt, chatHistory, currentModel) {
    const lowerPrompt = currentPrompt.toLowerCase();

    // Check if user is referencing previous conversation
    const contextualKeywords = [
      'previous', 'last', 'above', 'earlier', 'that code', 'the code',
      'update', 'modify', 'change', 'improve', 'fix', 'your suggestion',
      'your recommendations', 'what you said', 'mentioned earlier'
    ];

    const needsContext = contextualKeywords.some(keyword => lowerPrompt.includes(keyword));

    if (needsContext && chatHistory.length > 0) {
      // Get the last few AI messages for context
      const recentContext = chatHistory
        .filter(msg => msg.type === 'ai')
        .slice(-3) // Last 3 AI messages
        .map(msg => `Previous AI response: ${msg.text}`)
        .join('\n\n');

      // Get recent user messages for context
      const recentUserContext = chatHistory
        .filter(msg => msg.type === 'user')
        .slice(-3)
        .map(msg => `Previous user message: ${msg.text}`)
        .join('\n\n');

      const enhancedPrompt = `Context from our conversation:
${recentUserContext}

${recentContext}

Current request: ${currentPrompt}`;

      console.log('🧠 Enhanced prompt with context');
      return enhancedPrompt;
    }

    return currentPrompt;
  }
};