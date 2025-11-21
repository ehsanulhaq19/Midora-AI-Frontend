"use client";

import React, { useState, useRef, useEffect } from "react";
import { MoreOptions, Share, Pencil, Archive, Trash } from "@/icons";

interface ConversationMenuProps {
  onShare?: () => void;
  onRemoveFromFolder?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const ConversationMenu: React.FC<ConversationMenuProps> = ({
  onShare,
  onRemoveFromFolder,
  onArchive,
  onDelete,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center justify-center hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors p-1"
        aria-label="More options"
      >
        <MoreOptions className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 z-50 bg-white rounded-lg border border-[color:var(--premitives-color-light-purple-200)] shadow-lg min-w-[180px]">
          <div className="py-1">
            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onShare);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors text-[color:var(--premitives-color-brand-purple-1000)]"
              >
                <Share className="w-4 h-4" color="var(--premitives-color-brand-purple-1000)" />
                <span className="font-h02-heading02 text-[14px] font-[number:var(--text-small-font-weight)]">
                  Share
                </span>
              </button>
            )}

            {onRemoveFromFolder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onRemoveFromFolder);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors text-[color:var(--premitives-color-brand-purple-1000)]"
              >
                <Pencil className="w-4 h-4" color="var(--premitives-color-brand-purple-1000)" />
                <span className="font-h02-heading02 text-[14px] font-[number:var(--text-small-font-weight)]">
                  Remove
                </span>
              </button>
            )}

            {onArchive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onArchive);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors text-[color:var(--premitives-color-brand-purple-1000)]"
              >
                <Archive className="w-4 h-4" color="var(--premitives-color-brand-purple-1000)" />
                <span className="font-h02-heading02 text-[14px] font-[number:var(--text-small-font-weight)]">
                  Archive
                </span>
              </button>
            )}

            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onDelete);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors text-[color:var(--premitives-color-brand-purple-1000)]"
              >
                <Trash className="w-4 h-4" color="var(--premitives-color-brand-purple-1000)" />
                <span className="font-h02-heading02 text-[14px] font-[number:var(--text-small-font-weight)]">
                  Delete
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

