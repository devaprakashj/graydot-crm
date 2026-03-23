import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './index.css';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const DEMO_MODE = false; // Set to true to bypass auth for testing

  useEffect(() => {
    if (DEMO_MODE) {
      setUser({
        userId: 'USR_DEMO',
        name: 'Demo Admin',
        email: 'admin@graydot.in',
        role: 'Admin',
        status: 'Active'
      });
      setLoading(false);
      return;
    }
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('crm_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loader" />
      <span>Initializing CRM...</span>
    </div>
  );

  // Helper to determine home path based on role
  const getHomePath = (role: string) => {
    switch (role) {
      case 'Admin': return '/admin';
      case 'Lead': return '/lead';
      case 'Sales': return '/sales';
      case 'Manager': return '/manager';
      case 'Developer': return '/developer';
      case 'Tester': return '/testing';
      default: return '/dashboard';
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={getHomePath(user.role)} /> : <Login onLogin={handleLogin} />} />
        
        {/* Protected Routes for each Role */}
        <Route path="/admin/*" element={user?.role === 'Admin' ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/lead/*" element={user?.role === 'Lead' ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/sales/*" element={user?.role === 'Sales' ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/manager/*" element={user?.role === 'Manager' ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/developer/*" element={user?.role === 'Developer' ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/testing/*" element={user?.role === 'Tester' ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        
        {/* Fallbacks */}
        <Route path="/dashboard/*" element={user ? <Navigate to={getHomePath(user.role)} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={user ? getHomePath(user.role) : "/login"} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
