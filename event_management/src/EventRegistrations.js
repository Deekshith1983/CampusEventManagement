import React, { useEffect, useState } from 'react';
import './Event.css';

function EventRegistrations({ user }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.role === 'club_admin') {
            fetchEvents();
        }
    }, [user]);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`http://127.0.0.1:5000/events?user_id=${user.id}&role=${user.role}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                // Filter events to only show those organized by this admin
                const adminEvents = Array.isArray(data) ? data.filter(event => event.organizer_id === user.id) : [];
                setEvents(adminEvents);
            } else {
                console.error('Failed to fetch events');
                setEvents([]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchEventRegistrations = async (eventId) => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`http://127.0.0.1:5000/event_registrations/${eventId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setRegistrations(data);
                setSelectedEvent(eventId);
            } else {
                console.error('Failed to fetch event registrations');
                setRegistrations([]);
            }
        } catch (error) {
            console.error('Error fetching event registrations:', error);
            setRegistrations([]);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading events...</div>;
    }

    return (
        <div className="event-list">
            <h2>View Event Registrations</h2>

            {!selectedEvent ? (
                <>
                    <p>Select an event to view its registrations and feedback:</p>
                    {events.length === 0 ? (
                        <p>No events found. Create an event first to view registrations.</p>
                    ) : (
                        <ul>
                            {events.map(event => (
                                <li key={event.id} className="event-item">
                                    <div>
                                        <strong>{event.name}</strong>
                                        <span className="event-date">({event.date})</span><br />
                                        <span className="event-desc">{event.description}</span><br />
                                        <span className="event-venue">Venue: {event.venue}</span>
                                    </div>
                                    <div className="event-actions">
                                        <button
                                            onClick={() => fetchEventRegistrations(event.id)}
                                            style={{
                                                background: '#7c2ae8',
                                                color: 'white',
                                                border: 'none',
                                                padding: '0.5rem 1rem',
                                                borderRadius: '4px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            View Registrations
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                <div>
                    <button
                        onClick={() => { setSelectedEvent(null); setRegistrations([]); }}
                        style={{
                            background: '#6c757d',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '1rem'
                        }}
                    >
                        ← Back to Events
                    </button>

                    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                        <h3>{registrations.event?.name}</h3>
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                            <div><strong>📅 Total Registrations:</strong> {registrations.total_registrations || 0}</div>
                            <div><strong>✅ Attended:</strong> {registrations.total_attended || 0}</div>
                            <div><strong>📝 Feedback Received:</strong> {registrations.total_feedback || 0}</div>
                        </div>
                    </div>

                    {registrations.registrations && registrations.registrations.length > 0 ? (
                        <div>
                            <h4>Registered Participants</h4>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{
                                    width: '100%',
                                    borderCollapse: 'collapse',
                                    border: '1px solid #ddd'
                                }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa' }}>
                                            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Name</th>
                                            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Registration No.</th>
                                            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>College</th>
                                            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Registered On</th>
                                            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Attendance</th>
                                            <th style={{ padding: '0.75rem', border: '1px solid #ddd' }}>Feedback</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrations.registrations.map((reg, index) => (
                                            <tr key={index}>
                                                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{reg.name}</td>
                                                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{reg.registration_number}</td>
                                                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{reg.college_name}</td>
                                                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                                    {new Date(reg.registration_time).toLocaleDateString()}
                                                </td>
                                                <td style={{
                                                    padding: '0.75rem',
                                                    border: '1px solid #ddd',
                                                    color: reg.attended ? '#28a745' : '#dc3545'
                                                }}>
                                                    {reg.attended ? '✅ Present' : '❌ Absent'}
                                                </td>
                                                <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                                                    {reg.rating ? (
                                                        <div>
                                                            <div><strong>Rating:</strong> {reg.rating}/5 ⭐</div>
                                                            {reg.comments && (
                                                                <div><strong>Comments:</strong> {reg.comments}</div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span style={{ color: '#6c757d' }}>No feedback</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <p>No registrations found for this event.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default EventRegistrations;
