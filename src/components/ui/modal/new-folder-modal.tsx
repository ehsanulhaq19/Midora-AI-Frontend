"use client";

import React, { useState, useEffect } from "react";
import { Close, Lightbulb, AudioSettings } from "@/icons";

interface CategoryButton {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placeholder?: string;
  infoText?: string;
  buttonText?: string;
  showText?: boolean;
  showInput?: boolean;
  showButton?: boolean;
  categories?: CategoryButton[];
  onConfirm?: (projectName: string, selectedCategory?: string) => void;
}

export const NewFolderModal: React.FC<NewFolderModalProps> = ({
  isOpen,
  onClose,
  title = "Project name",
  placeholder = "Copenhagen Trip",
  infoText = "Projects keep chats, files, and custom instructions in one place. Use them for ongoing work, or just to keep things tidy.",
  buttonText = "Create project",
  showText = true,
  showInput = true,
  showButton = true,
  categories = [],
  onConfirm,
}) => {
  const [projectName, setProjectName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();

  useEffect(() => {
    if (!isOpen) {
      setProjectName("");
      setSelectedCategory(undefined);
    }
  }, [isOpen]);

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

  const handleConfirm = () => {
    if (projectName.trim() && onConfirm) {
      onConfirm(projectName.trim(), selectedCategory);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && projectName.trim()) {
      handleConfirm();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  const isButtonDisabled = !projectName.trim();

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
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-lg font-h02-heading02 text-[color:var(--tokens-color-text-text-primary)]">
            {title}
          </h2>
          <div className="flex items-center gap-2">
            {/* <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
              aria-label="Settings"
            >
              <AudioSettings
                className="w-5 h-5"
                color="var(--tokens-color-text-text-primary)"
              />
            </button> */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
              aria-label="Close"
            >
              <Close
                className="w-5 h-5"
                color="var(--tokens-color-text-text-primary)"
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          {/* Input Field */}
          {showInput && (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">+</span>
                </div>
              </div>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-11 pr-4 py-2.5 bg-[color:var(--tokens-color-surface-surface-secondary)] border border-gray-200 dark:border-gray-700 rounded-md text-[color:var(--tokens-color-text-text-primary)] placeholder:text-[color:var(--tokens-color-text-text-inactive-2)] focus:outline-none focus:ring-2 focus:ring-[color:var(--tokens-color-text-text-brand)] focus:border-transparent transition-all"
                autoFocus
              />
            </div>
          )}

          {/* Category Buttons */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    const newValue =
                      selectedCategory === category.id
                        ? undefined
                        : category.id;
                    setSelectedCategory(newValue);
                    if (newValue) {
                      setProjectName(category.label);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    selectedCategory === category.id
                      ? "bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-brand)] border-gray-300 dark:border-gray-600"
                      : "bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] border-gray-200 dark:border-gray-700"
                  }`}
                >
                  {category.icon && (
                    <span className="w-4 h-4 flex items-center justify-center">
                      {category.icon}
                    </span>
                  )}
                  {category.label}
                </button>
              ))}
            </div>
          )}

          {/* Info Box */}
          {showText && infoText && (
            <div className="flex items-start gap-3 p-3 font-h02-heading02  bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-md">
              <Lightbulb
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                color="var(--tokens-color-text-text-seconary)"
              />
              <p className="text-sm tracking-[0] leading-[var(--text-line-height)] text-[color:var(--tokens-color-text-text-seconary)] ">
                {infoText}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {showButton && (
          <div className="flex items-center justify-end px-6 py-4">
            <button
              onClick={handleConfirm}
              disabled={isButtonDisabled}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                isButtonDisabled
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-[color:var(--tokens-color-surface-surface-button)] text-white  hover:opacity-90"
              }`}
            >
              {buttonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

