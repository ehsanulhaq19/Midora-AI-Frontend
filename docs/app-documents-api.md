# App Documents API Reference

## Overview

This document provides API reference for the App Documents documentation system components and their interfaces.

## Components API

### DocumentationDashboard

Main dashboard component that manages navigation and content display.

```typescript
interface DocumentationDashboardProps {
  // No props required - self-contained component
}

export const DocumentationDashboard: React.FC<DocumentationDashboardProps>
```

**Features:**
- Manages active section state
- Renders navigation sidebar
- Handles section switching
- Provides responsive layout

### ThemeVariablesDisplay

Interactive display of theme variables and CSS custom properties.

```typescript
interface ThemeVariablesDisplayProps {
  // No props required - self-contained component
}

export const ThemeVariablesDisplay: React.FC<ThemeVariablesDisplayProps>
```

**State Management:**
- `activeCategory`: Current selected category (colors, typography, spacing, borders)
- `copiedVariable`: Currently copied variable name for feedback

**Methods:**
- `copyToClipboard(text: string)`: Copies variable name to clipboard

### IconsGallery

Interactive gallery for browsing and using icons.

```typescript
interface IconsGalleryProps {
  // No props required - self-contained component
}

export const IconsGallery: React.FC<IconsGalleryProps>
```

**State Management:**
- `searchTerm`: Current search query
- `selectedCategory`: Current filter category
- `selectedIcon`: Currently selected icon for modal display
- `copiedCode`: Currently copied code for feedback

**Methods:**
- `copyToClipboard(code: string)`: Copies code to clipboard
- `generateUsageCode(icon: IconItem)`: Generates usage code for icon

**Data Structures:**
```typescript
interface IconItem {
  name: string
  component: React.ComponentType<any>
  category: IconCategory
  description: string
}

type IconCategory = 'all' | 'navigation' | 'actions' | 'media' | 'communication' | 'files'
```

### ComponentsOverview

Showcase of UI components with examples.

```typescript
interface ComponentsOverviewProps {
  // No props required - self-contained component
}

export const ComponentsOverview: React.FC<ComponentsOverviewProps>
```

**Features:**
- Displays component categories
- Shows live examples
- Provides usage guidelines
- Shows component statistics

## Theme Variables API

### Color Variables

```typescript
interface ColorVariable {
  name: string
  value: string
  description: string
}

// Available color categories:
// - surface: Surface color variables
// - text: Text color variables  
// - primitive: Primitive color variables
```

### Typography Variables

```typescript
interface TypographyVariable {
  name: string
  value: string
  description: string
}

// Available typography variables:
// - Font families (Poppins, SF Pro, Plus Jakarta Sans)
// - Font sizes (heading and body text)
// - Font weights and line heights
```

### Spacing Variables

```typescript
interface SpacingVariable {
  name: string
  value: string
  description: string
}

// Available spacing variables:
// - Border radius values
// - Corner radius definitions
```

### Border Variables

```typescript
interface BorderVariable {
  name: string
  value: string
  description: string
}

// Available border variables:
// - Border colors (primary, secondary, focus)
// - Border styles and widths
```

## Icons API

### Icon Component Interface

All icon components follow this standard interface:

```typescript
interface IconProps {
  className?: string
  color?: string
}

export const IconName: React.FC<IconProps>
```

**Props:**
- `className`: Optional CSS classes for styling
- `color`: Optional color override (defaults to "currentColor")

### Available Icons

The icons gallery includes 40+ icons organized by category:

**Navigation Icons:**
- ArrowDownSm, ArrowUpSm, ArrowRightSm, DownArrowSm
- ChevronDown, CaretDown
- Menu, Grid

**Action Icons:**
- Search, Search02, Close, Star, Stars
- Lightning, Lightbulb, Code
- MoreOptions, MinusSquare, Plus01_5
- CheckBroken, CheckBroken4
- CollapseButton, Logout

**Media Icons:**
- Microphone, AudioSettings
- Image26, Icon6122191
- Midoras, MidorasIcon, LogoOnly

