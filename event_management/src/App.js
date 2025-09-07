import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import DefaultDashboard from './DefaultDashboard';
import ErrorBoundary from './ErrorBoundary';
import ErrorPage from './ErrorPage';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

function App() {
  const [view, setView] = useState('home'); // 'home', 'login', 'register', 'dashboard', 'about', 'error', 'forgot-password', 'reset-password'
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to decode JWT token and extract user info
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  // Check for existing token on app load
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.exp > Date.now() / 1000) {
        // Token is valid and not expired
        setUser({
          id: decoded.user_id,
          name: decoded.name,
          role: decoded.role
        });
        setView('dashboard');
      } else {
        // Token is expired, remove it
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userInfo) => {
    try {
      setUser(userInfo);
      setView('dashboard');
      setError(null);
    } catch (err) {
      handleError(err, 'LOGIN_ERROR');
    }
  };

  const handleLogout = () => {
    try {
      // Clear JWT token from localStorage
      localStorage.removeItem('auth_token');
      setUser(null);
      setView('home');
      setError(null);
    } catch (err) {
      handleError(err, 'LOGOUT_ERROR');
    }
  };

  // Navigation handler for navbar
  const handleNavigate = (nav) => {
    try {
      if (nav === 'home') setView('home');
      if (nav === 'login') setView('login');
      if (nav === 'register') setView('register');
      if (nav === 'about') setView('about');
      if (nav === 'forgot-password') setView('forgot-password');
      if (nav === 'reset-password') setView('reset-password');
      setError(null);
    } catch (err) {
      handleError(err, 'NAVIGATION_ERROR');
    }
  };

  // Error handler
  const handleError = (error, code = 'UNKNOWN_ERROR') => {
    console.error('App Error:', error);
    setError({
      code: code,
      message: error?.message || 'An unexpected error occurred'
    });
    setView('error');
  };

  // Redirect to appropriate dashboard based on user
  const handleErrorRedirect = () => {
    try {
      setError(null);
      if (user) {
        setView('dashboard');
      } else {
        setView('home');
      }
    } catch (err) {
      // If redirect fails, just reload the page
      window.location.reload();
    }
  };

  // Switch handlers for auth pages
  const switchToRegister = () => {
    try {
      setView('register');
      setError(null);
    } catch (err) {
      handleError(err, 'SWITCH_ERROR');
    }
  };

  const switchToLogin = () => {
    try {
      setView('login');
      setError(null);
    } catch (err) {
      handleError(err, 'SWITCH_ERROR');
    }
  };

  // Show error page if there's an error
  if (view === 'error' || error) {
    return <ErrorPage error={error} onRedirect={handleErrorRedirect} />;
  }

  // Show loading spinner while checking token
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          textAlign: 'center'
        }}>
          <h3>Loading...</h3>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary errorComponent={ErrorPage} onError={handleErrorRedirect}>
      <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)', paddingBottom: '2rem' }}>
        {!user ? (
          view === 'login' ? (
            <LoginPage
              switchToRegister={switchToRegister}
              onLoginSuccess={handleLoginSuccess}
              onNavigate={handleNavigate}
              onError={handleError}
            />
          ) : view === 'register' ? (
            <RegisterPage
              switchToLogin={switchToLogin}
              onNavigate={handleNavigate}
              onError={handleError}
            />
          ) : view === 'forgot-password' ? (
            <ForgotPassword
              onNavigate={handleNavigate}
            />
          ) : view === 'reset-password' ? (
            <ResetPassword
              onNavigate={handleNavigate}
            />
          ) : view === 'about' ? (
            <DefaultDashboard
              onNavigate={handleNavigate}
              view={'about'}
              onError={handleError}
            />
          ) : (
            <DefaultDashboard
              onNavigate={handleNavigate}
              view={'home'}
              onError={handleError}
            />
          )
        ) : (
          user.role === 'club_admin' ? (
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              onError={handleError}
            />
          ) : (
            <StudentDashboard
              user={user}
              onLogout={handleLogout}
              onError={handleError}
            />
          )
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
