"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Close } from "@/icons";
import { useToast, useProjects, useFileUpload } from "@/hooks";
import { t } from "@/i18n";
import { FilePreview } from "@/components/ui/file-preview";
import { FilePreview as FilePreviewType } from "@/api/files/types";
import { projectApi } from "@/api/project/api";

interface ProjectFile {
  uuid: string;
  filename: string;
  file_extension: string;
  file_type: string;
  file_size: number;
  preview?: string;
  created_at: string;
}

interface ProjectFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

interface UploadedFileWithStatus extends FilePreviewType {
  status: 'pending' | 'saved';
}

export const ProjectFilesModal: React.FC<ProjectFilesModalProps> = ({
  isOpen,
  onClose,
  projectId,
}) => {
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [filesPagination, setFilesPagination] = useState<{ page: number, per_page: number, total: number, total_pages: number } | null>(null);
  const [isLoadingMoreFiles, setIsLoadingMoreFiles] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const { error: showErrorToast } = useToast();
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const filesContainerRef = useRef<HTMLDivElement>(null);
  const { uploadFile: uploadFileHook, files: uploadedFiles, clearFiles, removeFile } = useFileUpload();
  const { addFileToProject } = useProjects();
  const hasLoadedRef = useRef<string | null>(null);

  // Load project files when modal opens
  useEffect(() => {
    if (isOpen && projectId) {
      // Reset loaded ref when project changes
      if (hasLoadedRef.current !== projectId) {
        hasLoadedRef.current = null;
      }

      // Skip if we've already loaded for this project
      if (hasLoadedRef.current === projectId) {
        return;
      }

      const loadFiles = async () => {
        setIsLoadingFiles(true);
        try {
          const response = await projectApi.getProjectFiles(projectId, 1, 20);
          if (response.error) {
            throw new Error(response.error);
          }
          const data = response.data || { files: [], pagination: { page: 1, per_page: 20, total: 0, total_pages: 0 } };
          setProjectFiles(data.files);
          setFilesPagination(data.pagination);
          hasLoadedRef.current = projectId;
        } catch (error) {
          console.error('Failed to load project files:', error);
          showErrorToast('Failed to Load Files', error instanceof Error ? error.message : 'Failed to load project files');
        } finally {
          setIsLoadingFiles(false);
        }
      };

      loadFiles();
    }
  }, [isOpen, projectId, showErrorToast]);

  // Handle scroll to load more files
  const handleFilesScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      const threshold = 10;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (
        isNearBottom &&
        !isLoadingMoreFiles &&
        filesPagination &&
        filesPagination.page < filesPagination.total_pages
      ) {
        setIsLoadingMoreFiles(true);
        projectApi.getProjectFiles(projectId, filesPagination.page + 1, 20)
          .then((response) => {
            if (response.error) {
              throw new Error(response.error);
            }
            const data = response.data || { files: [], pagination: filesPagination };
            setProjectFiles((prev) => [...prev, ...data.files]);
            setFilesPagination(data.pagination);
          })
          .catch((error) => {
            console.error('Failed to load more files:', error);
            showErrorToast('Failed to Load More Files', error instanceof Error ? error.message : 'Failed to load more files');
          })
          .finally(() => {
            setIsLoadingMoreFiles(false);
          });
      }
    },
    [isLoadingMoreFiles, filesPagination, projectId, showErrorToast]
  );

  // Handle file upload
  const handleProjectFilesSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      
      for (const file of Array.from(files)) {
        try {
          // Upload file using file upload hook
          await uploadFileHook(file);
        } catch (error) {
          showErrorToast(
            "Upload Failed",
            error instanceof Error
              ? error.message
              : t("common.fileUpload.uploadFailed")
          );
        }
      }
    },
    [uploadFileHook, showErrorToast]
  );

  // Handle save files to project
  const handleSaveFiles = useCallback(async () => {
    if (uploadedFiles.length === 0) {
      showErrorToast("No Files", "Please upload files first");
      return;
    }

    let successCount = 0;
    for (const file of uploadedFiles) {
      try {
        const success = await addFileToProject(projectId, file.uuid);
        if (success) {
          successCount++;
          // Add to project files list
          const newFile: ProjectFile = {
            uuid: file.uuid,
            filename: file.filename,
            file_extension: file.file_extension,
            file_type: file.file_type,
            file_size: file.file_size,
            preview: file.preview,
            created_at: new Date().toISOString(),
          };
          setProjectFiles((prev) => [newFile, ...prev]);
        }
      } catch (error) {
        showErrorToast(
          "Failed to Link File",
          error instanceof Error ? error.message : "Failed to link file to project"
        );
      }
    }
    
    if (successCount > 0) {
      // Clear uploaded files after saving
      clearFiles();
    }
  }, [uploadedFiles, projectId, addFileToProject, clearFiles, showErrorToast]);

  // Convert uploaded files to include status
  const uploadedFilesWithStatus: UploadedFileWithStatus[] = uploadedFiles.map(file => ({
    ...file,
    status: 'pending' as const
  }));

  // Convert project files to FilePreviewType format
  const projectFilesAsPreview: FilePreviewType[] = projectFiles.map(file => ({
    uuid: file.uuid,
    filename: file.filename,
    file_extension: file.file_extension,
    file_type: file.file_type,
    file_size: file.file_size,
    preview: file.preview,
  }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="w-full max-w-xl h-[600px] flex flex-col bg-[color:var(--tokens-color-surface-surface-primary)] rounded-2xl shadow-2xl border border-[color:var(--tokens-color-border-border-subtle)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4 flex-shrink-0">
          <div className="font-h02-heading02 text-lg text-[color:var(--tokens-color-text-text-primary)]">
            Project files
          </div>
          <div className="flex items-center gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] bg-[color:var(--tokens-color-surface-surface-tertiary)] rounded-full hover:bg-[color:var(--tokens-color-surface-surface-secondary)] transition-colors"
              onClick={() => projectFileInputRef.current?.click()}
            >
              Add files
            </button>
            <button
              aria-label="Close files modal"
              className="p-1 rounded-full hover:bg-[color:var(--tokens-color-surface-surface-tertiary)] transition-colors"
              onClick={() => {
                onClose();
                clearFiles();
              }}
            >
              <Close className="w-4 h-4" color="currentColor" />
            </button>
          </div>
        </div>

        {/* Files Content - Scrollable */}
        <div 
          ref={filesContainerRef}
          className="flex-1 overflow-y-auto px-6 py-4 min-h-0"
          onScroll={handleFilesScroll}
        >
          {isLoadingFiles ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-[color:var(--tokens-color-text-text-inactive-2)]">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[color:var(--tokens-color-text-text-inactive-2)]"></div>
                <span className="text-sm">Loading files...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Show uploaded files preview with pending status */}
              {uploadedFilesWithStatus.length > 0 && (
                <div className="mb-4">
                  <div className="text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] mb-2">
                    Uploaded Files (Pending)
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {uploadedFilesWithStatus.map((file: UploadedFileWithStatus) => (
                      <FilePreview
                        key={file.uuid}
                        file={file}
                        onRemove={(uuid: string) => {
                          removeFile(uuid);
                        }}
                        showPendingStatus={true}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show project files */}
              {projectFilesAsPreview.length === 0 && uploadedFilesWithStatus.length === 0 ? (
                <div className="text-sm text-[color:var(--tokens-color-text-text-inactive-2)] text-center py-8">
                  No files added yet.
                </div>
              ) : (
                <div>
                  {uploadedFilesWithStatus.length > 0 && (
                    <div className="text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] mb-2 mt-4">
                      Project Files
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {projectFilesAsPreview.map((file) => (
                      <FilePreview
                        key={file.uuid}
                        file={file}
                        onRemove={(uuid: string) => {
                          // TODO: Implement remove file from project
                          console.log('Remove file from project:', uuid);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Loading indicator for more files */}
              {isLoadingMoreFiles && (
                <div className="w-full p-3 text-center text-[color:var(--tokens-color-text-text-inactive-2)]">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[color:var(--tokens-color-text-text-inactive-2)]"></div>
                    <span className="text-[14px]">
                      Loading more files...
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer with Save button */}
        {uploadedFilesWithStatus.length > 0 && (
          <div className="border-t border-[color:var(--tokens-color-border-border-subtle)] px-6 py-4 flex-shrink-0 flex justify-end">
            <button
              className="px-6 py-2 text-sm font-medium text-white bg-[color:var(--premitives-color-brand-purple-1000)] rounded-full hover:bg-[color:var(--tokens-color-surface-surface-button-pressed)] transition-colors"
              onClick={handleSaveFiles}
            >
              Save
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={projectFileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z"
          className="hidden"
          onChange={(e) => {
            handleProjectFilesSelect(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
};

