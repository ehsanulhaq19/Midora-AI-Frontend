import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Project {
  id: string
  name: string
  category?: string
}

export interface ProjectConversation {
  uuid: string
  name: string
  created_at: string
}

export interface ProjectsState {
  projects: { [projectId: string]: Project }
  projectConversations: { [projectId: string]: string[] } // projectId -> conversationUuids[]
  projectConversationsData: { [projectId: string]: ProjectConversation[] } // projectId -> conversation data
  selectedProjectId: string | null
  projectsPagination: { page: number, per_page: number, total: number, total_pages: number } | null
  isLoadingMoreProjects: boolean
}

const initialState: ProjectsState = {
  projects: {},
  projectConversations: {},
  projectConversationsData: {},
  selectedProjectId: null,
  projectsPagination: null,
  isLoadingMoreProjects: false,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Add a new project
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects = {
        [action.payload.id]: action.payload,
        ...state.projects
      }
      if (!state.projectConversations[action.payload.id]) {
        state.projectConversations[action.payload.id] = []
      }
    },

    // Update a project
    updateProject: (state, action: PayloadAction<Project>) => {
      if (state.projects[action.payload.id]) {
        state.projects[action.payload.id] = action.payload
      }
    },

    // Remove a project
    removeProject: (state, action: PayloadAction<string>) => {
      delete state.projects[action.payload]
      delete state.projectConversations[action.payload]
      if (state.selectedProjectId === action.payload) {
        state.selectedProjectId = null
      }
    },

    // Set selected project
    setSelectedProject: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload
    },

    // Add conversation to project
    addConversationToProject: (state, action: PayloadAction<{ projectId: string; conversationUuid: string }>) => {
      const { projectId, conversationUuid } = action.payload
      if (!state.projectConversations[projectId]) {
        state.projectConversations[projectId] = []
      }
      if (!state.projectConversations[projectId].includes(conversationUuid)) {
        state.projectConversations[projectId].push(conversationUuid)
      }
    },

    // Remove conversation from project
    removeConversationFromProject: (state, action: PayloadAction<{ projectId: string; conversationUuid: string }>) => {
      const { projectId, conversationUuid } = action.payload
      if (state.projectConversations[projectId]) {
        state.projectConversations[projectId] = state.projectConversations[projectId].filter(
          uuid => uuid !== conversationUuid
        )
      }
    },

    // Set all projects
    setProjects: (state, action: PayloadAction<Project[]>) => {
      const projectsObject: { [projectId: string]: Project } = {}
      action.payload.forEach((project: Project) => {
        projectsObject[project.id] = project
      })
      state.projects = projectsObject
    },

    // Append projects (for pagination)
    appendProjects: (state, action: PayloadAction<{ projects: Project[], pagination: { page: number, per_page: number, total: number, total_pages: number } }>) => {
      action.payload.projects.forEach((project: Project) => {
        state.projects[project.id] = project
      })
      state.projectsPagination = action.payload.pagination
    },

    // Set projects pagination
    setProjectsPagination: (state, action: PayloadAction<{ page: number, per_page: number, total: number, total_pages: number }>) => {
      state.projectsPagination = action.payload
    },

    // Set loading more projects state
    setLoadingMoreProjects: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMoreProjects = action.payload
    },

    // Initialize projects state
    initializeProjects: (state, action: PayloadAction<{ projects: Project[]; projectConversations: { [projectId: string]: string[] } }>) => {
      const projectsObject: { [projectId: string]: Project } = {}
      action.payload.projects.forEach((project: Project) => {
        projectsObject[project.id] = project
      })
      state.projects = projectsObject
      state.projectConversations = action.payload.projectConversations
    },

    // Set project conversations data
    setProjectConversationsData: (state, action: PayloadAction<{ projectId: string; conversations: ProjectConversation[] }>) => {
      const { projectId, conversations } = action.payload
      state.projectConversationsData[projectId] = conversations
    },

    // Append project conversations data (for pagination)
    appendProjectConversationsData: (state, action: PayloadAction<{ projectId: string; conversations: ProjectConversation[] }>) => {
      const { projectId, conversations } = action.payload
      if (!state.projectConversationsData[projectId]) {
        state.projectConversationsData[projectId] = []
      }
      state.projectConversationsData[projectId] = [...state.projectConversationsData[projectId], ...conversations]
    },

    // Clear all projects
    clearProjects: (state) => {
      state.projects = {}
      state.projectConversations = {}
      state.projectConversationsData = {}
      state.selectedProjectId = null
    },
  },
})

export const {
  addProject,
  updateProject,
  removeProject,
  setSelectedProject,
  addConversationToProject,
  removeConversationFromProject,
  setProjects,
  appendProjects,
  setProjectsPagination,
  setLoadingMoreProjects,
  initializeProjects,
  setProjectConversationsData,
  appendProjectConversationsData,
  clearProjects,
} = projectsSlice.actions

export default projectsSlice.reducer

