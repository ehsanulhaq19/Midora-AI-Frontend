'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { MarkdownRendererProps } from './types'

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '',
  onLinkClick
}) => {
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
            <p className="app-text-md app-text-primary mb-3 leading-relaxed break-words">
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
            <li className="app-text-primary">
              {children}
            </li>
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
          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),
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
                  onLinkClick(event, href)
                }
              }}
            >
              {children}
            </a>
          ),

          // Code blocks with syntax highlighting - white background
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '')
            
            if (!inline && match) {
              return (
                <div className="my-4 rounded-lg overflow-hidden border border-[color:var(--tokens-color-border-border-inactive)]">
                  <SyntaxHighlighter
                    style={oneLight}
                    language={match[1]}
                    PreTag="div"
                    className="!bg-white !text-gray-800"
                    customStyle={{
                      backgroundColor: '#ffffff',
                      margin: 0,
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      padding: '1rem',
                    }}
                    codeTagProps={{
                      style: {
                        color: '#1f2937',
                      }
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
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
            )
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
        {content}
      </ReactMarkdown>
    </div>
  )
}
