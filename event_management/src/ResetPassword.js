import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

function ResetPassword({ onNavigate }) {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // Get token from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            verifyToken(tokenFromUrl);
        } else {
            setMessage('Invalid reset link. Please request a new password reset.');
            setTokenValid(false);
        }
    }, []);

    const verifyToken = async (resetToken) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/verify-reset-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: resetToken })
            });

            const data = await response.json();

            if (response.ok) {
                setTokenValid(true);
                setUserInfo(data);
            } else {
                setTokenValid(false);
                setMessage(data.error || 'Invalid or expired token');
            }
        } catch (error) {
            setTokenValid(false);
            setMessage('Network error. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await fetch('http://127.0.0.1:5000/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setIsSuccess(true);
            } else {
                setMessage(data.error || 'Failed to reset password');
                setIsSuccess(false);
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (tokenValid === null) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
                <Navbar user={null} onLogout={null} onNavigate={onNavigate} currentView="reset-password" />
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
                        textAlign: 'center'
                    }}>
                        <h3>🔄 Verifying reset token...</h3>
                    </div>
                </div>
            </div>
        );
    }

    if (tokenValid === false) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
                <Navbar user={null} onLogout={null} onNavigate={onNavigate} currentView="reset-password" />
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
                        maxWidth: '450px',
                        textAlign: 'center'
                    }}>
                        <h2 style={{ color: '#dc3545', marginBottom: '1rem' }}>❌ Invalid Reset Link</h2>
                        <p style={{ color: '#666', marginBottom: '1.5rem' }}>{message}</p>
                        <button
                            onClick={() => onNavigate('forgot-password')}
                            style={{
                                background: '#7c2ae8',
                                color: '#fff',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                marginRight: '1rem'
                            }}
                        >
                            Request New Reset Link
                        </button>
                        <button
                            onClick={() => onNavigate('login')}
                            style={{
                                background: '#6c757d',
                                color: '#fff',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600'
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)' }}>
            <Navbar user={null} onLogout={null} onNavigate={onNavigate} currentView="reset-password" />

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
                            🔑 Reset Password
                        </h2>
                        {userInfo && (
                            <p style={{ color: '#666', fontSize: '1rem' }}>
                                Setting new password for <strong>{userInfo.user_name}</strong>
                            </p>
                        )}
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
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
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
                                    placeholder="Enter new password (min 6 characters)"
                                />
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.5rem',
                                    color: '#333',
                                    fontWeight: '500'
                                }}>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        border: `2px solid ${confirmPassword && newPassword !== confirmPassword ? '#dc3545' : '#ddd'}`,
                                        borderRadius: '8px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = confirmPassword && newPassword !== confirmPassword ? '#dc3545' : '#7c2ae8'}
                                    onBlur={(e) => e.target.style.borderColor = confirmPassword && newPassword !== confirmPassword ? '#dc3545' : '#ddd'}
                                    placeholder="Confirm your new password"
                                />
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <small style={{ color: '#dc3545', fontSize: '0.85rem' }}>
                                        Passwords do not match
                                    </small>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || newPassword !== confirmPassword}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: (isLoading || newPassword !== confirmPassword) ? '#ccc' : '#7c2ae8',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: (isLoading || newPassword !== confirmPassword) ? 'not-allowed' : 'pointer',
                                    transition: 'background-color 0.3s',
                                    marginBottom: '1rem'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isLoading && newPassword === confirmPassword) e.target.style.background = '#6a1fb8';
                                }}
                                onMouseLeave={(e) => {
                                    if (!isLoading && newPassword === confirmPassword) e.target.style.background = '#7c2ae8';
                                }}
                            >
                                {isLoading ? '🔄 Updating...' : '🔑 Update Password'}
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
                                    ← Cancel and go to Login
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
                                ✅ Password updated successfully!
                            </div>
                            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                                Your password has been reset. You can now login with your new password.
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
                                Go to Login
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

export default ResetPassword;
