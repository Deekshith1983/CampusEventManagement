import React, { useState } from 'react';

function FeedbackForm({ eventId, studentId, onSubmitted, showLabel = true }) {
    const [rating, setRating] = useState(5);
    const [comments, setComments] = useState('');
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

        try {
            const res = await fetch('http://127.0.0.1:5000/submit_feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ event_id: eventId, student_id: studentId, rating, comments })
            });
            const data = await res.json();
            if (res.ok) {
                setMessage('Feedback submitted!');
                if (onSubmitted) onSubmitted();
            } else {
                setMessage(data.error || 'Submission failed');
            }
        } catch {
            setMessage('Server error');
        }
    };
    return (
        <form onSubmit={handleSubmit} style={{ margin: '1rem 0', border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
            {showLabel && <h4>Submit Feedback</h4>}
            <label>Rating:
                <select value={rating} onChange={e => setRating(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
            </label><br />
            <label>Comments:<br />
                <textarea value={comments} onChange={e => setComments(e.target.value)} rows={3} style={{ width: '100%' }} />
            </label><br />
            <button type="submit">Submit Feedback</button>
            <p>{message}</p>
        </form>
    );
}

export default FeedbackForm;
