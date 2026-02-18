# Font System Guide

## Overview

The Midora AI frontend uses a standardized font system with 14px as the default font size. This guide explains how to use the font classes correctly throughout the application.

## Default Font Size

- **14px** is set as the default font size for the entire application
- This is configured in `src/app/globals.css` for both `html` and `body` elements
- All components should use the standardized `.app-text-*` classes instead of hardcoded font sizes

## Available Font Size Classes

Use these standardized classes for consistent typography:

```css
.app-text-xs    /* 10px */
.app-text-sm    /* 12px */
.app-text       /* 14px - Default */
.app-text-md    /* 14px - Same as default */
.app-text-lg    /* 16px */
.app-text-xl    /* 18px */
.app-text-2xl   /* 20px */
.app-text-3xl   /* 24px */
.app-text-4xl   /* 28px */
.app-text-5xl   /* 32px */
```

## Usage Examples

### ✅ Correct Usage

```tsx
// Use app text classes
<div className="app-text app-text-primary">
  Default 14px text
</div>

<h1 className="app-text-3xl app-text-primary">
  Large heading (24px)
</h1>

<p className="app-text-sm app-text-secondary">
  Small text (12px)
</p>
```

### ❌ Incorrect Usage

```tsx
// Don't use hardcoded Tailwind text classes
<div className="text-base">  {/* Use app-text instead */}
<div className="text-lg">    {/* Use app-text-lg instead */}
<div className="text-xl">    {/* Use app-text-xl instead */}
```

## Color Classes

Combine font size classes with theme-aware color classes:

```tsx
<div className="app-text app-text-primary">     {/* Primary text color */}
<div className="app-text app-text-secondary">   {/* Secondary text color */}
<div className="app-text app-text-muted">       {/* Muted text color */}
<div className="app-text app-text-brand">       {/* Brand text color */}
<div className="app-text app-text-error">       {/* Error text color */}
```

## Component Guidelines

### Button Components
```tsx
// Button with default 14px text
<button className="app-text app-text-primary">
  Click me
</button>
```

### Input Components
```tsx
// Input with default 14px text
<input className="app-text app-text-primary" />
```

### Headings
```tsx
// Use appropriate heading sizes
<h1 className="app-text-3xl app-text-primary">Main Title</h1>
<h2 className="app-text-2xl app-text-primary">Section Title</h2>
<h3 className="app-text-xl app-text-primary">Subsection</h3>
```

## Migration from Old Classes

When updating existing components:

1. Replace `text-base` with `app-text`
2. Replace `text-sm` with `app-text-sm`
3. Replace `text-lg` with `app-text-lg`
4. Replace `text-xl` with `app-text-xl`
5. And so on...

## Benefits

- **Consistency**: All text uses the same standardized sizes
- **Maintainability**: Easy to update font sizes globally
- **Theme Support**: Works seamlessly with light/dark themes
- **Accessibility**: Consistent line heights and spacing

## Implementation Details

The font system is implemented in:
- `src/app/globals.css` - Font size classes and default styles
- `src/hooks/use-theme.tsx` - Theme management
- `tailwind.config.js` - Tailwind configuration

## Best Practices

1. Always use `.app-text-*` classes instead of hardcoded font sizes
2. Combine with theme-aware color classes (`.app-text-primary`, etc.)
3. Use semantic heading sizes (h1 = app-text-3xl, h2 = app-text-2xl, etc.)
4. Test in both light and dark themes
5. Ensure proper contrast ratios for accessibility
