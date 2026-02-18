# Markdown Component Implementation

## Overview

The MarkdownRenderer component provides a comprehensive solution for rendering markdown content with theme-aware styling, syntax highlighting, and consistent design patterns that align with the Midora AI application's design system.

## Features

### Theme Integration
- **Automatic Theme Detection**: The component automatically adapts to light and dark themes using CSS custom properties
- **Consistent Typography**: Uses the application's font system and text color tokens
- **Responsive Design**: Mobile-first approach with proper spacing and layout

### Supported Markdown Elements

#### Headings (H1-H6)
- **H1**: Large heading with bold font weight
- **H2**: Medium heading with semibold font weight  
- **H3**: Standard heading with medium font weight
- **H4-H6**: Progressively smaller headings with appropriate font weights
- All headings use theme-aware text colors and proper spacing

#### Text Formatting
- **Paragraphs**: Proper line height and spacing for readability
- **Bold Text**: Strong emphasis with semibold font weight
- **Italic Text**: Emphasis with italic styling
- **Links**: Brand-colored links with hover effects and external link handling

#### Lists
- **Unordered Lists**: Bullet points with proper indentation
- **Ordered Lists**: Numbered lists with consistent spacing
- **Nested Lists**: Support for multi-level list structures

#### Tables
- **Responsive Tables**: Horizontal scrolling for wide tables
- **Theme Styling**: Consistent borders and background colors
- **Header Styling**: Distinct header row with secondary background
- **Cell Padding**: Proper spacing for table content

#### Code Blocks
- **Syntax Highlighting**: Full syntax highlighting using Prism.js
- **Black Background**: Code blocks use black background for better contrast
- **Language Detection**: Automatic language detection from markdown fenced code blocks
- **Inline Code**: Inline code uses theme-aware background and styling

#### Other Elements
- **Blockquotes**: Left border with brand color and secondary background
- **Horizontal Rules**: Themed divider lines
- **Images**: Responsive images with rounded corners and borders

## Implementation Details

### File Structure
```
src/components/markdown/
├── MarkdownRenderer.tsx    # Main component
├── types.ts               # TypeScript type definitions
└── index.ts              # Export file
```

### Dependencies
- `react-markdown`: Core markdown parsing
- `remark-gfm`: GitHub Flavored Markdown support
- `react-syntax-highlighter`: Code syntax highlighting
- `@types/react-syntax-highlighter`: TypeScript definitions

### Component Props

```typescript
interface MarkdownRendererProps {
  /**
   * The markdown content to render
   */
  content: string
  
  /**
   * Additional CSS classes to apply to the markdown container
   */
  className?: string
}
```

### Usage Example

```tsx
import { MarkdownRenderer } from '@/components/markdown'

// Basic usage
<MarkdownRenderer content="# Hello World\n\nThis is **bold** text." />

// With custom styling
<MarkdownRenderer 
  content={markdownContent} 
  className="custom-markdown-styles" 
/>
```

## Theme Integration

### CSS Custom Properties Used
- `--tokens-color-text-text-primary`: Primary text color
- `--tokens-color-text-text-brand`: Brand/accent color for links
- `--tokens-color-surface-surface-secondary`: Secondary background
- `--tokens-color-border-border-inactive`: Border colors
- `--tokens-color-border-border-active`: Active border colors

### Dark Mode Support
The component automatically supports dark mode through CSS custom properties that change based on the `data-theme="dark"` attribute on the root element.

## Code Highlighting

### Supported Languages
The component supports all languages supported by Prism.js, including:
- JavaScript/TypeScript
- Python
- Java
- C/C++
- HTML/CSS
- JSON
- YAML
- SQL
- And many more

### Styling
- **Background**: Black (#000000) for optimal contrast
- **Text**: Light gray for readability
- **Font**: Monospace font family
- **Border Radius**: Rounded corners for modern appearance

## Performance Considerations

### Optimization Features
- **Lazy Loading**: Syntax highlighter is only loaded when code blocks are present
- **Memoization**: Component can be memoized for better performance
- **Minimal Re-renders**: Efficient change detection

### Bundle Size
- Core markdown parsing: ~50KB
- Syntax highlighting: ~200KB (only loaded when needed)
- Total impact: Minimal for most use cases

## Accessibility

### ARIA Support
- Proper heading hierarchy for screen readers
- Alt text support for images
- Keyboard navigation support for links

### Color Contrast
- All text meets WCAG AA contrast requirements
- Code blocks use high contrast black background
- Theme colors are tested for accessibility

## Integration with Chat System

### Conversation Container
The MarkdownRenderer is integrated into the chat system for rendering AI responses:

```tsx
// In conversation-container.tsx
{isUser ? (
  <p className="whitespace-pre-wrap">{message.content}</p>
) : (
  <MarkdownRenderer content={message.content} />
)}
```

### Streaming Support
The component supports real-time markdown rendering for streaming AI responses, maintaining proper formatting as content is received.

## Customization

### Extending the Component
The component can be extended by:
1. Adding new markdown elements to the `components` prop
2. Customizing existing element styles
3. Adding new syntax highlighting themes
4. Implementing custom plugins

### Example: Custom Element
```tsx
const customComponents = {
  // Add custom element
  customElement: ({ children }) => (
    <div className="custom-element">
      {children}
    </div>
  )
}

<MarkdownRenderer 
  content={content}
  components={customComponents}
/>
```

## Testing

### Test Coverage
- Component rendering with various markdown content
- Theme switching (light/dark mode)
- Code highlighting with different languages
- Table rendering and responsiveness
- Link handling and security

### Test Files
- `MarkdownRenderer.test.tsx`: Unit tests for the component
- `markdown.integration.test.tsx`: Integration tests with chat system

## Future Enhancements

### Planned Features
1. **Copy Code Button**: Add copy functionality to code blocks
2. **Table of Contents**: Auto-generate TOC for long documents
3. **Math Support**: LaTeX math rendering
4. **Mermaid Diagrams**: Support for diagram rendering
5. **Custom Themes**: User-selectable syntax highlighting themes

### Performance Improvements
1. **Virtual Scrolling**: For very long markdown documents
2. **Progressive Loading**: Load content in chunks
3. **Caching**: Cache parsed markdown content

## Troubleshooting

### Common Issues

#### Code Highlighting Not Working
- Ensure the language is specified in the fenced code block
- Check that the language is supported by Prism.js
- Verify the syntax highlighter is properly imported

#### Theme Colors Not Applied
- Check that CSS custom properties are defined
- Verify the theme is properly set on the root element
- Ensure the component is not overriding theme styles

#### Tables Not Responsive
- Check that the table has proper overflow handling
- Verify the container has sufficient width
- Test on different screen sizes

### Debug Mode
Enable debug mode by adding `data-debug="true"` to see component state and performance metrics.

## Contributing

### Development Guidelines
1. Follow the established component structure
2. Maintain theme consistency
3. Add proper TypeScript types
4. Include comprehensive tests
5. Update documentation for new features

### Code Style
- Use functional components with hooks
- Follow the established naming conventions
- Use CSS custom properties for theming
- Maintain accessibility standards

## Changelog

### Version 1.0.0
- Initial implementation
- Theme-aware styling
- Syntax highlighting support
- Table and list rendering
- Chat system integration

---

*This documentation is maintained alongside the component implementation. Please update it when making changes to the MarkdownRenderer component.*
