# Chat Theme Implementation

## Overview
This document describes the theme implementation for the chat screen and its components in the Midora AI frontend application.

## Theme System Architecture

### 1. Theme Provider
- **Location**: `src/components/theme-provider.tsx`
- **Purpose**: Provides theme context and state management for light/dark mode switching
- **Key Features**:
  - Theme state management (light/dark)
  - Theme persistence in localStorage
  - DOM attribute management (`data-theme="dark"`)

### 2. CSS Variables System
- **Location**: `src/app/globals.css`
- **Structure**: 
  - Light theme variables defined in `:root`
  - Dark theme variables defined in `[data-theme="dark"]`
  - Semantic color tokens for consistent theming

### 3. Theme Integration
- **Layout**: `src/app/layout.tsx` - ThemeProvider wraps the entire application
- **Initialization**: `src/components/ui/theme-initializer.tsx` - Handles theme initialization on app load

## Chat Components Theme Integration

### Updated Components

#### 1. ChatScreen (`src/components/chat/chat-screen.tsx`)
- **Background**: Uses `bg-tokens-color-surface-surface-primary`
- **Theme Support**: Automatically adapts to light/dark theme

#### 2. ChatInterface (`src/components/chat/sections/chat-interface.tsx`)
- **Header Elements**: All colors use theme-aware CSS variables
- **Theme Toggle**: Added for testing theme switching
- **Hover States**: Use theme-aware surface colors

#### 3. NavigationSidebar (`src/components/chat/sections/navigation-sidebar.tsx`)
- **Background**: Uses `bg-tokens-color-surface-surface-neutral`
- **Interactive Elements**: All hover states use theme-aware colors
- **Icon Colors**: Tool icons use theme-aware brand colors
- **Text Colors**: All text uses theme-aware color variables

#### 4. ModelSelection (`src/components/chat/sections/model-selection.tsx`)
- **Background**: Uses `bg-tokens-color-surface-surface-button-pressed`
- **Text Colors**: Uses theme-aware text color variables

#### 5. MessageInput (`src/components/chat/sections/message-input.tsx`)
- **Background**: Uses `bg-tokens-color-surface-surface-neutral`
- **Text Colors**: Uses theme-aware text color variables

## CSS Variables Used

### Surface Colors
- `--tokens-color-surface-surface-primary`: Main background color
- `--tokens-color-surface-surface-secondary`: Secondary background (hover states)
- `--tokens-color-surface-surface-tertiary`: Tertiary background (selected states)
- `--tokens-color-surface-surface-neutral`: Neutral background (cards, inputs)
- `--tokens-color-surface-surface-button`: Button background
- `--tokens-color-surface-surface-button-pressed`: Pressed button state

### Text Colors
- `--tokens-color-text-text-primary`: Primary text color
- `--tokens-color-text-text-secondary`: Secondary text color
- `--tokens-color-text-text-neutral`: Neutral text color (white in light, dark in dark)
- `--tokens-color-text-text-brand`: Brand/accent text color
- `--tokens-color-text-text-inactive-2`: Inactive/muted text color

### Border Colors
- `--tokens-color-border-border-inactive`: Default border color
- `--tokens-color-border-border-active`: Active/focused border color

## Theme Toggle Component

### Location
- `src/components/ui/theme-toggle.tsx`

### Features
- Uses existing icons (Lightbulb for dark mode, MinusSquare for light mode)
- Integrates with IconButton component
- Provides accessibility labels
- Currently added to chat interface for testing

## Color Scheme

### Light Theme
- **Primary Background**: White (`#ffffff`)
- **Secondary Background**: Light gray (`#f2f2f2`)
- **Brand Colors**: Purple (`#5E4D74`)
- **Text Colors**: Dark gray (`#293241`) for primary text

### Dark Theme
- **Primary Background**: Dark purple (`#1F1740`)
- **Secondary Background**: Darker purple (`#0f0f23`)
- **Brand Colors**: Light purple (`#5E4D74`)
- **Text Colors**: White (`#ffffff`) for primary text

## Implementation Notes

1. **No Hardcoded Colors**: All hardcoded colors (like `bg-gray-50`, `text-purple-600`) have been replaced with theme-aware CSS variables.

2. **Consistent Naming**: All CSS variables follow the `tokens-color-*` naming convention for consistency.

3. **Theme Switching**: The theme system uses `data-theme="dark"` attribute instead of CSS classes for better performance.

4. **Backward Compatibility**: Existing color variables are maintained for backward compatibility.

5. **Testing**: A theme toggle button has been added to the chat interface for testing theme switching functionality.

## Usage

### For Developers
1. Always use CSS variables instead of hardcoded colors
2. Test components in both light and dark themes
3. Use the theme toggle for testing theme switching
4. Follow the established naming conventions for new color variables

### For Users
- Theme preference is automatically saved in localStorage
- Theme switching is instant and applies to all chat components
- Default theme is light mode
- Theme toggle is available in the chat interface header

## Future Enhancements

1. **System Theme Detection**: Automatically detect user's system theme preference
2. **More Theme Options**: Add additional theme variants (e.g., high contrast)
3. **Theme Persistence**: Ensure theme persists across browser sessions
4. **Component Library**: Extend theme support to all UI components
5. **Animation**: Add smooth transitions between theme changes
