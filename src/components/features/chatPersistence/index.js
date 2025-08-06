// src/components/features/chatPersistence/index.js

// Export all components and hooks for easy importing
export { useChatPersistence } from './hooks/useChatPersistence';
export { chatStorageService } from './services/chatStorageService';

// Export a main ChatPersistence feature component that orchestrates everything
export { default as ChatPersistenceFeature } from './ChatPersistenceFeature';

// Example usage:
// import { ChatPersistenceFeature, useChatPersistence } from 'src/components/features/chatPersistence';