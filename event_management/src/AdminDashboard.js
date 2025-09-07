import React from 'react';
import EventList from './EventList';
import EventForm from './EventForm';
import EventRegistrations from './EventRegistrations';
import ManualAttendance from './QRScanner';
import AnalyticsDashboard from './AnalyticsDashboard';
import Navbar from './Navbar';

function AdminDashboard({ user, onLogout }) {
    const [view, setView] = React.useState('view'); // view, create, manage, events, scan, analytics
    const [editEvent, setEditEvent] = React.useState(null);
    const [refreshEvents, setRefreshEvents] = React.useState(false);

    const handleEditEvent = (event) => {
        setEditEvent(event);
        setView('manage');
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            // Get JWT token from localStorage
            const token = localStorage.getItem('auth_token');
            if (!token) {
                alert('Please login first');
                return;
            }

            const res = await fetch(`http://127.0.0.1:5000/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ organizer_id: user.id })
            });
            const data = await res.json();
            if (res.ok) {
                setRefreshEvents(r => !r);
                alert(data.message);
            } else {
                alert(data.error || 'Delete failed');
            }
        } catch {
            alert('Server error');
        }
    };

    const handleEventFormSave = () => {
        setView('view');
        setEditEvent(null);
        setRefreshEvents(r => !r);
    };

    const handleCancel = () => {
        setView('view');
        setEditEvent(null);
    };

    const handleNavigate = (navView) => {
        setView(navView);
        if (navView === 'manage') setEditEvent(null);
        if (navView === 'view') setEditEvent(null);
        if (navView === 'events') setEditEvent(null);
    };
    return (
        <div>
            <Navbar user={user} onLogout={onLogout} onNavigate={handleNavigate} currentView={view} />
            {view === 'view' && (
                <EventRegistrations user={user} />
            )}
            {view === 'events' && (
                <EventList user={user} onEdit={handleEditEvent} onDelete={handleDeleteEvent} refresh={refreshEvents} />
            )}
            {view === 'create' && (
                <EventForm user={user} onSave={handleEventFormSave} onCancel={handleCancel} event={editEvent} />
            )}
            {view === 'manage' && (
                <EventForm user={user} onSave={handleEventFormSave} onCancel={handleCancel} event={editEvent} />
            )}
            {view === 'scan' && (
                <ManualAttendance user={user} />
            )}
            {view === 'analytics' && (
                <AnalyticsDashboard />
            )}
        </div>
    );
}

export default AdminDashboard;
