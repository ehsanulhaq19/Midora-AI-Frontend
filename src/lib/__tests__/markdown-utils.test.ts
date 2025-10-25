/**
 * Tests for markdown utility functions
 */

import { markdownToTextSync, markdownToText } from '../markdown-utils'

describe('markdown-utils', () => {
  describe('markdownToTextSync', () => {
    it('should remove headers', () => {
      const markdown = '# Header 1\n## Header 2\n### Header 3'
      const result = markdownToTextSync(markdown)
      expect(result).toBe('Header 1 Header 2 Header 3')
    })

    it('should remove bold and italic formatting', () => {
      const markdown = '**bold text** and *italic text*'
      const result = markdownToTextSync(markdown)
      expect(result).toBe('bold text and italic text')
    })

    it('should remove inline code', () => {
      const markdown = 'Here is `inline code` example'
      const result = markdownToTextSync(markdown)
      expect(result).toBe('Here is inline code example')
    })

    it('should remove code blocks', () => {
      const markdown = '```javascript\nconst x = 1;\n```'
      const result = markdownToTextSync(markdown)
      expect(result).toBe('')
    })

    it('should remove links but keep text', () => {
      const markdown = 'Visit [Google](https://google.com) for search'
      const result = markdownToTextSync(markdown)
      expect(result).toBe('Visit Google for search')
    })

    it('should remove list markers', () => {
      const markdown = '- Item 1\n- Item 2\n1. Numbered item'
      const result = markdownToTextSync(markdown)
      expect(result).toBe('Item 1 Item 2 Numbered item')
    })

    it('should handle complex markdown', () => {
      const markdown = `
# Title
**Bold text** and *italic text*

- List item 1
- List item 2

\`\`\`javascript
const code = "example";
\`\`\`

Visit [Google](https://google.com) for more info.
      `.trim()
      
      const result = markdownToTextSync(markdown)
      expect(result).toContain('Title')
      expect(result).toContain('Bold text and italic text')
      expect(result).toContain('List item 1')
      expect(result).toContain('List item 2')
      expect(result).toContain('Visit Google for more info')
      expect(result).not.toContain('```')
      expect(result).not.toContain('**')
      expect(result).not.toContain('*')
    })

    it('should handle empty string', () => {
      const result = markdownToTextSync('')
      expect(result).toBe('')
    })

    it('should handle plain text', () => {
      const text = 'This is plain text without any markdown'
      const result = markdownToTextSync(text)
      expect(result).toBe(text)
    })
  })

  describe('markdownToText', () => {
    it('should work asynchronously', async () => {
      const markdown = '**bold text**'
      const result = await markdownToText(markdown)
      expect(result).toBe('bold text')
    })
  })
})
