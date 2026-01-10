"use client";

import React, { useState } from "react";
import { MoreOptions, Share, Pencil, Archive, Trash } from "@/icons";
import { ActionButton } from "../../ui/buttons/action-button";

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
      <ActionButton
        type="button"
        variant="ghost"
        size="sm"
        className="!p-1 !min-w-0 !h-auto !rounded transition-colors !text-[color:var(--tokens-color-text-text-brand)]"
        aria-label="More options"
        leftIcon={<MoreOptions className="w-4 h-4" color="var(--tokens-color-text-text-brand)" />}
      >
        <span className="sr-only">More options</span>
      </ActionButton>

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
              <div onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  type="button"
                  onClick={() => handleAction(onShare)}
                  variant="ghost"
                  size="sm"
                  className="!w-full !justify-start !gap-3 !px-4 !py-2 !text-left hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)] !text-[color:var(--tokens-color-text-text-brand)]"
                  leftIcon={<Share className="w-4 h-4" color="var(--tokens-color-text-text-brand)" />}
                  fullWidth
                >
                  <span className="font-h02-heading02 text-[14px] font-[number:var(--text-small-font-weight)]">
                    Share
                  </span>
                </ActionButton>
              </div>
            )}

            {/* {onRemoveFromFolder && (
              <div onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  type="button"
                  onClick={() => handleAction(onRemoveFromFolder)}
                  variant="ghost"
                  size="sm"
                  className="!w-full !justify-start !gap-3 !px-4 !py-2 !text-left hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)] !text-[color:var(--tokens-color-text-text-brand)]"
                  leftIcon={<Pencil className="w-4 h-4" color="var(--tokens-color-text-text-brand)" />}
                  fullWidth
                >
                  <span className="font-h02-heading02 text-[14px] font-[number:var(--text-small-font-weight)]">
                    Remove
                  </span>
                </ActionButton>
              </div>
            )} */}

            {onArchive && (
              <div onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  type="button"
                  onClick={() => handleAction(onArchive)}
                  variant="ghost"
                  size="sm"
                  className="!w-full !justify-start !gap-3 !px-4 !py-2 !text-left hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)] !text-[color:var(--tokens-color-text-text-brand)]"
                  leftIcon={<Archive className="w-4 h-4" color="var(--tokens-color-text-text-brand)" />}
                  fullWidth
                >
                  <span className="font-h02-heading02 text-[14px] font-[number:var(--text-small-font-weight)]">
                    Archive
                  </span>
                </ActionButton>
              </div>
            )}

            {onDelete && (
              <div onClick={(e) => e.stopPropagation()}>
                <ActionButton
                  type="button"
                  onClick={() => handleAction(onDelete)}
                  variant="ghost"
                  size="sm"
                  className="!w-full !justify-start !gap-3 !px-4 !py-2 !text-left hover:!bg-[color:var(--tokens-color-surface-surface-tertiary)] !text-[color:var(--tokens-color-text-text-brand)]"
                  leftIcon={<Trash className="w-4 h-4" color="var(--tokens-color-text-text-brand)" />}
                  fullWidth
                >
                  <span className="font-h02-heading02 text-[14px] font-[number:var(--text-small-font-weight)]">
                    Delete
                  </span>
                </ActionButton>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

