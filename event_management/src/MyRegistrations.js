import React, { useEffect, useState } from 'react';
import FeedbackForm from './FeedbackForm';
import './Event.css';

function MyRegistrations({ user }) {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState({});

    useEffect(() => {
        if (user && user.role === 'student') {
            fetchRegistrations();
        }
    }, [user]);

    const fetchRegistrations = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`http://127.0.0.1:5000/my_registrations/${user.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                const registrationsData = Array.isArray(data) ? data : [];
                setRegistrations(registrationsData);

                // Initialize feedbackSubmitted state based on backend data
                const feedbackState = {};
                registrationsData.forEach(event => {
                    if (event.feedback_submitted) {
                        feedbackState[event.id] = true;
                    }
                });
                setFeedbackSubmitted(feedbackState);
            } else {
                console.error('Failed to fetch registrations');
                setRegistrations([]);
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
            setRegistrations([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFeedbackSubmitted = (eventId) => {
        setFeedbackSubmitted(prev => ({ ...prev, [eventId]: true }));
    };

    const isEventCompleted = (eventDate) => {
        return new Date(eventDate) < new Date();
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading your registrations...</div>;
    }

    return (
        <div className="event-list">
            <h2>My Event Registrations</h2>
            {registrations.length === 0 ? (
                <p>No event registrations found.</p>
            ) : (
                <ul>
                    {registrations.map(event => (
                        <li key={event.id} className="event-item">
                            <div>
                                <strong>{event.name}</strong>
                                <span className="event-date">({event.date})</span>
                                {isEventCompleted(event.date) && <span className="event-status" style={{ color: '#666', fontStyle: 'italic' }}> - Completed</span>}
                                <br />
                                <span className="event-desc">{event.description}</span><br />
                                <span className="event-venue">Venue: {event.venue}</span><br />
                                <span className="event-reg-time">Registered on: {new Date(event.registration_time).toLocaleDateString()}</span>
                            </div>
                            <div className="event-actions">
                                {/* Show feedback form for completed events automatically */}
                                {isEventCompleted(event.date) && !event.feedback_submitted && !feedbackSubmitted[event.id] && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '1.5rem',
                                        background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                                        borderRadius: '12px',
                                        border: '2px solid #f39c12',
                                        boxShadow: '0 4px 12px rgba(243, 156, 18, 0.2)'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '1rem',
                                            color: '#e67e22',
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold'
                                        }}>
                                            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📝</span>
                                            Event Completed - Your Feedback is Important!
                                        </div>
                                        <p style={{
                                            margin: '0 0 1rem 0',
                                            color: '#8b4513',
                                            fontSize: '0.95rem'
                                        }}>
                                            Help us improve future events by sharing your experience.
                                        </p>
                                        <FeedbackForm
                                            eventId={event.id}
                                            studentId={user.id}
                                            onSubmitted={() => handleFeedbackSubmitted(event.id)}
                                            showLabel={false}
                                        />
                                    </div>
                                )}
                                {(event.feedback_submitted || feedbackSubmitted[event.id]) && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #d4edda 0%, #a8e6cf 100%)',
                                        borderRadius: '8px',
                                        border: '2px solid #28a745',
                                        color: '#155724',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>✅</span>
                                        Thank you for your feedback!
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyRegistrations;
