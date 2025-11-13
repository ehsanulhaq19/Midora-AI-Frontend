'use client'

import React, { useState } from 'react'
import { LinkedFile } from '@/api/conversation/types'
import { FileTypeInfo } from '@/api/files/types'
import { Spinner } from '@/components/ui/loaders'
import { t } from '@/i18n'
import { appConfig } from '@/config/app'
import { baseApiClient } from '@/api/base'

interface LinkedFilesPreviewProps {
  linkedFiles: LinkedFile[]
  className?: string
  isUser?: boolean
}

// File type icons mapping (same as FilePreview component)
const getFileTypeInfo = (fileType: string, fileExtension: string): FileTypeInfo => {
  if (fileType.startsWith('image/')) {
    return {
      category: 'image',
      icon: '🖼️',
      color: 'text-blue-500'
    }
  }
  
  if (fileType.includes('pdf')) {
    return {
      category: 'document',
      icon: '📄',
      color: 'text-red-500'
    }
  }
  
  if (fileType.includes('word') || fileExtension === '.doc' || fileExtension === '.docx') {
    return {
      category: 'document',
      icon: '📝',
      color: 'text-blue-600'
    }
  }
  
  if (fileType.includes('excel') || fileExtension === '.xls' || fileExtension === '.xlsx') {
    return {
      category: 'document',
      icon: '📊',
      color: 'text-green-600'
    }
  }
  
  if (fileType.includes('powerpoint') || fileExtension === '.ppt' || fileExtension === '.pptx') {
    return {
      category: 'document',
      icon: '📈',
      color: 'text-orange-500'
    }
  }
  
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) {
    return {
      category: 'archive',
      icon: '📦',
      color: 'text-purple-500'
    }
  }
  
  if (fileType.includes('text') || fileExtension === '.txt') {
    return {
      category: 'document',
      icon: '📄',
      color: 'text-gray-500'
    }
  }
  
  return {
    category: 'other',
    icon: '📎',
    color: 'text-gray-500'
  }
}

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Individual Linked File Preview Component (without cross button)
const LinkedFilePreview: React.FC<{ linkedFile: LinkedFile; isUser: boolean }> = ({ linkedFile, isUser }) => {
  const fileTypeInfo = getFileTypeInfo(linkedFile.file_type, linkedFile.file_extension)
  const isImage = fileTypeInfo.category === 'image'
  const fileExtension = linkedFile.file_extension.replace('.', '').toUpperCase()
  const isUploading = linkedFile.uuid?.startsWith('temp-') || false
  const [isDownloading, setIsDownloading] = useState(false)
  
  // Determine background color based on message type
  const backgroundColor = isUser 
    ? 'bg-[#6B4392]/10 border-[#6B4392]/20' 
    : 'bg-[color:var(--tokens-color-surface-surface-secondary)] border-[color:var(--tokens-color-border-border-subtle)]'

  // Handle file download for AI responses (not user messages)
  const handleFileDownload = async (event: React.MouseEvent) => {
    // Only allow download for AI responses, not user messages
    if (isUser || isUploading || isDownloading) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    if (!linkedFile.uuid) {
      console.error('File UUID is missing')
      return
    }

    setIsDownloading(true)

    try {
      // Construct download endpoint
      const endpoint = `/api/v1/files/download/${linkedFile.uuid}`
      const downloadResponse = await baseApiClient.downloadFile(endpoint)
      const blobUrl = window.URL.createObjectURL(downloadResponse.data)

      // Get filename from response or use the linked file filename
      const filename = downloadResponse.filename || linkedFile.filename || 'download'

      // Create temporary link and trigger download
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Failed to download file:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  // Determine if file is clickable (only AI responses, not uploading)
  const isClickable = !isUser && !isUploading

  return (
    <div 
      className={`relative ${backgroundColor} border rounded-[var(--premitives-corner-radius-corner-radius-2)] p-3 w-[200px] h-[120px] flex flex-col shadow-sm transition-shadow flex-shrink-0 ${
        isClickable 
          ? 'hover:shadow-md cursor-pointer hover:border-[color:var(--tokens-color-border-border-active)]' 
          : ''
      }`}
      onClick={isClickable ? handleFileDownload : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `Download ${linkedFile.filename}` : undefined}
      onKeyDown={isClickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleFileDownload(e as any)
        }
      } : undefined}
    >
      {/* Uploading overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-[var(--premitives-corner-radius-corner-radius-2)] flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" color="white" />
            <span className="app-text-xs app-text-primary text-white">{t('common.fileUpload.uploading')}</span>
          </div>
        </div>
      )}

      {/* Downloading overlay */}
      {isDownloading && (
        <div className="absolute inset-0 bg-black/50 rounded-[var(--premitives-corner-radius-corner-radius-2)] flex items-center justify-center z-20">
          <div className="flex flex-col items-center gap-2">
            <Spinner size="md" color="white" />
            <span className="app-text-xs app-text-primary text-white">Downloading...</span>
          </div>
        </div>
      )}
      
      {/* File preview section - fixed height */}
      <div className="flex items-center justify-center h-16 mb-2">
        {isImage ? (
          <div className={`w-12 h-12 flex items-center justify-center text-2xl ${fileTypeInfo.color}`}>
            {fileTypeInfo.icon}
          </div>
        ) : (
          <div className={`w-12 h-12 flex items-center justify-center text-2xl ${fileTypeInfo.color}`}>
            {fileTypeInfo.icon}
          </div>
        )}
      </div>
      
      {/* File info section - fixed height and position */}
      <div className="flex flex-col justify-between h-12">
        {/* File name - fixed position */}
        <p className="app-text-sm app-text-primary truncate font-medium leading-tight h-5">
          {linkedFile.filename}
        </p>
        
        {/* File details row - fixed position at bottom */}
        <div className="flex items-center justify-between h-6">
          {/* File type badge */}
          <span className="px-2 py-1 bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-tertiary)] app-text-xs rounded-[var(--premitives-corner-radius-corner-radius-1)] font-medium border border-[color:var(--tokens-color-border-border-subtle)]">
            {fileExtension}
          </span>
          
          {/* File size */}
          <span className="app-text-xs app-text-secondary">
            {formatFileSize(linkedFile.file_size)}
          </span>
        </div>
      </div>
    </div>
  )
}

export const LinkedFilesPreview: React.FC<LinkedFilesPreviewProps> = ({ 
  linkedFiles, 
  className = '',
  isUser = false
}) => {
  if (!linkedFiles || linkedFiles.length === 0) {
    return null
  }

  return (
    <div className={`mt-3 ${className}`}>
      <div className={`flex gap-3 overflow-x-auto overflow-y-hidden pb-2 file-preview-scroll max-w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {linkedFiles.map((linkedFile) => (
          <LinkedFilePreview
            key={linkedFile.uuid}
            linkedFile={linkedFile}
            isUser={isUser}
          />
        ))}
      </div>
    </div>
  )
}
