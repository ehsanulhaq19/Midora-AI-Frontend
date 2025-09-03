# Midora AI Platform Theme System

## Overview

The Midora AI Platform uses a comprehensive theme system that provides consistent design tokens, colors, typography, spacing, and other design elements throughout the application. This system ensures visual consistency and makes it easy to maintain and update the platform's appearance.

**Note**: The current design follows a simplified, elegant approach with a **dark purple theme** and white text for maximum readability and modern aesthetics.

## Theme Structure

The theme system is defined in `src/lib/theme.ts` and includes the following categories:

### 1. Colors

#### Primary Purple Colors (Main Theme)
- **50**: `#faf5ff` - Lightest purple for backgrounds
- **100**: `#f3e8ff` - Very light purple for subtle backgrounds
- **200**: `#e9d5ff` - Light purple for borders and dividers
- **300**: `#d8b4fe` - Medium light purple for hover states
- **400**: `#c084fc` - Medium purple for secondary elements
- **500**: `#a855f7` - Main purple for primary actions
- **600**: `#9333ea` - Darker purple for hover states
- **700**: `#7c3aed` - Dark purple for active states
- **800**: `#6b21a8` - Very dark purple for text
- **900**: `#581c87` - Dark purple for emphasis
- **950**: `#3b0764` - **Main background color (Darkest Purple)**

#### Secondary Purple Colors
- **50**: `#fdf4ff` - Lightest secondary purple
- **100**: `#fae8ff` - Very light secondary purple
- **200**: `#f5d0fe` - Light secondary purple
- **300**: `#f0abfc` - Medium light secondary purple
- **400**: `#e879f9` - Medium secondary purple
- **500**: `#d946ef` - Main secondary purple
- **600**: `#c026d3` - Darker secondary purple
- **700**: `#a21caf` - Dark secondary purple
- **800**: `#86198f` - Very dark secondary purple
- **900**: `#701a75` - Darkest secondary purple
- **950**: `#4a044e` - Deepest secondary purple

#### Accent Colors
- **Blue**: `#3b82f6` - For informational elements
- **Green**: `#10b981` - For success states
- **Orange**: `#f59e0b` - For warning states
- **Red**: `#ef4444` - For error states
- **Yellow**: `#eab308` - For highlights
- **Teal**: `#14b8a6` - For secondary actions
- **Indigo**: `#6366f1` - For tertiary actions
- **Pink**: `#ec4899` - For special elements

#### Neutral Colors
- **50**: `#fafafa` - Lightest neutral
- **100**: `#f5f5f5` - Very light neutral
- **200**: `#e5e5e5` - Light neutral
- **300**: `#d4d4d4` - Medium light neutral
- **400**: `#a3a3a3` - Medium neutral
- **500**: `#737373` - Medium dark neutral
- **600**: `#525252` - Dark neutral
- **700**: `#404040` - Very dark neutral
- **800**: `#262626` - Darkest neutral
- **900**: `#171717` - Deepest neutral
- **950**: `#0a0a0a` - Pure black

#### Semantic Colors
- **Success**: `#10b981` - For positive actions and states
- **Warning**: `#f59e0b` - For caution and attention
- **Error**: `#ef4444` - For errors and destructive actions
- **Info**: `#3b82f6` - For informational content

#### Background Colors
- **Primary**: `#ffffff` - Main background
- **Secondary**: `#fafafa` - Secondary background
- **Tertiary**: `#f5f5f5` - Tertiary background
- **Dark**: `#0f0f23` - Dark mode background
- **Card**: `#ffffff` - Card backgrounds
- **Overlay**: `rgba(0, 0, 0, 0.5)` - Modal overlays

#### Text Colors
- **Primary**: `#171717` - Main text color
- **Secondary**: `#525252` - Secondary text color
- **Tertiary**: `#737373` - Tertiary text color
- **Inverse**: `#ffffff` - **Text on dark backgrounds (White)**
- **Muted**: `#a3a3a3` - Muted text color
- **Accent**: `#a855f7` - Accent text color

#### Ring Colors
- **Default**: `#a855f7` - Focus ring color

### 2. Typography

#### Font Families
- **Sans**: `['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']`
- **Mono**: `['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace']`
- **Display**: `['Inter', 'system-ui', 'sans-serif']`

#### Font Sizes
- **xs**: `0.75rem` (12px)
- **sm**: `0.875rem` (14px)
- **base**: `1rem` (16px)
- **lg**: `1.125rem` (18px)
- **xl**: `1.25rem` (20px)
- **2xl**: `1.5rem` (24px)
- **3xl**: `1.875rem` (30px)
- **4xl**: `2.25rem` (36px)
- **5xl**: `3rem` (48px)
- **6xl**: `3.75rem` (60px)
- **7xl**: `4.5rem` (72px)
- **8xl**: `6rem` (96px)
- **9xl**: `8rem` (128px)

