import React, { useState, useEffect } from 'react';

function ManualAttendance({ onMarkAttendance, user }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch events created by this admin
    useEffect(() => {
        if (user && user.id) {
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`http://127.0.0.1:5000/events?organizer_id=${user.id}`, {
                headers: headers
            })
                .then(res => res.json())
                .then(data => {
                    setEvents(Array.isArray(data) ? data : []);
                })
                .catch(err => console.error('Failed to fetch events:', err));
        }
    }, [user]);

    // Fetch registered students for selected event
    useEffect(() => {
        if (selectedEvent) {
            setLoading(true);
            const token = localStorage.getItem('auth_token');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`http://127.0.0.1:5000/event_students/${selectedEvent}`, {
                headers: headers
            })
                .then(res => res.json())
                .then(data => {
                    const studentList = Array.isArray(data) ? data : [];
                    setStudents(studentList);
                    setFilteredStudents(studentList);

                    // Initialize attendance data
                    const attendance = studentList.map(student => ({
                        student_id: student.id,
                        student_name: student.name,
                        registration_number: student.registration_number,
                        present: student.already_marked === 1, // Pre-check if already marked
                        already_marked: student.already_marked === 1
                    }));
                    setAttendanceData(attendance);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Failed to fetch students:', err);
                    setLoading(false);
                });
        }
    }, [selectedEvent]);

    // Filter students based on search term
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredStudents(students);
        } else {
            const filtered = students.filter(student =>
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.registration_number.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    }, [searchTerm, students]);

    const handleAttendanceToggle = (studentId) => {
        setAttendanceData(prev =>
            prev.map(item => {
                if (item.student_id === studentId) {
                    // Don't allow toggling if already marked
                    if (item.already_marked) {
                        return item;
                    }
                    return { ...item, present: !item.present };
                }
                return item;
            })
        );
    };

    const handleSubmitAttendance = async () => {
        if (!selectedEvent) {
            alert('Please select an event first');
            return;
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('Please login first');
            return;
        }

        setLoading(true);
        const presentStudents = attendanceData.filter(item => item.present && !item.already_marked);

        try {
            const promises = presentStudents.map(student =>
                fetch('http://127.0.0.1:5000/mark_attendance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        event_id: selectedEvent,
                        student_id: student.student_id
                    })
                })
            );

            await Promise.all(promises);
            alert(`Attendance marked for ${presentStudents.length} students`);

            // Reset attendance
            setAttendanceData(prev => prev.map(item => ({ ...item, present: false })));
        } catch (error) {
            console.error('Failed to mark attendance:', error);
            alert('Failed to mark attendance. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAll = () => {
        const availableStudents = attendanceData.filter(item => !item.already_marked);
        const allAvailableSelected = availableStudents.every(item => item.present);

        setAttendanceData(prev =>
            prev.map(item => {
                if (item.already_marked) {
                    return item; // Don't change already marked students
                }
                return { ...item, present: !allAvailableSelected };
            })
        );
    };

    const presentCount = attendanceData.filter(item => item.present).length;
    const totalCount = attendanceData.length;
    const availableCount = attendanceData.filter(item => !item.already_marked).length;
    const availableSelectedCount = attendanceData.filter(item => item.present && !item.already_marked).length;

    return (
        <div style={{
            maxWidth: '800px',
            margin: '2rem auto',
            padding: '2rem',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
        }}>
            <h2 style={{ color: '#7c2ae8', marginBottom: '2rem', textAlign: 'center' }}>
                📋 Manual Attendance System
            </h2>

            {/* Event Selection */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                    Select Event:
                </label>
                <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '1rem'
                    }}
                >
                    <option value="">-- Select an Event --</option>
                    {events.map(event => (
                        <option key={event.id} value={event.id}>
                            {event.name} - {event.date}
                        </option>
                    ))}
                </select>
            </div>

            {selectedEvent && (
                <>
                    {/* Search Bar */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            placeholder="🔍 Search by name or registration number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '2px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {/* Attendance Summary */}
                    <div style={{
                        background: '#f8f9fa',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <strong>Present: {presentCount} / {totalCount}</strong>
                            {availableCount < totalCount && (
                                <span style={{ color: '#28a745', marginLeft: '1rem' }}>
                                    ({totalCount - availableCount} already marked)
                                </span>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={handleSelectAll}
                                disabled={availableCount === 0}
                                style={{
                                    background: availableCount === 0 ? '#6c757d' : '#17a2b8',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: availableCount === 0 ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {availableCount === 0
                                    ? 'All Marked'
                                    : (availableSelectedCount === availableCount ? 'Unselect Available' : 'Select Available')}
                            </button>
                            <button
                                onClick={handleSubmitAttendance}
                                disabled={loading || availableSelectedCount === 0}
                                style={{
                                    background: availableSelectedCount > 0 ? '#28a745' : '#6c757d',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '6px',
                                    cursor: availableSelectedCount > 0 ? 'pointer' : 'not-allowed'
                                }}
                            >
                                {loading ? 'Submitting...' : `Mark ${availableSelectedCount} Present`}
                            </button>
                        </div>
                    </div>

                    {/* Student List */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <p>Loading students...</p>
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            <p>No students registered for this event or no matches found.</p>
                        </div>
                    ) : (
                        <div style={{
                            maxHeight: '400px',
                            overflowY: 'auto',
                            border: '1px solid #ddd',
                            borderRadius: '8px'
                        }}>
                            {filteredStudents.map(student => {
                                const attendanceItem = attendanceData.find(item => item.student_id === student.id);
                                return (
                                    <div
                                        key={student.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            borderBottom: '1px solid #eee',
                                            background: attendanceItem?.already_marked
                                                ? '#d4edda'
                                                : attendanceItem?.present
                                                    ? '#e8f5e8'
                                                    : '#fff',
                                            cursor: attendanceItem?.already_marked ? 'not-allowed' : 'pointer',
                                            opacity: attendanceItem?.already_marked ? 0.7 : 1
                                        }}
                                        onClick={() => !attendanceItem?.already_marked && handleAttendanceToggle(student.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={attendanceItem?.present || false}
                                            onChange={() => !attendanceItem?.already_marked && handleAttendanceToggle(student.id)}
                                            disabled={attendanceItem?.already_marked}
                                            style={{
                                                marginRight: '1rem',
                                                width: '18px',
                                                height: '18px',
                                                cursor: attendanceItem?.already_marked ? 'not-allowed' : 'pointer'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
                                                {student.name}
                                            </div>
                                            <div style={{ color: '#666', fontSize: '0.9rem' }}>
                                                Reg: {student.registration_number} | College: {student.college_name}
                                            </div>
                                        </div>
                                        <div style={{
                                            background: attendanceItem?.already_marked
                                                ? '#28a745'
                                                : attendanceItem?.present
                                                    ? '#28a745'
                                                    : '#6c757d',
                                            color: '#fff',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem'
                                        }}>
                                            {attendanceItem?.already_marked
                                                ? 'Already Marked'
                                                : attendanceItem?.present
                                                    ? 'Present'
                                                    : 'Absent'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ManualAttendance;
