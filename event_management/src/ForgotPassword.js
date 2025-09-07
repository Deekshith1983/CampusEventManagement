import React, { useState } from 'react';
import Navbar from './Navbar';

function ForgotPassword({ onNavigate }) {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:5000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setIsSuccess(true);
                setEmail('');
            } else {
                setMessage(data.error || 'Failed to send reset email');
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
            <Navbar user={null} onLogout={null} onNavigate={onNavigate} currentView="forgot-password" />

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 100px)',
                padding: '2rem'
            }}>
                <div style={{
                    background: '#fff',
                    padding: '3rem',
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    width: '100%',
                    maxWidth: '450px'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <h2 style={{
                            color: '#7c2ae8',
                            marginBottom: '0.5rem',
                            fontSize: '2rem',
                            fontWeight: '600'
                        }}>
                            🔐 Forgot Password
                        </h2>
                        <p style={{ color: '#666', fontSize: '1rem' }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: '#333',
                                    fontWeight: '500'
                                }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: '2px solid #ddd',
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#7c2ae8'}
                                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                    placeholder="Enter your email address"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: isLoading ? '#ccc' : '#7c2ae8',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.3s',
                                    marginBottom: '1rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading) e.target.style.background = '#6a1fb8';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLoading) e.target.style.background = '#7c2ae8';
                                }}
                            >
                                {isLoading ? '📧 Sending...' : '📧 Send Reset Link'}
                            </button>

                            <div style={{ textAlign: 'center' }}>
                                <button
                                    type="button"
                                    onClick={() => onNavigate('login')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#7c2ae8',
                                        textDecoration: 'underline',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    ← Back to Login
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                background: '#d4edda',
                                border: '1px solid #c3e6cb',
                                color: '#155724',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem'
                            }}>
                                ✅ Reset link sent successfully!
                            </div>
                            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                                Please check your email for the password reset link.
                            </p>
                            <button
                                onClick={() => onNavigate('login')}
                                style={{
                                    background: '#7c2ae8',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontWeight: '600'
                                }}
                            >
                                Return to Login
                            </button>
                        </div>
                    )}

                    {message && !isSuccess && (
                        <div style={{
                            background: '#f8d7da',
                            border: '1px solid #f5c6cb',
                            color: '#721c24',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            marginTop: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
