**College Event Management System**
A one-stop platform to make college events easier to create, manage, and enjoy!

This system is designed for both club admins and students, so that organizing and participating in college events becomes smooth, stress-free, and fun.

**What It Does**
Club admins can create and manage events, handle student registrations, mark attendance, and get feedback.

Students can browse upcoming events, register in one click, track their registrations, and share their experience through feedback.

Basically, it’s like your campus’s event hub – everything related to your events in one place.

**Features**
**For Club Admins**
Create, edit, and delete events

Track registered students with full details

Mark attendance easily (even during the event)

View feedback and ratings after events

Only manage events for your own college

**For Students**
Discover all events happening in your college

Register instantly with a single click

Keep track of all your registered events in one tab

Give feedback after attending events

Only see events relevant to your college

**System Features**
Secure login with JWT authentication

Password reset via email if you forget it

Works smoothly even if frontend and backend run on different ports (CORS support)

Different permissions for students and admins (Role-based access)

Real-time updates for registrations and event status

**Technology Used**
Backend: Python (Flask, SQLite, JWT, Flask-Mail, Flask-CORS)

Frontend: React 18, Hooks, Responsive CSS, Fetch API

Auth: JWT tokens for secure sessions

Project Structure
```
Event_management/
├── app/
│   ├── app.py              # Main Flask application
│   └── __init__.py         # Package initialization
├── event_management/        # React frontend
│   ├── public/             # Static files and index.html
│   ├── src/                # React source code
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # React entry point
│   │   ├── LoginPage.js    # Authentication component
│   │   ├── EventList.js    # Event listing component
│   │   ├── EventForm.js    # Event creation/editing
│   │   ├── AdminDashboard.js   # Club admin interface
│   │   ├── StudentDashboard.js # Student interface
│   │   ├── QRScanner.js    # Manual attendance marking
│   │   ├── FeedbackForm.js # Event feedback submission
│   │   ├── MyRegistrations.js # Student registration view
│   │   ├── EventRegistrations.js # Admin participant view
│   │   ├── ForgotPassword.js # Password reset request
│   │   ├── ResetPassword.js # Password reset form
│   │   └── [other components]
│   ├── package.json        # Node.js dependencies
│   └── package-lock.json   # Dependency lock file
├── init_db.py             # Database setup script
├── requirements.txt       # Python dependencies
└── README.md             # This file
```
**Getting Started**

**Prerequisites**
Python 3.8+
Node.js 14+ and npm
Git

