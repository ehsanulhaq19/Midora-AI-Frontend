# Page-Based Multi-Step Signup Implementation

## Overview

This document describes the implementation of a page-based multi-step signup flow for the Midora AI frontend. The implementation uses separate Next.js pages with smooth transitions and no page reloads, providing a seamless user experience.

## Architecture

### Page Structure

```
src/app/(auth)/signup/
├── page.tsx                    # Main signup page (email input)
├── layout.tsx                  # Layout with page transitions
├── welcome/
│   ├── page.tsx               # Welcome step page
│   └── loading.tsx            # Loading state
├── full-name/
│   ├── page.tsx               # Full name step page
│   └── loading.tsx            # Loading state
├── profession/
│   ├── page.tsx               # Profession step page
│   └── loading.tsx            # Loading state
└── success/
    ├── page.tsx               # Success completion page
    └── loading.tsx            # Loading state
```

### Flow Diagram

```
/signup → /signup/welcome → /signup/full-name → /signup/profession → /signup/success
   ↓            ↓                ↓                   ↓                ↓
Email      Welcome Screen    Full Name Input    Profession Input   Success Page
Input      (Success Msg)     (with Back)        (with Back)        (Redirect)
```

## Key Features

### 1. Separate Pages
- Each step is a separate Next.js page
- No page reloads - uses Next.js App Router
- Clean URLs for each step
- Independent loading states

### 2. Smooth Page Transitions
- Custom `PageTransition` component
- Sliding animations between pages
- Direction-aware transitions (left/right)
- 500ms duration with ease-in-out

### 3. State Management
- Custom `useSignupData` hook
- SessionStorage persistence
- Automatic data synchronization
- Clean data management

### 4. Navigation Flow
- Forward navigation with right slide
- Backward navigation with left slide
- Proper URL routing
- Browser back button support

## Implementation Details

### Page Transition Component

```typescript
// src/components/ui/page-transition.tsx
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')

  // Determines slide direction based on step progression
  const getStepNumber = (path: string): number => {
    if (path.includes('/welcome')) return 1
    if (path.includes('/full-name')) return 2
    if (path.includes('/profession')) return 3
    return 0
  }

  // Applies appropriate transform classes
  const getTransformClass = () => {
    if (isVisible) {
      return 'opacity-100 transform translate-x-0'
    } else {
      return slideDirection === 'right' 
        ? 'opacity-0 transform translate-x-full'
        : 'opacity-0 transform -translate-x-full'
    }
  }
}
```

### State Management Hook

```typescript
// src/hooks/use-signup-data.ts
export const useSignupData = () => {
  const [data, setData] = useState<SignupData>({
    email: '',
    fullName: '',
    profession: ''
  })

  // Automatic sessionStorage synchronization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data])

  const updateData = (updates: Partial<SignupData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const clearData = () => {
    setData({ email: '', fullName: '', profession: '' })
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  return { data, updateData, clearData, isComplete }
}
```

### Individual Page Components

Each page follows a consistent pattern:

```typescript
// Example: src/app/(auth)/signup/full-name/page.tsx
export default function FullNamePage() {
  const router = useRouter()
  const { updateData } = useSignupData()

  const handleNext = (fullName: string) => {
    updateData({ fullName })
    router.push('/signup/profession')
  }

  const handleBack = () => {
    router.push('/signup/welcome')
  }

  return (
    <div className="relative min-h-screen w-full bg-[color:var(--tokens-color-surface-surface-primary)]">
      {/* Header with Logo */}
      <header>...</header>
      
      {/* Main Content */}
      <main className="w-full flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[408px]">
          <FullNameStep onNext={handleNext} onBack={handleBack} />
        </div>
      </main>
    </div>
  )
}
```

## User Experience

### Navigation Flow

1. **Email Input** (`/signup`)
   - User enters email
   - Validation occurs
   - Data stored in sessionStorage
   - Navigate to `/signup/welcome`

2. **Welcome Screen** (`/signup/welcome`)
   - Success message displayed
   - Next button to continue
   - Navigate to `/signup/full-name`

