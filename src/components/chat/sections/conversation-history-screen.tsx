"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Search02 } from "@/icons";
import { useTheme } from "@/hooks/use-theme";
import { useConversation } from "@/hooks/use-conversation";
import { t, tWithParams } from "@/i18n";
import { Conversation } from "@/api/conversation/types";
import { useRouter, usePathname } from "next/navigation";
import { conversationApi } from "@/api/conversation/api";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ConversationHistoryScreenProps {
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

// Memoized message preview component to prevent unnecessary re-renders
const MessagePreview = React.memo<{
  message: { content: string; uuid?: string; relevance_score?: number };
  searchQuery: string;
  isDark: boolean;
}>(({ message, searchQuery, isDark }) => {
  const highlightedContent = useMemo(
    () => highlightSearchQuery(message.content, searchQuery, isDark, 200),
    [message.content, searchQuery, isDark]
  );

  return (
    <div
      className="p-3 rounded-lg border"
      style={{
        backgroundColor: isDark
          ? "var(--tokens-color-surface-surface-card-default)"
          : "var(--tokens-color-surface-surface-secondary)",
        borderColor: "var(--tokens-color-border-border-subtle)",
      }}
    >
      <div
        className="text-sm"
        style={{
          color: "var(--tokens-color-text-text-primary)",
        }}
      >
        {highlightedContent}
      </div>
    </div>
  );
});

MessagePreview.displayName = "MessagePreview";

// Truncate text to show highlighted word, truncating from both ends if needed
const truncateToShowQuery = (text: string, query: string, maxLength: number = 150): string => {
  if (!query.trim() || text.length <= maxLength) {
    return text;
  }
  
  const queryLower = query.trim().toLowerCase();
  const textLower = text.toLowerCase();
  
  // Find the first occurrence of the query
  const queryIndex = textLower.indexOf(queryLower);
  
  if (queryIndex === -1) {
    // Query not found, just truncate from end
    return text.substring(0, maxLength - 3) + "...";
  }
  
  // Calculate how much space we have for context around the query
  const queryLength = query.length;
  const availableSpace = maxLength - queryLength - 6; // Reserve space for ellipsis (3 + 3)
  const contextBefore = Math.floor(availableSpace / 2);
  const contextAfter = Math.ceil(availableSpace / 2);
  
  // Calculate start and end positions
  let start = Math.max(0, queryIndex - contextBefore);
  let end = Math.min(text.length, queryIndex + queryLength + contextAfter);
  
  // Adjust if we're near the beginning or end
  if (start === 0) {
    // At the beginning, use more space at the end
    end = Math.min(text.length, start + maxLength - 3);
  } else if (end === text.length) {
    // At the end, use more space at the beginning
    start = Math.max(0, end - maxLength + 3);
  }
  
  // Build the truncated text with ellipsis
  let truncated = "";
  if (start > 0) {
    truncated += "...";
  }
  truncated += text.substring(start, end);
  if (end < text.length) {
    truncated += "...";
  }
  
  return truncated;
};

// Highlight search query in text
const highlightSearchQuery = (text: string, query: string, isDark: boolean, maxLength?: number): React.ReactNode => {
  if (!query.trim()) {
    return text;
  }
  
  // Truncate text to show the query if needed
  const displayText = maxLength ? truncateToShowQuery(text, query, maxLength) : text;
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = displayText.split(regex);
  
  // Check if a part matches the query (case-insensitive)
  const queryLower = query.trim().toLowerCase();
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === queryLower) {
      return (
        <mark
          key={index}
          className="rounded px-1"
          style={{
            backgroundColor: isDark 
              ? "rgba(250, 204, 21, 0.3)" 
              : "rgba(250, 204, 21, 0.4)",
            color: "inherit",
          }}
        >
          {part}
        </mark>
      );
    }
    return part;
  });
};

export const ConversationHistoryScreen: React.FC<
  ConversationHistoryScreenProps
