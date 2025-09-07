import React from 'react';

function AboutUs() {
    return (
        <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ color: '#7c2ae8', marginBottom: '1rem' }}>About Event Vibes</h2>
            <p style={{ fontSize: '1.15rem', color: '#333', marginBottom: '1.5rem' }}>
                <b>Event Vibes</b> is your one-stop platform for college event management, registration, and enjoyment! Our mission is to make campus events more accessible, engaging, and fun for everyone.
            </p>
            <ul style={{ textAlign: 'left', margin: '0 auto', maxWidth: 500, fontSize: '1.05rem', color: '#444' }}>
                <li><b>Discover Events:</b> Browse and filter events by college, club, or category.</li>
                <li><b>Easy Registration:</b> Sign up for events with a single click and track your registrations.</li>
                <li><b>Attendance Tracking:</b> Mark attendance via QR code or manually for seamless event check-in.</li>
                <li><b>Feedback & Analytics:</b> Share your experience and view event stats and popularity.</li>
                <li><b>Club Admin Dashboard:</b> Manage events, view analytics, and engage with your audience.</li>
                <li><b>Student Dashboard:</b> Track your events, feedback, and participation history.</li>
            </ul>
            <p style={{ marginTop: '2rem', color: '#7c2ae8', fontWeight: 500 }}>
                Join the vibe. Make your college events memorable with Event Vibes!
            </p>
        </div>
    );
}

export default AboutUs;
