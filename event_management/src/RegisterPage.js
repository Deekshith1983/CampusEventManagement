import React, { useState } from 'react';
import './RegisterPage.css';
import Navbar from './Navbar';

export default function RegisterPage({ switchToLogin, onNavigate }) {
    const [name, setName] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('student');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [clubName, setClubName] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        const payload = { name, registration_number: registrationNumber, email, role, mobile, password, college_name: collegeName };
        if (role === 'club_admin') payload.club_name = clubName;
        try {
            const res = await fetch('http://127.0.0.1:5000/register_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
            } else {
                setMessage(data.error || 'Registration failed');
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
                    if (nav === 'login') {
                        switchToLogin();
                    } else {
                        onNavigate(nav);
                    }
                }}
                currentView={'register'}
            />
            <div className="auth-bg">
                <div className="auth-card">
                    <h2>Create Your Account</h2>
                    <form onSubmit={handleRegister}>
                        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                        <input type="text" placeholder="College Name" value={collegeName} onChange={e => setCollegeName(e.target.value)} required />
                        <input type="text" placeholder="Registration Number" value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value)} required />
                        <input type="text" placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
                        <select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="student">Student</option>
                            <option value="club_admin">Club Admin</option>
                        </select>
                        {role === 'club_admin' && (
                            <input type="text" placeholder="Club Name" value={clubName} onChange={e => setClubName(e.target.value)} required />
                        )}
                        <button type="submit">Register</button>
                    </form>
                    <p>{message}</p>
                    <button className="switch-btn" onClick={switchToLogin}>Already have an account? Login</button>
                </div>
            </div>
        </div>
    );
}