> = ({ onClose, onSelectConversation }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const { selectConversation } = useConversation();
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [doDeepSearch, setDoDeepSearch] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pagination, setPagination] = useState<{
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  }>({
    page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0,
  });
  const [isSelectingConversation, setIsSelectingConversation] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Get conversations from Redux to check if they exist
  const reduxConversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );

  // Debounce search query to avoid too many API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const previousSearchQueryRef = useRef<string | undefined>(undefined);
  const isInitialMountRef = useRef<boolean>(true);
  const lastDeepSearchRef = useRef<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms debounce delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load conversations from API (not from Redux)
  const loadConversations = useCallback(async (page: number = 1, append: boolean = false, messageSearch?: string, doDeep?: boolean) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const response = await conversationApi.getConversations(page, 20, "-created_at", messageSearch, doDeep);
      if (response.error) {
        console.error("Failed to load conversations:", response.error);
        return;
      }
      
      if (response.data) {
        if (append) {
          setConversations((prev: Conversation[]) => [...prev, ...response.data!.conversations]);
        } else {
          setConversations(response.data.conversations);
        }
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Load conversations when debounced search query changes
  useEffect(() => {
    const currentQuery = debouncedSearchQuery.trim() || undefined;
    
    // Initial load on mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      previousSearchQueryRef.current = currentQuery;
      lastDeepSearchRef.current = doDeepSearch;
      loadConversations(1, false, currentQuery, doDeepSearch);
      return;
    }
    
    // Reload when query changed or deep search toggled
    const deepChanged = lastDeepSearchRef.current !== doDeepSearch;
    if (previousSearchQueryRef.current !== currentQuery || deepChanged) {
      previousSearchQueryRef.current = currentQuery;
      lastDeepSearchRef.current = doDeepSearch;
      loadConversations(1, false, currentQuery, doDeepSearch);
    }
  }, [debouncedSearchQuery, doDeepSearch, loadConversations]);

  // Handle scroll to load more
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>): void => {
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Check if we're near the bottom (within 100px)
      const threshold = 100;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (
        isNearBottom &&
        !isLoadingMore &&
        !isLoading &&
        pagination.page < pagination.total_pages
      ) {
        loadConversations(pagination.page + 1, true, debouncedSearchQuery.trim() || undefined, doDeepSearch);
      }
    },
    [isLoadingMore, isLoading, pagination, loadConversations, debouncedSearchQuery]
  );

  // When using message_search, conversations are already filtered by the API
  // No need for client-side filtering when message_search is active
  const filteredConversations = useMemo(() => {
    // If message_search is active (debouncedSearchQuery is set), return conversations as-is
    // The API has already filtered them based on message content
    if (debouncedSearchQuery.trim()) {
      return conversations;
    }
    // Otherwise, filter by conversation name (client-side filtering for name search)
    // Use debouncedSearchQuery for consistency and to avoid filtering on every keystroke
    if (!debouncedSearchQuery.trim()) {
      return conversations;
    }
    const query = debouncedSearchQuery.toLowerCase();
    return conversations.filter((conv: Conversation) =>
      conv.name.toLowerCase().includes(query)
    );
  }, [conversations, debouncedSearchQuery]);

  // Sort conversations by most recent first
  const sortedConversations = useMemo(() => {
    return [...filteredConversations].sort(
      (a, b) =>
        new Date(b.updated_at || b.created_at).getTime() -
        new Date(a.updated_at || a.created_at).getTime()
    );
  }, [filteredConversations]);

  const handleConversationClick = async (conversation: Conversation) => {
    setIsSelectingConversation(true);
    
    try {
      // Check if conversation exists in Redux store
      const existsInRedux = reduxConversations[conversation.uuid];
      
      if (!existsInRedux) {
        // Conversation doesn't exist in Redux, fetch it using the hook
        // The selectConversation function will handle fetching if needed
        await selectConversation(conversation.uuid);
      } else {
        // Conversation exists, just select it
        await selectConversation(conversation.uuid);
      }
      
      onSelectConversation?.(conversation.uuid);
      onClose?.();
      if (pathname !== "/chat") {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Error selecting conversation:", error);
    } finally {
      setIsSelectingConversation(false);
    }
  };

  const brandName = t("chat.brandName");

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
            {t("chat.history.title")}
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
                {isLoading && searchQuery.trim() ? (
                  <div
                    className="w-5 h-5 flex-shrink-0 animate-spin rounded-full border-b-2"
                    style={{
                      borderColor: "var(--tokens-color-text-text-inactive-2)",
                    }}
                  />
                ) : (
                  <Search02
                    className="w-5 h-5 flex-shrink-0"
                    color="var(--tokens-color-text-text-inactive-2)"
                  />
                )}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("chat.history.searchPlaceholder")}
                  className="flex-1 bg-transparent border-none outline-none font-text font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] placeholder:text-[color:var(--tokens-color-text-text-inactive-2)]"
                  style={{
                    color: "var(--tokens-color-text-text-primary)",
                  }}
                />
              </div>
              {/* Deep search switch */}
              <div className="flex items-center gap-3 mt-2 px-1 justify-end">
                <button
                  type="button"
                  aria-pressed={doDeepSearch}
                  onClick={() => {
                    const checked = !doDeepSearch
                    setDoDeepSearch(checked)
                    const currentQuery = debouncedSearchQuery.trim() || undefined
                    loadConversations(1, false, currentQuery, checked)
                  }}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none ${
                    doDeepSearch ? "app-bg-button-active" : "app-bg-button-inactive"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 transform app-bg-primary rounded-full transition-transform ${
                      doDeepSearch ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="app-text-sm app-text-secondary">
                  {t("chat.history.deepSearch") || "Deep search"}
                </span>
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
                {tWithParams("chat.history.conversationsCount", {
                  count: pagination?.total?.toString() || "0",
                  brandName,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversations List - Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 lg:px-0 pb-6"
      >
        <div className="px-[24px] lg:px-[24px] pl-[64px]">
          <div className="max-w-[548px] mx-auto">
            {isLoading && searchQuery.trim() ? (
              <div
                className="flex items-center justify-center py-12"
                style={{
                  color: "var(--tokens-color-text-text-inactive-2)",
                }}
              >
                <div className="flex flex-col items-center gap-4">
                  <div
                    className="animate-spin rounded-full h-8 w-8 border-b-2"
                    style={{
                      borderColor: "var(--tokens-color-text-text-brand)",
                    }}
                  />
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
                  const hasRelatedMessages = debouncedSearchQuery.trim() && conversation.related_messages && conversation.related_messages.length > 0;

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
                          <div
                            className="font-h02-heading02 font-[number:var(--text-font-weight)] text-[14px] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] mb-1"
                            style={{
                              color: "var(--tokens-color-text-text-primary)",
                            }}
                          >
                            <div className="flex items-center justify-between">
                              {conversation.name}
                              {conversation.project && (
                                <div className="font-text text-xs mb-1" style={{ color: "var(--tokens-color-text-text-inactive-2)" }}>
                                  {conversation.project.name}
                                </div>
                              )}
                            </div>
                          </div>
                          <div
                            className="font-text font-[number:var(--text-small-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)] text-end"
                            style={{
                              color: "var(--tokens-color-text-text-inactive-2)",
                            }}
                          >
                            {daysAgoText}
                          </div>
                        </button>
                        
                        {/* Related Messages Section */}
                        {hasRelatedMessages && (
                          <div className="px-0 pb-4">
                            <div
                              className="text-xs font-medium mb-2"
                              style={{
                                color: "var(--tokens-color-text-text-inactive-2)",
                              }}
                            >
                              {t("chat.history.relatedMessages") || "Related Messages"} ({conversation.related_messages!.length})
                            </div>
                            <div className="space-y-2">
                              {conversation.related_messages!.slice(0, 3).map((message, msgIndex) => (
                                <MessagePreview
                                  key={message.uuid || msgIndex}
                                  message={message}
                                  searchQuery={debouncedSearchQuery}
                                  isDark={isDark}
                                />
                              ))}
                            </div>
                          </div>
                        )}
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
                      ? t("chat.history.noResults")
                      : t("chat.history.noConversations")}
                  </p>
                </div>
              </div>
            )}

            {/* Loading indicator for more conversations */}
            {isLoadingMore && (
              <div
                className="w-full p-3 text-center"
                style={{
                  color: "var(--tokens-color-text-text-inactive-2)",
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <div
                    className="animate-spin rounded-full h-4 w-4 border-b-2"
                    style={{
                      borderColor: "var(--tokens-color-text-text-inactive-2)",
                    }}
                  />
                  <span className="text-[14px]">
                    {t("chat.loadingMoreConversations")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
