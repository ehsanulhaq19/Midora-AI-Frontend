// components/code/CodeBlock.jsx
import { useState, useEffect } from 'react';
import { detectLanguage, executeCode, validateCode, exportCode } from '../../utils/codeUtils.js';

const CodeBlock = ({ children, className, onEdit, messageId, onAIReview }) => {
  const [copied, setCopied] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [showActions, setShowActions] = useState(false);
  const [versions, setVersions] = useState([]);

  const code = typeof children === 'string' ? children : children?.props?.children || '';
  const detectedLanguage = detectLanguage(code, className);

  // Auto-validate code on mount
  useEffect(() => {
    const validation = validateCode(code, detectedLanguage);
    setValidationResult(validation);
  }, [code, detectedLanguage]);

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
    console.log('Edit button clicked:', {
      code: code.substring(0, 50) + '...',
      language: detectedLanguage,
      messageId,
      onEdit: !!onEdit
    });

    // Save current version before editing
    const newVersion = {
      id: Date.now(),
      code: code,
      timestamp: new Date().toISOString(),
      description: 'Original version'
    };
    setVersions(prev => [newVersion, ...prev.slice(0, 4)]); // Keep last 5 versions

    if (onEdit) {
      onEdit(code, detectedLanguage, messageId);
    }
  };

  const handleExecute = async () => {
    setExecuting(true);
    setExecutionResult(null);

    const result = await executeCode(code, detectedLanguage);
    setExecutionResult(result);
    setExecuting(false);
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `code_${timestamp}.${detectedLanguage === 'javascript' ? 'js' : detectedLanguage}`;
    exportCode(code, detectedLanguage, filename);
  };

  const handleAIReview = () => {
    if (onAIReview) {
      onAIReview(code, detectedLanguage);
    }
  };

  const canExecute = ['javascript'].includes(detectedLanguage);

  return (
    <div
      key={`codeblock-${messageId}-${detectedLanguage}`}
      className="code-block-container"
      style={{
        position: 'relative',
        margin: '16px 0',
        backgroundColor: '#0d1117',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #30363d',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Header */}
      <div
        className="code-block-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 16px',
          backgroundColor: '#161b22',
          borderBottom: '1px solid #30363d',
          fontSize: '12px',
          color: '#7d8590'
        }}
      >
        <span
          className={`code-block-language ${detectedLanguage}`}
          style={{
            textTransform: 'capitalize',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: detectedLanguage === 'python' ? '#3776ab' :
                           detectedLanguage === 'javascript' ? '#f7df1e' :
                           detectedLanguage === 'css' ? '#1572b6' :
                           detectedLanguage === 'html' ? '#e34f26' :
                           detectedLanguage === 'json' ? '#000000' :
                           detectedLanguage === 'bash' ? '#4eaa25' :
                           detectedLanguage === 'sql' ? '#336791' : '#f85149'
          }}></span>
          {detectedLanguage}
          {validationResult && !validationResult.valid && (
            <span style={{ color: '#f85149', marginLeft: '4px' }} title={validationResult.issues.join(', ')}>
              ⚠️
            </span>
          )}
        </span>

        <div className="code-block-actions" style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={copyToClipboard}
            className={`code-block-btn ${copied ? 'success' : ''}`}
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
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>

          {canExecute && (
            <button
              onClick={handleExecute}
              disabled={executing}
              className="code-block-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: '1px solid #30363d',
                borderRadius: '6px',
                color: executing ? '#7d8590' : '#f0f6fc',
                fontSize: '12px',
                cursor: executing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontWeight: '500'
              }}
            >
              {executing ? '⏳ Running...' : '▶️ Run'}
            </button>
          )}

          {showActions && (
            <>
              <button
                onClick={handleExport}
                className="code-block-btn"
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
              >
                💾 Export
              </button>

              <button
                onClick={handleAIReview}
                className="code-block-btn"
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
              >
                🔍 Review
              </button>
            </>
          )}

          <button
            onClick={handleEdit}
            className="code-block-btn"
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
          >
            ✏️ Edit
          </button>
        </div>
      </div>

      {/* Validation Issues */}
      {validationResult && validationResult.issues.length > 0 && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#2d1b00',
          borderBottom: '1px solid #30363d',
          fontSize: '12px',
          color: '#f85149'
        }}>
          {validationResult.issues.map((issue, index) => (
            <div key={index}>⚠️ {issue}</div>
          ))}
        </div>
      )}

      {/* Code content */}
      <pre
        className="code-block-content"
        style={{
          margin: '0',
          padding: '16px',
          backgroundColor: '#0d1117',
          color: '#e6edf3',
          fontSize: '14px',
          lineHeight: '1.45',
          overflow: 'auto',
          fontFamily: 'SF Mono, Monaco, Inconsolata, Roboto Mono, Source Code Pro, Menlo, Consolas, DejaVu Sans Mono, monospace'
        }}
      >
        <code style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {code}
        </code>
      </pre>

      {/* Execution Result */}
      {executionResult && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: executionResult.success ? '#0d2818' : '#2d1618',
          borderTop: '1px solid #30363d',
          fontSize: '12px',
          color: executionResult.success ? '#7ee787' : '#f85149'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {executionResult.success ? '✅ Execution Result:' : '❌ Execution Error:'}
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {executionResult.output}
          </pre>
        </div>
      )}

      {/* Version History (if available) */}
      {versions.length > 0 && showActions && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: '0',
          width: '200px',
          backgroundColor: '#161b22',
          border: '1px solid #30363d',
          borderRadius: '6px',
          padding: '8px',
          fontSize: '12px',
          color: '#7d8590',
          zIndex: 1000
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Version History:</div>
          {versions.slice(0, 3).map(version => (
            <div key={version.id} style={{ padding: '2px 0', cursor: 'pointer' }}>
              📝 {new Date(version.timestamp).toLocaleTimeString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeBlock;