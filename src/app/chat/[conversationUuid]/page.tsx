 "use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ChatScreen } from "@/components/chat/chat-screen";
import { GuestChatScreen } from "@/components/chat/guest-chat-screen";
import { PublicChatScreen } from "@/components/chat/public-chat-screen";
import { useAuthRedux } from "@/hooks/use-auth-redux";
import { Spinner } from "@/components/ui/loaders";
import { conversationApi } from "@/api/conversation/api";

export default function SharedChatPage() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const [convUuid, setConvUuid] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuthRedux();
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);

  useEffect(() => {
    if (!pathname) return;
    const parts = pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    setConvUuid(last || null);
  }, [pathname]);

  // Check membership for authenticated users
  useEffect(() => {
    let mounted = true;

    const checkMembership = async () => {
      if (!convUuid || !isAuthenticated) {
        setIsMember(null);
        setIsCheckingMembership(false);
        return;
      }

      try {
        setIsCheckingMembership(true);
        const membershipResponse = await conversationApi.checkConversationMembership(convUuid);

        if (mounted) {
          if (!membershipResponse.error && membershipResponse.data?.is_member) {
            setIsMember(true);
          } else {
            setIsMember(false);
          }
          setIsCheckingMembership(false);
        }
      } catch (err) {
        if (mounted) {
          setIsMember(false);
          setIsCheckingMembership(false);
        }
      }
    };

    checkMembership();
    return () => { mounted = false; };
  }, [convUuid, isAuthenticated]);

  if (authLoading || isCheckingMembership) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--tokens-color-surface-surface-primary)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!convUuid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--tokens-color-surface-surface-primary)]">
        <p className="text-[color:var(--tokens-color-text-text-primary)]">Invalid conversation link</p>
      </div>
    );
  }

  // Route unauthenticated users to public chat screen
  if (!isAuthenticated) {
    return <PublicChatScreen conversationUuid={convUuid} />;
  }

  // Route authenticated non-members to guest chat screen
  if (isAuthenticated && isMember === false) {
    return <GuestChatScreen conversationUuid={convUuid} />;
  }

  // Route authenticated members to chat screen
  if (isAuthenticated && isMember === true) {
    return <ChatScreen initialConversationUuid={convUuid} />;
  }

  // Default fallback
  return <PublicChatScreen conversationUuid={convUuid} />;
}


