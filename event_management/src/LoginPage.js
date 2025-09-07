import React, { useState } from 'react';
import './LoginPage.css';
import Navbar from './Navbar';

export default function LoginPage({ switchToRegister, onLoginSuccess, onNavigate }) {
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ registration_number: registrationNumber, password })
            });
            const data = await res.json();
            if (res.ok) {
                // Store JWT token in localStorage
                if (data.token) {
                    localStorage.setItem('auth_token', data.token);
                }
                if (onLoginSuccess) onLoginSuccess({ ...data, id: data.id });
                setMessage(`Welcome, ${data.name} (${data.role})`);
            } else {
                setMessage(data.error || 'Login failed');
            }
        } catch (err) {
            setMessage('Server error');
        }
    };

    return (
        <div>
            <Navbar
                user={null}
                onLogout={null}
                onNavigate={(nav) => {
                    if (nav === 'register') {
                        switchToRegister();
                    } else {
                        onNavigate(nav);
                    }
                }}
                currentView={'login'}
            />
            <div className="auth-bg">
                <div className="auth-card">
                    <h2>Welcome Back!</h2>
                    <form onSubmit={handleLogin}>
                        <input type="text" placeholder="Registration Number" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <button type="submit">Login</button>
                    </form>

                    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                        <button
                            type="button"
                            onClick={() => onNavigate('forgot-password')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#7c2ae8',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <p>{message}</p>
                    <button className="switch-btn" onClick={switchToRegister}>Don't have an account? Register</button>
                </div>
            </div>
        </div>
    );
}