#### Font Weights
- **Thin**: `100`
- **Extralight**: `200`
- **Light**: `300`
- **Normal**: `400`
- **Medium**: `500`
- **Semibold**: `600`
- **Bold**: `700`
- **Extrabold**: `800`
- **Black**: `900`

#### Line Heights
- **None**: `1`
- **Tight**: `1.25`
- **Snug**: `1.375`
- **Normal**: `1.5`
- **Relaxed**: `1.625`
- **Loose**: `2`

#### Letter Spacing
- **Tighter**: `-0.05em`
- **Tight**: `-0.025em`
- **Normal**: `0em`
- **Wide**: `0.025em`
- **Wider**: `0.05em`
- **Widest**: `0.1em`

### 3. Spacing

The spacing scale follows a consistent pattern:
- **px**: `1px`
- **0**: `0px`
- **0.5**: `0.125rem` (2px)
- **1**: `0.25rem` (4px)
- **1.5**: `0.375rem` (6px)
- **2**: `0.5rem` (8px)
- **2.5**: `0.625rem` (10px)
- **3**: `0.75rem` (12px)
- **3.5**: `0.875rem` (14px)
- **4**: `1rem` (16px)
- **5**: `1.25rem` (20px)
- **6**: `1.5rem` (24px)
- **7**: `1.75rem` (28px)
- **8**: `2rem` (32px)
- **9**: `2.25rem` (36px)
- **10**: `2.5rem` (40px)
- **11**: `2.75rem` (44px)
- **12**: `3rem` (48px)
- **14**: `3.5rem` (56px)
- **16**: `4rem` (64px)
- **20**: `5rem` (80px)
- **24**: `6rem` (96px)
- **28**: `7rem` (112px)
- **32**: `8rem` (128px)
- **36**: `9rem` (144px)
- **40**: `10rem` (160px)
- **44**: `11rem` (176px)
- **48**: `12rem` (192px)
- **52**: `13rem` (208px)
- **56**: `14rem` (224px)
- **60**: `15rem` (240px)
- **64**: `16rem` (256px)
- **72**: `18rem` (288px)
- **80**: `20rem` (320px)
- **96**: `24rem` (384px)

### 4. Border Radius

- **None**: `0px`
- **Sm**: `0.125rem` (2px)
- **Default**: `0.25rem` (4px)
- **Md**: `0.375rem` (6px)
- **Lg**: `0.5rem` (8px)
- **Xl**: `0.75rem` (12px)
- **2xl**: `1rem` (16px)
- **3xl**: `1.5rem` (24px)
- **4xl**: `2rem` (32px)
- **Full**: `9999px`

### 5. Shadows

- **Sm**: `0 1px 2px 0 rgb(0 0 0 / 0.05)`
- **Default**: `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)`
- **Md**: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`
- **Lg**: `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)`
- **Xl**: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)`
- **2xl**: `0 25px 50px -12px rgb(0 0 0 / 0.25)`
- **Inner**: `inset 0 2px 4px 0 rgb(0 0 0 / 0.05)`
- **None**: `none`

### 6. Transitions

- **Default**: `150ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Fast**: `100ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Slow**: `300ms cubic-bezier(0.4, 0, 0.2, 1)`
- **Bounce**: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`
- **Ease**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **EaseIn**: `cubic-bezier(0.4, 0, 1, 1)`
- **EaseOut**: `cubic-bezier(0, 0, 0.2, 1)`
- **EaseInOut**: `cubic-bezier(0.4, 0, 0.2, 1)`

### 7. Z-Index Scale

- **Hide**: `-1`
- **Auto**: `auto`
- **Base**: `0`
- **Docked**: `10`
- **Dropdown**: `1000`
- **Sticky**: `1100`
- **Banner**: `1200`
- **Overlay**: `1300`
- **Modal**: `1400`
- **Popover**: `1500`
- **SkipLink**: `1600`
- **Toast**: `1700`
- **Tooltip**: `1800`

### 8. Breakpoints

- **Sm**: `640px`
- **Md**: `768px`
- **Lg**: `1024px`
- **Xl**: `1280px`
- **2xl**: `1536px`

### 9. Container Max Widths

- **Sm**: `640px`
- **Md**: `768px`
- **Lg**: `1024px`
- **Xl**: `1280px`
- **2xl**: `1536px`
- **Full**: `100%`

### 10. Animation Durations

- **Fast**: `100ms`
- **Normal**: `200ms`
- **Slow**: `300ms`
- **Slower**: `500ms`
- **Slowest**: `700ms`

### 11. Animation Easing

- **Linear**: `linear`
- **In**: `cubic-bezier(0.4, 0, 1, 1)`
- **Out**: `cubic-bezier(0, 0, 0.2, 1)`
- **InOut**: `cubic-bezier(0.4, 0, 0.2, 1)`

## Current Design Approach

### Simplified Dark Theme
The current Midora AI platform uses a **simplified, elegant design approach** with:

- **Primary Background**: **Darkest purple** (`primary-950: #3b0764`) for sophisticated appearance
- **Header Background**: Darkest purple (`primary-950: #3b0764`) for navbar
- **Text Colors**: White and light purple for maximum contrast and readability
- **Minimal Elements**: Clean, focused design without visual clutter
- **Sequential Animations**: Content appears one by one with smooth transitions and hide/show effects

