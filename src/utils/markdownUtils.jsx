// utils/markdownUtils.js
// Shared markdown components for consistent styling

export const markdownComponents = {
  // Enhanced paragraph styling
  p({ children, ...props }) {
    return (
      <div style={{ marginBottom: '16px', lineHeight: '1.7' }} {...props}>
        {children}
      </div>
    );
  },

  // Enhanced blockquote styling
  blockquote({ children, ...props }) {
    return (
      <div
        style={{
          borderLeft: '4px solid var(--chatgpt-button)',
          paddingLeft: '16px',
          margin: '16px 0',
          color: 'var(--chatgpt-text-secondary)',
          fontStyle: 'italic',
          backgroundColor: 'var(--chatgpt-hover)',
          padding: '16px',
          borderRadius: '8px'
        }}
        {...props}
      >
        {children}
      </div>
    );
  },

  // Enhanced list styling
  ul({ children, ...props }) {
    return (
      <ul
        style={{
          marginLeft: '20px',
          marginBottom: '16px',
          lineHeight: '1.7'
        }}
        {...props}
      >
        {children}
      </ul>
    );
  },

  ol({ children, ...props }) {
    return (
      <ol
        style={{
          marginLeft: '20px',
          marginBottom: '16px',
          lineHeight: '1.7'
        }}
        {...props}
      >
        {children}
      </ol>
    );
  },

  // Enhanced table styling
  table({ children, ...props }) {
    return (
      <div style={{ overflow: 'auto', margin: '16px 0' }}>
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            border: '1px solid var(--chatgpt-border)'
          }}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },

  th({ children, ...props }) {
    return (
      <th
        style={{
          border: '1px solid var(--chatgpt-border)',
          padding: '8px 12px',
          backgroundColor: 'var(--chatgpt-hover)',
          fontWeight: '600',
          textAlign: 'left'
        }}
        {...props}
      >
        {children}
      </th>
    );
  },

  td({ children, ...props }) {
    return (
      <td
        style={{
          border: '1px solid var(--chatgpt-border)',
          padding: '8px 12px'
        }}
        {...props}
      >
        {children}
      </td>
    );
  },

  // Enhanced heading styling
  h1({ children, ...props }) {
    return (
      <h1
        style={{
          fontSize: '24px',
          fontWeight: '600',
          margin: '24px 0 16px 0',
          color: 'var(--chatgpt-text)'
        }}
        {...props}
      >
        {children}
      </h1>
    );
  },

  h2({ children, ...props }) {
    return (
      <h2
        style={{
          fontSize: '20px',
          fontWeight: '600',
          margin: '20px 0 12px 0',
          color: 'var(--chatgpt-text)'
        }}
        {...props}
      >
        {children}
      </h2>
    );
  },

  h3({ children, ...props }) {
    return (
      <h3
        style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: '16px 0 8px 0',
          color: 'var(--chatgpt-text)'
        }}
        {...props}
      >
        {children}
      </h3>
    );
  },

  // Enhanced link styling
  a({ children, href, ...props }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'var(--chatgpt-button)',
          textDecoration: 'none',
          borderBottom: '1px solid transparent',
          transition: 'border-color 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.borderBottomColor = 'var(--chatgpt-button)';
        }}
        onMouseLeave={(e) => {
          e.target.style.borderBottomColor = 'transparent';
        }}
        {...props}
      >
        {children}
      </a>
    );
  }
};