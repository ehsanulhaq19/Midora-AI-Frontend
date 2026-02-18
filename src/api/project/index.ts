/**
 * Project API module exports
 * Centralized export point for all project-related API functionality
 */

export { projectApi, ProjectApiClient } from './api'
export type {
  Project,
  ProjectConversation,
  CreateProjectRequest,
  UpdateProjectRequest,
  CreateProjectResponse,
  GetProjectsResponse,
  GetProjectResponse,
  GetProjectConversationsResponse,
  AddProjectFileResponse,
  DeleteProjectFileResponse,
  DeleteProjectResponse,
  GetProjectFilesResponse,
  LinkConversationToProjectRequest,
  LinkConversationToProjectResponse,
} from './types'

