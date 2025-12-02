"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { FolderOpen01 } from "@/icons";
import { Conversation } from "@/api/conversation/types";
import { useToast, useProjects, useFileUpload } from "@/hooks";
import { t } from "@/i18n";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MessageInput, MessageInputHandle } from "./message-input";
import { ProjectFilesModal } from "./project-files-modal";

interface Project {
  id: string;
  name: string;
  category?: string;
}

interface ProjectScreenProps {
  project: Project;
  conversations: Conversation[];
  onSelectConversation?: (conversationUuid: string) => void;
  onSendMessage?: (
    message: string,
    modelUuid?: string,
    fileUuids?: string[],
    uploadedFiles?: any[]
  ) => void;
  isStreaming?: boolean;
  onFilesChange?: (hasFiles: boolean) => void;
}


export const ProjectScreen: React.FC<ProjectScreenProps> = ({
  project,
  conversations,
  onSelectConversation,
  onSendMessage,
  isStreaming = false,
  onFilesChange,
}) => {
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [projectConversationsList, setProjectConversationsList] = useState<Array<{ uuid: string; name: string; created_at: string }>>([]);
  const [conversationsPagination, setConversationsPagination] = useState<{ page: number, per_page: number, total: number, total_pages: number } | null>(null);
  const [isLoadingMoreConversations, setIsLoadingMoreConversations] = useState(false);
  const messageInputRef = useRef<MessageInputHandle>(null);
  const conversationsContainerRef = useRef<HTMLDivElement>(null);
  const { loadProjectConversations, projectConversationsData } = useProjects();
  const hasLoadedRef = useRef<string | null>(null);

  // Load project conversations on mount and when project changes
  useEffect(() => {
    // Reset loaded ref when project changes
    if (hasLoadedRef.current !== project.id) {
      hasLoadedRef.current = null;
    }

    // Skip if we've already loaded for this project
    if (hasLoadedRef.current === project.id) {
      return;
    }

    const loadConversations = async () => {
      try {
        // Check Redux store first - only call API if not in store
        const cachedConversations = projectConversationsData[project.id];
        if (cachedConversations && cachedConversations.length > 0) {
          // Use cached data from Redux
          setProjectConversationsList(cachedConversations);
          // Set a default pagination for cached data
          setConversationsPagination({ page: 1, per_page: 10, total: cachedConversations.length, total_pages: 1 });
          hasLoadedRef.current = project.id;
        } else {
          // Fetch from API if not in Redux
          const result = await loadProjectConversations(project.id, 1, 10, false);
          if (result) {
            setProjectConversationsList(result.conversations);
            setConversationsPagination(result.pagination);
            hasLoadedRef.current = project.id;
          }
        }
      } catch (error) {
        console.error('Failed to load project conversations:', error);
      }
    };
    
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  // Handle scroll to load more conversations
  const handleConversationsScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const threshold = 10;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (
        isNearBottom &&
        !isLoadingMoreConversations &&
        conversationsPagination &&
        conversationsPagination.page < conversationsPagination.total_pages
      ) {
        setIsLoadingMoreConversations(true);
        loadProjectConversations(project.id, conversationsPagination.page + 1, 10)
          .then((result) => {
            if (result) {
              setProjectConversationsList((prev) => [...prev, ...result.conversations]);
              setConversationsPagination(result.pagination);
            }
          })
          .catch((error) => {
            console.error('Failed to load more conversations:', error);
          })
          .finally(() => {
            setIsLoadingMoreConversations(false);
          });
      }
    },
    [isLoadingMoreConversations, conversationsPagination, loadProjectConversations, project.id]
  );

  // Format date helper (e.g., "Nov 19")
  const formatConversationDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Extract subtitle from conversation name (first word after split)
  const getConversationSubtitle = (name: string): string => {
    const words = name.split(" ");
    if (words.length > 1) {
      return words[0].toLowerCase();
    }
    return "";
  };


  // Handle message send - parent will create conversation and link via project_uuid
  const handleSendMessage = useCallback(async (
    message: string,
    modelUuid?: string,
    fileUuids?: string[],
    uploadedFiles?: any[]
  ) => {
    if (!onSendMessage) return;

    // Call parent's onSendMessage - it will create conversation and link via project_uuid
    // The conversation will be created in use-conversation hook when projectId is provided
    await onSendMessage(message, modelUuid, fileUuids, uploadedFiles);
    
    // Reload project conversations after a delay to get the newly created one
    // This ensures the conversation appears in the list
    // Force refresh to get the latest data from API
    setTimeout(async () => {
      try {
        const result = await loadProjectConversations(project.id, 1, 10, true);
        if (result) {
          setProjectConversationsList(result.conversations);
          setConversationsPagination(result.pagination);
          // Reset the loaded ref so we can reload if needed
          hasLoadedRef.current = null;
        }
      } catch (error) {
        console.error('Failed to reload project conversations:', error);
      }
    }, 1500);
  }, [onSendMessage, project.id, loadProjectConversations]);

  return (
    <>
      <div className="flex flex-col items-center gap-[50px] px-4 lg:px-0 py-6 relative flex-1 grow min-h-screen w-full">
        {/* Project Header Section */}
        <div className="flex items-start flex-col w-full max-w-[698px] gap-6 relative flex-[0_0_auto] mx-auto">
          <div className="flex items-center justify-between w-full gap-4 max-w-[700px] m-auto">
            <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
              <div className="flex flex-col  items-start gap-2.5 relative aspect-[1.02] ">
                <FolderOpen01 className="relative !w-8 !h-8 self-stretch  aspect-[1.02]" />
              </div>
              <p className="relative max-w-[300px] truncate app-text-28 text-[color:var(--tokens-color-text-text-seconary)] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)]">
                {project.name}
              </p>
            </div>
            <button
              onClick={() => setIsFilesModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] bg-[color:var(--tokens-color-surface-surface-tertiary)] hover:text-white rounded-full transition-colors hover:bg-[color:var(--tokens-color-surface-surface-button)]"
            >
              Add files
            </button>
          </div>

          <MessageInput
            ref={messageInputRef}
            onSend={handleSendMessage}
            isStreaming={isStreaming}
            onFilesChange={onFilesChange}
            placeholder={`New chat in ${project.name}`}
          />

          {/* Project Chat History */}
          {projectConversationsList.length > 0 && (
            <div 
              ref={conversationsContainerRef}
              className="flex flex-col w-full max-w-[808px] gap-2 mt-8 max-h-[400px] overflow-y-auto scroll-smooth"
              onScroll={handleConversationsScroll}
            >
              {projectConversationsList.map((conversation) => {
                const subtitle = getConversationSubtitle(conversation.name);
                const dateStr = formatConversationDate(conversation.created_at);

                return (
                  <button
                    key={conversation.uuid}
                    onClick={() => {
                      if (onSelectConversation) {
                        onSelectConversation(conversation.uuid);
                      }
                    }}
                    className="flex items-center justify-between p-4 rounded-lg bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors text-left group hover:bg-[color:var(--tokens-color-surface-surface-secondary)]"
                  >
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="font-h02-heading02 text-[color:var(--tokens-color-text-text-seconary)] font-semibold leading-[var(--text-line-height)] truncate">
                        {conversation.name}
                      </div>
                      <div className="font-h02-heading02 text-[color:var(--tokens-color-text-text-inactive-2)] text-[13px] font-[number:var(--text-small-font-weight)] leading-[var(--text-small-line-height)]">
                        {subtitle || "Data will appear here"}
                      </div>
                    </div>
                    <div className="font-h02-heading02 text-[color:var(--tokens-color-text-text-inactive-2)] text-[13px] font-[number:var(--text-small-font-weight)] leading-[var(--text-small-line-height)] ml-4 whitespace-nowrap">
                      {dateStr}
                    </div>
                  </button>
                );
              })}
              
              {/* Loading indicator for more conversations */}
              {isLoadingMoreConversations && (
                <div className="w-full p-3 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--tokens-color-text-text-inactive-2)]"></div>
                    <span className="text-[14px]">
                      {t("chat.loadingMoreConversations")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Files Modal */}
      <ProjectFilesModal
        isOpen={isFilesModalOpen}
        onClose={() => setIsFilesModalOpen(false)}
        projectId={project.id}
      />
    </>
  );
};
