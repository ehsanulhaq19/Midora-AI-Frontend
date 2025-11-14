/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ===== BRAND COLORS =====
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
          accent: 'var(--brand-accent)',
          80: 'var(--brand-80)',
        },
        
        // ===== PRIMITIVE COLORS =====
        primitive: {
          'dark-purple': {
            1000: 'var(--primitive-dark-purple-1000)',
            900: 'var(--primitive-dark-purple-900)',
            800: 'var(--primitive-dark-purple-800)',
            600: 'var(--primitive-dark-purple-600)',
            400: 'var(--primitive-dark-purple-400)',
            200: 'var(--primitive-dark-purple-200)',
            100: 'var(--primitive-dark-purple-100)',
          },
          'light-purple': {
            1000: 'var(--primitive-light-purple-1000)',
            800: 'var(--primitive-light-purple-800)',
            600: 'var(--primitive-light-purple-600)',
            400: 'var(--primitive-light-purple-400)',
            200: 'var(--primitive-light-purple-200)',
            100: 'var(--primitive-light-purple-100)',
          },
          'brand-purple': {
            1000: 'var(--primitive-brand-purple-1000)',
          },
          gray: {
            1000: 'var(--primitive-gray-1000)',
            900: 'var(--primitive-gray-900)',
            800: 'var(--primitive-gray-800)',
            600: 'var(--primitive-gray-600)',
            400: 'var(--primitive-gray-400)',
            200: 'var(--primitive-gray-200)',
            100: 'var(--primitive-gray-100)',
          },
          'light-gray': {
            1000: 'var(--primitive-light-gray-1000)',
            800: 'var(--primitive-light-gray-800)',
            600: 'var(--primitive-light-gray-600)',
            400: 'var(--primitive-light-gray-400)',
            300: 'var(--primitive-light-gray-300)',
            200: 'var(--primitive-light-gray-200)',
            100: 'var(--primitive-light-gray-100)',
          },
        },
        
        // ===== SEMANTIC SURFACE COLORS =====
        surface: {
          primary: 'var(--surface-primary)',
          secondary: 'var(--surface-secondary)',
          tertiary: 'var(--surface-tertiary)',
          card: 'var(--surface-card)',
          overlay: 'var(--surface-overlay)',
          backdrop: 'var(--surface-backdrop)',
          button: 'var(--surface-button)',
          'button-hover': 'var(--surface-button-hover)',
          'button-active': 'var(--surface-button-active)',
          'button-inactive': 'var(--surface-button-inactive)',
          'button-disabled': 'var(--surface-button-disabled)',
        },
        
        // ===== SEMANTIC TEXT COLORS =====
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
          inverse: 'var(--text-inverse)',
          muted: 'var(--text-muted)',
          brand: 'var(--text-brand)',
          accent: 'var(--text-accent)',
          success: 'var(--text-success)',
          warning: 'var(--text-warning)',
          error: 'var(--text-error)',
          info: 'var(--text-info)',
        },
        
        // ===== BORDER COLORS =====
        border: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
          focus: 'var(--border-focus)',
          error: 'var(--border-error)',
          success: 'var(--border-success)',
        },
        
        // ===== LEGACY COMPATIBILITY =====
        'gray0-white': 'var(--gray0-white)',
        'premitives-color-light-gray-1000': 'var(--premitives-color-light-gray-1000)',
        'premitives-color-light-gray-300': 'var(--premitives-color-light-gray-300)',
        'premitives-color-light-gray-700': 'var(--premitives-color-light-gray-700)',
        'tokens-color-surface-surface-button': 'var(--tokens-color-surface-surface-button)',
        'tokens-color-surface-surface-button-inactive': 'var(--tokens-color-surface-surface-button-inactive)',
        'tokens-color-surface-surface-button-pressed': 'var(--tokens-color-surface-surface-button-pressed)',
        'tokens-color-surface-surface-dark': 'var(--tokens-color-surface-surface-dark)',
        'tokens-color-surface-surface-tertiary': 'var(--tokens-color-surface-surface-tertiary)',
        'tokens-color-text-text-neutral': 'var(--tokens-color-text-text-neutral)',
        'tokens-color-text-text-primary': 'var(--tokens-color-text-text-primary)',
        'tokens-color-text-text-seconary': 'var(--tokens-color-text-text-seconary)',
        'tokens-color-text-text-brand': 'var(--tokens-color-text-text-brand)',
        'premitives-color-dark-puprle-1000': 'var(--premitives-color-dark-puprle-1000)',
        'premitives-color-dark-puprle-900': 'var(--premitives-color-dark-puprle-900)',
        'premitives-color-darkgray-900': 'var(--premitives-color-darkgray-900)',
        'premitives-color-light-gray-2000': 'var(--premitives-color-light-gray-2000)',
        'premitives-color-light-purple-1000': 'var(--premitives-color-light-purple-1000)',
        'premitives-color-light-purple-200': 'var(--premitives-color-light-purple-200)',
        'premitives-color-light-purple-400': 'var(--premitives-color-light-purple-400)',
        
        // ===== STANDARD TAILWIND COLORS (for compatibility) =====
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
          950: '#4a044e',
        },
        accent: {
          blue: '#3b82f6',
          green: '#10b981',
          orange: '#f59e0b',
          red: '#ef4444',
          yellow: '#eab308',
          teal: '#14b8a6',
          indigo: '#6366f1',
          pink: '#ec4899',
        },
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        background: {
          primary: '#ffffff',
          secondary: '#fafafa',
          tertiary: '#f5f5f5',
          dark: '#0f0f23',
          card: '#ffffff',
        },
        ring: {
          DEFAULT: '#a855f7',
        },
      },
      fontFamily: {
        // Centralized Font System
        'heading-primary': 'var(--font-heading-primary)',
        'heading-secondary': 'var(--font-heading-secondary)',
        'body-primary': 'var(--font-body-primary)',
        'body-secondary': 'var(--font-body-secondary)',
        'mono': 'var(--font-mono)',
        
        // Legacy Signup Module Fonts (for backward compatibility)
        'h01-heading-01': 'var(--h01-heading-01-font-family)',
        'h02-heading02': 'var(--h02-heading02-font-family)',
        'h03-heading03': 'var(--h03-heading-light-font-family)',
        'SF-Pro' : 'var(--text-large-font-family)',
        'text': 'var(--text-font-family)',
        'text-large': 'var(--text-large-font-family)',
        'text-xs-bold': 'var(--text-xs-bold-font-family)',
        
        // Standard Tailwind fonts
        sans: ['var(--font-body-primary)'],
        display: ['var(--font-heading-primary)'],
        serif: ['var(--font-heading-secondary)'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'corner-radius-3': 'var(--premitives-corner-radius-corner-radius-3)',
        'corner-radius-5': 'var(--premitives-corner-radius-corner-radius-5)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in-down': 'fadeInDown 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'progress-bar': 'progressBar 0.8s ease-out forwards',
        'bounce-in': 'bounceIn 0.8s ease-out forwards',
        'float-chat': 'floatChat 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        floatChat: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) translate(0, 0)' },
          '50%': { opacity: '0.5', transform: 'scale(1) translate(20px, -20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' },
          '100%': { boxShadow: '0 0 30px rgba(168, 85, 247, 0.8)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        progressBar: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-midora': 'var(--gradient-primary)',
        'gradient-dark': 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-features': 'var(--gradient-features)',
        'gradient-button': 'var(--gradient-button)',
        'gradient-glass': 'var(--gradient-glass)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
    'purple-soft': '-6px 4px 33.2px 0 #4D30711A',
  },
    },
  },
  plugins: [],
}
