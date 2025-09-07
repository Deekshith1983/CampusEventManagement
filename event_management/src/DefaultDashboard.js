import React from 'react';
import './DefaultDashboard.css';
import Navbar from './Navbar';
import heroBg from './hero-bg.jpg';
import AboutUs from './AboutUs';

function DefaultDashboard({ onNavigate, view }) {
    console.log('DefaultDashboard props:', { onNavigate: !!onNavigate, view }); // Debug log

    // If About Us is selected, show AboutUs page
    if (view === 'about') {
        return (
            <div className="default-dashboard-bg" style={{
                backgroundImage: `url(${heroBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                position: 'relative'
            }}>
                <div className="dashboard-overlay"></div>
                <Navbar
                    user={null}
                    onLogout={null}
                    onNavigate={(nav) => {
                        console.log('DefaultDashboard navbar click (about):', nav);
                        if (onNavigate) {
                            onNavigate(nav);
                        }
                    }}
                    currentView={view}
                />
                <div className="dashboard-content">
                    <AboutUs />
                </div>
            </div>
        );
    }
    // Otherwise, show home page
    return (
        <div className="default-dashboard-bg" style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            position: 'relative'
        }}>
            <div className="dashboard-overlay"></div>
            <Navbar user={null} onLogout={null} onNavigate={onNavigate} currentView={view} />
            <div className="dashboard-content">
                <div className="dashboard-hero">
                    <h1 className="dashboard-title">🎉 Welcome to <span className="vibes-gradient">Event Vibes</span>!</h1>
                    <p className="dashboard-subtitle">Your campus, your events, your vibe. Discover, register, and enjoy college events like never before!</p>
                    <div className="dashboard-actions">
                        <button className="dashboard-btn" onClick={() => onNavigate('register')}>Get Started</button>
                        <button className="dashboard-btn secondary" onClick={() => onNavigate('about')}>Learn More</button>
                        <button className="dashboard-btn secondary" onClick={() => onNavigate('login')}>Login</button>
                    </div>
                </div>
                <div className="dashboard-features">
                    <div className="feature-card" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
                        <span role="img" aria-label="search" className="feature-icon">🔍</span>
                        <h3>Discover Events</h3>
                        <p>Browse and filter events by college, club, or category.</p>
                    </div>
                    <div className="feature-card" onClick={() => onNavigate('register')} style={{ cursor: 'pointer' }}>
                        <span role="img" aria-label="register" className="feature-icon">📝</span>
                        <h3>Easy Registration</h3>
                        <p>Sign up for events with a single click and track your registrations.</p>
                    </div>
                    <div className="feature-card" onClick={() => onNavigate('login')} style={{ cursor: 'pointer' }}>
                        <span role="img" aria-label="qr" className="feature-icon">📱</span>
                        <h3>QR Attendance</h3>
                        <p>Mark attendance via QR code or manually for seamless check-in.</p>
                    </div>
                    <div className="feature-card" onClick={() => onNavigate('about')} style={{ cursor: 'pointer' }}>
                        <span role="img" aria-label="feedback" className="feature-icon">⭐</span>
                        <h3>Feedback & Analytics</h3>
                        <p>Share your experience and view event stats and popularity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DefaultDashboard;
