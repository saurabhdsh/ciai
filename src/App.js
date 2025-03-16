import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import FailureTrends from './pages/FailureTrends';
import Login from './pages/Login';
import RootCauseAnalysis from './pages/RootCauseAnalysis';
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

  return (
    <Router>
      <div className={darkMode ? 'dark' : ''}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/failure-trends" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} userInfo={userInfo}>
                  <Navigate to="/failure-trends" replace />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/failure-trends"
            element={
              isAuthenticated ? (
                <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} userInfo={userInfo}>
                  <FailureTrends />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/root-cause"
            element={
              isAuthenticated ? (
                <Layout onLogout={handleLogout} userInfo={userInfo}>
                  <RootCauseAnalysis />
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 