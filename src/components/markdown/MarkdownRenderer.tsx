"use client";

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@/hooks/use-theme'
import type { MarkdownRendererProps } from './types'
import { Copy } from '@/icons/copy'

type CodeSection = {
  name: string
  content: string
}

// Try to split a large code block into logical sections (functions, classes, etc.)
// so each part can be copied separately (useful for long files like the Python
// example you shared).
const splitCodeIntoSections = (code: string, language: string): CodeSection[] => {
  const lang = language.toLowerCase()
  const lines = code.split('\n')

  // Only try to split for languages where it makes sense
  const isStructuredLang = ['python', 'py', 'javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'].includes(lang)
  if (!isStructuredLang || lines.length < 30) {
    return [{ name: '', content: code }]
  }

  const sections: { name: string; lines: string[] }[] = []
  let current: { name: string; lines: string[] } | null = null

  const pushCurrent = () => {
    if (current && current.lines.length > 0) {
      sections.push({ name: current.name, lines: [...current.lines] })
    }
  }

  const startSection = (name: string, firstLine: string) => {
    pushCurrent()
    current = { name, lines: [firstLine] }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    // Python: def / class at the left margin
    if (lang === 'python' || lang === 'py') {
      const pyMatch = trimmed.match(/^(def|class)\s+([A-Za-z_]\w*)/)
      if (pyMatch && !line.startsWith(' ')) {
        startSection(pyMatch[2], line)
        continue
      }
    }

    // JS / TS: function / class / const name = (...) => / export function / etc.
    if (['javascript', 'js', 'typescript', 'ts', 'jsx', 'tsx'].includes(lang)) {
      const jsMatch =
        trimmed.match(/^(export\s+)?(async\s+)?(function|class)\s+([A-Za-z_]\w*)/) ||
        trimmed.match(/^(export\s+)?(const|let|var)\s+([A-Za-z_]\w*)\s*=\s*(async\s+)?\(/)

      if (jsMatch && !line.startsWith('  //')) {
        const name = jsMatch[4] || jsMatch[3]
        startSection(name, line)
        continue
      }
    }

    if (!current) {
      current = { name: '', lines: [line] }
    } else {
      current.lines.push(line)
    }
  }

  pushCurrent()

  // If we didn't actually find meaningful splits, fall back to a single section
  if (sections.length <= 1) {
    return [{ name: '', content: code }]
  }

  return sections.map((s) => ({
    name: s.name,
    content: s.lines.join('\n').trimEnd(),
  }))
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = "",
  onLinkClick,
}) => {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [copiedCodeBlocks, setCopiedCodeBlocks] = useState<Set<number>>(new Set())
  
  // Pre-process markdown to extract filenames from headings before code blocks
  // Pattern: Heading text (like "index.js") followed immediately by a code block
  const processedContent = React.useMemo(() => {
    // Split content into lines
    const lines = content.split('\n')
    const processed: string[] = []
    let i = 0
    
    while (i < lines.length) {
      const line = lines[i]
      
      // Check if this is a heading (starts with #)
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
      
      if (headingMatch) {
        const headingText = headingMatch[2].trim()
        // Check if next non-empty line is a code block
        let j = i + 1
        const blankLines: string[] = []
        while (j < lines.length && lines[j].trim() === '') {
          blankLines.push(lines[j])
          j++
        }
        
        if (j < lines.length && lines[j].startsWith('```')) {
          // This heading is likely a filename for the code block
          // Extract language from code block
          const codeBlockLine = lines[j]
          const langMatch = codeBlockLine.match(/^```(\w+)?/)
          const language = langMatch ? langMatch[1] || 'text' : 'text'
          
          // Add the code block with filename in language tag (skip heading and blank lines)
          processed.push(`\`\`\`${language}:${headingText}`)
          
          // Skip the heading and blank lines, move to code block
          i = j + 1
          continue
        }
      }
      
      processed.push(line)
      i++
    }
    
    return processed.join('\n')
  }, [content])
  
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings with theme-aware styling
          h1: ({ children }) => (
            <h1 className="app-text-3xl font-bold app-text-primary mb-4 mt-6 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="app-text-2xl font-semibold app-text-primary mb-3 mt-5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="app-text-xl font-medium app-text-primary mb-2 mt-4 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="app-text-lg font-medium app-text-primary mb-2 mt-3 first:mt-0">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="app-text-md font-medium app-text-primary mb-2 mt-3 first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="app-text-sm font-medium app-text-primary mb-2 mt-3 first:mt-0">
              {children}
            </h6>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className={`markdown-paragraph app-text-md app-text-primary mb-3 relative font-h02-heading02 font-[number:var(--text-font-weight)] tracking-[var(--text-letter-spacing)] leading-[var(--text-line-height)] [font-style:var(--text-font-style)] break-words ${isDark ? 'text-white' : 'text-[color:var(--light-mode-colors-dark-gray-900)]'}`}>
              {children}
            </p>
          ),

          // Lists with theme styling
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-1 app-text-primary">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1 app-text-primary">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="app-text-primary">{children}</li>
          ),

          // Tables with theme styling
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full border-collapse border border-[color:var(--tokens-color-border-border-inactive)] rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[color:var(--tokens-color-surface-surface-secondary)]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-[color:var(--tokens-color-border-border-inactive)]">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] border-r border-[color:var(--tokens-color-border-border-inactive)] last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-sm text-[color:var(--tokens-color-text-text-primary)] border-r border-[color:var(--tokens-color-border-border-inactive)] last:border-r-0">
              {children}
            </td>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[color:var(--tokens-color-text-text-brand)] pl-4 py-2 mb-4 bg-[color:var(--tokens-color-surface-surface-secondary)] rounded-r-lg">
              <div className="text-[color:var(--tokens-color-text-text-primary)] italic">
                {children}
              </div>
            </blockquote>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-[color:var(--tokens-color-text-text-brand)] hover:text-[color:var(--tokens-color-text-text-brand)] underline hover:no-underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                if (onLinkClick) {
                  onLinkClick(event, href);
                }
              }}
            >
              {children}
            </a>
          ),

          // Code blocks with syntax highlighting - theme-aware
          code: ({ node, className, children, ...props }: any) => {
            const match = /language-(\w+)(?::(.+))?/.exec(className || '')
            
            if (match) {
              const language = match[1]
              const filename = match[2] || null
              const codeContent = String(children).replace(/\n$/, "")
              // Optionally split a long file into smaller logical sections so each
              // function/class can be copied on its own.
              const sections = splitCodeIntoSections(codeContent, language)

              const codeStyle: Record<string, string | number> = {
                backgroundColor: isDark ? '#282c34' : '#ffffff',
                margin: 0,
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                padding: '1rem',
              }
              
              const codeTagStyle: Record<string, string> = {
                color: isDark ? '#ffffff' : '#1f2937',
              }

              return (
                <div className="space-y-4 my-6">
                  {sections.map((section, index) => {
                    const sectionCode = section.content

                    // Generate an ID per section for copy state tracking
                    const sectionId =
                      sectionCode.split('').reduce((acc, char) => {
                        return ((acc << 5) - acc) + char.charCodeAt(0)
                      }, 0) +
                      index +
                      (filename ? filename.length : 0)

                    const isCopied = copiedCodeBlocks.has(sectionId)

                    const handleCopySection = async () => {
                      if (isCopied) return
                      try {
                        await navigator.clipboard.writeText(sectionCode)
                        setCopiedCodeBlocks((prev) => {
                          const next = new Set(prev)
                          next.add(sectionId)
                          return next
                        })
                        setTimeout(() => {
                          setCopiedCodeBlocks((prev) => {
                            const next = new Set(prev)
                            next.delete(sectionId)
                            return next
                          })
                        }, 2000)
                      } catch (err) {
                        console.error('Failed to copy code:', err)
                      }
                    }

                    // Decide what to show in the header:
                    // filename > section name > language
                    const displayLabel =
                      filename
                        ? section.name
                          ? `${filename} – ${section.name}`
                          : filename
                        : section.name || language

                    return (
                      <div
                        key={index}
                        className="rounded-lg overflow-hidden border border-[color:var(--tokens-color-border-border-inactive)] bg-[color:var(--tokens-color-surface-surface-secondary)]"
                      >
                        <div className="flex items-center justify-between px-4 py-2.5 bg-[color:var(--tokens-color-surface-surface-tertiary)] border-b border-[color:var(--tokens-color-border-border-inactive)]">
                          <div className="flex items-center gap-2">
                            {displayLabel && (
                              <span className="text-sm font-medium text-[color:var(--tokens-color-text-text-primary)] font-mono">
                                {displayLabel}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={handleCopySection}
                            disabled={isCopied}
                            className="flex items-center gap-1.5 px-2 py-1 text-xs text-[color:var(--tokens-color-text-text-primary)] hover:bg-[color:var(--tokens-color-surface-surface-secondary)] rounded transition-colors disabled:opacity-50"
                            aria-label={isCopied ? 'Copied' : 'Copy code'}
                          >
                            {isCopied ? (
                              <span className="text-green-500 text-xs">✓ Copied</span>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="relative">
                          <SyntaxHighlighter
                            style={isDark ? oneDark : oneLight}
                            language={language}
                            PreTag="div"
                            className={isDark ? '!bg-[#282c34] !text-white' : '!bg-[#e8e8e8] !text-gray-800'}
                            customStyle={codeStyle as any}
                            codeTagProps={{
                              style: codeTagStyle as any,
                            }}
                            {...props}
                          >
                            {sectionCode}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            }

            return (
              <code
                className="bg-[color:var(--tokens-color-surface-surface-secondary)] text-[color:var(--tokens-color-text-text-primary)] px-1.5 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },

          // Horizontal rule
          hr: () => (
            <hr className="my-6 border-0 h-px bg-[color:var(--tokens-color-border-border-inactive)]" />
          ),

          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold text-[color:var(--tokens-color-text-text-primary)]">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[color:var(--tokens-color-text-text-primary)]">
              {children}
            </em>
          ),

          // Images
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg my-4 border border-[color:var(--tokens-color-border-border-inactive)]"
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
