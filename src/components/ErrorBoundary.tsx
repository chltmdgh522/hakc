import React, { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #e9f8f8 0%, #e6f3ff 100%)',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(91,147,198,0.10)',
            maxWidth: '400px',
          }}>
            <h2 style={{ color: '#1e3a8a', marginBottom: '16px' }}>
              오류가 발생했습니다
            </h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#1e3a8a',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 