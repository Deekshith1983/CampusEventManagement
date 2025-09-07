import React, { useState } from 'react';

function JWTTest() {
    const [loginData, setLoginData] = useState({ registration_number: '', password: '' });
    const [message, setMessage] = useState('');
    const [tokenData, setTokenData] = useState(null);
    const [eventData, setEventData] = useState({ name: '', description: '', date: '', venue: '' });
    const [eventResult, setEventResult] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(loginData)
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(`Login successful! Token: ${data.token ? 'Received' : 'Missing'}`);
                setTokenData(data);
                if (data.token) {
                    localStorage.setItem('auth_token', data.token);
                }
            } else {
                setMessage(data.error || 'Login failed');
            }
        } catch (err) {
            setMessage('Login error: ' + err.message);
        }
    };

    const testEventCreation = async (e) => {
        e.preventDefault();
        setEventResult('');

        const token = localStorage.getItem('auth_token');
        if (!token) {
            setEventResult('No token found - please login first');
            return;
        }

        try {
            const payload = {
                ...eventData,
                organizer_id: tokenData?.id
            };

            const res = await fetch('http://127.0.0.1:5000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (res.ok) {
                setEventResult('Event created successfully!');
            } else {
                setEventResult(`Event creation failed: ${data.error}`);
            }
        } catch (err) {
            setEventResult('Event creation error: ' + err.message);
        }
    };

    const clearToken = () => {
        localStorage.removeItem('auth_token');
        setTokenData(null);
        setMessage('Token cleared');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px' }}>
            <h2>JWT Authentication Test</h2>

            <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                <h3>Step 1: Login</h3>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Registration Number"
                        value={loginData.registration_number}
                        onChange={(e) => setLoginData({ ...loginData, registration_number: e.target.value })}
                        required
                    /><br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                    /><br />
                    <button type="submit">Login</button>
                    <button type="button" onClick={clearToken}>Clear Token</button>
                </form>
                <p><strong>Result:</strong> {message}</p>
                {tokenData && (
                    <div>
                        <p><strong>User Data:</strong> {tokenData.name} ({tokenData.role})</p>
                        <p><strong>Token Stored:</strong> {localStorage.getItem('auth_token') ? 'Yes' : 'No'}</p>
                    </div>
                )}
            </div>

            {tokenData && tokenData.role === 'club_admin' && (
                <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
                    <h3>Step 2: Test Event Creation (Club Admin Only)</h3>
                    <form onSubmit={testEventCreation}>
                        <input
                            type="text"
                            placeholder="Event Name"
                            value={eventData.name}
                            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
                            required
                        /><br />
                        <input
                            type="text"
                            placeholder="Description"
                            value={eventData.description}
                            onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                        /><br />
                        <input
                            type="date"
                            value={eventData.date}
                            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                            required
                        /><br />
                        <input
                            type="text"
                            placeholder="Venue"
                            value={eventData.venue}
                            onChange={(e) => setEventData({ ...eventData, venue: e.target.value })}
                        /><br />
                        <button type="submit">Create Event</button>
                    </form>
                    <p><strong>Result:</strong> {eventResult}</p>
                </div>
            )}

            <div style={{ padding: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}>
                <h3>Instructions</h3>
                <p>1. Try logging in with a club admin account (e.g., Rakshit: CK_RAKSHIT / password123)</p>
                <p>2. If login is successful, you should see token data and can test event creation</p>
                <p>3. For students, try: CK_ANURAG / password123</p>
                <p>4. Check browser console for any additional error messages</p>
            </div>
        </div>
    );
}

export default JWTTest;
