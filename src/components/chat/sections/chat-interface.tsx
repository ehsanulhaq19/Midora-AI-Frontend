"use client";

import React, { useState, useCallback, useRef } from "react";
import { ModelSelection } from "./model-selection";
import { MessageInput, MessageInputHandle } from "./message-input";
import { DragDropOverlay } from "@/components/ui/drag-drop-overlay";
import { LogoOnly } from "@/icons";
import { t, tWithParams } from "@/i18n";
import { useAuthRedux } from "@/hooks/use-auth-redux";
import { useToast } from "@/hooks";
import { Conversation } from "@/api/conversation/types";
import { ProjectScreen } from "./project-screen";
import { useRouter } from "next/navigation";

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
  const { error: showErrorToast } = useToast();
  const messageInputRef = useRef<MessageInputHandle>(null);
  const router = useRouter()
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

  // If a project is selected, show the project screen
  if (selectedProject) {
    return (
      <div
        className="flex flex-col items-center px-4 lg:px-0 py-6 relative flex-1 grow min-h-screen"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <DragDropOverlay isVisible={isDragOver} />
        <ProjectScreen
          project={selectedProject}
          conversations={conversations || []}
          onSelectConversation={selectConversation}
          onSendMessage={onSendMessage}
          isStreaming={isStreaming}
          onFilesChange={onFilesChange}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center gap-[246px] px-4 lg:px-0 py-6 relative flex-1 grow min-h-screen"
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
          <button  onClick={() => router.push('/pricing')} className="hidden sm:inline-flex items-center justify-center gap-2 h-[40px] p-2 bg-[color:var(--premitives-color-brand-purple-1000)] rounded-[var(--premitives-corner-radius-corner-radius-2)] hover:bg-[color:var(--tokens-color-surface-surface-button-pressed)]  transition-colors">
            <div className="relative w-fit  font-h02-heading02 text-[14px]  text-white tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]">
              {t("chat.upgradeToPro")}
            </div>
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex items-center flex-col w-full max-w-[695px] gap-6 relative flex-[0_0_auto] mx-auto">
        <div className="inline-flex items-center gap-[15px] relative flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-2.5 relative aspect-[1.02]">
            <LogoOnly className="relative h-9 w-9 self-stretch  aspect-[1.02] " />
          </div>
          <p className="relative flex items-center justify-center w-fit app-text-28 text-[color:var(--tokens-color-text-text-seconary)] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-center">
            {tWithParams("chat.welcomeBack", { name: userName })}
          </p>
        </div>

        <MessageInput
          ref={messageInputRef}
          onSend={onSendMessage}
          isStreaming={isStreaming}
          onFilesChange={onFilesChange}
        />
      </div>
    </div>
  );
};


