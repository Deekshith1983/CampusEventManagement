import sqlite3

conn = sqlite3.connect('event_management.db')
c = conn.cursor()

# Users table (club admin & students)
c.execute('''CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	registration_number TEXT UNIQUE NOT NULL,
	email TEXT,
	role TEXT CHECK(role IN ('club_admin', 'student')) NOT NULL,
	mobile TEXT NOT NULL,
	password TEXT NOT NULL,
	club_name TEXT,
	college_name TEXT
)''')

# Password reset tokens table
c.execute('''CREATE TABLE IF NOT EXISTS password_reset_tokens (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER NOT NULL,
	token TEXT NOT NULL,
	expires_at TEXT NOT NULL,
	used INTEGER DEFAULT 0,
	FOREIGN KEY(user_id) REFERENCES users(id)
)''')

# Events table
c.execute('''CREATE TABLE IF NOT EXISTS events (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	description TEXT,
	date TEXT NOT NULL,
	venue TEXT,
	organizer_id INTEGER,
	FOREIGN KEY(organizer_id) REFERENCES users(id)
)''')

# Event Registrations table
c.execute('''CREATE TABLE IF NOT EXISTS registrations (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_id INTEGER NOT NULL,
	student_id INTEGER NOT NULL,
	registration_time TEXT NOT NULL,
	FOREIGN KEY(event_id) REFERENCES events(id),
	FOREIGN KEY(student_id) REFERENCES users(id)
)''')

# Attendance table
c.execute('''CREATE TABLE IF NOT EXISTS attendance (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_id INTEGER NOT NULL,
	student_id INTEGER NOT NULL,
	attended INTEGER DEFAULT 0,
	timestamp TEXT,
	FOREIGN KEY(event_id) REFERENCES events(id),
	FOREIGN KEY(student_id) REFERENCES users(id)
)''')

# Feedback table
c.execute('''CREATE TABLE IF NOT EXISTS feedback (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	event_id INTEGER NOT NULL,
	student_id INTEGER NOT NULL,
	rating INTEGER,
	comments TEXT,
	timestamp TEXT,
	FOREIGN KEY(event_id) REFERENCES events(id),
	FOREIGN KEY(student_id) REFERENCES users(id)
)''')

conn.commit()
conn.close()
print("Database initialized.")
