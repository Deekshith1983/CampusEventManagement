import React, { useState } from 'react';

function RegisterEventButton({ eventId, studentId, isRegistered, onRegister }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setMessage('');

        // Get JWT token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setMessage('Please login first');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('http://127.0.0.1:5000/register_event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ event_id: eventId, student_id: studentId })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Registered!');
                if (onRegister) onRegister();
            } else {
                setMessage(data.error || 'Registration failed');
            }
        } catch {
            setMessage('Server error');
        }
        setLoading(false);
    };

    return (
        <span>
            {isRegistered ? (
                <button disabled>Registered</button>
            ) : (
                <button onClick={handleRegister} disabled={loading}>Register</button>
            )}
            {message && <span style={{ color: 'green', marginLeft: '0.5rem' }}>{message}</span>}
        </span>
    );
}

export default RegisterEventButton;