### Key Design Principles
1. **Simplicity First** - Clean, uncluttered interface
2. **High Contrast** - Dark background with white text for readability
3. **Sequential Reveal** - Content appears in a logical, animated sequence
4. **Hide & Show Effects** - Smooth transitions between content states
5. **Elegant Typography** - Large, bold headlines with clear hierarchy
6. **Smooth Animations** - Subtle, professional transitions

### Animation Features
- **Sequential Content**: Each step appears for 5 seconds
- **Hide & Show Transitions**: Content fades out before next content appears
- **Smooth Fade Effects**: Opacity and transform transitions
- **Background Elements**: Floating animated circles for visual interest

## Usage

### Importing the Theme

```typescript
import { theme, getThemeColor, getThemeSpacing } from '@/lib/theme'
```

### Using Theme Colors

```typescript
// Direct access
const primaryColor = theme.colors.primary[500]

// Using utility function
const accentColor = getThemeColor('accent.blue')
```

### Using Theme Spacing

```typescript
// Direct access
const spacing = theme.spacing[8]

// Using utility function
const margin = getThemeSpacing('8')
```

### Using Theme Typography

```typescript
// Direct access
const fontSize = theme.typography.fontSize.lg[0]
const fontWeight = theme.typography.fontWeight.semibold
```

## Tailwind CSS Integration

The theme system is integrated with Tailwind CSS through the `tailwind.config.js` file. All theme colors, fonts, spacing, and other design tokens are available as Tailwind utility classes.

### Custom Utility Classes

The following custom utility classes are available:

- `.gradient-text` - Applies the Midora gradient to text
- `.ai-card` - Styled card for AI-related content
- `.feature-icon` - Styled icon container for features
- `.glass-effect` - Glass morphism effect
- `.floating-element` - Floating animation
- `.glow-effect` - Glowing animation

### Custom Animations

- `.animate-fade-in` - Fade in animation
- `.animate-slide-up` - Slide up animation
- `.animate-slide-down` - Slide down animation
- `.animate-scale-in` - Scale in animation
- `.animate-bounce-gentle` - Gentle bounce animation
- `.animate-float` - Floating animation
- `.animate-glow` - Glowing animation
- `.animate-slide-in-from-right` - Slide in from right animation

### Custom Gradients

- `.bg-gradient-midora` - Main Midora gradient
- `.bg-gradient-purple` - Purple gradient
- `.bg-gradient-dark` - Dark gradient
- `.bg-gradient-ai` - AI-themed gradient
- `.bg-gradient-hero` - Hero section gradient
- `.bg-gradient-features` - Features section gradient

## Best Practices

1. **Use Theme Tokens**: Always use theme tokens instead of hardcoded values
2. **Consistent Spacing**: Use the spacing scale consistently throughout the application
3. **Color Hierarchy**: Follow the established color hierarchy for different UI elements
4. **Typography Scale**: Use the typography scale for consistent text sizing
5. **Responsive Design**: Use breakpoints for responsive design
6. **Accessibility**: Ensure sufficient color contrast ratios
7. **Performance**: Use CSS custom properties for dynamic theming when needed
8. **Simplicity**: Keep the design clean and focused on content
9. **Animation Timing**: Use consistent animation durations and easing

## Customization

To customize the theme:

1. **Modify Theme File**: Update values in `src/lib/theme.ts`
2. **Update Tailwind Config**: Sync changes in `tailwind.config.js`
3. **Update CSS Variables**: Modify `src/app/globals.css` if needed
4. **Test Changes**: Ensure all components render correctly
5. **Document Changes**: Update this documentation

## Examples

### Simple Dark Theme Button

```typescript
<button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
  Click me
</button>
```

### Dark Theme Card

```typescript
<div className="bg-primary-950 border border-primary-800 rounded-xl p-6">
  <h3 className="text-xl font-semibold text-white mb-2">Title</h3>
  <p className="text-primary-200">Content</p>
</div>
```

### Typography with Dark Theme

```typescript
<h1 className="text-5xl font-bold text-white">Heading</h1>
<p className="text-xl text-primary-200">Paragraph text</p>
```

### Header Component

```typescript
<header className="bg-primary-950 border-b border-primary-800">
  <span className="text-2xl font-bold text-white">midora.ai</span>
</header>
```

## Support

For questions about the theme system or to request new design tokens, please contact the design team or create an issue in the project repository.
