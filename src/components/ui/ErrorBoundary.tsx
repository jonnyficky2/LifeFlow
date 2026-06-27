import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    if (window.confirm("WARNING: This will wipe all local application data (tasks, habits, notes) and reset the app. Are you sure?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '24px',
          backgroundColor: '#0F172A',
          color: '#F9FAFB',
          fontFamily: "'Inter', -apple-system, sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '550px',
            backgroundColor: '#1E293B',
            borderRadius: '16px',
            padding: '40px 24px',
            border: '1px solid #334155',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{
              fontSize: '56px',
              marginBottom: '24px'
            }}>⚠️</div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#EF4444'
            }}>Something went wrong</h1>
            <p style={{
              fontSize: '15px',
              color: '#9CA3AF',
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              LifeFlow encountered an unexpected error. Don't worry, your data is likely safe. Try reloading the app first.
            </p>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '32px'
            }}>
              <button 
                onClick={this.handleReload}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#4F46E5',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  outline: 'none'
                }}
              >
                Reload Application
              </button>
              <button 
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  color: '#9CA3AF',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Clear Data & Reset
              </button>
            </div>

            {this.state.error && (
              <details style={{
                textAlign: 'left',
                backgroundColor: '#0F172A',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #334155',
                cursor: 'pointer'
              }}>
                <summary style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#6366F1'
                }}>Technical Details</summary>
                <pre style={{
                  margin: '12px 0 0 0',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  color: '#F3F4F6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
