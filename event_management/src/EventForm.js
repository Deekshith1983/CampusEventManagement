import React, { useState } from 'react';
import './Event.css';

function EventForm({ user, event, onSave, onCancel }) {
    const [name, setName] = useState(event ? event.name : '');
    const [description, setDescription] = useState(event ? event.description : '');
    const [date, setDate] = useState(event ? event.date : '');
    const [venue, setVenue] = useState(event ? event.venue : '');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        // Get JWT token from localStorage
        const token = localStorage.getItem('auth_token');
        if (!token) {
            setMessage('Please login first');
            return;
        }

        const payload = {
            name,
            description,
            date,
            venue,
            organizer_id: user.id
        };
        try {
            let res, data;
            if (event) {
                res = await fetch(`http://127.0.0.1:5000/events/${event.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('http://127.0.0.1:5000/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
            }
            data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                onSave();
            } else {
                setMessage(data.error || 'Error saving event');
            }
        } catch (err) {
            setMessage('Server error');
        }
    };

    return (
        <div className="event-form">
            <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Event Name" value={name} onChange={e => setName(e.target.value)} required /><br />
                <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required /><br />
                <input type="text" placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} /><br />
                <button type="submit">{event ? 'Update' : 'Create'}</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </form>
            <p>{message}</p>
        </div>
    );
}

export default EventForm;
