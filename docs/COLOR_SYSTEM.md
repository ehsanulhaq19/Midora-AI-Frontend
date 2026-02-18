# Midora AI Color System

This document describes the comprehensive color system implemented for the Midora AI frontend application, supporting both light and dark themes.

## Overview

The color system is built using CSS custom properties (variables) and is designed to be:
- **Theme-aware**: Automatically switches between light and dark themes (defaults to light)
- **Semantic**: Uses meaningful names for different use cases
- **Consistent**: Maintains visual consistency across the application
- **Accessible**: Ensures proper contrast ratios for readability
- **Extensible**: Easy to add new colors or modify existing ones

## Color Categories

### 1. Brand Colors
The core brand colors that represent Midora AI's identity:

```css
--brand-primary: #a855f7;        /* Primary purple */
--brand-secondary: #d946ef;      /* Secondary purple */
--brand-accent: #ec4899;         /* Accent pink */
--brand-80: rgba(55, 48, 163, 1); /* Legacy brand color */
```

### 2. Primitive Colors
Base color scales that form the foundation of the system:

#### Dark Purple Scale
```css
--primitive-dark-purple-1000: rgba(31, 23, 64, 1);
--primitive-dark-purple-900: rgba(31, 23, 64, 0.9);
--primitive-dark-purple-800: rgba(31, 23, 64, 0.8);
--primitive-dark-purple-600: rgba(31, 23, 64, 0.6);
--primitive-dark-purple-400: rgba(31, 23, 64, 0.4);
--primitive-dark-purple-200: rgba(31, 23, 64, 0.2);
--primitive-dark-purple-100: rgba(31, 23, 64, 0.1);
```

#### Light Purple Scale
```css
--primitive-light-purple-1000: rgba(94, 77, 116, 1);
--primitive-light-purple-800: rgba(94, 77, 116, 0.8);
--primitive-light-purple-600: rgba(94, 77, 116, 0.6);
--primitive-light-purple-400: rgba(94, 77, 116, 0.4);
--primitive-light-purple-200: rgba(94, 77, 116, 0.2);
--primitive-light-purple-100: rgba(94, 77, 116, 0.1);
```

#### Gray Scale
```css
--primitive-gray-1000: rgba(41, 50, 65, 1);
--primitive-gray-900: rgba(41, 50, 65, 0.9);
--primitive-gray-800: rgba(41, 50, 65, 0.8);
--primitive-gray-600: rgba(41, 50, 65, 0.6);
--primitive-gray-400: rgba(41, 50, 65, 0.4);
--primitive-gray-200: rgba(41, 50, 65, 0.2);
--primitive-gray-100: rgba(41, 50, 65, 0.1);
```

#### Light Gray Scale
```css
--primitive-light-gray-1000: rgba(242, 242, 242, 1);
--primitive-light-gray-800: rgba(242, 242, 242, 0.8);
--primitive-light-gray-600: rgba(242, 242, 242, 0.6);
--primitive-light-gray-400: rgba(242, 242, 242, 0.4);
--primitive-light-gray-300: rgba(242, 242, 242, 0.3);
--primitive-light-gray-200: rgba(242, 242, 242, 0.2);
--primitive-light-gray-100: rgba(242, 242, 242, 0.1);
```

### 3. Light Mode Colors
Dedicated tokens that mirror design tooling names for light mode references:

```css
--light-mode-colors-dark-gray-900: rgba(41, 50, 65, 0.9); /* #293241 at 90% */
```

### 4. Semantic Surface Colors
Colors for different surface types and contexts:

```css
--surface-primary: var(--pure-white);           /* Main background */
--surface-secondary: var(--primitive-light-gray-1000); /* Secondary background */
--surface-tertiary: var(--primitive-light-purple-200); /* Tertiary background */
--surface-card: var(--pure-white);              /* Card backgrounds */
--surface-overlay: rgba(0, 0, 0, 0.5);         /* Modal overlays */
--surface-backdrop: rgba(255, 255, 255, 0.8);  /* Backdrop blur */
```

#### Button Surfaces
```css
--surface-button: var(--primitive-light-purple-1000);
--surface-button-hover: var(--primitive-dark-purple-1000);
--surface-button-active: var(--primitive-dark-purple-1000);
--surface-button-inactive: var(--primitive-light-purple-400);
--surface-button-disabled: var(--primitive-light-gray-400);
```

### 5. Semantic Text Colors
Colors for different text contexts:

```css
--text-primary: var(--primitive-gray-1000);     /* Main text */
--text-secondary: var(--primitive-dark-purple-1000); /* Secondary text */
--text-tertiary: var(--primitive-gray-600);     /* Tertiary text */
--text-inverse: var(--pure-white);              /* Text on dark backgrounds */
--text-muted: var(--primitive-gray-400);        /* Muted text */
--text-brand: var(--primitive-light-purple-1000); /* Brand text */
--text-accent: var(--brand-primary);            /* Accent text */
--text-success: #10b981;                        /* Success messages */
--text-warning: #f59e0b;                        /* Warning messages */
--text-error: #ef4444;                          /* Error messages */
--text-info: #3b82f6;                           /* Info messages */
```

### 6. Border Colors
Colors for borders and dividers:

