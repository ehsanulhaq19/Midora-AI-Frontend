import React, { useState } from 'react';

const CodeBlock = ({ children, className, language, onEdit }) => {
  const [copied, setCopied] = useState(false);

  // Extract the code content
  const code = typeof children === 'string' ? children : children?.props?.children || '';

  // Detect language from className (e.g., "language-javascript")
  const detectedLanguage = className?.replace('language-', '') || language || 'text';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(code, detectedLanguage);
    }
  };

  return (
    <div className="code-block-container" style={{
      position: 'relative',
      marginBottom: '16px',
      backgroundColor: '#0d1117',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid #30363d'
    }}>
      {/* Header with language and buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#161b22',
        borderBottom: '1px solid #30363d',
        fontSize: '12px',
        color: '#7d8590'
      }}>
        <span style={{
          textTransform: 'lowercase',
          fontWeight: '500'
        }}>
          {detectedLanguage}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {/* Copy Button */}
          <button
            onClick={copyToClipboard}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: copied ? '#238636' : '#f0f6fc',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              if (!copied) {
                e.target.style.backgroundColor = '#21262d';
                e.target.style.borderColor = '#8b949e';
              }
            }}
            onMouseLeave={(e) => {
              if (!copied) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#30363d';
              }
            }}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
                  <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
                </svg>
                Copy
              </>
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={handleEdit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#f0f6fc',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#21262d';
              e.target.style.borderColor = '#8b949e';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = '#30363d';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61zm1.414 1.06a.25.25 0 00-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 000-.354l-1.086-1.086zM11.189 6.25L9.75 4.81l-6.286 6.287a.25.25 0 00-.064.108l-.558 1.953 1.953-.558a.249.249 0 00.108-.064l6.286-6.286z"/>
            </svg>
            Edit
          </button>
        </div>
      </div>

      {/* Code content */}
      <pre style={{
        margin: '0',
        padding: '16px',
        backgroundColor: '#0d1117',
        color: '#e6edf3',
        fontSize: '14px',
        lineHeight: '1.45',
        overflow: 'auto',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
      }}>
        <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;