# Component Library Documentation

This document provides comprehensive documentation for all UI components in the Midora AI Frontend application.

## 🎯 Overview

The component library is built with:
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **class-variance-authority (cva)** for variant management
- **Accessibility** best practices
- **Responsive design** principles

## 🏗️ Component Architecture

### Component Structure
```
src/components/
├── ui/                    # Base UI components
│   ├── Button.tsx        # Button component
│   ├── LoadingSpinner.tsx # Loading indicators
│   ├── ErrorDisplay.tsx  # Error handling
│   └── NotFoundDisplay.tsx # 404 displays
├── forms/                # Form components
├── layout/               # Layout components
└── shared/               # Shared components
```

### Design Principles
- **Composable**: Components can be combined and nested
- **Configurable**: Props allow customization
- **Accessible**: ARIA labels and keyboard navigation
- **Responsive**: Mobile-first design approach
- **Consistent**: Unified design language

## 🎨 UI Components

### Button Component

A versatile button component with multiple variants and sizes.

#### Props
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  className?: string
  children?: React.ReactNode
}
```

#### Variants
- **primary**: Blue background with white text
- **secondary**: Gray background with white text
- **outline**: Transparent with colored border
- **ghost**: Transparent with hover effects
- **destructive**: Red background for dangerous actions

#### Sizes
- **sm**: Small button (h-9, px-3)
- **md**: Medium button (h-10, px-4) - Default
- **lg**: Large button (h-12, px-8)
- **xl**: Extra large button

#### Usage Examples

```tsx
// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary" size="lg">
  Primary Button
</Button>

<Button variant="outline" onClick={handleClick}>
  Outline Button
</Button>

// Loading state
<Button loading disabled>
  Processing...
</Button>

// Form submission
<Button type="submit" variant="primary">
  Submit Form
</Button>
```

#### Styling
The Button component uses Tailwind CSS classes and supports:
- Hover effects
- Focus states with ring
- Disabled states
- Loading animations
- Custom className overrides

### LoadingSpinner Component

A configurable loading spinner for async operations.

#### Props
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'default' | 'secondary' | 'white'
  className?: string
}
```

#### Sizes
- **sm**: 16x16 pixels
- **md**: 24x24 pixels - Default
- **lg**: 32x32 pixels
- **xl**: 48x48 pixels

#### Colors
- **default**: Primary brand color
- **secondary**: Secondary color
- **white**: White color for dark backgrounds

#### Usage Examples

```tsx
// Basic usage
<LoadingSpinner />

// Different sizes
<LoadingSpinner size="lg" />
<LoadingSpinner size="sm" />

// Different colors
<LoadingSpinner color="white" />
<LoadingSpinner color="secondary" />

// With custom styling
<LoadingSpinner className="text-blue-500" />
```

### ErrorDisplay Component

A comprehensive error display component for error boundaries.

#### Props
```typescript
interface ErrorDisplayProps {
  error: Error
  onReset: () => void
  title?: string
  message?: string
}
```

#### Features
- Error icon and styling
- Customizable title and message
- Error details in development mode
- Action buttons (Try Again, Go Home)
- Responsive design

#### Usage Examples

```tsx
// Basic usage
<ErrorDisplay 
  error={error}
  onReset={handleReset}
/>

// With custom messages
<ErrorDisplay 
  error={error}
  onReset={handleReset}
  title="Something went wrong!"
  message="We encountered an unexpected error."
/>
```

### NotFoundDisplay Component

A 404 page component for missing routes.

#### Props
```typescript
interface NotFoundDisplayProps {
  title?: string
  message?: string
  backUrl?: string
}
```

#### Features
- 404 icon and styling
- Customizable title and message
- Navigation buttons (Go Back, Go Home)
- Responsive design

#### Usage Examples

```tsx
// Basic usage
<NotFoundDisplay />

// With custom content
<NotFoundDisplay 
  title="Page Not Found"
  message="The page you're looking for doesn't exist."
  backUrl="/dashboard"
/>
```

