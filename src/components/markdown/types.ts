import type { MouseEvent } from 'react'

export interface MarkdownRendererProps {
  /**
   * The markdown content to render
   */
  content: string
  
  /**
   * Additional CSS classes to apply to the markdown container
   */
  className?: string

  /**
   * Optional handler invoked when an anchor tag is clicked
   */
  onLinkClick?: (event: MouseEvent<HTMLAnchorElement>, href?: string) => void
}
