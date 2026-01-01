"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Search02, Trash, Archive } from "@/icons";
import { useTheme } from "@/hooks/use-theme";
import { t, tWithParams } from "@/i18n";
import { Conversation } from "@/api/conversation/types";
import { useConversation } from "@/hooks/use-conversation";
import { ConfirmationModal } from "./confirmation-modal";
import { ActionButton } from "@/components/ui/buttons";
import { usePathname, useRouter } from "next/navigation";

interface ArchiveScreenProps {
  onClose?: () => void;
  onSelectConversation?: (conversationUuid: string) => void;
}

// Calculate days ago from a date string
const getDaysAgo = (dateString: string): number => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Format days ago text
const formatDaysAgo = (days: number): string => {
  if (days === 0) {
    return t("chat.history.today");
  } else if (days === 1) {
    return t("chat.history.yesterday");
  } else {
    return tWithParams("chat.history.daysAgo", { days: String(days) });
  }
};

export const ArchiveScreen: React.FC<ArchiveScreenProps> = ({ onClose, onSelectConversation }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { unarchiveConversation, deleteConversation, selectConversation, loadArchivedConversations } = useConversation();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, per_page: 20, total: 0, total_pages: 0 });
  
  // Modal states
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pendingConversationUuid, setPendingConversationUuid] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSelectingConversation, setIsSelectingConversation] = useState(false);

  // Load conversations on mount and when search query changes (with debounce)
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      setIsLoading(true);
      try {
        const result = await loadArchivedConversations(searchQuery.trim() || undefined, 1, 20);
        if (isMounted) {
          setArchivedConversations(result.conversations);
          setPagination(result.pagination);
        }
      } catch (error) {
        console.error("Error loading archived conversations:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(() => {
      loadData();
    }, 300); // Debounce search by 300ms

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Stable function to reload conversations (used in handlers)
  const reloadConversations = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await loadArchivedConversations(searchQuery.trim() || undefined, 1, 20);
      setArchivedConversations(result.conversations);
      setPagination(result.pagination);
    } catch (error) {
      console.error("Error loading archived conversations:", error);
    } finally {
      setIsLoading(false);
    }
  }, [loadArchivedConversations, searchQuery]);

  // Sort conversations by most recent first
  const sortedConversations = useMemo(() => {
    return [...archivedConversations].sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime()
    );
  }, [archivedConversations]);

  // Handle unarchive
  const handleUnarchive = useCallback(async () => {
    if (!pendingConversationUuid) return;
    
    setIsProcessing(true);
    try {
      const success = await unarchiveConversation(pendingConversationUuid);
      if (success) {
        // Remove from the list and reload
        setArchivedConversations(prev => prev.filter(conv => conv.uuid !== pendingConversationUuid));
        // Reload to update pagination
        await reloadConversations();
      }
    } catch (error) {
      console.error("Unarchive failed:", error);
    } finally {
      setIsProcessing(false);
      setShowUnarchiveModal(false);
      setPendingConversationUuid(null);
    }
  }, [pendingConversationUuid, unarchiveConversation, reloadConversations]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!pendingConversationUuid) return;
    
    setIsProcessing(true);
    try {
      const success = await deleteConversation(pendingConversationUuid);
      if (success) {
        // Remove from the list and reload
        setArchivedConversations(prev => prev.filter(conv => conv.uuid !== pendingConversationUuid));
        // Reload to update pagination
        await reloadConversations();
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsProcessing(false);
      setShowDeleteModal(false);
      setPendingConversationUuid(null);
    }
  }, [pendingConversationUuid, deleteConversation, reloadConversations]);

  const openUnarchiveModal = (conversationUuid: string) => {
    setPendingConversationUuid(conversationUuid);
    setShowUnarchiveModal(true);
  };

  const openDeleteModal = (conversationUuid: string) => {
    setPendingConversationUuid(conversationUuid);
    setShowDeleteModal(true);
  };

  // Handle conversation click - just open it (like in search)
  const handleConversationClick = async (conversation: Conversation) => {
    setIsSelectingConversation(true);
    
    try {
      // Select the conversation
      await selectConversation(conversation.uuid);
      
      // Call the callback if provided
      onSelectConversation?.(conversation.uuid);
      
      // Close the archive screen
      onClose?.();
      
      // Navigate to chat if not already there
      if (pathname !== "/chat") {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error selecting conversation:", error);
    } finally {
      setIsSelectingConversation(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[color:var(--tokens-color-surface-surface-primary)]">
      {/* Loader overlay */}
      {isSelectingConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div
              className="animate-spin rounded-full h-8 w-8 border-b-2"
              style={{
                borderColor: "var(--tokens-color-text-text-brand)",
              }}
            />
            <p
              className="font-text font-[number:var(--text-font-weight)] text-[14px]"
              style={{
                color: "var(--tokens-color-text-text-primary)",
              }}
            >
              {t("chat.loading")}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 px-4 lg:px-0 py-6">
        <div className="px-[24px] lg:px-[24px] pl-[64px]">
          <h1
            className="font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[24px] tracking-[var(--h02-heading02-letter-spacing)] leading-[var(--h02-heading02-line-height)] [font-style:var(--h02-heading02-font-style)] mb-6"
            style={{
              color: "var(--tokens-color-text-text-primary)",
            }}
          >
            Archive
          </h1>

          <div className="max-w-[548px] mx-auto">
            {/* Search Bar */}
            <div className="relative mb-4">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors ${
                  isDark
                    ? "bg-[color:var(--tokens-color-surface-surface-card-default)] border-[color:var(--tokens-color-border-border-subtle)]"
                    : "bg-[color:var(--tokens-color-surface-surface-secondary)] border-[color:var(--tokens-color-border-border-subtle)]"
                }`}
              >
                <Search02
                  className="w-5 h-5 flex-shrink-0"
                  color="var(--tokens-color-text-text-inactive-2)"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search archived chats..."
                  className="flex-1 bg-transparent border-none outline-none font-text font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] placeholder:text-[color:var(--tokens-color-text-text-inactive-2)]"
                  style={{
                    color: "var(--tokens-color-text-text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Conversations Count */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="font-text font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]"
                style={{
                  color: "var(--tokens-color-text-text-primary)",
                }}
              >
                {isLoading ? 'Loading...' : `${pagination.total} archived conversation${pagination.total !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List - Scrollable Container */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-0 pb-6">
        <div className="px-[24px] lg:px-[24px] pl-[64px]">
          <div className="max-w-[548px] mx-auto">
            {isLoading ? (
              <div
                className="flex items-center justify-center h-full text-center py-8"
                style={{
                  color: "var(--tokens-color-text-text-inactive-2)",
                }}
              >
                <div>
                  <p className="font-text font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)]">
                    {t("chat.loading")}
                  </p>
                </div>
              </div>
            ) : sortedConversations.length > 0 ? (
              <div className="space-y-0">
                {sortedConversations.map((conversation: Conversation, index: number) => {
                  const lastUpdated = conversation.updated_at || conversation.created_at;
                  const daysAgo = getDaysAgo(lastUpdated);
                  const daysAgoText = formatDaysAgo(daysAgo);

                  return (
                    <div key={conversation.uuid}>
                      {index > 0 && (
                        <div
                          className="h-px my-0"
                          style={{
                            backgroundColor: "var(--tokens-color-border-border-subtle)",
                          }}
                        />
                      )}
                      <div className="w-full">
                        <button
                          onClick={() => handleConversationClick(conversation)}
                          className={`w-full text-left py-4 px-1 transition-colors hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-lg ${
                            isDark ? "dark:hover:bg-white/10" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div
                              className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] flex-1"
                              style={{
                                color: "var(--tokens-color-text-text-primary)",
                              }}
                            >
                              {conversation.name}
                            </div>
                            <div
                              className="font-text font-[number:var(--text-small-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)] ml-4"
                              style={{
                                color: "var(--tokens-color-text-text-inactive-2)",
                              }}
                            >
                              {daysAgoText}
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center gap-2 mt-2 px-1" onClick={(e) => e.stopPropagation()}>
                          <ActionButton
                            type="button"
                            onClick={() => openUnarchiveModal(conversation.uuid)}
                            variant="ghost"
                            size="sm"
                            className="!px-3 !py-1.5 !text-xs hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)] !text-[color:var(--tokens-color-text-text-brand)]"
                            leftIcon={<Archive className="w-4 h-4" color="var(--tokens-color-text-text-brand)" />}
                          >
                            Unarchive
                          </ActionButton>
                          <ActionButton
                            type="button"
                            onClick={() => openDeleteModal(conversation.uuid)}
                            variant="ghost"
                            size="sm"
                            className="!px-3 !py-1.5 !text-xs hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)] !text-red-600"
                            leftIcon={<Trash className="w-4 h-4" color="#dc2626" />}
                          >
                            Delete
                          </ActionButton>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="flex items-center justify-center h-full text-center"
                style={{
                  color: "var(--tokens-color-text-text-inactive-2)",
                }}
              >
                <div>
                  <p className="font-text font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] mb-2">
                    {searchQuery
                      ? "No archived conversations found"
                      : "No archived conversations"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unarchive Confirmation Modal */}
      <ConfirmationModal
        isOpen={showUnarchiveModal}
        onClose={() => {
          if (!isProcessing) {
            setShowUnarchiveModal(false);
            setPendingConversationUuid(null);
          }
        }}
        onConfirm={handleUnarchive}
        title="Unarchive Conversation"
        message="Are you sure you want to unarchive this conversation? It will be restored to your conversation list."
        confirmText="Unarchive"
        cancelText="Cancel"
        confirmButtonVariant="primary"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          if (!isProcessing) {
            setShowDeleteModal(false);
            setPendingConversationUuid(null);
          }
        }}
        onConfirm={handleDelete}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonVariant="danger"
      />
    </div>
  );
};

