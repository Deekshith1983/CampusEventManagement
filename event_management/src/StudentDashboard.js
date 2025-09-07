import React, { useState } from 'react';
import EventList from './EventList';
import MyRegistrations from './MyRegistrations';
import Navbar from './Navbar';

function StudentDashboard({ user, onLogout }) {
    const [view, setView] = useState('search'); // search, manage
    const handleNavigate = (navView) => {
        setView(navView);
    };

    return (
        <div>
            <Navbar user={user} onLogout={onLogout} onNavigate={handleNavigate} currentView={view} />
            {view === 'search' && (
                <EventList user={user} />
            )}
            {view === 'manage' && (
                <MyRegistrations user={user} />
            )}
        </div>
    );
}

export default StudentDashboard;