```css
--border-primary: var(--primitive-light-gray-400);
--border-secondary: var(--primitive-light-gray-200);
--border-focus: var(--brand-primary);
--border-error: var(--text-error);
--border-success: var(--text-success);
```

### 7. Shadow Colors
Predefined shadow values:

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
--shadow-glow: 0 0 20px rgba(168, 85, 247, 0.4);
```

### 8. Gradient Colors
Predefined gradient combinations:

```css
--gradient-primary: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
--gradient-secondary: linear-gradient(135deg, #d946ef 0%, #ec4899 100%);
--gradient-hero: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%);
--gradient-features: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5d0fe 100%);
--gradient-button: linear-gradient(138deg, rgba(31,23,64,1) 0%, rgba(94,77,116,1) 100%);
--gradient-glass: linear-gradient(293deg, rgba(94,77,116,0.4) 2%, rgba(255,255,255,0.2) 100%);
```

## Theme Behavior

### Light Theme (Default)
The application defaults to light theme for optimal readability and user experience:

- **Backgrounds**: Clean white and light gray backgrounds
- **Text**: Dark text on light backgrounds for maximum readability
- **Borders**: Subtle borders with proper contrast
- **Shadows**: Light shadows for depth
- **Gradients**: Vibrant gradients optimized for light backgrounds

### Dark Theme
The dark theme can be manually activated and automatically adjusts colors for better visibility in dark environments:

- **Backgrounds**: Dark backgrounds with proper contrast
- **Text**: Light text on dark backgrounds
- **Borders**: Adjusted opacity for better visibility
- **Shadows**: Enhanced for dark environments
- **Gradients**: Modified for dark theme aesthetics

## Usage in Tailwind CSS

The color system is integrated with Tailwind CSS through custom color definitions:

```javascript
// tailwind.config.js
colors: {
  brand: {
    primary: 'var(--brand-primary)',
    secondary: 'var(--brand-secondary)',
    accent: 'var(--brand-accent)',
  },
  surface: {
    primary: 'var(--surface-primary)',
    secondary: 'var(--surface-secondary)',
    card: 'var(--surface-card)',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    brand: 'var(--text-brand)',
  },
  // ... more colors
}
```

### Tailwind Usage Examples

```html
<!-- Background colors -->
<div class="bg-surface-primary">Primary background</div>
<div class="bg-surface-card">Card background</div>

<!-- Text colors -->
<h1 class="text-text-primary">Primary heading</h1>
<p class="text-text-secondary">Secondary text</p>

<!-- Border colors -->
<div class="border border-border-primary">Primary border</div>
<input class="border border-border-focus">Focus border</input>

<!-- Brand colors -->
<button class="bg-brand-primary text-text-inverse">Brand button</button>
```

## CSS Component Classes

The system includes pre-built component classes:

### Buttons
```css
.btn-primary    /* Primary button with brand colors */
.btn-secondary  /* Secondary button */
.btn-outline    /* Outline button */
.btn-ghost      /* Ghost button */
.btn-accent     /* Accent button with gradient */
```

### Cards
```css
.card           /* Standard card */
.card-hover     /* Card with hover effects */
.ai-card        /* AI-themed card with gradient */
```

### Inputs
```css
.input          /* Standard input */
.input-focus    /* Input with enhanced focus state */
```

### Utilities
```css
.text-gradient  /* Gradient text effect */
.glass-effect   /* Glass morphism effect */
.gradient-text  /* Alternative gradient text */
```

## Theme Switching

The system defaults to light theme and supports manual theme switching:

```typescript
import { setTheme, toggleTheme, getCurrentTheme } from '@/utils/theme';

// Get current theme (defaults to 'light')
const currentTheme = getCurrentTheme();

// Set specific theme
setTheme('dark');

// Toggle between themes
toggleTheme();
```

### Default Behavior
- **First Visit**: Always starts with light theme
- **Return Visits**: Remembers user's last selected theme
- **No System Preference**: Ignores system dark mode preference, defaults to light

## Best Practices

1. **Use Semantic Colors**: Prefer semantic colors over primitive colors
   ```css
   /* Good */
   color: var(--text-primary);
   background: var(--surface-card);
   
   /* Avoid */
   color: var(--primitive-gray-1000);
   background: var(--primitive-light-gray-2000);
   ```

2. **Maintain Contrast**: Ensure proper contrast ratios for accessibility
3. **Test Both Themes**: Always test components in both light and dark themes
4. **Use CSS Variables**: Leverage CSS variables for dynamic theming
5. **Follow Naming Conventions**: Use consistent naming patterns

## Migration from Legacy Colors

The system maintains backward compatibility with existing color variables:

```css
/* Legacy variables still work */
--premitives-color-dark-puprle-1000
--tokens-color-surface-surface-button
--tokens-color-text-text-primary

/* But prefer new semantic names */
--primitive-dark-purple-1000
--surface-button
--text-primary
```

## Demo Page

Visit `/color-system-demo` to see all colors and components in action with live theme switching.

## Future Enhancements

- [ ] Add more color scales (blue, green, etc.)
- [ ] Implement color contrast validation
- [ ] Add color picker for custom themes
- [ ] Create color accessibility tools
- [ ] Add animation color variables
