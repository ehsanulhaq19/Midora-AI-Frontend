"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavigationSidebar } from "./sections/navigation-sidebar";
import { ChatInterface } from "./sections/chat-interface";
import { ConversationContainer } from "./sections/conversation-container";
import { ChatHeader } from "./sections/chat-header";
import { ConversationHistoryScreen } from "./sections/conversation-history-screen";
import { ArchiveScreen } from "./sections/archive-screen";
import { useConversation } from "@/hooks/use-conversation";
import { AccountScreen } from "../account/account-screen";
import { useAIModels, useProjects } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setSelectedProject, Project } from "@/store/slices/projectsSlice";
import { ConversationModalProvider } from "./sections/conversation-modal-context";

export const ChatScreen: React.FC = () => {
  const [hasFiles, setHasFiles] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const hasInitialized = useRef(false);
  const dispatch = useDispatch();
  const { selectedProjectId, projects } = useSelector(
    (state: RootState) => state.projects
  );
  const selectedProject = selectedProjectId
    ? projects[selectedProjectId] || null
    : null;
  const {
    currentConversation,
    conversations,
    selectConversation,
    loadConversations,
    sendMessage,
    startNewChat,
    isLoading,
    error,
    isStreaming,
  } = useConversation();

  const { fetchServiceProviders } = useAIModels();
  const { loadProjects } = useProjects();

  const handleCanvasStateChange = (isOpen: boolean) => {
    setIsCanvasOpen(isOpen);
  };

  useEffect(() => {
    // Load initial data only once on mount
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadConversations();
      fetchServiceProviders();
      loadProjects(1, 10); // Load first page of projects
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProjectSelect = (project: Project | null) => {
    if (project) {
      dispatch(setSelectedProject(project.id));
      // Start new chat in project context
      startNewChat();
    } else {
      dispatch(setSelectedProject(null));
    }
  };

  const handleSendMessage = async (
    message: string,
    modelUuid?: string,
    fileUuids?: string[],
    uploadedFiles?: any[]
  ) => {
    // Pass project UUID (encoded) to sendMessage
    // The project.id is already the encoded UUID from Redux
    await sendMessage(
      message,
      modelUuid,
      undefined,
      fileUuids,
      uploadedFiles,
      selectedProject?.id
    );
  };

  // Modal handlers - these will be passed to ChatInterface which will render the modals
  const [modalHandlers, setModalHandlers] = useState<{
    showDeleteModal: (conversationUuid: string) => void;
    showArchiveModal: (conversationUuid: string) => void;
  } | null>(null);

  const handleShowDelete = useCallback((uuid: string) => {
    if (modalHandlers) {
      modalHandlers.showDeleteModal(uuid);
    }
  }, [modalHandlers]);

  const handleShowArchive = useCallback((uuid: string) => {
    if (modalHandlers) {
      modalHandlers.showArchiveModal(uuid);
    }
  }, [modalHandlers]);

  return (
    <ConversationModalProvider
      onShowDelete={handleShowDelete}
      onShowArchive={handleShowArchive}
    >
      <div className="min-h-screen flex bg-[color:var(--tokens-color-surface-surface-primary)]">
        <NavigationSidebar
        isOpen={true}
        onClose={() => {}}
        onNewChat={() => {
          handleProjectSelect(null);
          startNewChat();
          setIsCanvasOpen(false);
          setIsAccountOpen(false);
          setIsHistoryOpen(false);
          setIsArchiveOpen(false);
        }}
        showFullSidebar={!isCanvasOpen}
        selectedProjectId={selectedProjectId || undefined}
        onProjectSelect={(project) => {
          handleProjectSelect(project);
          setIsAccountOpen(false);
          setIsHistoryOpen(false);
          setIsArchiveOpen(false);
        }}
        onAccountClick={() => {
          setIsAccountOpen(true);
          setIsHistoryOpen(false);
          setIsArchiveOpen(false);
        }}
        onNavigate={() => {
          setIsAccountOpen(false);
          setIsHistoryOpen(false);
          setIsArchiveOpen(false);
        }}
        onSearchClick={() => {
          setIsHistoryOpen(true);
          setIsAccountOpen(false);
          setIsArchiveOpen(false);
        }}
        onArchiveClick={() => {
          setIsArchiveOpen(true);
          setIsAccountOpen(false);
          setIsHistoryOpen(false);
        }}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative z-0 min-w-0">
        {isAccountOpen ? (
          <div className="w-full h-full relative z-0">
            <AccountScreen onClose={() => setIsAccountOpen(false)} />
          </div>
        ) : isHistoryOpen ? (
          <div className="w-full h-full relative z-0">
            <ConversationHistoryScreen
              onClose={() => setIsHistoryOpen(false)}
              onSelectConversation={(uuid) => {
                selectConversation(uuid);
                setIsHistoryOpen(false);
              }}
            />
          </div>
        ) : isArchiveOpen ? (
          <div className="w-full h-full relative z-0">
            <ArchiveScreen
              onClose={() => setIsArchiveOpen(false)}
              onSelectConversation={(uuid) => {
                selectConversation(uuid);
                setIsArchiveOpen(false);
              }}
            />
          </div>
        ) : currentConversation ? (
          <>
            {!isCanvasOpen && <ChatHeader />}
            <ConversationContainer
              conversationUuid={currentConversation.uuid}
              className={`flex-1 ${
                isCanvasOpen
                  ? "h-screen"
                  : hasFiles
                  ? "max-h-[calc(100vh-380px)]"
                  : "max-h-[calc(100vh-270px)]"
              }`}
              onCanvasStateChange={handleCanvasStateChange}
              onSendMessage={isCanvasOpen ? handleSendMessage : undefined}
              isStreaming={isStreaming}
              onFilesChange={isCanvasOpen ? setHasFiles : undefined}
              hasFiles={hasFiles}
            />
            {!isCanvasOpen && (
              <div className="">
                <ChatInterface
                  onSendMessage={handleSendMessage}
                  isCompact={true}
                  isStreaming={isStreaming}
                  onFilesChange={setHasFiles}
                  selectedProject={selectedProject}
                  onModalHandlersReady={setModalHandlers}
                />
              </div>
            )}
          </>
        ) : (
          <ChatInterface
            onSendMessage={handleSendMessage}
            isCompact={false}
            isStreaming={isStreaming}
            selectedProject={selectedProject}
            conversations={conversations}
            selectConversation={selectConversation}
            onModalHandlersReady={setModalHandlers}
          />
        )}
      </div>
      </div>
    </ConversationModalProvider>
  );
};
