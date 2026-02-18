'use client'

import { useState, useCallback } from 'react'
import { fileApi } from '@/api/files/api'
import { FilePreview as FilePreviewType, SUPPORTED_FILE_TYPES, MAX_FILE_SIZE, FileTypeCategory } from '@/api/files/types'
import { t, tWithParams } from '@/i18n'

interface UseFileUploadReturn {
  files: FilePreviewType[]
  isUploading: boolean
  uploadFile: (file: File) => Promise<void>
  removeFile: (uuid: string) => void
  clearFiles: () => void
  validateFile: (file: File) => { isValid: boolean; error?: string }
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [files, setFiles] = useState<FilePreviewType[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const validateFile = useCallback((file: File): { isValid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: tWithParams('common.fileUpload.fileTooLarge', { maxSize: '10MB' })
      }
    }

    // Check if video file (not allowed)
    if (file.type.startsWith('video/')) {
      return {
        isValid: false,
        error: t('common.fileUpload.videoNotAllowed')
      }
    }

    // Check supported file types
    const allSupportedTypes = [
      ...SUPPORTED_FILE_TYPES.IMAGES,
      ...SUPPORTED_FILE_TYPES.DOCUMENTS,
      ...SUPPORTED_FILE_TYPES.ARCHIVES
    ]

    if (!allSupportedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: t('common.fileUpload.unsupportedFileType')
      }
    }

    return { isValid: true }
  }, [t, tWithParams])

  const createFilePreview = useCallback(async (file: File): Promise<FilePreviewType> => {
    const preview: FilePreviewType = {
      uuid: '', // Will be set after upload
      filename: file.name,
      file_extension: '.' + file.name.split('.').pop()?.toLowerCase() || '',
      file_type: file.type,
      file_size: file.size
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      try {
        const reader = new FileReader()
        preview.preview = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      } catch (error) {
        console.warn('Failed to create image preview:', error)
      }
    }

    return preview
  }, [])

  const uploadFile = useCallback(async (file: File): Promise<void> => {
    const validation = validateFile(file)
    if (!validation.isValid) {
      throw new Error(validation.error)
    }

    setIsUploading(true)
    try {
      // Create temporary preview
      const tempPreview = await createFilePreview(file)
      tempPreview.uuid = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Add temporary file to list
      setFiles(prev => [...prev, tempPreview])

      // Upload file to backend
      const response = await fileApi.uploadFile({ file })
      
      if (response.error || !response.data) {
        throw new Error(response.error || 'Upload failed')
      }

      // Update file with backend response
      const uploadedFile: FilePreviewType = {
        uuid: response.data.file.uuid,
        filename: response.data.file.filename,
        file_extension: response.data.file.file_extension,
        file_type: response.data.file.file_type,
        file_size: response.data.file.file_size,
        preview: tempPreview.preview
      }

      // Replace temporary file with uploaded file
      setFiles(prev => prev.map(f => f.uuid === tempPreview.uuid ? uploadedFile : f))
    } catch (error) {
      // Remove temporary file on error
      setFiles(prev => prev.filter(f => !f.uuid.startsWith('temp-')))
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [validateFile, createFilePreview])

  const removeFile = useCallback((uuid: string) => {
    setFiles(prev => prev.filter(f => f.uuid !== uuid))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
  }, [])

  return {
    files,
    isUploading,
    uploadFile,
    removeFile,
    clearFiles,
    validateFile
  }
}
