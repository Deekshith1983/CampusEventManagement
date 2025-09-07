
import React, { useEffect, useState } from 'react';
import RegisterEventButton from './RegisterEventButton';
import EventQRCode from './EventQRCode';
import FeedbackForm from './FeedbackForm';
import './Event.css';

function EventList({ user, onEdit, onDelete }) {
    const [events, setEvents] = useState([]);
    const [registrations, setRegistrations] = useState([]);

    useEffect(() => {
        // Get JWT token from localStorage
        const token = localStorage.getItem('auth_token');

        let eventsUrl = 'http://127.0.0.1:5000/events';
        if (user && user.id) {
            eventsUrl += `?user_id=${user.id}&role=${user.role}`;
            if (user.college_name) {
                eventsUrl += `&college_name=${encodeURIComponent(user.college_name)}`;
            }
        }

        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch(eventsUrl, {
            headers: headers
        })
            .then(res => res.json())
            .then(data => {
                // Ensure data is an array
                if (Array.isArray(data)) {
                    setEvents(data);
                } else {
                    console.error('Events API returned non-array data:', data);
                    setEvents([]); // Set empty array as fallback
                }
            })
            .catch(err => {
                console.error('Failed to fetch events:', err);
                setEvents([]); // Set empty array on error
            });

        if (user && user.role === 'student' && token) {
            fetch(`http://127.0.0.1:5000/my_registrations/${user.id}`, {
                headers: headers
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setRegistrations(data);
                    } else {
                        console.error('Registrations API returned non-array data:', data);
                        setRegistrations([]);
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch registrations:', err);
                    setRegistrations([]);
                });
        }
    }, [user]);

    const isRegistered = (eventId) => {
        return registrations.some(r => r.id === eventId);
    };

    // Track feedback submitted state per event
    const [feedbackSubmitted, setFeedbackSubmitted] = useState({});

    useEffect(() => {
        // Check feedback status for registered events
        if (user && user.role === 'student' && registrations.length > 0) {
            const checkFeedbackStatus = async () => {
                const token = localStorage.getItem('auth_token');
                const feedbackChecks = registrations.map(async (reg) => {
                    try {
                        const response = await fetch(`http://127.0.0.1:5000/check_feedback/${reg.id}/${user.id}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        if (response.ok) {
                            const data = await response.json();
                            return { eventId: reg.id, ...data };
                        }
                    } catch (error) {
                        console.error('Error checking feedback status:', error);
                    }
                    return null;
                });

                const results = await Promise.all(feedbackChecks);
                const feedbackState = {};
                results.forEach(result => {
                    if (result && result.feedback_submitted) {
                        feedbackState[result.eventId] = true;
                    }
                });
                setFeedbackSubmitted(feedbackState);
            };

            checkFeedbackStatus();
        }
    }, [user, registrations]);

    const handleFeedbackSubmitted = (eventId) => {
        setFeedbackSubmitted(prev => ({ ...prev, [eventId]: true }));
    };

    const handleRegister = () => {
        if (user && user.role === 'student') {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`http://127.0.0.1:5000/my_registrations/${user.id}`, {
                headers: headers
            })
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setRegistrations(data);
                    } else {
                        console.error('Registrations API returned non-array data:', data);
                        setRegistrations([]);
                    }
                })
                .catch(err => {
                    console.error('Failed to fetch registrations:', err);
                    setRegistrations([]);
                });
        }
    };

    return (
        <div className="event-list">
            <h2>Events</h2>
            {events.length === 0 ? <p>No events found.</p> : (
                <ul>
                    {events.map(event => (
                        <li key={event.id} className="event-item">
                            <div>
                                <strong>{event.name}</strong> <span className="event-date">({event.date})</span><br />
                                <span className="event-desc">{event.description}</span><br />
                                <span className="event-venue">Venue: {event.venue}</span><br />
                                <span className="event-org">Organizer: {event.organizer_name}</span>
                            </div>
                            {user && user.role === 'club_admin' && user.id === event.organizer_id && (
                                <div className="event-actions">
                                    <button onClick={() => onEdit(event)}>Edit</button>
                                    <button onClick={() => onDelete(event.id)}>Delete</button>
                                </div>
                            )}
                            {user && user.role === 'student' && (
                                <div className="event-actions">
                                    <RegisterEventButton eventId={event.id} studentId={user.id} isRegistered={isRegistered(event.id)} onRegister={handleRegister} />
                                    {isRegistered(event.id) && (
                                        <>
                                            {/* QR Code disabled as requested */}
                                            {/* <EventQRCode eventId={event.id} studentId={user.id} /> */}

                                            {/* Show feedback form only for completed events */}
                                            {new Date(event.date) < new Date() && !feedbackSubmitted[event.id] && (
                                                <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                                                    <h4 style={{ color: '#7c2ae8', marginBottom: '0.5rem' }}>📝 Event Completed - Please provide feedback</h4>
                                                    <FeedbackForm eventId={event.id} studentId={user.id} onSubmitted={() => handleFeedbackSubmitted(event.id)} showLabel={false} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default EventList;
