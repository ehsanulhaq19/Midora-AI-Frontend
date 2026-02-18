# Project API Quick Reference

## 📋 All Project API Methods

Located in: `src/api/project/api.ts`

```typescript
projectApi.createProject(data)                           // Create new project
projectApi.getProjects(page, perPage, orderBy)          // Get all projects
projectApi.getProject(projectUuid)                       // Get single project
projectApi.updateProject(projectUuid, data)             // Update project name
projectApi.deleteProject(projectUuid)                   // Delete project

projectApi.getProjectConversations(projectUuid, ...)    // Get project conversations
projectApi.linkConversationToProject(projectUuid, ...)  // Link conversation ✨ NEW

projectApi.addProjectFile(projectUuid, fileUuid)        // Add file to project
projectApi.getProjectFiles(projectUuid, page, perPage)  // Get project files
projectApi.removeProjectFile(projectUuid, fileUuid)     // Remove file from project
```

## 🪝 Hook Functions

### useProjects
```typescript
import { useProjects } from '@/hooks'

const {
  // State
  projects,                      // Project[]
  selectedProject,              // Project | null
  projectsPagination,           // PaginationInfo
  projectConversationsData,     // { [projectId]: Conversation[] }

  // Actions
  loadProjects,                 // (page?, perPage?) => Promise
  createProject,                // (name, category?) => Promise<Project | null>
  updateProjectName,            // (projectId, name) => Promise<Project | null>
  deleteProject,                // (projectId) => Promise<boolean>
  loadProjectConversations,     // (projectUuid, page?, perPage?) => Promise
  addFileToProject,             // (projectUuid, fileUuid) => Promise<boolean>
  removeFileFromProject,        // (projectUuid, fileUuid) => Promise<boolean>
  linkConversationToProject,    // (projectId, conversationUuid) => Promise<boolean>
  selectProject                 // (projectId | null) => void
} = useProjects()
```

### useLinkConversation
```typescript
import { useLinkConversation } from '@/hooks'

const {
  linkConversationToProject,    // (projectUuid, convUuid, token) => Promise<boolean>
  isLoading                      // boolean
} = useLinkConversation({
  onSuccess: () => {},
  onError: (error) => {}
})
```

## 💾 Types

```typescript
import {
  Project,
  ProjectConversation,
  CreateProjectRequest,
  UpdateProjectRequest,
  LinkConversationToProjectRequest,
  LinkConversationToProjectResponse
} from '@/api/project'
```

## 🔥 Common Patterns

### Load Projects
```typescript
const { loadProjects, projects } = useProjects()

useEffect(() => {
  loadProjects()
}, [])
```

### Create Project
```typescript
const { createProject } = useProjects()

const newProject = await createProject('My Project')
if (newProject) {
  console.log('Created:', newProject)
}
```

### Move Conversation
```typescript
const { linkConversationToProject, isLoading } = useLinkConversation({
  onSuccess: () => alert('Moved!'),
  onError: (err) => alert('Failed: ' + err)
})

await linkConversationToProject(projectUuid, convUuid, token)
```

### Get Project Conversations
```typescript
const { loadProjectConversations } = useProjects()

const result = await loadProjectConversations(projectUuid)
console.log(result.conversations) // Conversation[]
console.log(result.pagination)     // { page, per_page, total, total_pages }
```

## ✅ Import Cheatsheet

```typescript
// ✅ Correct
import { projectApi } from '@/api/project'
import { useProjects, useLinkConversation } from '@/hooks'

// ❌ Wrong
import { projectApi } from '@/api/project/api'
import { Project } from '@/api/project/types'
```

## 📊 Response Types

All API methods return `ApiResponse<T>`:

```typescript
{
  success?: boolean
  data?: T                    // Your data
  error?: string              // Error message
  status?: number             // HTTP status
  processedError?: {
    error_type: string
    error_message: string
    error_id?: string
  }
}
```

## 🛡️ Error Handling

Errors are handled automatically in hooks:
- Toast notifications shown to user
- Error callbacks triggered
- Console logging available

## 📚 Documentation

- Full guide: `docs/api/project-api-organization.md`
- Examples: Check component files using these hooks
- Types: `src/api/project/types.ts`

## 🚀 Quick Start

```typescript
// In your component
import { useProjects } from '@/hooks'

function MyComponent() {
  const { projects, loadProjects } = useProjects()

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <ul>
      {projects.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  )
}
```

## 📍 File Locations

- API: `src/api/project/`
- Hooks: `src/hooks/use-projects.ts` and `src/hooks/use-link-conversation.ts`
- Components: `src/components/chat/sections/project-*.tsx`
- Docs: `docs/api/project-api-organization.md`

---

**Last Updated**: January 31, 2026
**Status**: ✅ Complete and Production Ready

