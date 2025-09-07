import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console or send to error reporting service
        console.error('Error caught by ErrorBoundary:', error, errorInfo);

        this.setState({
            error: error,
            errorInfo: errorInfo,
            hasError: true
        });

        // You can also log the error to an error reporting service here
        // Example: logErrorToService(error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });

        // Redirect to appropriate dashboard
        if (this.props.onError) {
            this.props.onError();
        }
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            const ErrorPage = this.props.errorComponent;

            if (ErrorPage) {
                return (
                    <ErrorPage
                        error={{
                            code: 'REACT_ERROR',
                            message: this.state.error?.message || 'A React component error occurred'
                        }}
                        onRedirect={this.handleReset}
                    />
                );
            }

            // Fallback if no error component provided
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)'
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '2rem',
                        borderRadius: '16px',
                        textAlign: 'center',
                        maxWidth: '500px'
                    }}>
                        <h2>Something went wrong</h2>
                        <p>An unexpected error occurred. Please try again.</p>
                        <button
                            onClick={this.handleReset}
                            style={{
                                background: '#7c2ae8',
                                color: '#fff',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
