"use client";

import React, { useEffect, useRef } from "react";
import { MarkdownRenderer } from "@/components/markdown";
import { Close, Copy } from "@/icons";
import { IconButton } from "@/components/ui/buttons";
import { Tooltip } from "@/components/ui/tooltip";
import { DownloadDropdown } from "@/components/ui/download-dropdown";
import { t } from "@/i18n";
import { markdownToTextSync, markdownToHtmlSync } from "@/lib/markdown-utils";

import { 
  downloadAsPDF, 
  downloadAsExcel, 
  downloadAsWord, 
  downloadAsText 
} from "@/lib/download-utils";
import { cn } from "@/lib/utils";
import { appConfig } from "@/config/app";
import { baseApiClient } from "@/api/base";
import { useTheme } from "@/hooks/use-theme";

interface CanvasProps {
  isOpen: boolean;
  content: string;
  messageUuid?: string;
  onClose: () => void;
  onCopy?: () => void;
  onLinkClick?: (
    event: React.MouseEvent<HTMLAnchorElement>,
    href?: string
  ) => void;
  className?: string;
}

export const Canvas: React.FC<CanvasProps> = ({
  isOpen,
  content,
  messageUuid,
  onClose,
  onCopy,
  onLinkClick,
  className = "",
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  // Handle escape key to close canvas
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      // Focus on canvas when opened
      canvasRef.current?.focus();
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Scroll to bottom when content changes
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content, isOpen]);

  const handleCopy = async () => {
    if (isCopied) return;

    try {
      const htmlContent = markdownToHtmlSync(content);
      const plainText = markdownToTextSync(content);

      // plainText = content.replace(/\n{2,}/g, '\n\n');
      
      // Create clipboard items with both HTML and plain text formats
      const clipboardItems = [
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' })
        })
      ];
      
      await navigator.clipboard.write(clipboardItems);

      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      // Fallback to plain text if HTML copy fails
      try {
        const plainText = markdownToTextSync(content);
        await navigator.clipboard.writeText(plainText);
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (fallbackErr) {
        console.error("Failed to copy text: ", fallbackErr);
      }
    }

    if (onCopy) {
      onCopy();
    }
  };

  const handleDownload = (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const baseFilename = `midora-export-${timestamp}`;

    try {
      switch (format) {
        case 'pdf':
          downloadAsPDF(content, baseFilename);
          break;
        case 'excel':
          downloadAsExcel(content, baseFilename);
          break;
        case 'word':
          downloadAsWord(content, baseFilename);
          break;
        case 'text':
          downloadAsText(content, baseFilename);
          break;
        default:
          console.warn(`Unknown download format: ${format}`);
      }
    } catch (error) {
      console.error(`Error downloading as ${format}:`, error);
    }
  };

  // Handle markdown link clicks for file downloads
  // Use provided handler or create one that handles file downloads
  const handleLinkClick = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    href?: string
  ) => {
    if (!href) {
      return;
    }

    // If custom handler is provided, use it (it should handle file downloads)
    if (onLinkClick) {
      onLinkClick(event, href);
      return;
    }

    // Fallback: Handle file downloads directly if no handler provided
    const backendUrl = appConfig.backendUrl.replace(/\/$/, "");

    if (
      href.startsWith(backendUrl) &&
      href.includes("/api/v1/files/download")
    ) {
      event.preventDefault();
      event.stopPropagation();

      try {
        const downloadUrl = new URL(href);
        const endpoint = `${downloadUrl.pathname}${downloadUrl.search}`;
        const downloadResponse = await baseApiClient.downloadFile(endpoint);
        const blobUrl = window.URL.createObjectURL(downloadResponse.data);

        const pathSegments = downloadUrl.pathname.split("/");
        const fallbackFilename = decodeURIComponent(
          pathSegments[pathSegments.length - 1] || "download"
        );
        const filename =
          downloadResponse.filename || fallbackFilename || "download";

        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error("Failed to download file from canvas link:", error);
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      ref={canvasRef}
      className={cn(
        "w-full bg-white border-l border-[color:var(--tokens-color-border-border-inactive)] flex flex-col transition-all duration-300 ease-in-out",
        className
      )}
      style={{ 
        height: "100%"
      }}
      tabIndex={-1}
      role="region"
      aria-label={t("chat.canvasView")}
      aria-expanded={isOpen}
    >
      {/* Canvas Header */}
      <div 
        className="h-14 flex items-center justify-between px-6 border-b border-[color:var(--tokens-color-border-border-inactive)] bg-white flex-shrink-0"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors"
            aria-label={t("chat.closeCanvas")}
          >
            <Close className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[color:var(--tokens-color-text-text-primary)] bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-full transition-colors"
            onClick={handleCopy}
            disabled={isCopied}
            aria-label={isCopied ? t("chat.copied") : t("chat.copyMessage")}
          >
            {isCopied ? (
              <span className="font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--h01-heading-01-line-height)] whitespace-nowrap [font-style:var(--h02-heading02-font-style)] text-green-500">
                ✓ Copied
              </span>
            ) : (
              <>
                <span className="font-h02-heading02 font-[number:var(--h02-heading02-font-weight)] text-[14px] tracking-[var(--text-small-letter-spacing)] leading-[var(--h01-heading-01-line-height)] whitespace-nowrap [font-style:var(--h02-heading02-font-style)] text-[color:var(--tokens-color-text-text-brand)]">
                  Copy
                </span>
                <Copy className="w-4 h-4" />
              </>
            )}
          </button>
          <DownloadDropdown onDownload={handleDownload} />
          <button className="px-4 py-1.5 bg-[color:var(--tokens-color-surface-surface-button-pressed)] text-white text-sm font-medium rounded-full hover:bg-opacity-90 transition-colors">
            Publish
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto p-6 border-x-gray0-white"
        style={{
          scrollBehavior: "smooth",
          minHeight: 0,
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="app-text-primary">
            <MarkdownRenderer
              content={content || ""}
              onLinkClick={handleLinkClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};