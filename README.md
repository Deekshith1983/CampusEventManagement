# 🎉 Campus Event Management System  

A one-stop platform to make college events easier to create, manage, and enjoy!  

This system is designed for both **club admins** and **students**, so that organizing and participating in college events becomes smooth, stress-free, and fun.  

---

## 🚀 Features  

### 👨‍💼 For Club Admins  
- Create, edit, and delete events  
- Track registered students with full details  
- Mark attendance during events  
- View feedback and ratings after events  
- Manage events only within your college  

### 🎓 For Students  
- Browse upcoming events in your college  
- Register with just one click  
- See all your registered events in one place  
- Give feedback after attending events  
- Only see events from your own college  

### ⚡ System Features  
- Secure login using **JWT Authentication**  
- **Password reset** via email  
- **Cross-Origin Support (CORS)** so frontend & backend work from different ports  
- **Role-based access** for students and admins  
- **Real-time updates** for events & registrations  

---

## 🛠 Tech Stack  

**Backend (Python / Flask)**  
- Flask, SQLite, JWT  
- Flask-Mail for emails  
- Flask-CORS  

**Frontend (React)**  
- React 18 (with hooks)  
- Responsive CSS  
- Fetch API for backend communication  

---

## 📂 Project Structure  

```
CampusEventManagement/
├── app/                  # Flask backend
│   ├── app.py
│   └── __init__.py
├── event_management/     # React frontend
│   ├── public/
│   ├── src/              # React components
│   │   ├── LoginPage.js
│   │   ├── EventList.js
│   │   ├── EventForm.js
│   │   ├── AdminDashboard.js
│   │   ├── StudentDashboard.js
│   │   ├── FeedbackForm.js
│   │   ├── MyRegistrations.js
│   │   └── More...
├── init_db.py
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup & Installation  

### Prerequisites  
- Python **3.8+**  
- Node.js **14+** (with npm)  
- Git  

### Step 1: Clone Repo  
```bash
git clone https://github.com/Deekshith1983/CampusEventManagement.git
cd CampusEventManagement
```

### Step 2: Backend Setup  
```bash
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows

pip install -r requirements.txt
python init_db.py
cd app
python app.py
```
👉 Backend runs on `http://127.0.0.1:5000`  

### Step 3: Frontend Setup  
```bash
cd event_management
npm install
npm start
```
👉 Frontend runs on `http://localhost:3000`  

---

## 👤 Default Test Accounts  

**Club Admin**  
- Username: `CK_RAKSHIT`  
- Password: `password123`  
- College: ABC College  

**Student**  
- Username: `CK_ANURAG`  
- Password: `password123`  
- College: ABC College  

---

## 📝 How to Use  

### If You’re an Admin  
1. Login with admin account  
2. Create and manage events  
3. View registrations and mark attendance  
4. See feedback after events  

### If You’re a Student  
1. Login with student account  
2. Browse and register for events  
3. Track your registered events  
4. Give feedback after attending  

---

## 🔧 Troubleshooting  

- **Database issues:** Run  
  ```bash
  python init_db.py
  ```  
- **CORS errors:** Ensure both backend:5000 and frontend:3000 are running  
- **Port already in use:** Change the port in `app/app.py` or React settings  
- **Login/auth issues:** Clear browser cache or restart backend+frontend  

---

## 🗂 Database Tables  

- `users` – all student/admin accounts  
- `events` – event details  
- `registrations` – student event registrations  
- `attendance` – attendance records  
- `feedback` – event feedback & ratings  
- `password_reset_tokens` – for password reset  

---

## 🚀 Development  

Both frontend & backend support hot-reload:  
- Flask → auto reloads when Python files change  
- React → auto reloads when JS files change  

For adding features:  
1. Add new backend routes (`app/app.py`)  
2. Create new React components in `src/`  
3. Update database schema via `init_db.py`  

---
## 🎯 Goal  

This system makes college events **simpler for admins to run and more exciting for students to join.**  
Think of it as your campus’s ultimate event hub ✨  

