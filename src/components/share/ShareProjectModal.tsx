"use client";

import React, { useEffect, useState } from "react";
import { Close, Reddit, Linkedin, TwitterXIcon } from "@/icons";
import { Link, Lock, Globe } from "lucide-react";

type ShareProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export const ShareProjectModal: React.FC<ShareProjectModalProps> = ({
  isOpen,
  onClose,
  title = "Share Project",
}) => {
  const [email, setEmail] = useState("");
  const [accessType, setAccessType] = useState("Only those invited");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
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
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--tokens-color-border-border-subtle)]">
          <h2 className="text-lg font-h02-heading02 text-[color:var(--tokens-color-text-text-primary)]">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
            aria-label="Close"
          >
            <Close className="w-5 h-5" color="var(--tokens-color-text-text-primary)" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <label className="block mb-2 text-sm font-medium text-[color:var(--tokens-color-text-text-primary)]">
            Email
          </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-[color:var(--tokens-color-border-border-subtle)] bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-brand)]"
            placeholder="Email, separated by commas"
          />

          <div className="mt-4">
            <p className="text-sm text-[color:var(--tokens-color-text-text-secondary)] font-medium">
              Who has access
            </p>
            <div className="flex items-center justify-between bg-[color:var(--tokens-color-surface-surface-secondary)] rounded-lg px-4 py-3 border border-[color:var(--tokens-color-border-border-subtle)] mt-2">
              <div className="flex items-center gap-3">
                {accessType === "Only those invited" ? (
                  <Lock className="w-5 h-5 text-[color:var(--tokens-color-text-text-primary)]" />
                ) : (
                  <Globe className="w-5 h-5 text-[color:var(--tokens-color-text-text-primary)]" />
                )}
                <div>
                  <div className="text-sm font-medium">{accessType}</div>
                </div>
              </div>
              <select
                value={accessType}
                onChange={(e) => setAccessType(e.target.value)}
                className="text-[color:var(--tokens-color-text-text-secondary)] bg-transparent focus:outline-none"
              >
                <option value="Only those invited">Only those invited</option>
                <option value="Anyone with a link">Anyone with a link</option>
              </select>
            </div>
          </div>

          <div className="mt-4 bg-[color:var(--tokens-color-surface-surface-secondary)] border border-[color:var(--tokens-color-border-border-subtle)] rounded-lg px-4 py-3 text-sm text-[color:var(--tokens-color-text-text-secondary)]">
            This project may include personal information.
            <div className="text-xs mt-1">
              All project contents are visible to collaborators. Personal memories are disabled for shared projects.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[color:var(--tokens-color-border-border-subtle)]">
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-full bg-[color:var(--tokens-color-surface-surface-secondary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]">
              <Linkedin className="w-5 h-5 text-[color:var(--tokens-color-text-text-primary)]" />
            </button>
            <button className="p-2 rounded-full bg-[color:var(--tokens-color-surface-surface-secondary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]">
              <Reddit className="w-5 h-5 text-[color:var(--tokens-color-text-text-primary)]" />
            </button>
            <button className="p-2 rounded-full bg-[color:var(--tokens-color-surface-surface-secondary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]">
              <TwitterXIcon className="w-5 h-5 text-[color:var(--tokens-color-text-text-primary)]" />
            </button>
            <button className="p-2 rounded-full bg-[color:var(--tokens-color-surface-surface-secondary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)]">
              <Link className="w-5 h-5 text-[color:var(--tokens-color-text-text-primary)]" />
            </button>
          </div>
          <button
            className="px-4 py-2 rounded-full font-medium text-sm transition-all bg-[color:var(--tokens-color-surface-surface-button)] text-white hover:opacity-90"
          >
            Copy link
          </button>
        </div>
      </div>
    </div>
  );
};
