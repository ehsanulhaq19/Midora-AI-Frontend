import React from 'react'
import { render, screen } from '@testing-library/react'
import { MarkdownRenderer } from './MarkdownRenderer'

describe('MarkdownRenderer', () => {
  it('renders basic markdown content', () => {
    const content = '# Hello World\n\nThis is **bold** text.'
    render(<MarkdownRenderer content={content} />)
    
    expect(screen.getByText('Hello World')).toBeInTheDocument()
    expect(screen.getByText('This is')).toBeInTheDocument()
    expect(screen.getByText('bold')).toBeInTheDocument()
  })

  it('renders code blocks with syntax highlighting', () => {
    const content = '```javascript\nconst hello = "world";\n```'
    render(<MarkdownRenderer content={content} />)
    
    expect(screen.getByText('const hello = "world";')).toBeInTheDocument()
  })

  it('renders tables correctly', () => {
    const content = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |'
    render(<MarkdownRenderer content={content} />)
    
    expect(screen.getByText('Header 1')).toBeInTheDocument()
    expect(screen.getByText('Header 2')).toBeInTheDocument()
    expect(screen.getByText('Cell 1')).toBeInTheDocument()
    expect(screen.getByText('Cell 2')).toBeInTheDocument()
  })

  it('renders lists correctly', () => {
    const content = '- Item 1\n- Item 2\n- Item 3'
    render(<MarkdownRenderer content={content} />)
    
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
    expect(screen.getByText('Item 3')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const content = '# Test'
    const { container } = render(<MarkdownRenderer content={content} className="custom-class" />)
    
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('renders links with proper attributes', () => {
    const content = '[Google](https://google.com)'
    render(<MarkdownRenderer content={content} />)
    
    const link = screen.getByText('Google')
    expect(link).toHaveAttribute('href', 'https://google.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
