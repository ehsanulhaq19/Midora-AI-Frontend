"use client";

import React, { useState, useEffect, useRef } from "react";
import { NavigationSidebar } from "@/components/chat/sections/navigation-sidebar";
import { PricingContent } from "./pricing-content";
import { AccountScreen } from "../account/account-screen";
import { useConversation } from "@/hooks/use-conversation";
import { useAIModels, useProjects } from "@/hooks";

export const PricingScreen: React.FC = () => {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const hasInitialized = useRef(false);
  
  const { loadConversations } = useConversation();
  const { fetchServiceProviders } = useAIModels();
  const { loadProjects } = useProjects();

  useEffect(() => {
    // Load initial data only once on mount (same as ChatScreen)
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadConversations();
      fetchServiceProviders();
      loadProjects(1, 10); // Load first page of projects
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex bg-[color:var(--tokens-color-surface-surface-primary)]">
      <NavigationSidebar
        isOpen={true}
        onClose={() => {}}
        onNewChat={() => {
          setIsCanvasOpen(false);
          setIsAccountOpen(false);
        }}
        showFullSidebar={!isCanvasOpen}
        onAccountClick={() => setIsAccountOpen(true)}
        onNavigate={() => setIsAccountOpen(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-0 min-w-0">
        {isAccountOpen ? (
          <div className="w-full h-full relative z-0">
            <AccountScreen onClose={() => setIsAccountOpen(false)} />
          </div>
        ) : (
          <PricingContent />
        )}
      </div>
    </div>
  );
};
