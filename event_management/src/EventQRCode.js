import React, { useState, useEffect } from 'react';

function EventQRCode({ eventId, studentId }) {
    const [qrImageUrl, setQrImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    setError('Please login to view QR code');
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://127.0.0.1:5000/event_qr/${eventId}/${studentId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    setQrImageUrl(imageUrl);
                } else {
                    setError('Failed to load QR code');
                }
            } catch (err) {
                setError('Error loading QR code');
            } finally {
                setLoading(false);
            }
        };

        fetchQRCode();

        // Cleanup function to revoke object URL
        return () => {
            if (qrImageUrl) {
                URL.revokeObjectURL(qrImageUrl);
            }
        };
    }, [eventId, studentId]);

    if (loading) {
        return (
            <div style={{ margin: '1rem 0' }}>
                <h4>Your Event QR Code (for attendance):</h4>
                <div style={{ width: 200, height: 200, border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    Loading QR Code...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ margin: '1rem 0' }}>
                <h4>Your Event QR Code (for attendance):</h4>
                <div style={{ width: 200, height: 200, border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={{ margin: '1rem 0' }}>
            <h4>Your Event QR Code (for attendance):</h4>
            <img src={qrImageUrl} alt="Event QR Code" style={{ width: 200, height: 200, border: '1px solid #ccc' }} />
            <p>Show this QR code at the event to mark your attendance.</p>
        </div>
    );
}

export default EventQRCode;
