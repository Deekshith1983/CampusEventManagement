import React, { useState } from 'react';

function AuthTest() {
    const [authStatus, setAuthStatus] = useState('');
    const [loginResult, setLoginResult] = useState('');
    const [usersData, setUsersData] = useState('');
    const [loading, setLoading] = useState(false);

    const testAuth = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/debug/auth', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            setAuthStatus(JSON.stringify(data, null, 2));
        } catch (err) {
            setAuthStatus(`Error: ${err.message}`);
        }
        setLoading(false);
    };

    const checkUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/debug/users', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await res.json();
            setUsersData(JSON.stringify(data, null, 2));
        } catch (err) {
            setUsersData(`Error: ${err.message}`);
        }
        setLoading(false);
    };

    const testLogin = async () => {
        setLoading(true);
        const testUser = {
            registration_number: 'TEST123', // Test user we'll create
            password: 'test123'
        };

        try {
            const res = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(testUser)
            });
            const data = await res.json();
            setLoginResult(JSON.stringify(data, null, 2));

            // Test auth status immediately after login
            setTimeout(testAuth, 500);
        } catch (err) {
            setLoginResult(`Error: ${err.message}`);
        }
        setLoading(false);
    };

    const createTestUser = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:5000/debug/create_test_user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            setLoginResult(`Test User Creation: ${JSON.stringify(data, null, 2)}`);
        } catch (err) {
            setLoginResult(`Test User Creation Error: ${err.message}`);
        }
        setLoading(false);
    };

    const testEventCreation = async () => {
        setLoading(true);
        const testEvent = {
            name: 'Test Event',
            description: 'Test Description',
            date: '2025-12-25',
            venue: 'Test Venue',
            organizer_id: 1 // Use appropriate organizer ID
        };

        try {
            const res = await fetch('http://127.0.0.1:5000/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(testEvent)
            });
            const data = await res.json();
            setLoginResult(`Event Creation: ${JSON.stringify(data, null, 2)}`);
        } catch (err) {
            setLoginResult(`Event Creation Error: ${err.message}`);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', border: '2px solid #007bff', margin: '20px', backgroundColor: '#f8f9fa' }}>
            <h3>🔍 Authentication Debug Panel</h3>

            <div style={{ marginBottom: '15px' }}>
                <button onClick={createTestUser} disabled={loading} style={{ marginRight: '10px' }}>
                    Create Test User
                </button>
                <button onClick={checkUsers} disabled={loading} style={{ marginRight: '10px' }}>
                    Check Existing Users
                </button>
                <button onClick={testAuth} disabled={loading} style={{ marginRight: '10px' }}>
                    Check Auth Status
                </button>
                <button onClick={testLogin} disabled={loading} style={{ marginRight: '10px' }}>
                    Test Login
                </button>
                <button onClick={testEventCreation} disabled={loading}>
                    Test Event Creation
                </button>
            </div>

            {usersData && (
                <div style={{ marginBottom: '15px' }}>
                    <h4>Existing Users:</h4>
                    <pre style={{ backgroundColor: '#fff3cd', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
                        {usersData}
                    </pre>
                </div>
            )}

            {authStatus && (
                <div style={{ marginBottom: '15px' }}>
                    <h4>Auth Status:</h4>
                    <pre style={{ backgroundColor: '#e9ecef', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
                        {authStatus}
                    </pre>
                </div>
            )}

            {loginResult && (
                <div>
                    <h4>Login/Action Result:</h4>
                    <pre style={{ backgroundColor: '#d4edda', padding: '10px', fontSize: '12px', overflow: 'auto' }}>
                        {loginResult}
                    </pre>
                </div>
            )}

            {loading && (
                <div style={{ color: '#007bff', fontWeight: 'bold' }}>
                    🔄 Loading...
                </div>
            )}
        </div>
    );
}

export default AuthTest;
