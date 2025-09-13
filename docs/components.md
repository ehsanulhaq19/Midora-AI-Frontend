# Midora AI Platform - Component Library

## Overview

The Midora AI Platform component library provides a comprehensive set of reusable UI components built with React, TypeScript, and Tailwind CSS. All components follow consistent design patterns and are fully responsive.

## Component Categories

### 1. Layout Components

#### Header
**File**: `src/components/ui/Header.tsx`

The main navigation header with logo, navigation menu, and authentication buttons.

**Features**:
- Fixed positioning with backdrop blur
- Responsive navigation menu
- Mobile hamburger menu
- Login and signup buttons
- Brand logo with gradient text

**Props**: None (self-contained)

**Usage**:
```tsx
import { Header } from '@/components/ui/Header'

export default function Layout() {
  return (
    <div>
      <Header />
      {/* Other content */}
    </div>
  )
}
```

**Styling Classes**:
- `.bg-white/80` - Semi-transparent white background
- `.backdrop-blur-md` - Backdrop blur effect
- `.border-primary-100` - Primary color border

#### Footer
**File**: `src/components/ui/Footer.tsx`

Comprehensive footer with navigation links, social media, and company information.

**Features**:
- Multi-column navigation layout
- Social media links
- Company branding
- Legal links
- System status indicator

**Props**: None (self-contained)

**Usage**:
```tsx
import { Footer } from '@/components/ui/Footer'

export default function Layout() {
  return (
    <div>
      {/* Main content */}
      <Footer />
    </div>
  )
}
```

**Styling Classes**:
- `.bg-neutral-900` - Dark background
- `.gradient-text` - Gradient text effect
- `.text-neutral-300` - Light text color

### 2. Hero Components

#### MidoraHero
**File**: `src/components/ui/MidoraHero.tsx`

The main hero section showcasing the platform's capabilities and call-to-action.

**Features**:
- Gradient background with animated elements
- Main headline with gradient text
- Call-to-action buttons
- Feature highlights
- Trust indicators
- Animated background elements

**Props**: None (self-contained)

**Usage**:
```tsx
import { MidoraHero } from '@/components/ui/MidoraHero'

export default function HomePage() {
  return (
    <main>
      <MidoraHero />
      {/* Other sections */}
    </main>
  )
}
```

**Styling Classes**:
- `.bg-gradient-hero` - Hero background gradient
- `.gradient-text` - Gradient text effect
- `.animate-float` - Floating animation
- `.bg-grid-pattern` - Grid pattern background

### 3. Feature Components

#### AIFeatures
**File**: `src/components/ui/AIFeatures.tsx`

Comprehensive feature showcase for AI models, tools, and market intelligence.

**Features**:
- AI Models section (OpenAI, Gemini, Claude, DeepSeek)
- AI Tools section (Detection, Plagiarism, Humanizer, Analyzer)
- Market Tools section (Stock Alerts, Analysis, Portfolio, Risk)
- Responsive grid layout
- Icon-based feature cards

**Props**: None (self-contained)

**Usage**:
```tsx
import { AIFeatures } from '@/components/ui/AIFeatures'

export default function HomePage() {
  return (
    <main>
      <MidoraHero />
      <AIFeatures />
      {/* Other sections */}
    </main>
  )
}
```

**Styling Classes**:
- `.bg-gradient-features` - Features background gradient
- `.ai-card` - AI-themed card styling
- `.feature-icon` - Feature icon container

### 4. Call-to-Action Components

#### MidoraCTA
**File**: `src/components/ui/MidoraCTA.tsx`

Engaging call-to-action section with multiple CTAs and social proof.

**Features**:
- Gradient background with pattern overlay
- Multiple call-to-action buttons
- Feature highlights
- Social proof indicators
- Trust signals

**Props**: None (self-contained)

**Usage**:
```tsx
import { MidoraCTA } from '@/components/ui/MidoraCTA'

export default function HomePage() {
  return (
    <main>
      <MidoraHero />
      <AIFeatures />
      <MidoraCTA />
      {/* Other sections */}
    </main>
  )
}
```

**Styling Classes**:
- `.bg-gradient-midora` - Midora gradient background
- `.bg-dots-pattern` - Dots pattern overlay
- `.animate-fade-in` - Fade in animation

### 5. Authentication Components

#### LoginForm
**File**: `src/components/auth/LoginForm.tsx`

The main login form component with email/password authentication and Google OAuth.

**Features**:
- Email and password fields
- Form validation
- Google OAuth integration
- Error handling
- Loading states
- Navigation to signup

