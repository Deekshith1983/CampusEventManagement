import React from 'react';
import './ErrorPage.css';

function ErrorPage({ error, onRedirect }) {
    const handleGoToDashboard = () => {
        if (onRedirect) {
            onRedirect();
        } else {
            // Fallback: reload the page to go to home
            window.location.reload();
        }
    };

    return (
        <div className="error-page">
            <div className="error-container">
                <div className="error-icon">
                    <span role="img" aria-label="error">⚠️</span>
                </div>
                <h1 className="error-title">Oops! Something went wrong</h1>
                <p className="error-message">
                    We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
                </p>
                <div className="error-details">
                    <p className="error-code">Error Code: {error?.code || 'UNKNOWN_ERROR'}</p>
                    <p className="error-description">
                        {error?.message || 'An unexpected error occurred while processing your request.'}
                    </p>
                </div>
                <div className="error-actions">
                    <button className="primary-btn" onClick={handleGoToDashboard}>
                        Go to Dashboard
                    </button>
                    <button className="secondary-btn" onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
                <div className="error-help">
                    <p>If this problem persists, please contact our support team.</p>
                    <div className="help-links">
                        <span>Need help? </span>
                        <a href="mailto:support@eventvibes.com">Contact Support</a>
                        <span> | </span>
                        <button
                            className="link-button"
                            onClick={() => window.history.back()}
                            type="button"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;
