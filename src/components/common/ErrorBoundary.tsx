import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service (e.g., Sentry)
    // if (import.meta.env.PROD) {
    //   logErrorToService(error, errorInfo);
    // }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
          <div className="max-w-md w-full">
            <div className="bg-bg-secondary border border-border-primary rounded-xl p-8 shadow-light-xl dark:shadow-dark-xl text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-status-error/10 rounded-full mb-4">
                <AlertTriangle className="w-8 h-8 text-status-error" />
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Oops! Something went wrong
              </h1>

              {/* Description */}
              <p className="text-text-secondary mb-6">
                We're sorry for the inconvenience. An unexpected error has occurred.
              </p>

              {/* Error details (development only) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="text-sm text-text-tertiary cursor-pointer hover:text-text-primary mb-2">
                    Show error details
                  </summary>
                  <div className="bg-bg-tertiary border border-border-primary rounded-lg p-4 overflow-auto max-h-48">
                    <p className="text-xs font-mono text-status-error mb-2">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="text-xs text-text-muted overflow-x-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="primary"
                  className="w-full gap-2"
                  onClick={this.handleReset}
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={this.handleReload}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload Page
                  </Button>

                  <Button
                    variant="secondary"
                    className="gap-2"
                    onClick={this.handleGoHome}
                  >
                    <Home className="w-4 h-4" />
                    Go Home
                  </Button>
                </div>
              </div>

              {/* Support message */}
              <p className="text-xs text-text-muted mt-6">
                If this problem persists, please contact support with the error details.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to reset error boundary
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return setError;
};