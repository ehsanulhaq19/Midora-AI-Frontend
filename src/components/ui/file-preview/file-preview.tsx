'use client'

import React from 'react'
import { Close } from '@/icons'
import { FilePreview as FilePreviewType, FileTypeInfo } from '@/api/files/types'

interface FilePreviewProps {
  file: FilePreviewType
  onRemove: (uuid: string) => void
  className?: string
}

// File type icons mapping
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

export const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove, className = '' }) => {
  const fileTypeInfo = getFileTypeInfo(file.file_type, file.file_extension)
  const isImage = fileTypeInfo.category === 'image'
  
  // Get file extension without dot
  const fileExtension = file.file_extension.replace('.', '').toUpperCase()
  
  return (
    <div className={`relative bg-[color:var(--tokens-color-surface-surface-secondary)] border border-[color:var(--tokens-color-border-border-subtle)] rounded-[var(--premitives-corner-radius-corner-radius-2)] p-3 w-[200px] h-[120px] flex flex-col shadow-sm hover:shadow-md transition-shadow flex-shrink-0 ${className}`}>
      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(file.uuid)}
        aria-label="Remove file"
        className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full transition-colors z-10"
      >
        <Close className="w-3 h-3 text-red-500 hover:text-red-700" />
      </button>
      
      {/* File preview section - fixed height */}
      <div className="flex items-center justify-center h-16 mb-2">
        {isImage && file.preview ? (
          <img
            src={file.preview}
            alt={file.filename}
            className="w-16 h-16 object-cover rounded-[var(--premitives-corner-radius-corner-radius-1)]"
          />
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
          {file.filename}
        </p>
        
        {/* File details row - fixed position at bottom */}
        <div className="flex items-center justify-between h-6">
          {/* File type badge */}
          <span className="px-2 py-1 bg-[color:var(--tokens-color-surface-surface-tertiary)] text-[color:var(--tokens-color-text-text-tertiary)] app-text-xs rounded-[var(--premitives-corner-radius-corner-radius-1)] font-medium border border-[color:var(--tokens-color-border-border-subtle)]">
            {fileExtension}
          </span>
          
          {/* File size */}
          <span className="app-text-xs app-text-secondary">
            {formatFileSize(file.file_size)}
          </span>
        </div>
      </div>
    </div>
  )
}
