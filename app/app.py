

from flask import Flask, request, jsonify, session
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_mail import Mail, Message
import sqlite3
import hashlib
from flask_cors import CORS
import jwt
from functools import wraps
from datetime import datetime, timedelta
import secrets
import os


app = Flask(__name__)
CORS(app, 
     supports_credentials=True, 
     origins=['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001'],
     allow_headers=['Content-Type', 'Authorization'],
     expose_headers=['Set-Cookie'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
app.secret_key = 'your_secret_key_here'
app.config['JWT_SECRET_KEY'] = 'jwt_secret_key_here'  # JWT secret

# Email configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME') or 'your_email@gmail.com'
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD') or 'your_app_password'
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('MAIL_USERNAME') or 'your_email@gmail.com'

# Initialize Mail
mail = Mail(app)

# JWT Authentication decorator
def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing', 'authenticated': False}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
            current_user_role = data['role']
            
            # Add user info to request context
            request.current_user = {
                'id': current_user_id,
                'role': current_user_role,
                'authenticated': True
            }
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired', 'authenticated': False}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid', 'authenticated': False}), 401
        
        return f(*args, **kwargs)
    return decorated

# Session configuration for cross-origin cookies
app.config['SESSION_COOKIE_SAMESITE'] = None
app.config['SESSION_COOKIE_SECURE'] = False  # False for HTTP (development)
app.config['SESSION_COOKIE_HTTPONLY'] = False  # Allow JavaScript access for debugging
app.config['SESSION_COOKIE_DOMAIN'] = None  # Don't restrict domain
app.config['SESSION_COOKIE_PATH'] = '/'
app.config['REMEMBER_COOKIE_SAMESITE'] = None
app.config['REMEMBER_COOKIE_SECURE'] = False
DATABASE = '../event_management.db'

# Flask-Login setup
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'
login_manager.login_message = 'Please log in to access this page.'

@app.route('/test', methods=['GET', 'POST'])
def test_connection():
    from flask import make_response
    response = make_response(jsonify({
        'message': 'Connection successful',
        'method': request.method,
        'headers': dict(request.headers),
        'has_json': request.is_json,
        'data': request.get_json() if request.is_json else None,
        'cookies_received': dict(request.cookies),
        'session_before': dict(session)
    }))
    
    # Set a test cookie
    response.set_cookie('test_cookie', 'test_value', 
                       samesite=None, secure=False, httponly=False)
    
    # Also set a session value
    session['test_session'] = 'test_session_value'
    
    return response

@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ['http://localhost:3000', 'http://127.0.0.1:3000']:
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Expose-Headers', 'Set-Cookie')
    return response

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({'error': 'Authentication required', 'authenticated': False}), 401

class User(UserMixin):
    def __init__(self, id, role, name=None):
        self.id = str(id)  # Ensure ID is string
        self.role = role
        self.name = name
        
    def get_id(self):
        return str(self.id)

@login_manager.user_loader
def load_user(user_id):
    print(f"Loading user with ID: {user_id}")
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT * FROM users WHERE id=?', (user_id,))
    user = cur.fetchone()
    if user:
        print(f"User found: {user['name']} (ID: {user['id']}, Role: {user['role']})")
        return User(user['id'], user['role'], user['name'])
    print(f"No user found with ID: {user_id}")
    return None

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/')
def index():
    return "Event Management API is running."


import qrcode
import io
from flask import send_file
# Generate QR code for event registration (for attendance)
# Mark attendance via QR code scan
import qrcode
import io
from flask import send_file
# Generate QR code for event registration (for attendance)

# Mark attendance via QR code scan


