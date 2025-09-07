import React, { useEffect, useState } from 'react';

function AnalyticsDashboard() {
    const [eventPopularity, setEventPopularity] = useState([]);
    const [studentParticipation, setStudentParticipation] = useState([]);
    const [attendancePercentage, setAttendancePercentage] = useState([]);
    const [feedbackScores, setFeedbackScores] = useState([]);
    const [topStudents, setTopStudents] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const headers = {
            'Content-Type': 'application/json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        fetch('http://127.0.0.1:5000/analytics/event_popularity', { headers }).then(res => res.json()).then(setEventPopularity);
        fetch('http://127.0.0.1:5000/analytics/student_participation', { headers }).then(res => res.json()).then(setStudentParticipation);
        fetch('http://127.0.0.1:5000/analytics/attendance_percentage', { headers }).then(res => res.json()).then(setAttendancePercentage);
        fetch('http://127.0.0.1:5000/analytics/feedback_scores', { headers }).then(res => res.json()).then(setFeedbackScores);
        fetch('http://127.0.0.1:5000/analytics/top_students', { headers }).then(res => res.json()).then(setTopStudents);
    }, []);

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Analytics Dashboard</h2>
            <section>
                <h3>Event Popularity</h3>
                <table><thead><tr><th>Event</th><th>Registrations</th></tr></thead><tbody>
                    {eventPopularity.map(e => <tr key={e.id}><td>{e.name}</td><td>{e.registrations}</td></tr>)}
                </tbody></table>
            </section>
            <section>
                <h3>Student Participation</h3>
                <table><thead><tr><th>Student</th><th>Events Attended</th></tr></thead><tbody>
                    {studentParticipation.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.events_attended}</td></tr>)}
                </tbody></table>
            </section>
            <section>
                <h3>Attendance Percentage</h3>
                <table><thead><tr><th>Event</th><th>Registered</th><th>Attended</th><th>Attendance %</th></tr></thead><tbody>
                    {attendancePercentage.map(e => <tr key={e.id}><td>{e.name}</td><td>{e.registered}</td><td>{e.attended}</td><td>{e.attendance_percent}</td></tr>)}
                </tbody></table>
            </section>
            <section>
                <h3>Feedback Scores</h3>
                <table><thead><tr><th>Event</th><th>Avg Rating</th><th>Feedback Count</th></tr></thead><tbody>
                    {feedbackScores.map(e => <tr key={e.id}><td>{e.name}</td><td>{e.avg_rating}</td><td>{e.feedback_count}</td></tr>)}
                </tbody></table>
            </section>
            <section>
                <h3>Top Active Students</h3>
                <table><thead><tr><th>Student</th><th>Events Attended</th></tr></thead><tbody>
                    {topStudents.map(s => <tr key={s.id}><td>{s.name}</td><td>{s.events_attended}</td></tr>)}
                </tbody></table>
            </section>
        </div>
    );
}

export default AnalyticsDashboard;
