"use client";

import React from "react";
import { t } from "@/i18n";
import { ActionButton } from "@/components/ui/buttons";

interface MoveConversationConfirmationProps {
  isOpen: boolean;
  conversationName: string;
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
  onReopenMoveModal?: () => void;
  isLoading?: boolean;
}

export const MoveConversationConfirmation: React.FC<MoveConversationConfirmationProps> = ({
  isOpen,
  conversationName,
  projectName,
  onConfirm,
  onCancel,
  onReopenMoveModal,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[color:var(--tokens-color-surface-surface-primary)] rounded-2xl shadow-2xl border border-[color:var(--tokens-color-border-border-subtle)]">
        {/* Header */}
        <div className="border-b border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[color:var(--tokens-color-text-text-primary)]">
            {t("chat.moveConversationConfirmationTitle")}
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <p className="text-sm text-[color:var(--tokens-color-text-text-primary)] mb-6">
            {t("chat.moveConversationConfirmationMessage")}
          </p>

          <div className="bg-[color:var(--tokens-color-surface-surface-secondary)] rounded-lg p-4 mb-6">
            <div className="mb-3">
              <p className="text-xs font-semibold text-[color:var(--tokens-color-text-text-inactive-2)] uppercase tracking-wide mb-1">
                {t("chat.moveConversation")}
              </p>
              <p className="text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] truncate">
                {conversationName}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-[color:var(--tokens-color-text-text-inactive-2)] uppercase tracking-wide mb-1">
                {t("chat.selectProject")}
              </p>
              <p className="text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] truncate">
                {projectName}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4 flex gap-3 justify-end">
          <ActionButton
            onClick={() => {
              onCancel();
              onReopenMoveModal?.();
            }}
            variant="ghost"
            size="sm"
            disabled={isLoading}
            className="!px-4 !py-2"
          >
            {t("chat.cancel")}
          </ActionButton>
          <ActionButton
            onClick={onConfirm}
            variant="primary"
            size="sm"
            disabled={isLoading}
            className="!px-4 !py-2"
          >
            {isLoading ? "..." : t("chat.confirmMove")}
          </ActionButton>
        </div>
      </div>
    </div>
  );
};


