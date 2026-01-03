 "use client";
 
 import React, { useEffect, useMemo, useState, useRef } from "react";
import { useConversation } from "@/hooks/use-conversation";
import { conversationApi } from "@/api/conversation/api";
import { Conversation } from "@/api/conversation/types";
import { ActionButton } from "../../ui/buttons/action-button";
import { Close } from "@/icons";
import { t } from "@/i18n";

interface ConversationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationUuid: string; // encoded uuid of the primary conversation
}

export const ConversationLinkModal: React.FC<ConversationLinkModalProps> = ({ isOpen, onClose, conversationUuid }) => {
  const { conversations, loadConversations, loadMoreConversations, conversationPagination } = useConversation();
  const [searchTerm, setSearchTerm] = useState("");
  const [linkedUuids, setLinkedUuids] = useState<Record<string, boolean>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const hasLoadedRef = useRef(false);
  const linkedFetchedRef = useRef<Record<string, boolean>>({});
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      // reset so reopening the modal will load again
      hasLoadedRef.current = false;
      linkedFetchedRef.current = {};
      return;
    }

    // Load first page of conversations (descending order) only once per open
    if (!hasLoadedRef.current) {
      loadConversations(undefined);
      hasLoadedRef.current = true;
    }

    // Load linked conversations for this conversation only once per conversationUuid while modal open
    if (!linkedFetchedRef.current[conversationUuid]) {
      (async () => {
        try {
          const resp = await conversationApi.getLinkedConversations(conversationUuid);
          console.log("resp", resp);
          if (!resp.error) {
            const items = resp.data?.items || [];
            const map: Record<string, boolean> = {};
            items.forEach((it) => (map[it.uuid] = true));
            setLinkedUuids(map);
          }
        } catch (e) {
          // ignore
        } finally {
          linkedFetchedRef.current[conversationUuid] = true;
        }
      })();
    }
  }, [isOpen, conversationUuid, loadConversations]);

  const filteredConversations = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();
    return conversations
      .filter((c: Conversation) => c.uuid !== conversationUuid) // do not show current
      .filter((c: Conversation) => (lower ? c.name.toLowerCase().includes(lower) : true))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [conversations, searchTerm, conversationUuid]);

  const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (!conversationPagination) return;
    const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 150;
    if (nearBottom && conversationPagination.page < conversationPagination.total_pages) {
      await loadMoreConversations();
    }
  };

  const handleLinkToggle = async (targetUuid: string) => {
    setIsProcessing(true);
    try {
      if (linkedUuids[targetUuid]) {
        // unlink
        const resp = await conversationApi.unlinkConversation(conversationUuid, targetUuid);
        if (!resp.error) {
          setLinkedUuids((s) => ({ ...s, [targetUuid]: false }));
        }
      } else {
        const resp = await conversationApi.linkConversation(conversationUuid, targetUuid);
        if (!resp.error) {
          setLinkedUuids((s) => ({ ...s, [targetUuid]: true }));
        }
      }
    } catch (e) {
      // ignore
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[720px] max-h-[80vh] bg-white dark:bg-[#0b0b0e] rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("chat.manageLinks") || "Manage Conversation Links"}</h3>
          <div className="flex items-center gap-2">
            <ActionButton onClick={onClose} variant="ghost" size="sm">
              <Close className="w-4 h-4 mr-2" />
            </ActionButton>
          </div>
        </div>
        <div className="p-4">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("chat.searchPlaceholder") || "Search conversations..."}
            className="w-full px-3 py-2 rounded border"
          />
        </div>
        <div ref={listRef} onScroll={handleScroll} className="p-4 overflow-y-auto" style={{ maxHeight: "56vh" }}>
          {filteredConversations.length === 0 && <div className="text-sm text-muted p-2">No conversations</div>}
          {filteredConversations.map((conv) => (
            <div key={conv.uuid} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div>
                <div className="font-medium text-sm">{conv.name}</div>
                <div className="text-xs text-[color:var(--tokens-color-text-text-inactive-2)]">{new Date(conv.created_at).toLocaleString()}</div>
              </div>
              <div>
                <ActionButton
                  onClick={() => handleLinkToggle(conv.uuid)}
                  disabled={isProcessing}
                  size="sm"
                  variant={linkedUuids[conv.uuid] ? "danger" : "primary"}
                >
                  {linkedUuids[conv.uuid] ? (t("chat.unlink") || "Unlink") : (t("chat.link") || "Link")}
                </ActionButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationLinkModal;