**Props**:
```typescript
interface LoginFormProps {
  className?: string
  onLogin?: (credentials: { email: string; password: string }) => void
  onGoogleLogin?: () => void
  onSignupClick?: () => void
  loading?: boolean
}
```

**Usage**:
```tsx
import { LoginForm } from '@/components/auth/LoginForm'

<LoginForm
  onLogin={handleLogin}
  onGoogleLogin={handleGoogleLogin}
  onSignupClick={handleSignupClick}
  loading={isLoading}
/>
```

**Form Validation**:
- Email format validation
- Password length requirement (minimum 6 characters)
- Required field validation
- Real-time error clearing

**Styling Features**:
- Gradient background
- Glass morphism effect
- Responsive design
- Consistent with theme system

#### SignupForm
**File**: `src/components/auth/SignupForm.tsx`

The signup form component for new user registration.

**Features**:
- Full name, email, password, and confirm password fields
- Comprehensive form validation
- Google OAuth integration
- Terms of service and privacy policy links
- Navigation to login

**Props**:
```typescript
interface SignupFormProps {
  className?: string
  onSignup?: (data: { email: string; password: string; confirmPassword: string; name: string }) => void
  onGoogleSignup?: () => void
  onLoginClick?: () => void
  loading?: boolean
}
```

**Usage**:
```tsx
import { SignupForm } from '@/components/auth/SignupForm'

<SignupForm
  onSignup={handleSignup}
  onGoogleSignup={handleGoogleSignup}
  onLoginClick={handleLoginClick}
  loading={isLoading}
/>
```

#### WelcomeOnboardingSection
**File**: `src/components/auth/welcome-onboarding-section.tsx`

The welcome onboarding section component that introduces users to Midora AI features during the signup process.

**Features**:
- Brand logo display
- Welcome message with AI partner introduction
- Feature highlights with icons (document summarization, creative content, task automation, AI collaboration)
- Privacy notice with clickable privacy section link
- Continue button for email signup
- Footer with privacy policy link
- Full-screen responsive design
- i18n support for all text content

**Props**:
```typescript
interface WelcomeOnboardingSectionProps {
  onContinue: () => void
  onPrivacyClick: () => void
  className?: string
}
```

**Usage**:
```tsx
import { WelcomeOnboardingSection } from '@/components/auth'

<WelcomeOnboardingSection 
  onContinue={handleContinue}
  onPrivacyClick={handlePrivacyClick}
/>
```

**Features Displayed**:
- Document summarization (Paperclip icon)
- Creative content generation (Lightbulb icon)
- Task automation (Lightning icon)
- AI collaboration (Grid icon)

**Styling Classes**:
- `.bg-tokens-color-surface-surface-primary` - Primary surface background
- `.text-tokens-color-text-text-seconary` - Secondary text color
- `.text-tokens-color-text-text-inactive-2` - Inactive text color
- `.bg-tokens-color-surface-surface-button-pressed` - Button background

**Form Validation**:
- Name requirement
- Email format validation
- Password strength (minimum 6 characters)
- Password confirmation matching
- Required field validation

### 6. Base UI Components

#### Input
**File**: `src/components/ui/Input.tsx`

A versatile form input component with validation support and multiple variants.

**Features**:
- Multiple input types (text, email, password, etc.)
- Built-in validation error display
- Helper text support
- Multiple sizes (sm, default, lg)
- Variants (default, error, success)
- Accessible labels and error messages

**Props**:
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'error' | 'success'
  size?: 'sm' | 'default' | 'lg'
}
```

**Usage**:
```tsx
import { Input } from '@/components/ui/Input'

<Input
  type="email"
  label="Email Address"
  placeholder="Enter your email"
  error={errors.email}
  helperText="We'll never share your email"
/>
```

**Styling Classes**:
- `.rounded-lg` - Rounded corners
- `.border-neutral-200` - Default border color
- `.focus-visible:ring-2` - Focus ring styling
- `.text-sm` - Consistent typography

#### Card
**File**: `src/components/ui/Card.tsx`

A flexible card component system for creating consistent layouts.

**Features**:
- Multiple card sections (header, content, footer)
- Consistent spacing and typography
- Responsive design
- Shadow and border styling

**Components**:
- `Card` - Main container
- `CardHeader` - Header section with title and description
- `CardTitle` - Card title with proper typography
- `CardDescription` - Descriptive text below title
- `CardContent` - Main content area
- `CardFooter` - Footer section for actions

**Usage**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

**Styling Classes**:
- `.rounded-xl` - Extra large border radius
- `.border-neutral-200` - Subtle border
- `.shadow-sm` - Light shadow
- `.bg-white` - Clean white background

#### Separator
**File**: `src/components/ui/Separator.tsx`

A visual separator component for dividing content sections.

**Features**:
- Horizontal and vertical orientations
- Accessible ARIA attributes
- Customizable styling
- Decorative and semantic modes

**Props**:
```typescript
interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  className?: string
}
```

**Usage**:
```tsx
import { Separator } from '@/components/ui/Separator'

