# Custom Cursor System

## Overview

The Custom Cursor System provides a unique mouse cursor experience with a mid-size dot and round circle design that follows the Midora AI platform's color scheme. The system includes a theme flag to enable/disable the custom cursor and provides user controls for toggling between custom and default cursor modes.

## Features

- **Custom Design**: Mid-size purple dot with white border and outer circle
- **Theme Integration**: Uses platform color scheme from theme configuration
- **Toggle Control**: Easy enable/disable functionality with visual feedback
- **Persistence**: User preference saved to localStorage
- **Performance**: Smooth animations with CSS transitions
- **Accessibility**: Maintains pointer functionality while hiding default cursor

## Architecture

### Core Components

#### CustomCursor
**File**: `src/components/ui/CustomCursor.tsx`

The main cursor component that renders the custom mouse cursor.

**Features**:
- Real-time mouse position tracking
- Smooth animations and transitions
- Theme-based styling
- Global cursor hiding

**Props**:
```tsx
interface CustomCursorProps {
  enabled?: boolean // Override theme setting
}
```

**Usage**:
```tsx
import { CustomCursor } from '@/components/ui/CustomCursor'

// In root layout or main component
<CustomCursor />
```

#### CursorToggle
**File**: `src/components/ui/CursorToggle.tsx`

A toggle button component for enabling/disabling the custom cursor.

**Features**:
- Visual state indication
- Smooth transitions
- Icon representation of cursor states
- Optional label display

**Props**:
```tsx
interface CursorToggleProps {
  className?: string // Additional CSS classes
  showLabel?: boolean // Show/hide text label
}
```

**Usage**:
```tsx
import { CursorToggle } from '@/components/ui/CursorToggle'

// Basic usage
<CursorToggle />

// With custom styling
<CursorToggle className="absolute top-4 right-4" showLabel={false} />
```

### Custom Hook

#### useCustomCursor
**File**: `src/hooks/useCustomCursor.ts`

A React hook for managing cursor state and persistence.

**Returns**:
```tsx
{
  isEnabled: boolean
  enable: () => void
  disable: () => void
  toggle: () => void
}
```

**Usage**:
```tsx
import { useCustomCursor } from '@/hooks/useCustomCursor'

function MyComponent() {
  const { isEnabled, toggle } = useCustomCursor()
  
  return (
    <button onClick={toggle}>
      {isEnabled ? 'Disable' : 'Enable'} Custom Cursor
    </button>
  )
}
```

## Theme Configuration

### Cursor Settings

The cursor configuration is defined in `src/lib/theme.ts`:

```tsx
cursor: {
  enabled: true, // Global enable/disable flag
  dot: {
    size: '8px',
    color: '#a855f7', // primary-500
    borderColor: '#ffffff',
    borderWidth: '2px',
  },
  circle: {
    size: '32px',
    color: 'rgba(168, 85, 247, 0.2)', // primary-500 with opacity
    borderColor: 'rgba(168, 85, 247, 0.4)',
    borderWidth: '1px',
  },
  animation: {
    duration: '150ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
}
```

### Color Scheme

The cursor uses the platform's primary color palette:
- **Dot**: Primary purple (`#a855f7`) with white border
- **Circle**: Semi-transparent primary purple with subtle border
- **Animations**: Smooth transitions using theme-defined timing

## Implementation Details

### Cursor Rendering

The custom cursor consists of two main elements:

1. **Inner Dot**: 8px purple circle with white border
2. **Outer Circle**: 32px semi-transparent circle with subtle border

### Position Tracking

- Uses `mousemove` event listener for real-time position updates
- Applies `transform: translate(-50%, -50%)` for proper centering
- Handles mouse enter/leave events for visibility control

### Performance Optimizations

- CSS transitions for smooth animations
- `pointer-events: none` to prevent interference
- Efficient event handling with proper cleanup
- Local storage for preference persistence

## Usage Examples

### Basic Implementation

```tsx
// In root layout
import { CustomCursor } from '@/components/ui/CustomCursor'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  )
}
```

### With Toggle Control

```tsx
import { CursorToggle } from '@/components/ui/CursorToggle'

function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <Logo />
      <CursorToggle />
    </header>
  )
}
```

### Custom Hook Usage

```tsx
import { useCustomCursor } from '@/hooks/useCustomCursor'

function SettingsPanel() {
  const { isEnabled, enable, disable } = useCustomCursor()
  
  return (
    <div className="space-y-4">
      <h3>Cursor Settings</h3>
      <div className="flex gap-2">
        <button onClick={enable} disabled={isEnabled}>
          Enable Custom Cursor
        </button>
        <button onClick={disable} disabled={!isEnabled}>
          Disable Custom Cursor
        </button>
      </div>
    </div>
  )
}
```

## Styling and Customization

### CSS Classes

The cursor uses Tailwind CSS classes for styling:
- `.fixed` - Fixed positioning
- `.pointer-events-none` - Prevents interaction
- `.z-[9999]` - High z-index for visibility
- `.transition-all` - Smooth transitions

### Custom Styling

To customize the cursor appearance, modify the theme configuration:

```tsx
// In theme.ts
cursor: {
  dot: {
    size: '12px', // Larger dot
    color: '#d946ef', // Different color
  },
  circle: {
    size: '48px', // Larger circle
    color: 'rgba(217, 70, 239, 0.1)', // Matching color
  },
}
```

## Browser Compatibility

- **Modern Browsers**: Full support (Chrome, Firefox, Safari, Edge)
- **Mobile Devices**: Automatically disabled (touch-based interaction)
- **Accessibility**: Maintains keyboard navigation support

## Troubleshooting

### Common Issues

1. **Cursor Not Visible**
   - Check if custom cursor is enabled in theme
   - Verify component is mounted in DOM
   - Check browser console for errors

2. **Performance Issues**
   - Ensure proper event cleanup in useEffect
   - Check for excessive re-renders
   - Verify CSS transitions are hardware-accelerated

3. **Styling Conflicts**
   - Check z-index values
   - Verify pointer-events settings
   - Ensure no conflicting CSS rules

### Debug Mode

Enable debug logging by setting environment variable:
```bash
NEXT_PUBLIC_DEBUG_CURSOR=true
```

## Future Enhancements

- **Cursor Variants**: Different cursor styles for different contexts
- **Animation Effects**: Hover effects and click animations
- **Context Awareness**: Different cursors for different UI states
- **Performance Monitoring**: Cursor performance metrics
- **Accessibility Features**: High contrast mode support

## Related Documentation

- [Theme System](./theme-system.md) - Platform theming and configuration
- [Component Library](./components.md) - UI component documentation
- [API Reference](./api.md) - Backend API documentation
