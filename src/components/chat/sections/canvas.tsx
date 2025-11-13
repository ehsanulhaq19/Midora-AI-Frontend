'use client'

import React, { useEffect, useRef } from 'react'
import { MarkdownRenderer } from '@/components/markdown'
import { Close, Copy } from '@/icons'
import { IconButton } from '@/components/ui/buttons'
import { Tooltip } from '@/components/ui/tooltip'
import { t } from '@/i18n'
import { markdownToTextSync } from '@/lib/markdown-utils'
import { cn } from '@/lib/utils'
import { appConfig } from '@/config/app'
import { baseApiClient } from '@/api/base'
import { ModelSelection } from './model-selection'

interface CanvasProps {
  isOpen: boolean
  content: string
  messageUuid?: string
  onClose: () => void
  onCopy?: () => void
  onLinkClick?: (event: React.MouseEvent<HTMLAnchorElement>, href?: string) => void
  className?: string
}

export const Canvas: React.FC<CanvasProps> = ({
  isOpen,
  content,
  messageUuid,
  onClose,
  onCopy,
  onLinkClick,
  className = ''
}) => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isCopied, setIsCopied] = React.useState(false)

  // Handle escape key to close canvas
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      // Focus on canvas when opened
      canvasRef.current?.focus()
    }

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Scroll to bottom when content changes
  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [content, isOpen])

  const handleCopy = async () => {
    if (isCopied) return

    try {
      const plainText = markdownToTextSync(content)
      await navigator.clipboard.writeText(plainText)

      setIsCopied(true)

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }

    if (onCopy) {
      onCopy()
    }
  }
  
  // Handle markdown link clicks for file downloads
  // Use provided handler or create one that handles file downloads
  const handleLinkClick = async (event: React.MouseEvent<HTMLAnchorElement>, href?: string) => {
    if (!href) {
      return
    }

    // If custom handler is provided, use it (it should handle file downloads)
    if (onLinkClick) {
      onLinkClick(event, href)
      return
    }

    // Fallback: Handle file downloads directly if no handler provided
    const backendUrl = appConfig.backendUrl.replace(/\/$/, '')

    if (href.startsWith(backendUrl) && href.includes('/api/v1/files/download')) {
      event.preventDefault()
      event.stopPropagation()

      try {
        const downloadUrl = new URL(href)
        const endpoint = `${downloadUrl.pathname}${downloadUrl.search}`
        const downloadResponse = await baseApiClient.downloadFile(endpoint)
        const blobUrl = window.URL.createObjectURL(downloadResponse.data)

        const pathSegments = downloadUrl.pathname.split('/')
        const fallbackFilename = decodeURIComponent(pathSegments[pathSegments.length - 1] || 'download')
        const filename = downloadResponse.filename || fallbackFilename || 'download'

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(blobUrl)
      } catch (error) {
        console.error('Failed to download file from canvas link:', error)
      }
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      ref={canvasRef}
      className={cn(
        'w-full bg-white border-l border-[color:var(--tokens-color-border-border-inactive)] flex flex-col transition-all duration-300 ease-in-out',
        className
      )}
      style={{ height: '100%' }}
      tabIndex={-1}
      role="region"
      aria-label={t('chat.canvasView')}
      aria-expanded={isOpen}
    >
      {/* Canvas Header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[color:var(--tokens-color-border-border-inactive)] bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1 hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors"
            aria-label={t('chat.closeCanvas')}
          >
            <Close className="w-5 h-5" />
          </button>
          {/* Model Selection in canvas header */}
          <ModelSelection />
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded transition-colors"
            onClick={handleCopy}
            disabled={isCopied}
            aria-label={isCopied ? t('chat.copied') : t('chat.copyMessage')}
          >
            {isCopied ? (
              <span className="text-green-500">✓ Copied</span>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button className="px-4 py-1.5 bg-[color:var(--tokens-color-surface-surface-brand)] text-white text-sm font-medium rounded hover:bg-opacity-90 transition-colors">
            Publish
          </button>
        </div>
      </div>

      {/* Canvas Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto p-6 bg-white"
        style={{
          scrollBehavior: 'smooth',
          minHeight: 0
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="app-text-primary">
            <MarkdownRenderer 
              content={content || ''} 
              onLinkClick={handleLinkClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

