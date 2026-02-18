"use client";

import React, { useState, useRef, useEffect } from "react";
import { t } from "@/i18n";

interface ConversationActionMenuProps {
  onMoveToProject: () => void;
  className?: string;
}

export const ConversationActionMenu: React.FC<ConversationActionMenuProps> = ({
  onMoveToProject,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleMoveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onMoveToProject();
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="p-2 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
        title={t("chat.moveToProject")}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[color:var(--tokens-color-text-text-inactive-2)]"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 mt-0 w-48 rounded-md shadow-lg bg-[color:var(--tokens-color-surface-surface-primary)] border border-[color:var(--tokens-color-border-border-subtle)] z-50"
        >
          <button
            onClick={handleMoveClick}
            className="w-full text-left px-4 py-2 text-sm text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-secondary)] first:rounded-t-md last:rounded-b-md transition-colors"
          >
            {t("chat.moveToProject")}
          </button>
        </div>
      )}
    </div>
  );
};

