# Button Components Guide

## ✅ Problem Solved

**Before:** Every page/component had `isDark` checks scattered everywhere for button styling  
**After:** Button components handle dark theme internally - just use them and forget about theme!

## 🎯 Available Button Components

### 1. **SocialButton** - For OAuth/SSO buttons

Handles GitHub, Google, and Microsoft login buttons with automatic dark theme support.

```tsx
import { SocialButton } from '@/components/ui/buttons'

// GitHub button
<SocialButton
  provider="github"
  onClick={handleGitHubSignIn}
  disabled={isLoading}
/>

// Google button
<SocialButton
  provider="google"
  onClick={handleGoogleSignIn}
  disabled={isLoading}
  showLabel={false}  // Optional: hide label on mobile
/>

// Microsoft button
<SocialButton
  provider="microsoft"
  onClick={handleMicrosoftSignIn}
  disabled={isLoading}
/>
```

**Features:**
- ✅ Automatically switches GitHub icon based on theme
- ✅ Dark theme border colors handled internally
- ✅ Responsive labels (hidden on small screens by default)
- ✅ Disabled state styling
- ✅ Hover effects

### 2. **ActionButton** - For primary/secondary actions

General purpose button with multiple variants and sizes.

```tsx
import { ActionButton } from '@/components/ui/buttons'

// Primary button
<ActionButton variant="primary" onClick={handleSubmit}>
  Submit
</ActionButton>

// Secondary button
<ActionButton variant="secondary" onClick={handleCancel}>
  Cancel
</ActionButton>

// Outline button
<ActionButton variant="outline" onClick={handleEdit}>
  Edit
</ActionButton>

// Danger button
<ActionButton variant="danger" onClick={handleDelete}>
  Delete
</ActionButton>

// Ghost button
<ActionButton variant="ghost" onClick={handleClose}>
  Close
</ActionButton>

// With loading state
<ActionButton variant="primary" loading={isSubmitting}>
  Save Changes
</ActionButton>

// Full width
<ActionButton variant="primary" fullWidth>
  Continue
</ActionButton>

// Different sizes
<ActionButton variant="primary" size="sm">Small</ActionButton>
<ActionButton variant="primary" size="md">Medium</ActionButton>
<ActionButton variant="primary" size="lg">Large</ActionButton>

// With icons
<ActionButton 
  variant="primary" 
  leftIcon={<PlusIcon />}
  rightIcon={<ArrowIcon />}
>
  Add Item
</ActionButton>
```

**Variants:**
- `primary` - Main action (purple/dark theme aware)
- `secondary` - Secondary actions (gray background)
- `outline` - Outlined button (transparent background)
- `danger` - Destructive actions (red)
- `ghost` - Minimal button (transparent, hover effect)

**Sizes:**
- `sm` - Small (h-9)
- `md` - Medium (h-[54px]) - Default
- `lg` - Large (h-14)

### 3. **PrimaryButton** - Legacy component (still works)

Original primary button component, still available for backwards compatibility.

```tsx
import { PrimaryButton } from '@/components/ui/buttons'

<PrimaryButton
  text="Continue with email"
  onClick={handleContinue}
  disabled={isLoading}
  loading={isSubmitting}
/>
```

### 4. **IconButton** - For icon-only buttons

```tsx
import { IconButton } from '@/components/ui/buttons'

<IconButton
  variant="primary"
  icon={<MenuIcon />}
  aria-label="Open menu"
  onClick={handleMenuOpen}
/>
```

### 5. **Toggle** - For switch/toggle controls

```tsx
import { Toggle } from '@/components/ui'

<Toggle
  checked={isEnabled}
  onChange={setIsEnabled}
  label="Enable notifications"
/>
```

## 🔄 Migration Guide

### Before (❌ Bad):

```tsx
const { resolvedTheme } = useTheme()
const isDark = resolvedTheme === 'dark'

return (
  <button 
    className={`inline-flex items-center gap-2 p-3 rounded-xl border ${
      isDark 
        ? 'border-white/20 hover:border-white/30' 
        : 'border-[#dbdbdb] hover:border-[#bbb]'
    }`}
    onClick={signInWithGitHub}
  >
    {isDark ? (
      <GitHubColorful className="w-6 h-6" />
    ) : (
      <img src="/img/github.png" />
    )}
    <span>Github</span>
  </button>
)
```

### After (✅ Good):

```tsx
import { SocialButton } from '@/components/ui/buttons'

return (
  <SocialButton
    provider="github"
    onClick={signInWithGitHub}
  />
)
```

**Benefits:**
1. ✅ No more `useTheme()` hook needed
2. ✅ No more `isDark` checks
3. ✅ Much cleaner code
4. ✅ Consistent styling across app
5. ✅ Easy to update styling in one place

