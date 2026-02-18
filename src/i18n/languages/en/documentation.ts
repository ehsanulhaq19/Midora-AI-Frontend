/**
 * English translations for documentation page
 */

export const documentation = {
  title: 'App Documentation',
  description: 'Comprehensive documentation for Midora AI frontend application',
  
  navigation: {
    overview: 'Overview',
    theme: 'Theme Variables',
    icons: 'Icons Gallery',
    components: 'UI Components',
    api: 'API Documentation',
  },
  
  overview: {
    title: 'Documentation Overview',
    description: 'Welcome to the Midora AI frontend documentation. This dashboard provides comprehensive information about the application structure, theme system, UI components, and more.',
    
    sections: {
      theme: {
        title: 'Theme System',
        description: 'Explore the complete theme variables, colors, and styling system used throughout the application.',
        features: [
          'Light and dark mode support',
          'CSS custom properties',
          'Tailwind CSS integration',
          'Responsive design tokens'
        ]
      },
      icons: {
        title: 'Icon Library',
        description: 'Browse and interact with all available icons in the application.',
        features: [
          'Interactive icon gallery',
          'Code examples for each icon',
          'Copy-to-clipboard functionality',
          'Search and filter capabilities'
        ]
      },
      components: {
        title: 'UI Components',
        description: 'Comprehensive library of reusable UI components.',
        features: [
          'Button variants',
          'Form inputs',
          'Cards and layouts',
          'Loading states'
        ]
      }
    }
  },
  
  theme: {
    title: 'Theme Variables',
    description: 'Complete theme system including colors, typography, spacing, and more.',
    
    sections: {
      colors: {
        title: 'Color Palette',
        description: 'Primary, secondary, and semantic color definitions'
      },
      typography: {
        title: 'Typography',
        description: 'Font families, sizes, weights, and line heights'
      },
      spacing: {
        title: 'Spacing System',
        description: 'Consistent spacing values for margins and padding'
      },
      borders: {
        title: 'Border System',
        description: 'Border radius, widths, and color definitions'
      }
    },
    
    variables: {
      lightMode: 'Light Mode Variables',
      darkMode: 'Dark Mode Variables',
      surface: 'Surface Colors',
      text: 'Text Colors',
      border: 'Border Colors',
      primitive: 'Primitive Colors'
    }
  },
  
  icons: {
    title: 'Icons Gallery',
    description: 'Interactive gallery of all available icons with code examples.',
    
    search: {
      placeholder: 'Search icons...',
      noResults: 'No icons found matching your search.',
      totalCount: 'Total icons: {count}'
    },
    
    code: {
      title: 'Usage Code',
      copy: 'Copy Code',
      copied: 'Copied!',
      import: 'Import',
      usage: 'Usage Example'
    },
    
    categories: {
      all: 'All Icons',
      navigation: 'Navigation',
      actions: 'Actions',
      media: 'Media',
      communication: 'Communication',
      files: 'Files & Folders'
    }
  },
  
  components: {
    title: 'UI Components',
    description: 'Reusable UI components with examples and documentation.',
    
    categories: {
      buttons: 'Buttons',
      inputs: 'Form Inputs',
      cards: 'Cards & Layouts',
      navigation: 'Navigation',
      feedback: 'Feedback & Loading'
    }
  },
  
  common: {
    loading: 'Loading...',
    error: 'Error loading content',
    retry: 'Retry',
    copy: 'Copy',
    copied: 'Copied!',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    open: 'Open',
    expand: 'Expand',
    collapse: 'Collapse'
  }
}