## 🎭 Page Components

### WelcomeHero Component

The main hero section for the homepage.

#### Features
- Gradient background
- Welcome message with gradient text
- Feature highlights
- Call-to-action buttons
- Responsive grid layout

#### Usage
```tsx
import { WelcomeHero } from '@/components/ui/WelcomeHero'

export default function HomePage() {
  return (
    <main>
      <WelcomeHero />
      {/* Other content */}
    </main>
  )
}
```

### FeatureGrid Component

Displays application features in a responsive grid.

#### Features
- 6 feature cards
- Icons and descriptions
- Hover effects
- Responsive layout (1-3 columns)

#### Usage
```tsx
import { FeatureGrid } from '@/components/ui/FeatureGrid'

export default function HomePage() {
  return (
    <main>
      <WelcomeHero />
      <FeatureGrid />
      {/* Other content */}
    </main>
  )
}
```

### CallToAction Component

Bottom call-to-action section for the homepage.

#### Features
- Gradient background
- Action buttons
- Company information
- Responsive design

## 🎨 Styling System

### CSS Classes
Components use Tailwind CSS utility classes with custom extensions:

```css
/* Custom component classes */
.btn {
  @apply inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply btn bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl;
}
```

### Color Palette
```css
:root {
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-900: #1e3a8a;
  
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-500: #64748b;
  --secondary-600: #475569;
  --secondary-700: #334155;
  --secondary-900: #0f172a;
}
```

### Spacing System
```css
:root {
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;
}
```

### Typography
```css
:root {
  --font-family-sans: 'Inter', system-ui, sans-serif;
}
```

## ♿ Accessibility Features

### ARIA Labels
- Proper button roles
- Loading states
- Error descriptions
- Navigation landmarks

### Keyboard Navigation
- Tab order
- Focus indicators
- Keyboard shortcuts
- Screen reader support

### Color Contrast
- WCAG AA compliance
- High contrast ratios
- Color-blind friendly

## 📱 Responsive Design

### Breakpoints
```css
/* Tailwind breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile-First Approach
- Base styles for mobile
- Progressive enhancement
- Touch-friendly interactions
- Optimized layouts

## 🔧 Customization

### Theme Overrides
```typescript
// Custom button variants
const customButtonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        custom: 'bg-custom-color text-white',
      },
      size: {
        custom: 'h-16 px-12',
      },
    },
  }
)
```

### CSS Custom Properties
```css
:root {
  --component-border-radius: 0.75rem;
  --component-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## 🧪 Testing Components

### Component Testing
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="primary">Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-600')
  })
})
```

### Accessibility Testing
```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should not have accessibility violations', async () => {
  const { container } = render(<Button>Button</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## 📚 Best Practices

### Component Design
1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: Define clear TypeScript interfaces
3. **Default Values**: Provide sensible defaults
4. **Error Handling**: Graceful fallbacks for edge cases

### Performance
1. **Memoization**: Use React.memo for expensive components
2. **Lazy Loading**: Dynamic imports for heavy components
3. **Bundle Size**: Minimize dependencies
4. **Tree Shaking**: ES6 modules for better optimization

### Accessibility
1. **Semantic HTML**: Use proper HTML elements
2. **ARIA Labels**: Provide context for screen readers
3. **Keyboard Navigation**: Full keyboard support
4. **Color Contrast**: Meet WCAG guidelines

## 🔄 Component Updates

### Version History
- **v0.1.0**: Initial component library
- **v0.2.0**: Added variant system
- **v0.3.0**: Enhanced accessibility
- **v0.4.0**: Performance optimizations

### Migration Guide
When updating components:
1. Check breaking changes
2. Update prop interfaces
3. Test existing usage
4. Update documentation

---

**Last Updated**: December 2024  
**Version**: 0.1.0  
**Maintainer**: Midora AI Team
