/**
 * File API types
 * Type definitions for all file-related API requests and responses
 */

// File upload types
export interface FileUploadResponse {
  file: {
    uuid: string
    encoded_uuid: string
    filename: string
    file_extension: string
    file_type: string
    file_size: number
    file_path: string
    storage_type: string
    user_id: number
    created_at: string
    updated_at: string | null
  }
  storage_info: {
    stored_filename: string
    bucket: string | null
    size: number
  }
}

export interface FileUploadRequest {
  file: File
}

// File preview types
export interface FilePreview {
  uuid: string
  filename: string
  file_extension: string
  file_type: string
  file_size: number
  preview?: string // For images, this will be the data URL
}

// File validation types
export interface FileValidationResult {
  isValid: boolean
  error?: string
}

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv'
  ],
  ARCHIVES: [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed'
  ]
}

// Maximum file size (10MB)
export const MAX_FILE_SIZE = 10 * 1024 * 1024

// File type categories
export type FileTypeCategory = 'image' | 'document' | 'archive' | 'other'

export interface FileTypeInfo {
  category: FileTypeCategory
  icon: string
  color: string
}
