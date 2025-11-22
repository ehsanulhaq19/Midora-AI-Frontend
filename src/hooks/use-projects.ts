import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { projectApi } from '@/api/project/api'
import { Project } from '@/api/project/types'
import {
  addProject,
  updateProject,
  removeProject,
  setSelectedProject,
  addConversationToProject,
  setProjects,
  appendProjects,
  setProjectsPagination,
  setLoadingMoreProjects,
  setProjectConversationsData,
  appendProjectConversationsData,
} from '@/store/slices/projectsSlice'
import { useToast } from './use-toast'
import { handleApiError } from '@/lib/error-handler'

export const useProjects = () => {
  const dispatch = useDispatch()
  const { error: showErrorToast } = useToast()
  const {
    projects,
    projectConversations,
    projectConversationsData,
    selectedProjectId,
    projectsPagination,
    isLoadingMoreProjects,
  } = useSelector((state: RootState) => state.projects)

  // Load projects
  const loadProjects = useCallback(async (page: number = 1, perPage: number = 10) => {
    try {
      if (page > 1) {
        dispatch(setLoadingMoreProjects(true))
      }
      const response = await projectApi.getProjects(page, perPage, "-created_at")
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'PROJECTS_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      const projectsData = response.data || { projects: [], pagination: { page: 1, per_page: 10, total: 0, total_pages: 0 } }
      
      // Convert backend projects to Redux format (use uuid as id)
      const reduxProjects = projectsData.projects.map(project => ({
        id: project.uuid,
        name: project.name,
        category: project.category,
      }))
      
      if (page === 1) {
        // First page - replace all projects
        dispatch(setProjects(reduxProjects))
      } else {
        // Subsequent pages - append projects
        dispatch(appendProjects({ projects: reduxProjects, pagination: projectsData.pagination }))
      }
      
      dispatch(setProjectsPagination(projectsData.pagination))
      
      return { projects: reduxProjects, pagination: projectsData.pagination }
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Load Projects', errorMessage)
      throw err
    } finally {
      if (page > 1) {
        dispatch(setLoadingMoreProjects(false))
      }
    }
  }, [dispatch, showErrorToast])

  // Create a new project
  const createProject = useCallback(async (name: string, category?: string) => {
    try {
      const response = await projectApi.createProject({ name, category })
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'PROJECT_CREATION_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      const project = response.data!
      
      // Convert backend Project to Redux Project format
      const reduxProject: Project = {
        id: project.uuid, // Use uuid as id for Redux
        name: project.name,
        category: project.category,
      }
      
      dispatch(addProject(reduxProject))
      dispatch(setSelectedProject(reduxProject.id))
      return reduxProject
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Create Project', errorMessage)
      return null
    }
  }, [dispatch, showErrorToast])

  // Update a project
  const updateProjectName = useCallback(async (projectId: string, name: string) => {
    try {
      const response = await projectApi.updateProject(projectId, { name })
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'PROJECT_UPDATE_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      const project = response.data!
      
      const reduxProject: Project = {
        id: project.uuid,
        name: project.name,
        category: project.category,
      }
      
      dispatch(updateProject(reduxProject))
      return reduxProject
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Update Project', errorMessage)
      return null
    }
  }, [dispatch, showErrorToast])

  // Delete a project
  const deleteProject = useCallback(async (projectId: string) => {
    try {
      const response = await projectApi.deleteProject(projectId)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'PROJECT_DELETE_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      dispatch(removeProject(projectId))
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Delete Project', errorMessage)
      return false
    }
  }, [dispatch, showErrorToast])

  // Get project conversations
  const loadProjectConversations = useCallback(async (
    projectUuid: string,
    page: number = 1,
    perPage: number = 10,
    forceRefresh: boolean = false
  ) => {
    try {
      // Check Redux store first if not forcing refresh and it's the first page
      // Use selector to get current state instead of depending on prop
      if (!forceRefresh && page === 1) {
        const currentState = (dispatch as any).getState?.() || {}
        const currentProjectConversationsData = currentState.projects?.projectConversationsData || {}
        if (currentProjectConversationsData[projectUuid] && currentProjectConversationsData[projectUuid].length > 0) {
          // Return data from Redux store
          const conversations = currentProjectConversationsData[projectUuid]
          return {
            conversations,
            pagination: { page: 1, per_page: perPage, total: conversations.length, total_pages: 1 }
          }
        }
      }

      // Fetch from API
      const response = await projectApi.getProjectConversations(projectUuid, page, perPage)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'PROJECT_CONVERSATIONS_LOAD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      
      const data = response.data || { conversations: [], pagination: { page: 1, per_page: 10, total: 0, total_pages: 0 } }
      
      // Store in Redux
      if (page === 1) {
        dispatch(setProjectConversationsData({ projectId: projectUuid, conversations: data.conversations }))
      } else {
        dispatch(appendProjectConversationsData({ projectId: projectUuid, conversations: data.conversations }))
      }
      
      return data
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Load Project Conversations', errorMessage)
      return { conversations: [], pagination: { page: 1, per_page: 10, total: 0, total_pages: 0 } }
    }
  }, [showErrorToast, dispatch])

  // Add file to project
  const addFileToProject = useCallback(async (projectUuid: string, fileUuid: string) => {
    try {
      const response = await projectApi.addProjectFile(projectUuid, fileUuid)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'PROJECT_FILE_ADD_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Add File to Project', errorMessage)
      return false
    }
  }, [showErrorToast])

  // Remove file from project
  const removeFileFromProject = useCallback(async (projectUuid: string, fileUuid: string) => {
    try {
      const response = await projectApi.removeProjectFile(projectUuid, fileUuid)
      if (response.error) {
        const errorObject = response.processedError || {
          error_type: 'PROJECT_FILE_REMOVE_FAILED',
          error_message: response.error,
          error_id: response.error_id,
          status: response.status
        }
        throw new Error(JSON.stringify(errorObject))
      }
      return true
    } catch (err) {
      const errorMessage = handleApiError(err)
      showErrorToast('Failed to Remove File from Project', errorMessage)
      return false
    }
  }, [showErrorToast])

  // Link conversation to project
  const linkConversationToProject = useCallback((projectId: string, conversationUuid: string) => {
    dispatch(addConversationToProject({ projectId, conversationUuid }))
  }, [dispatch])

  // Select project
  const selectProject = useCallback((projectId: string | null) => {
    dispatch(setSelectedProject(projectId))
  }, [dispatch])

  // Convert projects object to array
  const projectsArray = Object.values(projects)
  
  return {
    // State
    projects: projectsArray,
    projectsObject: projects,
    projectConversations,
    projectConversationsData,
    selectedProjectId,
    selectedProject: selectedProjectId ? projects[selectedProjectId] || null : null,
    projectsPagination,
    isLoadingMoreProjects,
    
    // Actions
    loadProjects,
    createProject,
    updateProjectName,
    deleteProject,
    loadProjectConversations,
    addFileToProject,
    removeFileFromProject,
    linkConversationToProject,
    selectProject,
  }
}

