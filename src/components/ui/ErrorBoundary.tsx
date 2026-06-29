import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  confirmOpen: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    confirmOpen: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, confirmOpen: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ confirmOpen: true });
  };

  private confirmReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <div className="error-boundary-icon">⚠️</div>
            <h1 className="error-boundary-title">Something went wrong</h1>
            <p className="error-boundary-desc">
              LifeFlow encountered an unexpected error. Don't worry, your data is safe. Try reloading the app first.
            </p>

            <div className="error-boundary-btn-group">
              <button 
                onClick={this.handleReload}
                className="error-boundary-btn-primary"
              >
                Reload Application
              </button>
              <button 
                onClick={this.handleReset}
                className="error-boundary-btn-secondary"
              >
                Clear Data & Reset
              </button>
            </div>

            {this.state.error && (
              <details className="error-boundary-details">
                <summary className="error-boundary-summary">Technical Details</summary>
                <pre className="error-boundary-pre">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            {this.state.confirmOpen && (
              <div className="modal show" style={{ zIndex: 2000 }}>
                <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', padding: '24px', borderRadius: '12px', background: '#1E293B', border: '1px solid #334155' }}>
                  <h3 style={{ color: '#EF4444' }}>Warning</h3>
                  <p style={{ margin: '16px 0', color: '#9CA3AF' }}>
                    WARNING: This will wipe all local application data (tasks, habits, notes) and reset the app. Are you sure?
                  </p>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button className="btn btn-danger" onClick={this.confirmReset} style={{ padding: '10px 20px', fontWeight: 600 }}>Reset</button>
                    <button className="btn btn-secondary" onClick={() => this.setState({ confirmOpen: false })} style={{ padding: '10px 20px', fontWeight: 600 }}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