<Separator orientation="horizontal" className="my-4" />
```

#### Button
**File**: `src/components/ui/buttons.tsx`

Versatile button component with multiple variants and sizes.

**Features**:
- Multiple variants (default, destructive, outline, secondary, ghost, link)
- Multiple sizes (default, sm, lg, icon)
- TypeScript support with proper typing
- Class variance authority for variants
- Forwarded ref support

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
}
```

**Usage**:
```tsx
import { Button } from '@/components/ui/Button'

export default function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="lg">
        Primary Button
      </Button>
      <Button variant="outline" size="sm">
        Outline Button
      </Button>
      <Button variant="ghost">
        Ghost Button
      </Button>
    </div>
  )
}
```

**Variants**:
- **default**: Primary button with primary colors
- **destructive**: Red button for destructive actions
- **outline**: Outlined button with primary colors
- **secondary**: Secondary button with secondary colors
- **ghost**: Transparent button with hover effects
- **link**: Link-style button with underline

**Sizes**:
- **default**: Standard button size
- **sm**: Small button size
- **lg**: Large button size
- **icon**: Square button for icons

#### LoadingSpinner
**File**: `src/components/ui/loading-spinner.tsx`

Configurable loading spinner component.

**Features**:
- Multiple sizes
- Customizable colors
- Smooth animations
- Accessible loading states

**Props**:
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}
```

**Usage**:
```tsx
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function MyComponent() {
  return (
    <div>
      <LoadingSpinner size="lg" />
      <LoadingSpinner size="md" />
      <LoadingSpinner size="sm" />
    </div>
  )
}
```

#### ErrorDisplay
**File**: `src/components/ui/error-display.tsx`

Error boundary display component for graceful error handling.

**Features**:
- Error message display
- Retry functionality
- User-friendly error presentation
- Fallback UI

**Props**:
```typescript
interface ErrorDisplayProps {
  error?: Error
  resetError?: () => void
}
```

**Usage**:
```tsx
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'

export default function MyComponent() {
  return (
    <ErrorDisplay 
      error={new Error('Something went wrong')}
      resetError={() => window.location.reload()}
    />
  )
}
```

#### NotFoundDisplay
**File**: `src/components/ui/not-found-display.tsx`

404 page display component.

**Features**:
- User-friendly 404 message
- Navigation options
- Consistent styling
- Responsive design

**Props**: None (self-contained)

**Usage**:
```tsx
import { NotFoundDisplay } from '@/components/ui/NotFoundDisplay'