3. **Full Name Input** (`/signup/full-name`)
   - Full name input field
   - Back button to welcome
   - Next button to profession
   - Navigate to `/signup/profession`

4. **Profession Input** (`/signup/profession`)
   - Profession input field
   - Back button to full name
   - Next button to complete
   - Navigate to `/signup/success`

5. **Success Page** (`/signup/success`)
   - Completion confirmation
   - Auto-redirect to dashboard
   - Manual redirect option

### Animation Behavior

- **Forward Navigation**: Slides from right to left
- **Backward Navigation**: Slides from left to right
- **Page Load**: Fade in with slide
- **Duration**: 500ms with ease-in-out timing

## Technical Benefits

### 1. SEO Friendly
- Each step has its own URL
- Proper page structure
- Search engine crawlable

### 2. Browser Support
- Back button works correctly
- URL sharing possible
- Bookmarkable steps

### 3. Performance
- Code splitting per page
- Lazy loading of components
- Optimized bundle sizes

### 4. Maintainability
- Clear separation of concerns
- Independent page logic
- Easy to modify individual steps

## State Persistence

### SessionStorage Integration
- Data persists across page navigation
- Survives page refreshes
- Cleared on completion
- Automatic synchronization

### Data Flow
```
Email Input → SessionStorage → Welcome Page
     ↓              ↓              ↓
Full Name → SessionStorage → Profession Page
     ↓              ↓              ↓
Profession → SessionStorage → Success Page
     ↓              ↓              ↓
Completion → Clear Storage → Dashboard
```

## Error Handling

### Validation
- Client-side validation on each step
- Real-time error feedback
- Prevents navigation with invalid data

### Error States
- Visual error indicators
- Clear error messages
- Easy error recovery

### Fallback Handling
- Loading states for each page
- Error boundaries
- Graceful degradation

## Accessibility

### ARIA Support
- Proper page titles
- Screen reader navigation
- Focus management
- Semantic HTML

### Keyboard Navigation
- Tab order preservation
- Enter key submission
- Escape key handling
- Focus indicators

## Testing Strategy

### Unit Tests
- Individual page components
- Custom hook functionality
- Validation logic
- State management

### Integration Tests
- Complete user flow
- Navigation between pages
- Data persistence
- Error scenarios

### E2E Tests
- Full signup process
- Browser back button
- URL navigation
- Cross-browser compatibility

## Performance Optimization

### Code Splitting
- Each page is code-split
- Lazy loading of components
- Reduced initial bundle size

### Caching
- SessionStorage caching
- Component memoization
- Optimized re-renders

### Loading States
- Skeleton screens
- Progressive loading
- Smooth transitions

## Future Enhancements

### Planned Features
- Progress indicator
- Step validation
- Offline support
- Analytics tracking

### Technical Improvements
- Server-side validation
- API integration
- Real-time updates
- Advanced animations

## Deployment Considerations

### Environment Variables
- API endpoints
- Feature flags
- Analytics keys

### Build Optimization
- Bundle analysis
- Image optimization
- CSS optimization

### Monitoring
- Error tracking
- Performance monitoring
- User analytics

## Troubleshooting

### Common Issues

1. **Page Not Loading**
   - Check route configuration
   - Verify component exports
   - Check for TypeScript errors

2. **Animation Not Working**
   - Verify CSS classes
   - Check transition timing
   - Ensure proper component mounting

3. **State Not Persisting**
   - Check sessionStorage availability
   - Verify hook implementation
   - Check for data serialization issues

4. **Navigation Issues**
   - Verify router configuration
   - Check for route conflicts
   - Ensure proper link handling

### Debug Mode

Enable debug logging:

```typescript
// In useSignupData hook
console.log('Signup data updated:', data)

// In PageTransition component
console.log('Page transition:', { pathname, slideDirection, isVisible })
```

## Conclusion

The page-based multi-step signup implementation provides a robust, scalable, and user-friendly solution for the signup process. It leverages Next.js App Router capabilities while maintaining smooth user experience through custom transitions and state management.

The implementation is production-ready and includes proper error handling, accessibility features, and performance optimizations. It can be easily extended with additional steps or modified to meet changing requirements.
