'use client'

import React from 'react'
import { LinkedFile } from '@/api/conversation/types'
import { FileTypeInfo } from '@/api/files/types'

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
  
  // Determine background color based on message type
  const backgroundColor = isUser 
    ? 'bg-[#6B4392]/10 border-[#6B4392]/20' 
    : 'bg-[color:var(--tokens-color-surface-surface-secondary)] border-[color:var(--tokens-color-border-border-subtle)]'

  return (
    <div className={`relative ${backgroundColor} border rounded-[var(--premitives-corner-radius-corner-radius-2)] p-3 w-[200px] h-[120px] flex flex-col shadow-sm hover:shadow-md transition-shadow flex-shrink-0`}>
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
