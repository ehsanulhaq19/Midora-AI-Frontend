"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ConversationModalContextType {
  showDeleteModal: (conversationUuid: string) => void;
  showArchiveModal: (conversationUuid: string) => void;
}

const ConversationModalContext = createContext<ConversationModalContextType | null>(null);

export const useConversationModal = () => {
  const context = useContext(ConversationModalContext);
  if (!context) {
    throw new Error("useConversationModal must be used within ConversationModalProvider");
  }
  return context;
};

interface ConversationModalProviderProps {
  children: ReactNode;
  onShowDelete: (conversationUuid: string) => void;
  onShowArchive: (conversationUuid: string) => void;
}

export const ConversationModalProvider: React.FC<ConversationModalProviderProps> = ({
  children,
  onShowDelete,
  onShowArchive,
}) => {
  const showDeleteModal = useCallback((conversationUuid: string) => {
    onShowDelete(conversationUuid);
  }, [onShowDelete]);

  const showArchiveModal = useCallback((conversationUuid: string) => {
    onShowArchive(conversationUuid);
  }, [onShowArchive]);

  return (
    <ConversationModalContext.Provider value={{ showDeleteModal, showArchiveModal }}>
      {children}
    </ConversationModalContext.Provider>
  );
};

