import React, { useState } from 'react';


function Login({ switchToRegister, onLoginSuccess }) {
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
                body: JSON.stringify({ registration_number: registrationNumber, password })
            });
            const data = await res.json();
            if (res.ok) {
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
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="Registration Number" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} required /><br />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><br />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
            <button onClick={switchToRegister}>Don't have an account? Register</button>
        </div>
    );
}

export default Login;
