"use client";

import React, { useState, useCallback, useRef, useMemo } from "react";
import { ModelSelection } from "./model-selection";
import { MessageInput, MessageInputHandle } from "./message-input";
import { DragDropOverlay } from "@/components/ui/drag-drop-overlay";
import { LogoOnly, FolderOpen01, Close } from "@/icons";
import { t, tWithParams } from "@/i18n";
import { useAuthRedux } from "@/hooks/use-auth-redux";
import { useToast } from "@/hooks";
import { Conversation } from "@/api/conversation/types";

interface Project {
  id: string;
  name: string;
  category?: string;
}

interface ChatInterfaceProps {
  onSendMessage: (
    message: string,
    modelUuid?: string,
    fileUuids?: string[],
    uploadedFiles?: any[]
  ) => void;
  isCompact?: boolean;
  isStreaming?: boolean;
  onFilesChange?: (hasFiles: boolean) => void;
  selectedProject?: Project | null;
  conversations?: Conversation[];
  selectConversation?: (conversationUuid: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  isCompact = false,
  isStreaming = false,
  onFilesChange,
  selectedProject,
  conversations = [],
  selectConversation,
}) => {
  const { userName } = useAuthRedux();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
  const [projectFiles, setProjectFiles] = useState<
    { name: string; warning?: string }[]
  >([]);
  const { error: showErrorToast } = useToast();
  const messageInputRef = useRef<MessageInputHandle>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);

  const handleProjectFilesSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      if (!messageInputRef.current) {
        showErrorToast("Upload Failed", t("common.fileUpload.uploadFailed"));
        return;
      }
      for (const file of Array.from(files)) {
        const validation = messageInputRef.current.validateFile(file);
        if (!validation.isValid) {
          showErrorToast(
            "Upload Failed",
            validation.error || t("common.fileUpload.uploadFailed")
          );
          continue;
        }
        try {
          await messageInputRef.current.uploadFile(file);
          setProjectFiles((prev) => [...prev, { name: file.name }]);
        } catch (error) {
          showErrorToast(
            "Upload Failed",
            error instanceof Error
              ? error.message
              : t("common.fileUpload.uploadFailed")
          );
        }
      }
    },
    [showErrorToast]
  );

  // Get project conversations
  const projectConversations = useMemo(() => {
    if (!selectedProject || !conversations || conversations.length === 0) {
      return [];
    }
    const projectConversations = JSON.parse(
      localStorage.getItem("projectConversations") || "{}"
    );
    const conversationUuids = projectConversations[selectedProject.id] || [];
    return conversations
      .filter((conv) => conversationUuids.includes(conv.uuid))
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [selectedProject, conversations]);

  // Format date helper (e.g., "Nov 19")
  const formatConversationDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Extract subtitle from conversation name (first word after split)
  const getConversationSubtitle = (name: string): string => {
    const words = name.split(" ");
    if (words.length > 1) {
      // Return first word in lowercase as subtitle
      return words[0].toLowerCase();
    }
    return "";
  };

 

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length === 0) return;

      if (!messageInputRef.current) {
        showErrorToast("Upload Failed", t("common.fileUpload.uploadFailed"));
        return;
      }

      for (const file of files) {
        const validation = messageInputRef.current.validateFile(file);
        if (!validation.isValid) {
          showErrorToast(
            "Upload Failed",
            validation.error || t("common.fileUpload.uploadFailed")
          );
          continue;
        }

        try {
          await messageInputRef.current.uploadFile(file);
        } catch (error) {
          showErrorToast(
            "Upload Failed",
            error instanceof Error
              ? error.message
              : t("common.fileUpload.uploadFailed")
          );
        }
      }
    },
    [showErrorToast]
  );

  if (isCompact) {
    return (
      <div
        className="w-full max-w-[808px] max-h-[106px] mx-auto p-4 relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <DragDropOverlay isVisible={isDragOver} />
        <MessageInput
          ref={messageInputRef}
          onSend={onSendMessage}
          isStreaming={isStreaming}
          className="max-w-[808px]"
          textAreaClassName="!app-text-lg"
          onFilesChange={onFilesChange}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center ${
        projectConversations.length > 0 ? "gap-[50px]" : " gap-[246px] "
      } px-4 lg:px-0 py-6 relative flex-1 grow min-h-screen`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DragDropOverlay isVisible={isDragOver} />

      {/* Header */}
      <div className="flex items-start justify-between relative w-full px-[24px]">
        <div className="flex items-center gap-4">
          <ModelSelection />
        </div>

        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex items-center justify-center gap-2 h-[40px] p-2 bg-[color:var(--premitives-color-brand-purple-1000)] rounded-[var(--premitives-corner-radius-corner-radius-2)] hover:bg-[color:var(--tokens-color-surface-surface-button-pressed)]  transition-colors">
            <div className="relative w-fit  font-h02-heading02 text-[14px]  text-white tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
              {t("chat.upgradeToPro")}
            </div>
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div
        className={`flex ${
          projectConversations.length > 0 ? "items-start" : "items-center"
        } flex-col w-full max-w-[695px]  gap-6 relative flex-[0_0_auto] mx-auto`}
      >
        {selectedProject ? (
          <div className="flex items-center justify-between w-full gap-4">
            <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
              {projectConversations.length > 0 && (
                <div className="flex flex-col w-[37px] h-[20px] items-start gap-2.5 relative aspect-[1.02]">
                  <FolderOpen01 className="relative self-stretch w-full aspect-[1.02]" />
                </div>
              )}
              <p
                className={`relative flex items-center justify-center w-fit app-text-28 text-[color:var(--tokens-color-text-text-seconary)] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-center`}
              >
                {selectedProject.name}
              </p>
            </div>
            {projectConversations.length > 0 && (
              <button
                onClick={() => setIsFilesModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-full transition-colors"
              >
                Add files
              </button>
            )}
          </div>
        ) : (
          <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
            <div className="flex flex-col w-[37px] h-[20px] items-start gap-2.5 relative aspect-[1.02]">
              <LogoOnly className="relative self-stretch w-full mb-[-0.45px] aspect-[1.02]" />
            </div>
            <p className="relative flex items-center justify-center w-fit app-text-28 text-[color:var(--tokens-color-text-text-seconary)] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-center">
              {tWithParams("chat.welcomeBack", { name: userName })}
            </p>
          </div>
        )}

        <MessageInput
          ref={messageInputRef}
          onSend={onSendMessage}
          isStreaming={isStreaming}
          onFilesChange={onFilesChange}
          placeholder={
            selectedProject ? `New chat in ${selectedProject.name}` : undefined
          }
        />

        {/* Project Chat History */}
        {selectedProject && projectConversations.length > 0 && (
          <div className="flex flex-col w-full max-w-[808px] gap-2 mt-8">
            {projectConversations.map((conversation) => {
              const subtitle = getConversationSubtitle(conversation.name);
              const dateStr = formatConversationDate(conversation.created_at);

              return (
                <button
                  key={conversation.uuid}
                  onClick={() => {
                    if (selectConversation) {
                      selectConversation(conversation.uuid);
                    }
                  }}
                  className="flex items-center justify-between p-4 rounded-lg bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors text-left group"
                >
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="font-h02-heading02 text-[color:var(--tokens-color-text-text-seconary)] text-[16px] font-semibold leading-[var(--text-line-height)] truncate">
                      {conversation.name}
                    </div>
                    {/* {subtitle && ( */}
                    <div className="font-h02-heading02 text-[color:var(--tokens-color-text-text-inactive-2)] text-[13px] font-[number:var(--text-small-font-weight)] leading-[var(--text-small-line-height)]">
                      {subtitle || 'Data will appear here'} 
                    </div>
                    {/* )} */}
                  </div>
                  <div className="font-h02-heading02 text-[color:var(--tokens-color-text-text-inactive-2)] text-[13px] font-[number:var(--text-small-font-weight)] leading-[var(--text-small-line-height)] ml-4 whitespace-nowrap">
                    {dateStr}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {/* Hidden file input for project modal */}
      <input
        ref={projectFileInputRef}
        type="file"
        multiple
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z"
        className="hidden"
        onChange={(e) => {
          handleProjectFilesSelect(e.target.files);
          e.target.value = "";
        }}
      />
      {isFilesModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="w-full max-w-[520px] h-[500px] overflow-auto bg-white rounded-2xl shadow-2xl border border-[color:var(--tokens-color-border-border-subtle)]">
            <div className="flex items-center justify-between border-b border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4">
              <div className="font-h02-heading02 text-lg text-[color:var(--tokens-color-text-text-primary)]">
                Project files
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-[color:var(--premitives-color-brand-purple-1000)] rounded-full hover:bg-[color:var(--tokens-color-surface-surface-button-pressed)] transition-colors"
                  onClick={() => projectFileInputRef.current?.click()}
                >
                  Add files
                </button>
                <button
                  aria-label="Close files modal"
                  className="p-1 rounded-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
                  onClick={() => setIsFilesModalOpen(false)}
                >
                  <Close className="w-4 h-4" color="currentColor" />
                </button>
              </div>
            </div>
            <div className="max-h-[360px] overflow-y-auto px-6 py-4">
              {projectFiles.length === 0 ? (
                <div className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">
                  No files added yet.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {projectFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center gap-3 rounded-xl border border-[color:var(--tokens-color-border-border-subtle)] px-4 py-3 bg-[color:var(--tokens-color-surface-surface-tertiary)]"
                    >
                      <div className="w-10 h-10 rounded-full bg-[color:var(--premitives-color-light-purple-1000)] flex items-center justify-center text-white font-semibold text-sm">
                        {file.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[color:var(--tokens-color-text-text-primary)]">
                          {file.name}
                        </span>
                        <span className="text-xs text-[color:var(--tokens-color-text-text-inactive-2)]">
                          {file.warning ||
                            "File contents may not be accessible"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