**File Icons:**
- FolderOpen, FolderOpen01, FolderPlus
- Folders, FoldersIcon
- Paperclip

**Communication Icons:**
- (Currently none, but extensible)

## Utility Functions

### Clipboard Operations

```typescript
async function copyToClipboard(text: string): Promise<void>
```

**Parameters:**
- `text`: String to copy to clipboard

**Returns:**
- Promise that resolves when copy operation completes

**Error Handling:**
- Logs errors to console if clipboard API fails
- Provides user feedback through state management

### Code Generation

```typescript
function generateUsageCode(icon: IconItem): string
```

**Parameters:**
- `icon`: Icon item with name and component information

**Returns:**
- Formatted usage code string with import and JSX

**Example Output:**
```typescript
import { Search } from '@/icons'

// Usage
<Search className="w-6 h-6" color="currentColor" />
```

## State Management

### Local State

All components use React's `useState` hook for local state management:

```typescript
// Navigation state
const [activeSection, setActiveSection] = useState<DocumentationSection>('overview')

// Search and filter state
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState<IconCategory>('all')

// Modal and feedback state
const [selectedIcon, setSelectedIcon] = useState<IconItem | null>(null)
const [copiedCode, setCopiedCode] = useState<string | null>(null)
```

### Computed Values

Components use `useMemo` for performance optimization:

```typescript
const filteredIcons = useMemo(() => {
  return icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory
    return matchesSearch && matchesCategory
  })
}, [searchTerm, selectedCategory])
```

## Event Handlers

### Navigation Events

```typescript
const handleSectionChange = (section: DocumentationSection) => {
  setActiveSection(section)
}
```

### Search Events

```typescript
const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(event.target.value)
}
```

### Copy Events

```typescript
const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    setCopiedCode(text)
    setTimeout(() => setCopiedCode(null), 2000)
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}
```

## Styling API

### CSS Classes

Components use Tailwind CSS utility classes with custom theme variables:

```css
/* Custom theme variables */
--surface-primary: var(--premitives-color-light-gray-2000)
--text-primary: var(--premitives-color-darkgray-900)
--border-primary: var(--premitives-color-light-gray-300)

/* Component-specific classes */
.documentation-dashboard {
  @apply min-h-screen bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-tertiary
}

.icon-gallery-item {
  @apply cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105
}
```

### Responsive Design

Components implement mobile-first responsive design:

```typescript
// Grid layouts
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"

// Flex layouts  
className="flex flex-col md:flex-row gap-4"

// Text sizing
className="text-sm md:text-base lg:text-lg"
```

## Error Handling

### Clipboard API Errors

```typescript
try {
  await navigator.clipboard.writeText(text)
  // Success feedback
} catch (err) {
  console.error('Failed to copy: ', err)
  // Fallback or user notification
}
```

### Component Error Boundaries

Components include error handling for:

- Missing icon components
- Invalid theme variables
- Clipboard API failures
- Network errors (if applicable)

## Performance Considerations

### Optimization Strategies

1. **Memoization**: Use `useMemo` for expensive computations
2. **Lazy Loading**: Load components on demand
3. **Virtual Scrolling**: For large icon lists (future enhancement)
4. **Debounced Search**: Prevent excessive filtering operations

### Bundle Size

- Icons are tree-shakeable
- Components use dynamic imports where appropriate
- CSS is optimized with Tailwind's purge functionality

## Testing API

### Component Testing

```typescript
// Example test structure
describe('IconsGallery', () => {
  it('should render all icons', () => {
    // Test implementation
  })
  
  it('should filter icons by search term', () => {
    // Test implementation
  })
  
  it('should copy code to clipboard', () => {
    // Test implementation
  })
})
```

### Integration Testing

```typescript
// Example integration test
describe('DocumentationDashboard', () => {
  it('should navigate between sections', () => {
    // Test implementation
  })
})
```

---

*This API reference is automatically generated and should be updated when components change.*
