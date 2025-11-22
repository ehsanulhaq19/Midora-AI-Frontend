/**
 * Project API types
 * Type definitions for all project-related API requests and responses
 */

export interface Project {
  id: string
  uuid: string
  name: string
  created_by: number
  created_at: string
  updated_at: string
  category?: string
}

export interface ProjectConversation {
  uuid: string
  name: string
  created_at: string
}

// Request types
export interface CreateProjectRequest {
  name: string
  category?: string
}

export interface UpdateProjectRequest {
  name: string
}

// Response types
export interface CreateProjectResponse extends Project {}

export interface GetProjectsResponse {
  items: Project[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface GetProjectResponse extends Project {}

export interface GetProjectConversationsResponse {
  items: ProjectConversation[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export interface AddProjectFileResponse {
  project_uuid: string
  file_uuid: string
  message?: string
}

export interface DeleteProjectFileResponse {
  message: string
}

export interface DeleteProjectResponse {
  message: string
}

export interface GetProjectFilesResponse {
  items: Array<{
    uuid: string
    filename: string
    file_extension: string
    file_type: string
    file_size: number
    created_at: string
  }>
  total: number
  page: number
  per_page: number
  total_pages: number
}

