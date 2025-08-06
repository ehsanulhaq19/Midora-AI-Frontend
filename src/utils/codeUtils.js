// utils/codeUtils.js
// Code detection, validation, execution utilities

// Language detection function
export const detectLanguage = (code, className) => {
  if (className) {
    const match = className.match(/language-(\w+)/);
    if (match) return match[1];
  }

  // Handle empty or whitespace-only code
  if (!code || !code.trim()) return 'text';

  // Auto-detect based on code content
  if (code.includes('def ') || code.includes('import ') || code.includes('print(')) return 'python';
  if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
  if (code.includes('<!DOCTYPE') || code.includes('<html')) return 'html';
  if (code.includes('{') && code.includes('}') && code.includes(':')) return 'css';
  if (code.includes('SELECT') || code.includes('FROM') || code.includes('WHERE')) return 'sql';
  if (code.startsWith('{') || code.startsWith('[')) return 'json';
  if (code.includes('#!/bin/') || code.includes('sudo ') || code.includes('cd ')) return 'bash';

  return 'text';
};

// Code execution functionality
export const executeCode = async (code, language) => {
  if (language === 'javascript') {
    try {
      // Create a safe execution environment
      const logs = [];
      const customConsole = {
        log: (...args) => logs.push(args.join(' ')),
        error: (...args) => logs.push('ERROR: ' + args.join(' ')),
        warn: (...args) => logs.push('WARNING: ' + args.join(' '))
      };

      // Execute the code in a controlled environment
      const func = new Function('console', `
        try {
          ${code}
        } catch (error) {
          console.error(error.message);
        }
      `);

      func(customConsole);
      return { success: true, output: logs.join('\n') || 'Code executed successfully (no output)' };
    } catch (error) {
      return { success: false, output: `Execution Error: ${error.message}` };
    }
  } else if (language === 'python') {
    return { success: false, output: 'Python execution requires backend service - feature coming soon!' };
  } else {
    return { success: false, output: `Execution not supported for ${language} yet` };
  }
};

// Code validation functionality
export const validateCode = (code, language) => {
  const issues = [];

  if (language === 'javascript') {
    try {
      new Function(code);
      return { valid: true, issues: [] };
    } catch (error) {
      return { valid: false, issues: [`Syntax Error: ${error.message}`] };
    }
  } else if (language === 'python') {
    // Basic Python validation
    if (code.includes('import os') && code.includes('system')) {
      issues.push('Warning: Potentially unsafe system calls detected');
    }
    if (!code.trim()) {
      issues.push('Warning: Empty code block');
    }
    return { valid: issues.length === 0, issues };
  }

  return { valid: true, issues: [] };
};

// Export functionality
export const exportCode = async (code, language, filename) => {
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || `code.${language}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Function to clean and format pasted code
export const formatPastedCode = (text) => {
  // Check if text looks like code (has common code patterns)
  const codePatterns = [
    /class\s+\w+/,
    /def\s+\w+/,
    /function\s+\w+/,
    /import\s+\w+/,
    /from\s+\w+/,
    /public\s+class/,
    /private\s+\w+/,
    /const\s+\w+/,
    /let\s+\w+/,
    /var\s+\w+/
  ];

  const hasCodePatterns = codePatterns.some(pattern => pattern.test(text));
  const hasMultipleLines = text.includes('\n');
  const hasIndentation = /^\s{2,}/m.test(text);

  // If it looks like code, wrap it in proper markdown code blocks
  if (hasCodePatterns && hasMultipleLines && hasIndentation) {
    // Try to detect language
    let language = 'text';
    if (/class\s+\w+:|def\s+\w+:|import\s+\w+/.test(text)) language = 'python';
    else if (/public\s+class|import\s+java/.test(text)) language = 'java';
    else if (/function\s+\w+|const\s+\w+|let\s+\w+/.test(text)) language = 'javascript';
    else if (/<\w+>|<!DOCTYPE/.test(text)) language = 'html';

    // Clean up the text and wrap in code blocks
    const cleanedText = text.trim();
    return `Please review this ${language} code:\n\n\`\`\`${language}\n${cleanedText}\n\`\`\``;
  }

  return text;
};

// Code analysis utilities
export const codeAnalysis = {
  getComplexity: function(code, language) {
    if (language === 'javascript') {
      const lines = code.split('\n').filter(line => line.trim());
      const functions = (code.match(/function\s+\w+|=>\s*{|\w+\s*=\s*function/g) || []).length;
      const conditionals = (code.match(/if\s*\(|switch\s*\(|while\s*\(|for\s*\(/g) || []).length;

      return {
        lines: lines.length,
        functions,
        conditionals,
        complexity: functions + conditionals
      };
    }
    return { lines: code.split('\n').length, complexity: 0 };
  },

  findPotentialIssues: function(code, language) {
    const issues = [];

    if (language === 'javascript') {
      if (code.includes('eval(')) issues.push('Security: Use of eval() detected');
      if (code.includes('innerHTML')) issues.push('Security: Use of innerHTML detected');
      if (code.match(/var\s+/)) issues.push('Style: Consider using let/const instead of var');
      if (code.includes('==') && !code.includes('===')) issues.push('Style: Consider using === instead of ==');
    }

    return issues;
  },

  getSuggestions: function(code, language) {
    const suggestions = [];

    if (language === 'javascript') {
      if (!code.includes('const') && !code.includes('let')) {
        suggestions.push('Consider using const/let for variable declarations');
      }
      if (code.includes('function') && !code.includes('=>')) {
        suggestions.push('Consider using arrow functions for shorter syntax');
      }
    }

    return suggestions;
  }
};