/**
 * Project API client
 * Handles all project-related API calls
 */

import { baseApiClient, ApiResponse } from '../base'
import {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateProjectResponse,
  GetProjectsResponse,
  GetProjectResponse,
  GetProjectConversationsResponse,
  GetProjectFilesResponse,
  AddProjectFileResponse,
  DeleteProjectFileResponse,
  DeleteProjectResponse,
  LinkConversationToProjectRequest,
  LinkConversationToProjectResponse
} from './types'

class ProjectApiClient {
  private baseClient = baseApiClient

  /**
   * Create a new project
   */
  async createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>> {
    const response = await this.baseClient.post<CreateProjectResponse>('/api/v1/projects', data)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as Project, status: response.status }
  }

  /**
   * Get all projects for the authenticated user
   */
  async getProjects(
    page: number = 1, 
    perPage: number = 10, 
    orderBy: string = "-created_at"
  ): Promise<ApiResponse<{ projects: Project[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>> {
    const response = await this.baseClient.get<GetProjectsResponse>(
      `/api/v1/projects?page=${page}&per_page=${perPage}&order_by=${orderBy}`
    )
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    const projects = response?.data?.items || []
    const pagination = {
      page: response?.data?.page || page,
      per_page: response?.data?.per_page || perPage,
      total: response?.data?.total || 0,
      total_pages: response?.data?.total_pages || 0
    }
    
    return { data: { projects, pagination }, status: response.status }
  }

  /**
   * Get a specific project by UUID
   */
  async getProject(projectUuid: string): Promise<ApiResponse<Project>> {
    const response = await this.baseClient.get<GetProjectResponse>(`/api/v1/projects/${projectUuid}`)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as Project, status: response.status }
  }

  /**
   * Update a project
   */
  async updateProject(projectUuid: string, data: UpdateProjectRequest): Promise<ApiResponse<Project>> {
    const response = await this.baseClient.put<GetProjectResponse>(`/api/v1/projects/${projectUuid}`, data)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as Project, status: response.status }
  }

  /**
   * Delete a project
   */
  async deleteProject(projectUuid: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.baseClient.delete<DeleteProjectResponse>(`/api/v1/projects/${projectUuid}`)
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: { success: true }, status: response.status }
  }

  /**
   * Get conversations for a project
   */
  async getProjectConversations(
    projectUuid: string,
    page: number = 1,
    perPage: number = 10
  ): Promise<ApiResponse<{ conversations: Array<{ uuid: string; name: string; created_at: string }>, pagination: { page: number, per_page: number, total: number, total_pages: number } }>> {
    const response = await this.baseClient.get<GetProjectConversationsResponse>(
      `/api/v1/projects/${projectUuid}/conversations?page=${page}&per_page=${perPage}`
    )
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    const conversations = response?.data?.items || []
    const pagination = {
      page: response?.data?.page || page,
      per_page: response?.data?.per_page || perPage,
      total: response?.data?.total || 0,
      total_pages: response?.data?.total_pages || 0
    }
    
    return { data: { conversations, pagination }, status: response.status }
  }

  /**
   * Add a file to a project
   */
  async addProjectFile(projectUuid: string, fileUuid: string): Promise<ApiResponse<AddProjectFileResponse>> {
    const response = await this.baseClient.post<AddProjectFileResponse>(
      `/api/v1/projects/${projectUuid}/files/${fileUuid}`,
      {}
    )
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as AddProjectFileResponse, status: response.status }
  }

  /**
   * Get files for a project
   */
  async getProjectFiles(
    projectUuid: string,
    page: number = 1,
    perPage: number = 20
  ): Promise<ApiResponse<{ files: Array<{ uuid: string; filename: string; file_extension: string; file_type: string; file_size: number; created_at: string }>, pagination: { page: number, per_page: number, total: number, total_pages: number } }>> {
    const response = await this.baseClient.get<GetProjectFilesResponse>(
      `/api/v1/projects/${projectUuid}/files?page=${page}&per_page=${perPage}`
    )
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    const files = response?.data?.items || []
    const pagination = {
      page: response?.data?.page || page,
      per_page: response?.data?.per_page || perPage,
      total: response?.data?.total || 0,
      total_pages: response?.data?.total_pages || 0
    }
    
    return { data: { files, pagination }, status: response.status }
  }

  /**
   * Remove a file from a project
   */
  async removeProjectFile(projectUuid: string, fileUuid: string): Promise<ApiResponse<{ success: boolean }>> {
    const response = await this.baseClient.delete<DeleteProjectFileResponse>(
      `/api/v1/projects/${projectUuid}/files/${fileUuid}`
    )
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: { success: true }, status: response.status }
  }

  /**
   * Link a conversation to a project
   */
  async linkConversationToProject(
    projectUuid: string,
    conversationUuid: string
  ): Promise<ApiResponse<LinkConversationToProjectResponse>> {
    const response = await this.baseClient.post<LinkConversationToProjectResponse>(
      `/api/v1/projects/${projectUuid}/conversations/${conversationUuid}/link`,
      {}
    )
    
    if (response.error) {
      return { error: response.error, status: response.status }
    }
    
    return { data: response.data as LinkConversationToProjectResponse, status: response.status }
  }
}

// Export singleton instance
export const projectApi = new ProjectApiClient()

// Export the class for custom instances
export { ProjectApiClient }

