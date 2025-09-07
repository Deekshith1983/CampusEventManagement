import React, { useState } from 'react';

function ConnectionTest() {
    const [testResult, setTestResult] = useState('');
    const [loading, setLoading] = useState(false);

    const testBasicConnection = async () => {
        setLoading(true);
        setTestResult('Testing basic connection...');

        try {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('http://127.0.0.1:5000/test', {
                method: 'GET',
                headers: headers
            });
            const data = await res.json();
            setTestResult(`✓ Basic connection successful: ${JSON.stringify(data)}`);
        } catch (err) {
            setTestResult(`✗ Basic connection failed: ${err.message}`);
        }
        setLoading(false);
    };

    const testEventCreation = async () => {
        setLoading(true);
        setTestResult('Testing event creation...');

        const testData = {
            name: 'Test Event',
            description: 'Test Description',
            date: '2025-12-25',
            venue: 'Test Venue',
            organizer_id: 1
        };

        try {
            const res = await fetch('http://127.0.0.1:5000/events/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testData)
            });
            const data = await res.json();
            setTestResult(`✓ Event creation test successful: ${JSON.stringify(data)}`);
        } catch (err) {
            setTestResult(`✗ Event creation test failed: ${err.message}`);
        }
        setLoading(false);
    };

    const testAuthEndpoint = async () => {
        setLoading(true);
        setTestResult('Testing auth endpoint...');

        try {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch('http://127.0.0.1:5000/debug/auth', {
                method: 'GET',
                headers: headers
            });
            const data = await res.json();
            setTestResult(`✓ Auth endpoint successful: ${JSON.stringify(data)}`);
        } catch (err) {
            setTestResult(`✗ Auth endpoint failed: ${err.message}`);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h3>Backend Connection Test</h3>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={testBasicConnection} disabled={loading}>
                    Test Basic Connection
                </button>
                <button onClick={testAuthEndpoint} disabled={loading} style={{ marginLeft: '10px' }}>
                    Test Auth Status
                </button>
                <button onClick={testEventCreation} disabled={loading} style={{ marginLeft: '10px' }}>
                    Test Event Creation
                </button>
            </div>
            <div style={{
                padding: '10px',
                backgroundColor: '#f5f5f5',
                minHeight: '50px',
                fontFamily: 'monospace',
                fontSize: '12px'
            }}>
                {loading ? 'Loading...' : testResult || 'Click a button to test connection'}
            </div>
        </div>
    );
}

export default ConnectionTest;
