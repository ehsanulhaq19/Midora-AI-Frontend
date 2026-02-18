 "use client";

import React, { useEffect, useState } from "react";
import { conversationApi } from "@/api/conversation/api";
import { Button } from "@/components/ui";
import { MarkdownRenderer } from "@/components/markdown";
import { t } from "@/i18n";

interface ConversationShareModalProps {
  isOpen: boolean;
  conversationUuid: string | null;
  onClose: () => void;
}

export const ConversationShareModal: React.FC<ConversationShareModalProps> = ({ isOpen, conversationUuid, onClose }) => {
  const [conversationName, setConversationName] = useState<string>("");
  const [messagesPreview, setMessagesPreview] = useState<any[]>([]);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!conversationUuid) return;
      const convRes = await conversationApi.getConversation(conversationUuid);
      if (convRes.data && mounted) {
        setConversationName((convRes.data as any).name || "");
      }
      // fetch first 5 messages for preview
      const msgsRes = await conversationApi.getMessages(conversationUuid, 1, 5);
      if (msgsRes.data && mounted) {
        setMessagesPreview(msgsRes.data.messages || []);
      }
    };
    if (isOpen) load();
    return () => { mounted = false; };
  }, [isOpen, conversationUuid]);

  const handleCopyLink = async () => {
    if (!conversationUuid) return;
    try {
      setIsCopying(true);
      const url = `${window.location.origin}/chat/${conversationUuid}`;
      await navigator.clipboard.writeText(url);
      // indicate copied state
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (e) {
      // ignore clipboard errors
    } finally {
      setIsCopying(false);
    }
  };

  if (!isOpen) return null;

  const formatSender = (m: any) => {
    if (!m) return "User";
    if (m.sender_name && typeof m.sender_name === "string" && m.sender_name.trim() !== "") {
      return m.sender_name;
    }
    const sender = m.sender;
    if (!sender) return "User";
    if (typeof sender === "string") return sender;
    if (typeof sender === "object") {
      const first = sender.first_name || sender.first || "";
      const last = sender.last_name || sender.last || "";
      const full = `${first} ${last}`.trim();
      if (full) return full;
      if (sender.email) return sender.email;
    }
    return "User";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-[color:var(--tokens-color-surface-surface-primary)] rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--tokens-color-border-border-subtle)]">
          <h2 className="text-lg font-h02-heading02 text-[color:var(--tokens-color-text-text-primary)]">
            {conversationName || t("chat.shareConversation")}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div className="text-sm text-[color:var(--tokens-color-text-text-secondary)]">
            {t("chat.shareConversationDescription") || "Share this conversation by copying the link below."}
          </div>

          <div className="border rounded p-3 max-h-40 overflow-y-auto bg-[color:var(--tokens-color-surface-surface-primary)]">
            {messagesPreview.length > 0 ? (
              messagesPreview.map((m: any) => (
                <div key={m.uuid || Math.random()} className="mb-2">
                  <div className="text-xs text-[color:var(--tokens-color-text-text-inactive-2)]">{formatSender(m)}</div>
                  <div className="text-sm text-[color:var(--tokens-color-text-text-primary)]">
                    <MarkdownRenderer content={typeof m.content === "string" ? m.content : JSON.stringify(m.content)} />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)]">No messages to preview</div>
            )}
          </div>

          <div className="flex items-center gap-2 justify-end">
            <Button
              onClick={handleCopyLink}
              disabled={isCopying || !conversationUuid}
              className={`px-4 py-2 ${copied ? 'bg-green-600 text-white' : ''}`}
            >
              {copied ? t("chat.copied") : (isCopying ? t("common.copying") : t("chat.copyLink"))}
            </Button>
            <Button onClick={onClose} variant="ghost" className="px-4 py-2">{t("common.close")}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

ConversationShareModal.displayName = "ConversationShareModal";


