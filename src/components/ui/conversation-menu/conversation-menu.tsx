"use client";

import React, { useState } from "react";
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

  const handleAction = (callback?: () => void) => {
    if (callback) {
      callback();
    }
    setIsOpen(false);
  };

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        className="flex items-center justify-center rounded transition-colors p-1"
        aria-label="More options"
        style={{ color: 'var(--tokens-color-text-text-brand)' }}
      >
        <MoreOptions className="w-4 h-4" color="currentColor" />
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-[-30px]  z-[99999999] rounded-lg border shadow-lg min-w-[170px]"
          style={{
            backgroundColor: 'var(--tokens-color-surface-surface-primary)',
            borderColor: 'var(--tokens-color-border-border-subtle)'
          }}
        >
          <div className="py-1">
            {onShare && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(onShare);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
                style={{ color: 'var(--tokens-color-text-text-brand)' }}
              >
                <Share className="w-4 h-4" color="currentColor" />
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
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
                style={{ color: 'var(--tokens-color-text-text-brand)' }}
              >
                <Pencil className="w-4 h-4" color="currentColor" />
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
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
                style={{ color: 'var(--tokens-color-text-text-brand)' }}
              >
                <Archive className="w-4 h-4" color="currentColor" />
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
                className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
                style={{ color: 'var(--tokens-color-text-text-brand)' }}
              >
                <Trash className="w-4 h-4" color="currentColor" />
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

