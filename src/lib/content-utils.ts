/**
 * Content utility functions
 * Utilities for word counting and markdown truncation
 */

/**
 * Count words in text content
 * Simple word counting: splits by whitespace and filters empty strings
 */
export const countWords = (content: string): number => {
  if (!content || typeof content !== 'string') {
    return 0
  }
  
  // Convert markdown to plain text for accurate word counting
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list bullets
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered lists
    .replace(/\|/g, ' ') // Replace table separators with spaces
    .replace(/-{3,}/g, '') // Remove table separators
    .trim()
  
  const words = plainText.split(/\s+/).filter(Boolean)
  return words.length
}

/**
 * Check if content exceeds word threshold
 */
export const exceedsWordThreshold = (content: string, threshold: number = 200): boolean => {
  return countWords(content) > threshold
}

/**
 * Truncate markdown content while preserving syntax
 * Attempts to truncate at natural breakpoints (sentence, paragraph, list item)
 */
export const truncateMarkdown = (
  content: string,
  targetWords: number = 50
): { truncated: string; wasTruncated: boolean } => {
  if (!content || typeof content !== 'string') {
    return { truncated: '', wasTruncated: false }
  }
  
  const wordCount = countWords(content)
  
  // If content is shorter than target, return as-is
  if (wordCount <= targetWords) {
    return { truncated: content, wasTruncated: false }
  }
  
  // Try to find a good truncation point
  // Split by paragraphs first
  const paragraphs = content.split(/\n\n+/)
  let truncatedContent = ''
  let currentWordCount = 0
  let paragraphIndex = 0
  
  // Add paragraphs until we reach target word count
  while (paragraphIndex < paragraphs.length && currentWordCount < targetWords) {
    const paragraph = paragraphs[paragraphIndex]
    const paragraphWords = countWords(paragraph)
    
    if (currentWordCount + paragraphWords <= targetWords) {
      truncatedContent += (truncatedContent ? '\n\n' : '') + paragraph
      currentWordCount += paragraphWords
      paragraphIndex++
    } else {
      // Try to truncate within this paragraph
      const words = paragraph.split(/\s+/)
      const remainingWords = targetWords - currentWordCount
      
      if (remainingWords > 0 && words.length > remainingWords) {
        // Try to find a sentence boundary
        const truncatedParagraph = words.slice(0, remainingWords).join(' ')
        
        // Check if we can end at a sentence boundary
        const lastSentence = truncatedParagraph.match(/[.!?]\s*$/)
        if (lastSentence) {
          truncatedContent += (truncatedContent ? '\n\n' : '') + truncatedParagraph
        } else {
          // Try to find the last sentence boundary
          const sentences = paragraph.match(/[^.!?]*[.!?]+/g) || []
          let sentenceWords = 0
          let sentenceIndex = 0
          
          while (sentenceIndex < sentences.length && sentenceWords < remainingWords) {
            const sentence = sentences[sentenceIndex]
            const sentenceWordCount = countWords(sentence)
            
            if (sentenceWords + sentenceWordCount <= remainingWords) {
              sentenceWords += sentenceWordCount
              sentenceIndex++
            } else {
              break
            }
          }
          
          if (sentenceIndex > 0) {
            truncatedContent += (truncatedContent ? '\n\n' : '') + 
              sentences.slice(0, sentenceIndex).join(' ')
          } else {
            truncatedContent += (truncatedContent ? '\n\n' : '') + truncatedParagraph
          }
        }
      }
      break
    }
  }
  
  // If we couldn't truncate properly, fall back to simple word-based truncation
  if (!truncatedContent || currentWordCount === 0) {
    const words = content.split(/\s+/)
    truncatedContent = words.slice(0, targetWords).join(' ')
    
    // Try to avoid cutting in the middle of markdown syntax
    // Remove incomplete markdown tags at the end
    truncatedContent = truncatedContent.replace(/\*+$/, '')
    truncatedContent = truncatedContent.replace(/`+$/, '')
    truncatedContent = truncatedContent.replace(/\[$/, '')
    truncatedContent = truncatedContent.replace(/\($/, '')
  }
  
  // Ensure we don't break code blocks
  const codeBlockMatches = truncatedContent.match(/```/g)
  if (codeBlockMatches && codeBlockMatches.length % 2 !== 0) {
    // Unclosed code block, remove the last incomplete one
    const lastCodeBlockIndex = truncatedContent.lastIndexOf('```')
    truncatedContent = truncatedContent.substring(0, lastCodeBlockIndex)
  }
  
  return {
    truncated: truncatedContent.trim() + '...',
    wasTruncated: true
  }
}

/**
 * Extract the first line of content (title or first heading)
 * Falls back to first sentence or first few words
 */
export const getFirstLine = (content: string, maxLength: number = 50): string => {
  if (!content || typeof content !== 'string') {
    return ''
  }
  
  // Remove markdown formatting for cleaner display
  let plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove heading markers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .trim()
  
  // Try to get first line (before first newline)
  const firstLine = plainText.split('\n')[0].trim()
  
  if (firstLine && firstLine.length <= maxLength) {
    return firstLine
  }
  
  // If first line is too long, try to get first sentence
  const firstSentence = plainText.match(/^[^.!?]*[.!?]/)?.[0]?.trim()
  if (firstSentence && firstSentence.length <= maxLength) {
    return firstSentence
  }
  
  // Fall back to first few words
  const words = plainText.split(/\s+/)
  let result = ''
  for (const word of words) {
    if ((result + ' ' + word).length <= maxLength) {
      result = result ? result + ' ' + word : word
    } else {
      break
    }
  }
  
  return result || plainText.slice(0, maxLength)
}

