# Project API Organization Guide

## Overview

The project API has been reorganized to follow a clean, scalable architecture where all API calls are defined in the `@/api/project` module and consumed by hooks in `@/hooks`.

## Architecture

### 1. API Layer (`src/api/project/`)

The API layer contains all backend communication logic.

#### Files

- **`api.ts`** - ProjectApiClient class with all API methods
- **`types.ts`** - TypeScript types for requests and responses
- **`index.ts`** - Centralized exports

#### ProjectApiClient Methods

All methods return `ApiResponse<T>` for consistent error handling.

```typescript
class ProjectApiClient {
  // Project CRUD operations
  createProject(data: CreateProjectRequest): Promise<ApiResponse<Project>>
  getProjects(page: number, perPage: number, orderBy: string): Promise<ApiResponse<...>>
  getProject(projectUuid: string): Promise<ApiResponse<Project>>
  updateProject(projectUuid: string, data: UpdateProjectRequest): Promise<ApiResponse<Project>>
  deleteProject(projectUuid: string): Promise<ApiResponse<{ success: boolean }>>

  // Project conversations
  getProjectConversations(projectUuid: string, page: number, perPage: number): Promise<ApiResponse<...>>

  // Project files
  addProjectFile(projectUuid: string, fileUuid: string): Promise<ApiResponse<AddProjectFileResponse>>
  getProjectFiles(projectUuid: string, page: number, perPage: number): Promise<ApiResponse<...>>
  removeProjectFile(projectUuid: string, fileUuid: string): Promise<ApiResponse<{ success: boolean }>>

  // Conversation management
  linkConversationToProject(projectUuid: string, conversationUuid: string): Promise<ApiResponse<LinkConversationToProjectResponse>>
}
```

#### Singleton Instance

```typescript
export const projectApi = new ProjectApiClient()
```

This singleton is used throughout the application via hooks.

### 2. Hook Layer (`src/hooks/`)

Hooks handle Redux state management, error handling, and API orchestration.

#### useProjects Hook

Main hook for all project-related operations:

```typescript
export const useProjects = () => {
  // State
  const projects: Project[]
  const selectedProject: Project | null
  const projectsPagination: PaginationInfo
  
  // Actions
  const loadProjects: (page?: number, perPage?: number) => Promise<...>
  const createProject: (name: string, category?: string) => Promise<Project | null>
  const updateProjectName: (projectId: string, name: string) => Promise<Project | null>
  const deleteProject: (projectId: string) => Promise<boolean>
  const loadProjectConversations: (projectUuid: string, page?: number, perPage?: number) => Promise<...>
  const addFileToProject: (projectUuid: string, fileUuid: string) => Promise<boolean>
  const removeFileFromProject: (projectUuid: string, fileUuid: string) => Promise<boolean>
  const linkConversationToProject: (projectId: string, conversationUuid: string) => Promise<boolean>
  const selectProject: (projectId: string | null) => void
}
```

#### useLinkConversation Hook

Specialized hook for linking conversations:

```typescript
export const useLinkConversation = (options?: {
  onSuccess?: () => void
  onError?: (error: string) => void
}) => {
  const linkConversationToProject: (
    projectUuid: string,
    conversationUuid: string,
    token: string
  ) => Promise<boolean>
  const isLoading: boolean
}
```

## Data Flow

### Example: Link Conversation to Project

```
Component
  ↓
useLinkConversation hook
  ↓
projectApi.linkConversationToProject()
  ↓
baseApiClient.post() (HTTP request)
  ↓
Backend API
  ↓
Response → Hook → Component
```

### With Redux (useProjects)

```
Component
  ↓
useProjects hook
  ↓
projectApi.linkConversationToProject()
  ↓
HTTP Request
  ↓
Redux dispatch (addConversationToProject)
  ↓
Redux state updated
  ↓
Component re-renders
```

## Usage Examples

### Using useProjects Hook

```typescript
import { useProjects } from '@/hooks'

function ProjectList() {
  const { 
    projects,
    loadProjects,
    createProject,
    updateProjectName,
    deleteProject
  } = useProjects()

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          {project.name}
        </div>
      ))}
    </div>
  )
}
```

### Using useLinkConversation Hook

```typescript
import { useLinkConversation } from '@/hooks'

function MoveConversation() {
  const { linkConversationToProject, isLoading } = useLinkConversation({
    onSuccess: () => {
      console.log('Conversation moved successfully')
      // Reload data, close modal, etc.
    },
    onError: (error) => {
      console.error('Move failed:', error)
    }
  })

  const handleMove = async () => {
    const success = await linkConversationToProject(
      projectUuid,
      conversationUuid,
      authToken
    )
  }

  return (
    <button onClick={handleMove} disabled={isLoading}>
      {isLoading ? 'Moving...' : 'Move'}
    </button>
  )
}
```

### Using projectApi Directly (if needed)

```typescript
import { projectApi } from '@/api/project'

// In a utility or service
async function customProjectOperation() {
  const response = await projectApi.getProjects(1, 20)
  if (response.error) {
    console.error('API error:', response.error)
  } else {
    const { projects, pagination } = response.data
    // Use data
  }
}
```

