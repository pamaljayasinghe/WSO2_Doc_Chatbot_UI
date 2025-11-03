import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './MessageItem.css';

export default function MessageItem({ message }) {
  const cls = message.from === 'user' ? 'msg user' : 'msg bot';
  
  return (
    <div className={cls} aria-live="polite">
      <div className="msg-content">
        {message.from === 'bot' ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              // Customize how different markdown elements are rendered
              h1: ({children}) => <h1 style={{fontSize: '1.5em', marginBottom: '0.5em', color: '#2c3e50'}}>{children}</h1>,
              h2: ({children}) => <h2 style={{fontSize: '1.3em', marginBottom: '0.4em', color: '#34495e'}}>{children}</h2>,
              h3: ({children}) => <h3 style={{fontSize: '1.1em', marginBottom: '0.3em', color: '#34495e'}}>{children}</h3>,
              p: ({children}) => <p style={{marginBottom: '0.8em', lineHeight: '1.6'}}>{children}</p>,
              ul: ({children}) => <ul style={{marginBottom: '0.8em', paddingLeft: '1.5em'}}>{children}</ul>,
              ol: ({children}) => <ol style={{marginBottom: '0.8em', paddingLeft: '1.5em'}}>{children}</ol>,
              li: ({children}) => <li style={{marginBottom: '0.3em'}}>{children}</li>,
              code: ({children, className}) => {
                const isBlock = className?.includes('language-');
                return isBlock ? (
                  <pre style={{
                    backgroundColor: '#f8f9fa', 
                    padding: '1em', 
                    borderRadius: '6px', 
                    overflow: 'auto',
                    marginBottom: '0.8em',
                    border: '1px solid #e9ecef'
                  }}>
                    <code>{children}</code>
                  </pre>
                ) : (
                  <code style={{
                    backgroundColor: '#f8f9fa', 
                    padding: '0.2em 0.4em', 
                    borderRadius: '3px',
                    fontSize: '0.9em'
                  }}>{children}</code>
                );
              },
              blockquote: ({children}) => (
                <blockquote style={{
                  borderLeft: '4px solid #3498db',
                  paddingLeft: '1em',
                  margin: '0.8em 0',
                  fontStyle: 'italic',
                  backgroundColor: '#f8f9fa'
                }}>
                  {children}
                </blockquote>
              ),
              strong: ({children}) => <strong style={{fontWeight: '600'}}>{children}</strong>,
              em: ({children}) => <em style={{fontStyle: 'italic'}}>{children}</em>,
              a: ({children, href}) => (
                <a href={href} target="_blank" rel="noopener noreferrer" style={{
                  color: '#3498db',
                  textDecoration: 'none'
                }}>
                  {children}
                </a>
              ),
              hr: () => <hr style={{margin: '1.5em 0', border: 'none', borderTop: '1px solid #e9ecef'}} />
            }}
          >
            {message.text}
          </ReactMarkdown>
        ) : (
          message.text
        )}
      </div>
    </div>
  );
}
