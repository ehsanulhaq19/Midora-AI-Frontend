"use client";

import React, { useState } from "react";
import { NavigationSidebar } from "@/components/chat/sections/navigation-sidebar";
import { PricingContent } from "./pricing-content";

export const PricingScreen: React.FC = () => {
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[color:var(--tokens-color-surface-surface-primary)]">
      <NavigationSidebar
        isOpen={true}
        onClose={() => {}}
        onNewChat={() => {
          setIsCanvasOpen(false);
        }}
        showFullSidebar={!isCanvasOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-0 min-w-0">
        <PricingContent />
      </div>
    </div>
  );
};