## Import Patterns

### Recommended Imports

```typescript
// From centralized project API module
import { projectApi, Project, CreateProjectRequest } from '@/api/project'

// From hooks
import { useProjects, useLinkConversation } from '@/hooks'
```

### Avoid Direct Imports

```typescript
// ❌ Avoid
import { projectApi } from '@/api/project/api'
import { Project } from '@/api/project/types'
```

## Error Handling

### In Hooks

Hooks automatically handle errors with:

```typescript
// Toast notifications (user-friendly)
const { error: showErrorToast } = useToast()
showErrorToast('Failed to Load Projects', errorMessage)

// Structured error objects
const errorObject = response.processedError || {
  error_type: 'PROJECTS_LOAD_FAILED',
  error_message: response.error,
  error_id: response.error_id,
  status: response.status
}
```

### In Components

```typescript
const { createProject } = useProjects()

try {
  const project = await createProject('My Project')
  if (!project) {
    // Error already handled by hook
    return
  }
  // Use project
} catch (error) {
  // Handle unexpected errors
}
```

## Adding New API Methods

### Step 1: Add Types

```typescript
// src/api/project/types.ts
export interface MyNewRequest {
  // fields
}

export interface MyNewResponse {
  // fields
}
```

### Step 2: Add API Method

```typescript
// src/api/project/api.ts
async myNewMethod(data: MyNewRequest): Promise<ApiResponse<MyNewResponse>> {
  const response = await this.baseClient.post<MyNewResponse>(
    '/api/v1/projects/my-endpoint',
    data
  )
  
  if (response.error) {
    return { error: response.error, status: response.status }
  }
  
  return { data: response.data as MyNewResponse, status: response.status }
}
```

### Step 3: Export Types

```typescript
// src/api/project/index.ts
export type { MyNewRequest, MyNewResponse } from './types'
```

### Step 4: Add Hook Method (Optional)

```typescript
// src/hooks/use-projects.ts
const myNewHook = useCallback(async (params) => {
  try {
    const response = await projectApi.myNewMethod(params)
    if (response.error) throw new Error(response.error)
    return response.data
  } catch (err) {
    const errorMessage = handleApiError(err)
    showErrorToast('Error Title', errorMessage)
    return null
  }
}, [showErrorToast])
```

## Best Practices

### ✅ Do

- Use hooks for API calls in components
- Use `projectApi` directly only in services/utilities
- Return consistent `ApiResponse<T>` types from all API methods
- Handle errors in both API and hooks
- Use Redux for shared state (projects, selected project)
- Document API methods with JSDoc comments

### ❌ Don't

- Make fetch calls directly in components
- Mix API calls between different modules
- Skip error handling
- Create new API files without following the pattern
- Use different response formats for different methods
- Expose internal API details in components

## File Structure

```
src/
├── api/
│   └── project/
│       ├── index.ts          (Exports)
│       ├── api.ts            (API methods)
│       └── types.ts          (TypeScript types)
├── hooks/
│   ├── use-projects.ts       (Project hook)
│   ├── use-link-conversation.ts  (Link conversation hook)
│   └── ...other hooks
└── components/
    └── ...components using the hooks
```

## Related Files

- **API Base Client**: `src/api/base.ts`
- **Auth API**: `src/api/auth/`
- **Conversation API**: `src/api/conversation/`
- **File API**: `src/api/file/`
- **Error Handler**: `src/lib/error-handler.ts`
- **Redux Store**: `src/store/slices/projectsSlice.ts`

## Testing

### Unit Testing APIs

```typescript
import { projectApi } from '@/api/project'

describe('projectApi.createProject', () => {
  it('should create a project', async () => {
    const response = await projectApi.createProject({ name: 'Test' })
    expect(response.data).toBeDefined()
  })
})
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useProjects } from '@/hooks'

describe('useProjects', () => {
  it('should load projects', async () => {
    const { result } = renderHook(() => useProjects())
    
    await act(async () => {
      await result.current.loadProjects()
    })
    
    expect(result.current.projects.length).toBeGreaterThan(0)
  })
})
```

## Migration Guide

If you have existing components using direct fetch calls:

### Before
```typescript
const response = await fetch(`/api/v1/projects/${id}`)
const project = await response.json()
```

### After
```typescript
import { projectApi } from '@/api/project'

const response = await projectApi.getProject(id)
if (response.error) {
  // Handle error
} else {
  const project = response.data
}
```

## Troubleshooting

### Issue: "Cannot find module '@/api/project'"

**Solution**: Ensure the index.ts file exists and exports are correct

### Issue: "API returns 401 Unauthorized"

**Solution**: Check that authentication token is included in headers (handled by baseApiClient)

### Issue: "Redux state not updating after API call"

**Solution**: Ensure hook dispatches Redux actions after API success

### Issue: Toast notifications not showing

**Solution**: Verify useToast hook is imported and initialized in the hook