@app.route('/register_user', methods=['POST'])
def register_user():
    data = request.json
    name = data.get('name')
    registration_number = data.get('registration_number')
    role = data.get('role')
    mobile = data.get('mobile')
    password = data.get('password')
    club_name = data.get('club_name') if role == 'club_admin' else None
    college_name = data.get('college_name')
    if not all([name, registration_number, role, mobile, password, college_name]):
        return jsonify({'error': 'All fields are required.'}), 400
    if role == 'club_admin' and not club_name:
        return jsonify({'error': 'Club name is required for club admin.'}), 400
    if role not in ['club_admin', 'student']:
        return jsonify({'error': 'Role must be club_admin or student.'}), 400
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    db = get_db()
    cur = db.cursor()
    try:
        cur.execute('INSERT INTO users (name, registration_number, role, mobile, password, club_name, college_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    (name, registration_number, role, mobile, hashed_pw, club_name, college_name))
        db.commit()
        return jsonify({'message': f'{role} registered successfully.'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Registration number already exists.'}), 409

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    registration_number = data.get('registration_number')
    password = data.get('password')
    print(f"Login attempt: {registration_number}")
    
    if not registration_number or not password:
        return jsonify({'error': 'Registration number and password required.'}), 400
        
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    print(f"Password hash: {hashed_pw[:20]}...")
    
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT * FROM users WHERE registration_number=? AND password=?', (registration_number, hashed_pw))
    user = cur.fetchone()
    
    if user:
        # Create JWT token
        token_payload = {
            'user_id': user['id'],
            'role': user['role'],
            'name': user['name'],
            'exp': datetime.utcnow() + timedelta(hours=24)  # Token expires in 24 hours
        }
        
        token = jwt.encode(token_payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')
        print(f"JWT token created for user: {user['id']}")
        
        # Also maintain Flask-Login session as backup
        user_obj = User(user['id'], user['role'], user['name'])
        login_user(user_obj, remember=True, force=True)
        
        return jsonify({
            'message': 'Login successful.',
            'role': user['role'],
            'name': user['name'],
            'id': user['id'],
            'college_name': user['college_name'],
            'token': token,  # Send JWT token to frontend
            'authenticated': True
        }), 200
    else:
        print(f"No user found with registration_number: {registration_number}")
        return jsonify({'error': 'Invalid credentials.'}), 401

@app.route('/logout', methods=['POST'])
@jwt_required
def logout():
    # For JWT, we just send success since tokens are stateless
    return jsonify({'message': 'Logged out successfully.'}), 200

# Forgot Password - Send Reset Email
@app.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    
    if not email:
        return jsonify({'error': 'Email is required'}), 400
    
    db = get_db()
    cur = db.cursor()
    
    # Find user by email
    cur.execute('SELECT * FROM users WHERE email=?', (email,))
    user = cur.fetchone()
    
    if not user:
        # Don't reveal if email exists or not for security
        return jsonify({'message': 'If the email exists, a reset link has been sent.'}), 200
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    
    # Store reset token in database
    cur.execute('INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
                (user['id'], reset_token, expires_at.isoformat()))
    db.commit()
    
    # Send email
    try:
        reset_url = f"http://localhost:3000/reset-password?token={reset_token}"
        
        msg = Message(
            subject='Password Reset Request',
            recipients=[email],
            html=f"""
            <h2>Password Reset Request</h2>
            <p>Hello {user['name']},</p>
            <p>You have requested to reset your password. Click the link below to reset your password:</p>
            <p><a href="{reset_url}" style="background-color: #7c2ae8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Best regards,<br>Event Management Team</p>
            """
        )
        mail.send(msg)
        return jsonify({'message': 'If the email exists, a reset link has been sent.'}), 200
    except Exception as e:
        print(f"Email sending failed: {e}")
        return jsonify({'error': 'Failed to send email. Please try again later.'}), 500

# Verify Reset Token
@app.route('/verify-reset-token', methods=['POST'])
def verify_reset_token():
    data = request.json
    token = data.get('token')
    
    if not token:
        return jsonify({'error': 'Token is required'}), 400
    
    db = get_db()
    cur = db.cursor()
    
    # Check if token exists and is not expired
    cur.execute('''
        SELECT rt.*, u.name, u.email FROM password_reset_tokens rt
        JOIN users u ON rt.user_id = u.id
        WHERE rt.token = ? AND rt.used = 0 AND rt.expires_at > ?
    ''', (token, datetime.utcnow().isoformat()))
    
    reset_request = cur.fetchone()
    
    if not reset_request:
        return jsonify({'error': 'Invalid or expired token'}), 400
    
    return jsonify({
        'valid': True,
        'user_name': reset_request['name'],
        'email': reset_request['email']
    }), 200

# Reset Password
@app.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    token = data.get('token')
    new_password = data.get('new_password')
    
    if not token or not new_password:
        return jsonify({'error': 'Token and new password are required'}), 400
    
    if len(new_password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters long'}), 400
    
    db = get_db()
    cur = db.cursor()
    
    # Check if token exists and is not expired
    cur.execute('''
        SELECT rt.*, u.id as user_id FROM password_reset_tokens rt
        JOIN users u ON rt.user_id = u.id
        WHERE rt.token = ? AND rt.used = 0 AND rt.expires_at > ?
    ''', (token, datetime.utcnow().isoformat()))
    
    reset_request = cur.fetchone()
    
    if not reset_request:
        return jsonify({'error': 'Invalid or expired token'}), 400
    
    # Hash the new password
    hashed_password = hashlib.sha256(new_password.encode()).hexdigest()
    
    # Update user password
    cur.execute('UPDATE users SET password = ? WHERE id = ?',
                (hashed_password, reset_request['user_id']))
    
    # Mark token as used
    cur.execute('UPDATE password_reset_tokens SET used = 1 WHERE id = ?',
                (reset_request['id'],))
    
    db.commit()
    
    return jsonify({'message': 'Password has been reset successfully'}), 200

@app.route('/debug/create_test_user', methods=['POST'])
def create_test_user():
    import hashlib
    # Create a test user with known credentials for debugging
    data = {
        'name': 'Test Admin',
        'registration_number': 'TEST123',
        'role': 'club_admin',
        'mobile': '1234567890',
        'password': 'test123',
        'college_name': 'Test College',
        'club_name': 'Test Club'
    }
    
    hashed_pw = hashlib.sha256(data['password'].encode()).hexdigest()
    db = get_db()
    cur = db.cursor()
    try:
        cur.execute('INSERT OR REPLACE INTO users (name, registration_number, role, mobile, password, club_name, college_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    (data['name'], data['registration_number'], data['role'], data['mobile'], hashed_pw, data['club_name'], data['college_name']))
        db.commit()
        return jsonify({'message': 'Test user created successfully', 'credentials': 'TEST123/test123'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/debug/users', methods=['GET'])
def debug_users():
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT id, name, registration_number, role, college_name FROM users')
    users = [dict(row) for row in cur.fetchall()]
    return jsonify(users)

@app.route('/debug/auth', methods=['GET'])
def debug_auth():
    return jsonify({
        'authenticated': current_user.is_authenticated,
        'user_id': getattr(current_user, 'id', None),
        'user_role': getattr(current_user, 'role', None),
        'session_keys': list(session.keys()),
        'session_data': dict(session),
        'has_session': bool(session),
        'request_headers': dict(request.headers),
        'cookies': dict(request.cookies),
        'current_user_type': str(type(current_user)),
        'flask_login_user_id': session.get('_user_id'),
        'manual_session_user_id': session.get('user_id')
    })

@app.route('/events', methods=['GET'])
def list_events():
    college_name = request.args.get('college_name')
    user_role = request.args.get('role')
    user_id = request.args.get('user_id')
    
    db = get_db()
    cur = db.cursor()
    
    # Base query for upcoming events
    query = '''SELECT events.*, users.name as organizer_name, users.college_name as organizer_college 
               FROM events LEFT JOIN users ON events.organizer_id = users.id 
               WHERE date >= date("now")'''
    params = []
    
    # Filter by college for students and club admins
    if college_name:
        query += ' AND users.college_name = ?'
        params.append(college_name)
    elif user_role and user_id:
        # Get user's college if not provided in parameters
        cur.execute('SELECT college_name FROM users WHERE id=?', (user_id,))
        user_data = cur.fetchone()
        if user_data and user_data['college_name']:
            query += ' AND users.college_name = ?'
            params.append(user_data['college_name'])
    
    query += ' ORDER BY date ASC'
    cur.execute(query, params)
    events = [dict(row) for row in cur.fetchall()]
    
    return jsonify(events)

# Student registers for event
@app.route('/register_event', methods=['POST'])
@jwt_required
def register_event():
    data = request.json
    event_id = data.get('event_id')
    student_id = data.get('student_id')
    
    # Verify student_id matches the authenticated user
    if request.current_user['id'] != student_id:
        return jsonify({'error': 'Student ID must match authenticated user.'}), 403
        
    # Verify user is a student
    if request.current_user['role'] != 'student':
        return jsonify({'error': 'Only students can register for events.'}), 403
    
    db = get_db()
    cur = db.cursor()
    # Check if already registered
    cur.execute('SELECT * FROM registrations WHERE event_id=? AND student_id=?', (event_id, student_id))
    if cur.fetchone():
        return jsonify({'error': 'Already registered for this event.'}), 409
    # Check if event exists
    cur.execute('SELECT * FROM events WHERE id=?', (event_id,))
    if not cur.fetchone():
        return jsonify({'error': 'Event not found.'}), 404
    # Check if user is a student
    cur.execute('SELECT * FROM users WHERE id=? AND role="student"', (student_id,))
    if not cur.fetchone():
        return jsonify({'error': 'User must be a student.'}), 403
    cur.execute('INSERT INTO registrations (event_id, student_id, registration_time) VALUES (?, ?, datetime("now"))', (event_id, student_id))
    db.commit()
    return jsonify({'message': 'Registered for event successfully.'}), 201

# Get registrations for a student
@app.route('/my_registrations/<int:student_id>', methods=['GET'])
@jwt_required
def my_registrations(student_id):
    # Verify student_id matches the authenticated user
    if request.current_user['id'] != student_id:
        return jsonify({'error': 'Student ID must match authenticated user.'}), 403
        
    db = get_db()
    cur = db.cursor()
    cur.execute('''SELECT events.*, registrations.registration_time,
                   CASE WHEN events.date < date("now") THEN 1 ELSE 0 END as event_completed,
                   CASE WHEN feedback.id IS NOT NULL THEN 1 ELSE 0 END as feedback_submitted
                   FROM registrations
                   JOIN events ON registrations.event_id = events.id
                   LEFT JOIN feedback ON events.id = feedback.event_id AND registrations.student_id = feedback.student_id
                   WHERE registrations.student_id = ? ORDER BY events.date DESC''', (student_id,))
    events = [dict(row) for row in cur.fetchall()]
    return jsonify(events)

# Get event registrations for club admin (view participants)
@app.route('/event_registrations/<int:event_id>', methods=['GET'])
@jwt_required
def event_registrations(event_id):
    # Verify user is club admin and owns the event
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can view event registrations.'}), 403
    
    db = get_db()
    cur = db.cursor()
    
    # Check if the event belongs to this club admin
    cur.execute('SELECT * FROM events WHERE id=? AND organizer_id=?', (event_id, request.current_user['id']))
    event = cur.fetchone()
    if not event:
        return jsonify({'error': 'Event not found or access denied.'}), 404
    
    # Get registrations with student details, attendance, and feedback
    cur.execute('''SELECT 
                   users.id as student_id, users.name, users.college_name, users.registration_number,
                   registrations.registration_time,
                   attendance.attended, attendance.timestamp as attendance_time,
                   feedback.rating, feedback.comments, feedback.timestamp as feedback_time
                   FROM registrations
                   JOIN users ON registrations.student_id = users.id
                   LEFT JOIN attendance ON registrations.event_id = attendance.event_id AND registrations.student_id = attendance.student_id
                   LEFT JOIN feedback ON registrations.event_id = feedback.event_id AND registrations.student_id = feedback.student_id
                   WHERE registrations.event_id = ?
                   ORDER BY registrations.registration_time ASC''', (event_id,))
    
    registrations = [dict(row) for row in cur.fetchall()]
    
    # Add event details
    event_dict = dict(event)
    return jsonify({
        'event': event_dict,
        'registrations': registrations,
        'total_registrations': len(registrations),
        'total_attended': len([r for r in registrations if r['attended']]),
        'total_feedback': len([r for r in registrations if r['rating'] is not None])
    })

# Get simple student list for attendance marking
@app.route('/event_students/<int:event_id>', methods=['GET'])
@jwt_required
def event_students(event_id):
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can access event students.'}), 403
        
    db = get_db()
    cur = db.cursor()
    
    # Verify the event belongs to this admin
    cur.execute('SELECT * FROM events WHERE id=? AND organizer_id=?', (event_id, request.current_user['id']))
    if not cur.fetchone():
        return jsonify({'error': 'Event not found or access denied.'}), 404
    
    # Get registered students for this event (simple format for attendance)
    cur.execute('''
        SELECT users.id, users.name, users.registration_number, users.college_name,
               CASE WHEN attendance.attended = 1 THEN 1 ELSE 0 END as already_marked
        FROM users 
        JOIN registrations ON users.id = registrations.student_id 
        LEFT JOIN attendance ON users.id = attendance.student_id AND registrations.event_id = attendance.event_id
        WHERE registrations.event_id = ? AND users.role = 'student'
        ORDER BY users.name
    ''', (event_id,))
    
    students = [dict(row) for row in cur.fetchall()]
    return jsonify(students)

# Create Event (club admin only)
@app.route('/events', methods=['POST'])
@jwt_required
def create_event():
    print(f"JWT authenticated user: {request.current_user}")
    data = request.json
    name = data.get('name')
    description = data.get('description', '')
    date = data.get('date')
    venue = data.get('venue', '')
    organizer_id = data.get('organizer_id')
    print(f"Request data: {data}")
    
    # Verify organizer_id matches the authenticated user
    if request.current_user['id'] != organizer_id:
        return jsonify({'error': 'Organizer ID must match authenticated user.'}), 403
        
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can create events.'}), 403
    
    if not all([name, date, organizer_id]):
        return jsonify({'error': 'Name, date, and organizer_id are required.'}), 400
    
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT * FROM users WHERE id=? AND role="club_admin"', (organizer_id,))
    if not cur.fetchone():
        return jsonify({'error': 'Organizer must be a club admin.'}), 403
    cur.execute('INSERT INTO events (name, description, date, venue, organizer_id) VALUES (?, ?, ?, ?, ?)',
                (name, description, date, venue, organizer_id))
    db.commit()
    return jsonify({'message': 'Event created successfully.'}), 201

# Test endpoint for event creation without authentication
@app.route('/events/test', methods=['POST'])
def create_event_test():
    print("Test endpoint called")
    data = request.json
    print(f"Test request data: {data}")
    return jsonify({'message': 'Test endpoint working', 'received_data': data}), 200

# Edit Event (club admin only)
@app.route('/events/<int:event_id>', methods=['PUT'])
@jwt_required
def edit_event(event_id):
    data = request.json
    name = data.get('name')
    description = data.get('description')
    date = data.get('date')
    venue = data.get('venue')
    organizer_id = data.get('organizer_id')
    
    # Verify organizer_id matches the authenticated user
    if request.current_user['id'] != organizer_id:
        return jsonify({'error': 'Organizer ID must match authenticated user.'}), 403
        
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can edit events.'}), 403
    
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT * FROM events WHERE id=?', (event_id,))
    event = cur.fetchone()
    if not event:
        return jsonify({'error': 'Event not found.'}), 404
    if event['organizer_id'] != organizer_id:
        return jsonify({'error': 'Only the organizer can edit this event.'}), 403
    cur.execute('UPDATE events SET name=?, description=?, date=?, venue=? WHERE id=?',
                (name or event['name'], description or event['description'], date or event['date'], venue or event['venue'], event_id))
    db.commit()
    return jsonify({'message': 'Event updated successfully.'})


# Delete Event (club admin only)
@app.route('/events/<int:event_id>', methods=['DELETE'])
@jwt_required
def delete_event(event_id):
    organizer_id = request.json.get('organizer_id')
    
    # Verify organizer_id matches the authenticated user
    if request.current_user['id'] != organizer_id:
        return jsonify({'error': 'Organizer ID must match authenticated user.'}), 403
        
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can delete events.'}), 403
    
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT * FROM events WHERE id=?', (event_id,))
    event = cur.fetchone()
    if not event:
        return jsonify({'error': 'Event not found.'}), 404
    if event['organizer_id'] != organizer_id:
        return jsonify({'error': 'Only the organizer can delete this event.'}), 403
    cur.execute('DELETE FROM events WHERE id=?', (event_id,))
    db.commit()
    return jsonify({'message': 'Event deleted successfully.'})

# Generate QR code for event registration (for attendance)
@app.route('/event_qr/<int:event_id>/<int:student_id>', methods=['GET'])
@jwt_required
def event_qr(event_id, student_id):
    # Verify student_id matches the authenticated user
    if request.current_user['id'] != student_id:
        return jsonify({'error': 'Student ID must match authenticated user.'}), 403
        
    qr_data = f"event_id:{event_id};student_id:{student_id}"
    img = qrcode.make(qr_data)
    buf = io.BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

# Mark attendance via QR code scan
@app.route('/mark_attendance', methods=['POST'])
@jwt_required
def mark_attendance():
    data = request.json
    event_id = data.get('event_id')
    student_id = data.get('student_id')
    
    # Verify student_id matches the authenticated user or user is club admin
    if request.current_user['role'] == 'student' and request.current_user['id'] != student_id:
        return jsonify({'error': 'Student ID must match authenticated user.'}), 403
    elif request.current_user['role'] != 'student' and request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only students or club admins can mark attendance.'}), 403
    
    db = get_db()
    cur = db.cursor()
    cur.execute('SELECT * FROM attendance WHERE event_id=? AND student_id=?', (event_id, student_id))
    if cur.fetchone():
        return jsonify({'error': 'Attendance already marked.'}), 409
    cur.execute('SELECT * FROM registrations WHERE event_id=? AND student_id=?', (event_id, student_id))
    if not cur.fetchone():
        return jsonify({'error': 'Student not registered for event.'}), 403
    cur.execute('INSERT INTO attendance (event_id, student_id, attended, timestamp) VALUES (?, ?, 1, datetime("now"))', (event_id, student_id))
    db.commit()
    return jsonify({'message': 'Attendance marked.'}), 201

# Submit feedback for attended event
@app.route('/submit_feedback', methods=['POST'])
@jwt_required
def submit_feedback():
    data = request.json
    event_id = data.get('event_id')
    student_id = data.get('student_id')
    rating = data.get('rating')
    comments = data.get('comments')
    
    # Verify student_id matches the authenticated user
    if request.current_user['id'] != student_id:
        return jsonify({'error': 'Student ID must match authenticated user.'}), 403
        
    # Verify user is a student
    if request.current_user['role'] != 'student':
        return jsonify({'error': 'Only students can submit feedback.'}), 403
    
    db = get_db()
    cur = db.cursor()
    
    # Check if student is registered for the event
    cur.execute('SELECT * FROM registrations WHERE event_id=? AND student_id=?', (event_id, student_id))
    if not cur.fetchone():
        return jsonify({'error': 'Student not registered for event.'}), 403
    
    # Check if event is completed (past date) - allow feedback without attendance requirement
    cur.execute('SELECT date FROM events WHERE id=?', (event_id,))
    event = cur.fetchone()
    if not event:
        return jsonify({'error': 'Event not found.'}), 404
    
    # Allow feedback for completed events or attended events
    event_completed = event['date'] < datetime.now().strftime('%Y-%m-%d')
    if not event_completed:
        # For ongoing events, require attendance
        cur.execute('SELECT * FROM attendance WHERE event_id=? AND student_id=?', (event_id, student_id))
        if not cur.fetchone():
            return jsonify({'error': 'Feedback only allowed after attendance for ongoing events.'}), 403
    cur.execute('SELECT * FROM feedback WHERE event_id=? AND student_id=?', (event_id, student_id))
    if cur.fetchone():
        return jsonify({'error': 'Feedback already submitted.'}), 409
    cur.execute('INSERT INTO feedback (event_id, student_id, rating, comments, timestamp) VALUES (?, ?, ?, ?, datetime("now"))', (event_id, student_id, rating, comments))
    db.commit()
    return jsonify({'message': 'Feedback submitted.'}), 201

# Check if feedback has been submitted for an event by a student
@app.route('/check_feedback/<int:event_id>/<int:student_id>', methods=['GET'])
@jwt_required
def check_feedback(event_id, student_id):
    # Verify student_id matches the authenticated user
    if request.current_user['id'] != student_id:
        return jsonify({'error': 'Student ID must match authenticated user.'}), 403
        
    # Verify user is a student
    if request.current_user['role'] != 'student':
        return jsonify({'error': 'Only students can check feedback status.'}), 403
    
    db = get_db()
    cur = db.cursor()
    
    # Check if feedback exists
    cur.execute('SELECT * FROM feedback WHERE event_id=? AND student_id=?', (event_id, student_id))
    feedback = cur.fetchone()
    
    # Check if event is completed
    cur.execute('SELECT date FROM events WHERE id=?', (event_id,))
    event = cur.fetchone()
    event_completed = False
    if event:
        event_completed = event['date'] < datetime.now().strftime('%Y-%m-%d')
    
    return jsonify({
        'feedback_submitted': feedback is not None,
        'event_completed': event_completed,
        'can_submit_feedback': event_completed and feedback is None
    })











# Analytics Endpoints
@app.route('/analytics/event_popularity', methods=['GET'])
@jwt_required
def event_popularity():
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can access analytics.'}), 403
        
    db = get_db()
    cur = db.cursor()
    cur.execute('''SELECT events.id, events.name, COUNT(registrations.id) as registrations
        FROM events LEFT JOIN registrations ON events.id = registrations.event_id
        GROUP BY events.id ORDER BY registrations DESC''')
    data = [dict(row) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/analytics/student_participation', methods=['GET'])
@jwt_required
def student_participation():
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can access analytics.'}), 403
        
    db = get_db()
    cur = db.cursor()
    cur.execute('''SELECT users.id, users.name, COUNT(attendance.id) as events_attended
        FROM users LEFT JOIN attendance ON users.id = attendance.student_id
        WHERE users.role = 'student'
        GROUP BY users.id ORDER BY events_attended DESC''')
    data = [dict(row) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/analytics/attendance_percentage', methods=['GET'])
@jwt_required
def attendance_percentage():
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can access analytics.'}), 403
        
    db = get_db()
    cur = db.cursor()
    cur.execute('''SELECT events.id, events.name,
        COUNT(DISTINCT registrations.student_id) as registered,
        COUNT(DISTINCT attendance.student_id) as attended,
        ROUND(CASE WHEN COUNT(DISTINCT registrations.student_id) = 0 THEN 0 ELSE (COUNT(DISTINCT attendance.student_id)*100.0/COUNT(DISTINCT registrations.student_id)) END, 2) as attendance_percent
        FROM events
        LEFT JOIN registrations ON events.id = registrations.event_id
        LEFT JOIN attendance ON events.id = attendance.event_id
        GROUP BY events.id''')
    data = [dict(row) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/analytics/feedback_scores', methods=['GET'])
@jwt_required
def feedback_scores():
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can access analytics.'}), 403
        
    db = get_db()
    cur = db.cursor()
    cur.execute('''SELECT events.id, events.name, ROUND(AVG(feedback.rating),2) as avg_rating, COUNT(feedback.id) as feedback_count
        FROM events LEFT JOIN feedback ON events.id = feedback.event_id
        GROUP BY events.id ORDER BY avg_rating DESC''')
    data = [dict(row) for row in cur.fetchall()]
    return jsonify(data)

@app.route('/analytics/top_students', methods=['GET'])
@jwt_required
def top_students():
    # Verify user is club admin
    if request.current_user['role'] != 'club_admin':
        return jsonify({'error': 'Only club admins can access analytics.'}), 403
        
    db = get_db()
    cur = db.cursor()
    cur.execute('''SELECT users.id, users.name, COUNT(attendance.id) as events_attended
        FROM users LEFT JOIN attendance ON users.id = attendance.student_id
        WHERE users.role = 'student'
        GROUP BY users.id ORDER BY events_attended DESC LIMIT 10''')
    data = [dict(row) for row in cur.fetchall()]
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
