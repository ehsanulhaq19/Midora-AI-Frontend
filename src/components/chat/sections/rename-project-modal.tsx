"use client";

import React, { useState, useEffect } from "react";
import { Close } from "@/icons";

interface RenameProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newName: string) => void;
  currentName: string;
  isProcessing?: boolean;
}

export const RenameProjectModal: React.FC<RenameProjectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentName,
  isProcessing = false,
}) => {
  const [projectName, setProjectName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setProjectName(currentName);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, currentName]);

  const handleConfirm = () => {
    if (projectName.trim() && projectName.trim() !== currentName) {
      onConfirm(projectName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isProcessing) {
      handleConfirm();
    } else if (e.key === "Escape" && !isProcessing) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isProcessing) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-[color:var(--tokens-color-surface-surface-primary)] rounded-lg shadow-xl w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--tokens-color-border-border-subtle)]">
          <h2 className="text-lg font-h02-heading02 text-[color:var(--tokens-color-text-text-primary)]">
            Rename project
          </h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <Close
              className="w-5 h-5"
              color="var(--tokens-color-text-text-primary)"
            />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <label className="block mb-2 text-sm font-medium text-[color:var(--tokens-color-text-text-primary)]">
            Project name
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="w-full px-4 py-2 rounded-lg border border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-brand)] disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter project name"
            autoFocus
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[color:var(--tokens-color-border-border-subtle)]">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-full font-medium text-sm transition-all bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing || !projectName.trim() || projectName.trim() === currentName}
            className="px-4 py-2 rounded-full font-medium text-sm transition-all bg-[color:var(--tokens-color-surface-surface-button)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Renaming..." : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
};

