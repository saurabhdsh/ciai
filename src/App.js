import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import FailureTrends from './pages/FailureTrends';
import Login from './pages/Login';
import AILanding from './pages/AILanding';
import DataSourceSelection from './pages/DataSourceSelection';
import ServiceNowTrends from './pages/ServiceNowTrends';
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

  const [dataSourceSelected, setDataSourceSelected] = useState(() => {
    return localStorage.getItem('dataSourceSelected') === 'true';
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
    
    // Reset data source selection state to ensure user selects it after login
    setDataSourceSelected(false);
    localStorage.removeItem('dataSourceSelected');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserInfo(null);
    setDataSourceSelected(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('dataSourceSelected');
  };

  const handleDataSourceSelected = () => {
    setDataSourceSelected(true);
    localStorage.setItem('dataSourceSelected', 'true');
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
                <Navigate to="/data-source-selection" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/data-source-selection" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/data-source-selection"
            element={
              <ProtectedRoute>
                <DataSourceSelection onDataSourceSelected={handleDataSourceSelected} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-landing"
            element={
              <ProtectedRoute>
                {dataSourceSelected ? (
                  <AILanding />
                ) : (
                  <Navigate to="/data-source-selection" replace />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/failure-trends"
            element={
              <ProtectedRoute>
                {dataSourceSelected ? (
                  <FailureTrends />
                ) : (
                  <Navigate to="/data-source-selection" replace />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="/servicenow-trends"
            element={
              <ProtectedRoute>
                {dataSourceSelected ? (
                  <ServiceNowTrends />
                ) : (
                  <Navigate to="/data-source-selection" replace />
                )}
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 