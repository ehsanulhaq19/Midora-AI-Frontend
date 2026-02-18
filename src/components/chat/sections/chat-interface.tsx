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
import { useTheme } from "@/hooks/use-theme";
import { ConfirmationModal } from "./confirmation-modal";
import { useConversation } from "@/hooks/use-conversation";
import { useUserCredits } from "@/hooks/use-user-credits";

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
  onModalHandlersReady?: (handlers: {
    showDeleteModal: (conversationUuid: string) => void;
    showArchiveModal: (conversationUuid: string) => void;
  }) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onSendMessage,
  isCompact = false,
  isStreaming = false,
  onFilesChange,
  selectedProject,
  conversations = [],
  selectConversation,
  onModalHandlersReady,
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { userName } = useAuthRedux();
  const [isDragOver, setIsDragOver] = useState(false);
  const { error: showErrorToast } = useToast();
  const messageInputRef = useRef<MessageInputHandle>(null);
  const router = useRouter();
  const { deleteConversation, archiveConversation } = useConversation();
  const { data: creditsData } = useUserCredits();
  
  const isCreditsExhausted = creditsData 
    ? creditsData.used_credits >= creditsData.available_credits 
    : false;
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [pendingConversationUuid, setPendingConversationUuid] = useState<string | null>(null);

  // Handle delete confirmation
  const handleDeleteConfirm = useCallback(async () => {
    if (pendingConversationUuid) {
      await deleteConversation(pendingConversationUuid);
      setPendingConversationUuid(null);
      setShowDeleteModal(false);
    }
  }, [pendingConversationUuid, deleteConversation]);

  // Handle archive confirmation
  const handleArchiveConfirm = useCallback(async () => {
    if (pendingConversationUuid) {
      await archiveConversation(pendingConversationUuid);
      setPendingConversationUuid(null);
      setShowArchiveModal(false);
    }
  }, [pendingConversationUuid, archiveConversation]);

  // Handlers to show modals
  const handleShowDeleteModal = useCallback((conversationUuid: string) => {
    setPendingConversationUuid(conversationUuid);
    setShowDeleteModal(true);
  }, []);

  const handleShowArchiveModal = useCallback((conversationUuid: string) => {
    setPendingConversationUuid(conversationUuid);
    setShowArchiveModal(true);
  }, []);

  // Expose handlers to parent
  React.useEffect(() => {
    if (onModalHandlersReady) {
      onModalHandlersReady({
        showDeleteModal: handleShowDeleteModal,
        showArchiveModal: handleShowArchiveModal,
      });
    }
  }, [onModalHandlersReady, handleShowDeleteModal, handleShowArchiveModal]);
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
      <>
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
            disabled={isCreditsExhausted}
            disabledMessage="You have used all credits, please upgrade the subscription."
          />
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setPendingConversationUuid(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Conversation"
          message="Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently removed."
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonVariant="danger"
        />

        {/* Archive Confirmation Modal */}
        <ConfirmationModal
          isOpen={showArchiveModal}
          onClose={() => {
            setShowArchiveModal(false);
            setPendingConversationUuid(null);
          }}
          onConfirm={handleArchiveConfirm}
          title="Archive Conversation"
          message="Are you sure you want to archive this conversation? It will be hidden from your conversation list but can be restored later."
          confirmText="Archive"
          cancelText="Cancel"
          confirmButtonVariant="primary"
        />
      </>
    );
  }

  // If a project is selected, show the project screen
  if (selectedProject) {
    return (
      <>
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

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setPendingConversationUuid(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Delete Conversation"
          message="Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently removed."
          confirmText="Delete"
          cancelText="Cancel"
          confirmButtonVariant="danger"
        />

        {/* Archive Confirmation Modal */}
        <ConfirmationModal
          isOpen={showArchiveModal}
          onClose={() => {
            setShowArchiveModal(false);
            setPendingConversationUuid(null);
          }}
          onConfirm={handleArchiveConfirm}
          title="Archive Conversation"
          message="Are you sure you want to archive this conversation? It will be hidden from your conversation list but can be restored later."
          confirmText="Archive"
          cancelText="Cancel"
          confirmButtonVariant="primary"
        />
      </>
    );
  }

  return (
    <>
      <div
        className="flex flex-col items-center gap-[246px] px-4 lg:px-0 py-6 relative flex-1 grow min-h-screen"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <DragDropOverlay isVisible={isDragOver} />

      {/* Header */}
      <div className="flex items-start justify-between relative w-full px-[24px] lg:px-[24px] pl-[64px]">
        <div className="flex items-center gap-4">
          <ModelSelection />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push("/pricing")}
            className={`group hidden sm:inline-flex items-center justify-center gap-2 h-[40px] p-2 ${
              isDark
                ? "bg-[color:var(--tokens-color-surface-surface-card-purple)]"
                : "bg-[color:var(--premitives-color-brand-purple-1000)]"
            } rounded-[var(--premitives-corner-radius-corner-radius-2)] hover:bg-[color:var(--tokens-color-surface-surface-button-pressed)]  transition-colors`}
          >
            <div className={`relative w-fit  font-h02-heading02 text-[14px] ${
              isDark
                ? "text-[color:var(--tokens-color-surface-surface-dark)] group-hover:text-white"
                : "text-white"
            } tracking-[var(--h05-heading05-letter-spacing)] leading-[var(--h05-heading05-line-height)] whitespace-nowrap [font-style:var(--h05-heading05-font-style)]`}>
              {t("chat.upgradeToPro")}
            </div>
          </button>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex items-center flex-col w-full max-w-[695px] gap-6 relative flex-[0_0_auto] mx-auto">
        <div className="inline-flex flex-col md:flex-row items-center gap-[15px] relative flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-2.5 relative aspect-[1.02]">
            {isDark ? (
              <img src="/img/dark_logo.svg" alt="Logo" className="relative h-9 w-9 self-stretch aspect-[1.02]" />
            ) : (
              <LogoOnly className="relative h-9 w-9 self-stretch aspect-[1.02]" />
            )}
          </div>
          <p className="relative flex items-center justify-center w-fit app-text-xl sm:app-text-28 text-[color:var(--tokens-color-text-text-seconary)] font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-center">
            {tWithParams("chat.welcomeBack", { name: userName })}
          </p>
        </div>

        <MessageInput
          ref={messageInputRef}
          onSend={onSendMessage}
          isStreaming={isStreaming}
          onFilesChange={onFilesChange}
          disabled={isCreditsExhausted}
          disabledMessage="You have used all credits, please upgrade the subscription."
        />
      </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPendingConversationUuid(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonVariant="danger"
      />

      {/* Archive Confirmation Modal */}
      <ConfirmationModal
        isOpen={showArchiveModal}
        onClose={() => {
          setShowArchiveModal(false);
          setPendingConversationUuid(null);
        }}
        onConfirm={handleArchiveConfirm}
        title="Archive Conversation"
        message="Are you sure you want to archive this conversation? It will be hidden from your conversation list but can be restored later."
        confirmText="Archive"
        cancelText="Cancel"
        confirmButtonVariant="primary"
      />
    </>
  );
};