## 📋 Component Props Reference

### SocialButton

```typescript
interface SocialButtonProps {
  provider: 'github' | 'google' | 'microsoft'
  onClick: () => void
  disabled?: boolean
  className?: string
  showLabel?: boolean  // Default: true
}
```

### ActionButton

```typescript
interface ActionButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
```

## 🔍 Finding Buttons to Replace

Search for these patterns in your codebase:

```bash
# Find isDark usage in components
grep -r "const isDark" src/components/ --include="*.tsx"

# Find inline button elements
grep -r "<button" src/components/ --include="*.tsx" | grep "isDark"

# Find useTheme usage
grep -r "useTheme()" src/components/ --include="*.tsx"
```

## ✨ Real World Examples

### Example 1: Signup Form

```tsx
// Before: signup-form-section.tsx (❌)
const { resolvedTheme } = useTheme()
const isDark = resolvedTheme === 'dark'

<div className="flex gap-3">
  <button className={isDark ? '...' : '...'} onClick={signInWithGitHub}>
    {isDark ? <GitHubColorful /> : <img src="/img/github.png" />}
    <span>Github</span>
  </button>
  
  <button className={isDark ? '...' : '...'} onClick={signInWithMicrosoft}>
    <img src="/img/microsoft.png" />
    <span>Microsoft</span>
  </button>
  
  <button className={isDark ? '...' : '...'} onClick={signInWithGoogle}>
    <img src="/img/image-6.png" />
    <span>Google</span>
  </button>
</div>

// After: signup-form-section.tsx (✅)
import { SocialButton } from '@/components/ui/buttons'

<div className="flex gap-3">
  <SocialButton provider="github" onClick={signInWithGitHub} />
  <SocialButton provider="microsoft" onClick={signInWithMicrosoft} />
  <SocialButton provider="google" onClick={signInWithGoogle} />
</div>
```

### Example 2: Checkout Page

```tsx
// Before (❌)
<button
  className={`px-6 py-3 rounded-xl ${
    isDark
      ? 'bg-[color:var(--tokens-color-surface-surface-card-purple)] text-dark'
      : 'bg-[color:var(--premitives-color-brand-purple-1000)] text-white'
  }`}
  onClick={handleCheckout}
>
  Complete Purchase
</button>

// After (✅)
<ActionButton
  variant="primary"
  onClick={handleCheckout}
>
  Complete Purchase
</ActionButton>
```

### Example 3: Modal Actions

```tsx
// Before (❌)
<div className="flex gap-3 justify-end">
  <button
    className={isDark ? 'bg-gray-800 text-white' : 'bg-gray-200 text-black'}
    onClick={onCancel}
  >
    Cancel
  </button>
  <button
    className={isDark ? 'bg-purple-600' : 'bg-purple-800'}
    onClick={onConfirm}
  >
    Confirm
  </button>
</div>

// After (✅)
<div className="flex gap-3 justify-end">
  <ActionButton variant="secondary" onClick={onCancel}>
    Cancel
  </ActionButton>
  <ActionButton variant="primary" onClick={onConfirm}>
    Confirm
  </ActionButton>
</div>
```

## 🎨 Customization

If you need to customize a button beyond the provided props, you can:

1. **Add className for one-off changes:**
```tsx
<ActionButton 
  variant="primary" 
  className="shadow-lg rounded-2xl"
>
  Custom Button
</ActionButton>
```

2. **Update the component for global changes:**
Edit `src/components/ui/buttons/action-button.tsx` or `social-button.tsx`

## 💡 Best Practices

1. ✅ **Always use button components** instead of inline `<button>` elements
2. ✅ **Remove `isDark` checks** from pages/sections - let components handle it
3. ✅ **Use semantic variants** - `primary` for main actions, `secondary` for cancel/back
4. ✅ **Use `loading` prop** instead of custom loading states
5. ✅ **Keep theme logic in components** - never in pages

## 🐛 Troubleshooting

**Button doesn't show:**
- Check if you imported the component correctly
- Verify the provider name is lowercase ('github', not 'GitHub')

**Theme doesn't switch:**
- The component handles it automatically
- Make sure you removed `isDark` from parent component

**Styling looks wrong:**
- Check if you're passing `className` that overrides styles
- Verify CSS variables are defined in `globals.css`

## 📚 Next Steps

1. Search your codebase for `isDark` usage: `grep -r "const isDark" src/`
2. Replace inline buttons with `SocialButton` or `ActionButton`
3. Remove `useTheme()` hooks that are only used for `isDark`
4. Test theme switching to ensure everything works
5. Enjoy cleaner, more maintainable code! 🎉

