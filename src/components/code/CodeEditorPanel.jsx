// components/code/CodeEditorPanel.jsx
import { useState, useEffect } from 'react';
import { executeCode, validateCode, exportCode } from '../../utils/codeUtils.js';

const CodeEditorPanel = ({ isOpen, onClose, initialCode, language, onSave, onAIReview }) => {
  const [code, setCode] = useState(initialCode || '');
  const [saved, setSaved] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    setCode(initialCode || '');
  }, [initialCode]);

  useEffect(() => {
    const validation = validateCode(code, language);
    setValidationResult(validation);
  }, [code, language]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // Escape to close
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = () => {
    if (onSave) {
      onSave(code, language);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleExecute = async () => {
    if (!['javascript'].includes(language)) return;

    setExecuting(true);
    setExecutionResult(null);

    const result = await executeCode(code, language);
    setExecutionResult(result);
    setExecuting(false);
  };

  const handleExport = () => {
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `edited_code_${timestamp}.${language === 'javascript' ? 'js' : language}`;
    exportCode(code, language, filename);
  };

  const handleAIReview = () => {
    if (onAIReview) {
      onAIReview(code, language);
    }
  };

  const getStats = () => {
    const lines = code.split('\n').length;
    const characters = code.length;
    const words = code.trim() ? code.trim().split(/\s+/).length : 0;
    return { lines, characters, words };
  };

  const stats = getStats();

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      right: '0',
      width: '50%',
      height: '100vh',
      backgroundColor: '#1f1f1f',
      borderLeft: '1px solid #404040',
      zIndex: '1000',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-4px 0 8px rgba(0, 0, 0, 0.3)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #404040'
      }}>
        <div>
          <h3 style={{
            margin: '0',
            color: '#e6e6e6',
            fontSize: '16px',
            fontWeight: '500'
          }}>
            Code Editor
          </h3>
          <span style={{
            fontSize: '12px',
            color: '#a0a0a0',
            textTransform: 'lowercase'
          }}>
            {language || 'text'}
            {validationResult && !validationResult.valid && (
              <span style={{ color: '#f85149', marginLeft: '8px' }}>
                ⚠️ {validationResult.issues.length} issue(s)
              </span>
            )}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #404040',
              borderRadius: '4px',
              color: '#a0a0a0',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            📋 Copy
          </button>

          {['javascript'].includes(language) && (
            <button
              onClick={handleExecute}
              disabled={executing}
              style={{
                padding: '6px 12px',
                backgroundColor: executing ? '#1f7a1f' : '#22c55e',
                border: 'none',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '12px',
                cursor: executing ? 'not-allowed' : 'pointer',
                opacity: executing ? 0.7 : 1
              }}
            >
              {executing ? '⏳ Running...' : '▶️ Run'}
            </button>
          )}

          <button
            onClick={handleExport}
            style={{
              padding: '6px 12px',
              backgroundColor: 'transparent',
              border: '1px solid #404040',
              borderRadius: '4px',
              color: '#a0a0a0',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            💾 Export
          </button>

          <button
            onClick={handleAIReview}
            style={{
              padding: '6px 12px',
              backgroundColor: '#8b5cf6',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🔍 AI Review
          </button>

          <button
            onClick={handleSave}
            style={{
              padding: '6px 12px',
              backgroundColor: saved ? '#22c55e' : '#3b82f6',
              border: 'none',
              borderRadius: '4px',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
              minWidth: '60px'
            }}
          >
            {saved ? '✅ Saved!' : '💾 Save'}
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '6px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              color: '#a0a0a0',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Validation Issues */}
      {validationResult && validationResult.issues.length > 0 && (
        <div style={{
          padding: '8px 16px',
          backgroundColor: '#2d1b00',
          borderBottom: '1px solid #404040',
          fontSize: '12px',
          color: '#f85149'
        }}>
          {validationResult.issues.map((issue, index) => (
            <div key={index}>⚠️ {issue}</div>
          ))}
        </div>
      )}

      {/* Editor */}
      <div style={{ flex: '1', overflow: 'hidden' }}>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            width: '100%',
            height: '100%',
            padding: '16px',
            backgroundColor: '#1f1f1f',
            color: '#e6e6e6',
            border: 'none',
            outline: 'none',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '14px',
            lineHeight: '1.5',
            resize: 'none',
            boxSizing: 'border-box'
          }}
          placeholder="Start typing your code..."
          autoFocus
        />
      </div>

      {/* Execution Result */}
      {executionResult && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: executionResult.success ? '#0d2818' : '#2d1618',
          borderTop: '1px solid #404040',
          fontSize: '12px',
          color: executionResult.success ? '#7ee787' : '#f85149',
          maxHeight: '200px',
          overflow: 'auto'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {executionResult.success ? '✅ Execution Result:' : '❌ Execution Error:'}
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {executionResult.output}
          </pre>
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#2d2d2d',
        borderTop: '1px solid #404040',
        fontSize: '12px',
        color: '#a0a0a0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Press Ctrl/Cmd + S to save • Esc to close</span>
          <span>{stats.lines} lines • {stats.characters} chars • {stats.words} words</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;