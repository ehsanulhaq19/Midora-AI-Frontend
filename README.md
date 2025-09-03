# Midora AI Frontend

A modern, clean authentication landing page built with Next.js, TypeScript, and Tailwind CSS.

## New Simplified Auth Design

The authentication pages have been redesigned with a clean, minimalist approach inspired by modern design principles:

### Design Features

- **Two-Column Layout**: Form on the left (white background), animated content on the right (light purple background)
- **Clean & Simple**: Removed extra content, focused on essential elements
- **Color Scheme**: White and light purple backgrounds with dark purple buttons
- **Typography**: Elegant serif font for headlines, clean sans-serif for body text
- **Animations**: Smooth transitions and subtle animations on the right side

### Color Palette

- **Left Side**: Pure white background (`bg-white`)
- **Right Side**: Light purple background (`bg-purple-50`)
- **Buttons**: Dark purple (`bg-purple-800`, `hover:bg-purple-900`)
- **Accents**: Purple (`text-purple-600`, `border-purple-100`)

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│                    Header Navigation                     │
├─────────────────────┬───────────────────────────────────┤
│                     │                                   │
│   Login/Signup      │        Animated Content           │
│      Form           │                                   │
│   (White BG)       │        (Light Purple BG)          │
│                     │                                   │
│                     │        • Feature Cards            │
│                     │        • Statistics               │
│                     │        • App Highlights           │
│                     │                                   │
└─────────────────────┴───────────────────────────────────┘
```

### Components

- **LoginForm**: Clean login form with Google OAuth and email options
- **SignupForm**: Simple signup form with name, email, and password fields
- **AuthLandingPage**: Two-column layout wrapper with animated content

### Animations

- **Fade In**: Main headline and stats
- **Slide Up**: Feature cards with staggered delays
- **Bounce Gentle**: Logo animation
- **Smooth Transitions**: Hover effects and button states

### Usage

1. **Login Page**: `/login` - Shows login form on left, animated content on right
2. **Signup Page**: `/signup` - Shows signup form on left, animated content on right
3. **Demo Page**: `/cursor-demo` - Interactive demo with toggle between forms

### Responsive Design

- **Desktop**: Full two-column layout
- **Mobile**: Single column with form only (right side hidden)
- **Tablet**: Adaptive layout based on screen size

## Getting Started

```bash
npm install
npm run dev
```

## Features

- Clean, minimalist design
- Responsive layout
- Smooth animations
- Google OAuth integration
- Form validation
- TypeScript support
- Tailwind CSS styling

## Design Principles

1. **Simplicity**: Remove unnecessary elements
2. **Focus**: Keep user attention on the form
3. **Visual Hierarchy**: Clear information structure
4. **Accessibility**: High contrast and readable text
5. **Performance**: Lightweight animations and transitions
