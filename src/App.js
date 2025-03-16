import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import FailureTrends from './pages/FailureTrends';
import Login from './pages/Login';
import RootCauseAnalysis from './pages/RootCauseAnalysis';
import AILanding from './pages/AILanding';
import './styles/animations.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved preference or use system preference
    const savedMode = localStorage.getItem('darkMode');
    return savedMode !== null 
      ? JSON.parse(savedMode) 
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [userInfo, setUserInfo] = useState(() => {
    const savedInfo = localStorage.getItem('userInfo');
    return savedInfo ? JSON.parse(savedInfo) : null;
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleLogin = (email) => {
    const userInfo = {
      name: 'Saurabh Dubey',
      email: email,
      initials: 'SD'
    };
    setUserInfo(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userInfo');
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return (
      <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} userInfo={userInfo}>
        {children}
      </Layout>
    );
  };

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/ai-landing" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/ai-landing" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/ai-landing"
            element={
              <ProtectedRoute>
                <AILanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/failure-trends"
            element={
              <ProtectedRoute>
                <FailureTrends />
              </ProtectedRoute>
            }
          />
          <Route
            path="/root-cause"
            element={
              <ProtectedRoute>
                <RootCauseAnalysis />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 