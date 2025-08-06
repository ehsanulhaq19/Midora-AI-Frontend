// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authHelpers } from './services/authHelpers';

// 1. IMPORT THE NEW COMPONENTS
import { ModelProvider } from './context/ModelProvider';
import ChatLayout from './components/pages/ChatLayout';

// Import your other components
import Login from './components/pages/Login';
import Signup from './components/pages/Signup';
import Dashboard from './components/pages/Dashboard';

// Protected Route Component (This stays the same)
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authHelpers.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (This stays the same)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authHelpers.isAuthenticated();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// The ChatPlaceholder component is no longer needed and can be deleted.

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes - redirect to dashboard if already logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 2. THIS IS THE UPDATED CHAT ROUTE */}
          {/* It replaces the old <ChatPlaceholder /> */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ModelProvider>
                  <ChatLayout />
                </ModelProvider>
              </ProtectedRoute>
            }
          />

          {/* Default redirect (This stays the same) */}
          <Route
            path="/"
            element={
              authHelpers.isAuthenticated() ?
                <Navigate to="/dashboard" replace /> :
                <Navigate to="/login" replace />
            }
          />

          {/* Catch all - redirect to appropriate page (This stays the same) */}
          <Route
            path="*"
            element={
              authHelpers.isAuthenticated() ?
                <Navigate to="/dashboard" replace /> :
                <Navigate to="/login" replace />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;