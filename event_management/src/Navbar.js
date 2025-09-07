import React from 'react';

function Navbar({ user, onLogout, onNavigate, currentView }) {
    console.log('Navbar props:', { user, onNavigate: !!onNavigate, currentView }); // Debug log

    const handleNavClick = (nav) => {
        console.log('Nav button clicked:', nav, 'onNavigate exists:', !!onNavigate); // Debug log
        if (onNavigate) {
            onNavigate(nav);
        }
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#34495e',
            padding: '1rem',
            color: '#fff',
            borderRadius: '8px',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 1000
        }}>
            <div style={{ position: 'relative', zIndex: 1001 }}>
                {!user && (
                    <>
                        <button
                            style={{
                                marginRight: '1rem',
                                backgroundColor: currentView === 'home' ? '#7c2ae8' : '#34495e',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                position: 'relative',
                                zIndex: 1002,
                                outline: 'none',
                                userSelect: 'none'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Home button clicked!');
                                handleNavClick('home');
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6c7d'}
                            onMouseOut={(e) => e.target.style.backgroundColor = currentView === 'home' ? '#7c2ae8' : '#34495e'}
                        >
                            Home
                        </button>
                        <button
                            style={{
                                marginRight: '1rem',
                                backgroundColor: currentView === 'register' ? '#7c2ae8' : '#34495e',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                position: 'relative',
                                zIndex: 1002,
                                outline: 'none',
                                userSelect: 'none'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Register button clicked!');
                                handleNavClick('register');
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6c7d'}
                            onMouseOut={(e) => e.target.style.backgroundColor = currentView === 'register' ? '#7c2ae8' : '#34495e'}
                        >
                            Register
                        </button>
                        <button
                            style={{
                                marginRight: '1rem',
                                backgroundColor: currentView === 'login' ? '#7c2ae8' : '#34495e',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                position: 'relative',
                                zIndex: 1002,
                                outline: 'none',
                                userSelect: 'none'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Login button clicked!');
                                handleNavClick('login');
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6c7d'}
                            onMouseOut={(e) => e.target.style.backgroundColor = currentView === 'login' ? '#7c2ae8' : '#34495e'}
                        >
                            Login
                        </button>
                        <button
                            style={{
                                marginRight: '1rem',
                                backgroundColor: currentView === 'about' ? '#7c2ae8' : '#34495e',
                                color: '#fff',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                position: 'relative',
                                zIndex: 1002,
                                outline: 'none',
                                userSelect: 'none'
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('About button clicked!');
                                handleNavClick('about');
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#5a6c7d'}
                            onMouseOut={(e) => e.target.style.backgroundColor = currentView === 'about' ? '#7c2ae8' : '#34495e'}
                        >
                            About Us
                        </button>
                    </>
                )}
                {user && user.role === 'club_admin' && (
                    <>
                        <button style={{ marginRight: '1rem' }} onClick={() => onNavigate('create')}>Create Event</button>
                        <button style={{ marginRight: '1rem' }} onClick={() => onNavigate('events')}>Manage Events</button>
                        <button style={{ marginRight: '1rem' }} onClick={() => onNavigate('view')}>View Registrations</button>
                        <button style={{ marginRight: '1rem' }} onClick={() => onNavigate('scan')}>Manual Attendance</button>
                        <button style={{ marginRight: '1rem' }} onClick={() => onNavigate('analytics')}>Analytics</button>
                    </>
                )}
                {user && user.role === 'student' && (
                    <>
                        <button style={{ marginRight: '1rem' }} onClick={() => onNavigate('search')}>Search Events</button>
                        <button style={{ marginRight: '1rem' }} onClick={() => onNavigate('manage')}>My Registrations</button>
                    </>
                )}
            </div>
            <div>
                {user && <span>Welcome, {user.name} ({user.role.replace('_', ' ')})</span>}
                {user && <button style={{ marginLeft: '1rem' }} onClick={onLogout}>Logout</button>}
            </div>
        </nav>
    );
}

export default Navbar;