export default function NotFoundPage() {
  return <NotFoundDisplay />
}
```

## Component Styling

### Design System Integration

All components use the Midora AI theme system defined in `src/lib/theme.ts`:

- **Colors**: Primary and secondary purple palettes
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 8px grid system
- **Shadows**: Consistent shadow system
- **Transitions**: Smooth animations and hover effects

### Custom CSS Classes

The following custom CSS classes are available in `src/app/globals.css`:

#### Button Classes
- `.btn` - Base button styles
- `.btn-primary` - Primary button variant
- `.btn-secondary` - Secondary button variant
- `.btn-outline` - Outline button variant
- `.btn-ghost` - Ghost button variant
- `.btn-accent` - Accent button variant

#### Card Classes
- `.card` - Base card styles
- `.card-hover` - Hover effects for cards
- `.ai-card` - AI-themed card styling

#### Utility Classes
- `.gradient-text` - Gradient text effect
- `.glass-effect` - Glass morphism effect
- `.floating-element` - Floating animation
- `.glow-effect` - Glowing animation

#### Animation Classes
- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up animation
- `.animate-slide-down` - Slide down animation
- `.animate-scale-in` - Scale in animation
- `.animate-bounce-gentle` - Gentle bounce animation
- `.animate-float` - Floating animation
- `.animate-glow` - Glowing animation

## Responsive Design

All components are built with mobile-first responsive design:

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- **Grid Systems**: Responsive grid layouts using Tailwind CSS
- **Typography**: Responsive font sizing
- **Spacing**: Responsive spacing and margins
- **Navigation**: Mobile-friendly navigation patterns

## Accessibility

Components include accessibility features:

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Semantic HTML**: Proper HTML structure
- **Color Contrast**: WCAG compliant color ratios

## Performance

Components are optimized for performance:

- **Code Splitting**: Dynamic imports where appropriate
- **Lazy Loading**: Components load when needed
- **Optimized Images**: Next.js Image component usage
- **Minimal Re-renders**: Efficient React patterns
- **Bundle Optimization**: Tree shaking and code splitting

## Testing

Components include testing support:

- **Unit Tests**: Jest and Testing Library setup
- **Component Tests**: Isolated component testing
- **Accessibility Tests**: Screen reader and keyboard testing
- **Visual Regression**: Component visual testing

## Customization

### Theme Customization

To customize component appearance:

1. **Modify Theme File**: Update `src/lib/theme.ts`
2. **Update Tailwind Config**: Sync changes in `tailwind.config.js`
3. **Update CSS Variables**: Modify `src/app/globals.css`
4. **Test Changes**: Ensure components render correctly

### Component Variants

To add new component variants:

1. **Update Component**: Add new variant to component
2. **Update Types**: Add variant to TypeScript interface
3. **Add Styles**: Include new variant styles
4. **Update Tests**: Add tests for new variant
5. **Document**: Update this documentation

## Best Practices

1. **Consistent Naming**: Use consistent naming conventions
2. **TypeScript**: Always include proper type definitions
3. **Props Interface**: Define clear props interfaces
4. **Default Props**: Provide sensible defaults
5. **Error Handling**: Include proper error boundaries
6. **Accessibility**: Ensure ARIA compliance
7. **Performance**: Optimize for performance
8. **Testing**: Include comprehensive tests
9. **Documentation**: Document all props and usage
10. **Responsive**: Ensure mobile-first design

## Examples

### 7. Icon Components

#### Paperclip
**File**: `src/icons/paperclip.tsx`

Paperclip icon component for document-related features.

**Features**:
- SVG-based icon
- Customizable className
- TypeScript support
- Consistent sizing (24x24)

**Props**:
```typescript
interface PaperclipProps {
  className?: string
}
```

**Usage**:
```tsx
import { Paperclip } from '@/icons'

<Paperclip className="w-6 h-6 text-gray-600" />
```

#### Lightbulb
**File**: `src/icons/lightbulb.tsx`

Lightbulb icon component for creative and idea-related features.

**Features**:
- SVG-based icon
- Customizable className
- TypeScript support
- Consistent sizing (24x24)

**Props**:
```typescript
interface LightbulbProps {
  className?: string
}
```

**Usage**:
```tsx
import { Lightbulb } from '@/icons'

<Lightbulb className="w-6 h-6 text-gray-600" />
```

#### Lightning
**File**: `src/icons/lightning.tsx`

Lightning icon component for speed and automation features.

**Features**:
- SVG-based icon
- Customizable className
- TypeScript support
- Consistent sizing (24x24)

**Props**:
```typescript
interface LightningProps {
  className?: string
}
```

**Usage**:
```tsx
import { Lightning } from '@/icons'

<Lightning className="w-6 h-6 text-gray-600" />
```

#### Grid
**File**: `src/icons/grid.tsx`

Grid icon component for organization and collaboration features.

**Features**:
- SVG-based icon
- Customizable className
- TypeScript support
- Consistent sizing (24x24)

**Props**:
```typescript
interface GridProps {
  className?: string
}
```

**Usage**:
```tsx
import { Grid } from '@/icons'

<Grid className="w-6 h-6 text-gray-600" />
```

### Complete Page Example

```tsx
import { Header } from '@/components/ui/Header'
import { MidoraHero } from '@/components/ui/MidoraHero'
import { AIFeatures } from '@/components/ui/AIFeatures'
import { MidoraCTA } from '@/components/ui/MidoraCTA'
import { Footer } from '@/components/ui/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <MidoraHero />
      <AIFeatures />
      <MidoraCTA />
      <Footer />
    </main>
  )
}
```

### Custom Component Example

```tsx
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface CustomFeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  loading?: boolean
  onAction?: () => void
}

export function CustomFeatureCard({
  title,
  description,
  icon,
  loading = false,
  onAction
}: CustomFeatureCardProps) {
  return (
    <div className="ai-card">
      <div className="feature-icon mb-4">
        {loading ? <LoadingSpinner size="sm" /> : icon}
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-text-secondary mb-4">
        {description}
      </p>
      {onAction && (
        <Button 
          variant="primary" 
          size="sm" 
          onClick={onAction}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Learn More'}
        </Button>
      )}
    </div>
  )
}
```

## Support

For questions about components or to request new features:

- **Documentation**: Check this component documentation
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join conversations in GitHub Discussions
- **Contributing**: Submit pull requests for improvements