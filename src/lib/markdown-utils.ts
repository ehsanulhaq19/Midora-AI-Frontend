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
