/**
 * Markdown utility functions
 * Utilities for working with markdown content
 */

/**
 * Synchronous version of markdown to text conversion
 * Uses regex-based approach for immediate results
 */
export const markdownToTextSync = (markdown: string): string => {
  try {
    return markdown
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list bullets
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
      .replace(/\n\s*\n/g, '\n') // Clean up multiple newlines
      .replace(/>\s*/g, '') // Remove blockquote markers
      .replace(/^\s*[-*+]\s*/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s*/gm, '') // Remove numbered list markers
      .replace(/\|/g, ' ') // Replace table separators with spaces
      .replace(/-{3,}/g, '') // Remove table separators
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim()
  } catch (error) {
    return markdown
  }
}

/**
 * Async version of markdown to text conversion
 * Uses the same regex-based approach but returns a Promise for consistency
 */
export const markdownToText = async (markdown: string): Promise<string> => {
  return Promise.resolve(markdownToTextSync(markdown))
}

/**
 * Convert markdown to HTML for rich text copying
 * Preserves formatting like tables, headings, lists, etc.
 */
export const markdownToHtmlSync = (markdown: string): string => {
  try {
    let html = markdown

    // Code blocks (must be processed before other formatting and escaping)
    const codeBlockPlaceholders: string[] = []
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlockPlaceholders.length}__`
      const escapedCode = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
      codeBlockPlaceholders.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapedCode}</code></pre>`)
      return placeholder
    })

    // Inline code (process before escaping)
    const inlineCodePlaceholders: string[] = []
    html = html.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__INLINE_CODE_${inlineCodePlaceholders.length}__`
      inlineCodePlaceholders.push(`<code>${code}</code>`)
      return placeholder
    })

    // Escape HTML entities for the rest of the content
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    // Restore code blocks
    codeBlockPlaceholders.forEach((placeholder, index) => {
      html = html.replace(`__CODE_BLOCK_${index}__`, placeholder)
    })

    // Restore inline code
    inlineCodePlaceholders.forEach((placeholder, index) => {
      html = html.replace(`__INLINE_CODE_${index}__`, placeholder)
    })

    // Headings
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>')
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>')
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>')
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>')
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>')
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>')

    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>')

    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')
    html = html.replace(/_([^_]+)_/g, '<em>$1</em>')

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    // Tables
    const lines = html.split('\n')
    const tableLines: string[] = []
    let inTable = false
    let tableRows: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const isTableRow = line.trim().startsWith('|') && line.trim().endsWith('|')
      const isTableSeparator = /^\|\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|$/.test(line.trim())

      if (isTableRow && !isTableSeparator) {
        if (!inTable) {
          inTable = true
          tableRows = []
        }
        const cells = line
          .split('|')
          .map(cell => cell.trim())
          .filter(cell => cell.length > 0)
        const rowHtml = '<tr>' + cells.map(cell => `<td>${cell}</td>`).join('') + '</tr>'
        tableRows.push(rowHtml)
      } else if (isTableSeparator) {
        // Skip separator row
        continue
      } else {
        if (inTable) {
          tableLines.push('<table>' + tableRows.join('') + '</table>')
          tableRows = []
          inTable = false
        }
        tableLines.push(line)
      }
    }

    if (inTable && tableRows.length > 0) {
      tableLines.push('<table>' + tableRows.join('') + '</table>')
    }

    html = tableLines.join('\n')

    // Process lists line by line to handle them correctly
    const listLines = html.split('\n')
    const processedLines: string[] = []
    let currentList: string[] = []
    let currentListType: 'ul' | 'ol' | null = null

    for (let i = 0; i < listLines.length; i++) {
      const line = listLines[i]
      const unorderedMatch = line.match(/^\s*[-*+]\s+(.+)$/)
      const orderedMatch = line.match(/^\s*(\d+)\.\s+(.+)$/)

      if (unorderedMatch) {
        if (currentListType === 'ol') {
          // Close previous ordered list
          if (currentList.length > 0) {
            processedLines.push(`<ol>${currentList.join('')}</ol>`)
            currentList = []
          }
        }
        currentListType = 'ul'
        currentList.push(`<li>${unorderedMatch[1]}</li>`)
      } else if (orderedMatch) {
        if (currentListType === 'ul') {
          // Close previous unordered list
          if (currentList.length > 0) {
            processedLines.push(`<ul>${currentList.join('')}</ul>`)
            currentList = []
          }
        }
        currentListType = 'ol'
        currentList.push(`<li>${orderedMatch[2]}</li>`)
      } else {
        // Close current list if exists
        if (currentList.length > 0 && currentListType) {
          const tag = currentListType === 'ul' ? 'ul' : 'ol'
          processedLines.push(`<${tag}>${currentList.join('')}</${tag}>`)
          currentList = []
          currentListType = null
        }
        processedLines.push(line)
      }
    }

    // Close any remaining list
    if (currentList.length > 0 && currentListType) {
      const tag = currentListType === 'ul' ? 'ul' : 'ol'
      processedLines.push(`<${tag}>${currentList.join('')}</${tag}>`)
    }

    html = processedLines.join('\n')

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr>')
    html = html.replace(/^\*\*\*$/gm, '<hr>')

    // Paragraphs (wrap consecutive non-block elements)
    const blockElements = /<(h[1-6]|p|div|ul|ol|li|blockquote|pre|table|hr)/i
    const paragraphs: string[] = []
    let currentParagraph: string[] = []

    html.split('\n').forEach((line) => {
      const trimmed = line.trim()
      if (!trimmed) {
        if (currentParagraph.length > 0) {
          paragraphs.push('<p>' + currentParagraph.join(' ') + '</p>')
          currentParagraph = []
        }
        return
      }

      if (blockElements.test(trimmed)) {
        if (currentParagraph.length > 0) {
          paragraphs.push('<p>' + currentParagraph.join(' ') + '</p>')
          currentParagraph = []
        }
        paragraphs.push(trimmed)
      } else {
        currentParagraph.push(trimmed)
      }
    })

    if (currentParagraph.length > 0) {
      paragraphs.push('<p>' + currentParagraph.join(' ') + '</p>')
    }

    html = paragraphs.join('\n')

    // Clean up empty paragraphs and fix nested lists
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p>(<ul>|<ol>)/g, '$1')
    html = html.replace(/(<\/ul>|<\/ol>)<\/p>/g, '$1')

    return html
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    return markdown
  }
}
