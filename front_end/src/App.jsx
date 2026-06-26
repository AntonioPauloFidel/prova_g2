import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home/Home.jsx';
import Login from './pages/login/Login.jsx';
import Favorites from './pages/favorites/Favorites.jsx';

import ProtectedRoute from './routes/ProtectedRoute.jsx';

import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import './App.css';

function MainContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === 'light' ? '🌙 Noite' : '☀️ Dia'}
      </button>

      <Routes>

        {/* 🔥 HOME COMO INICIAL */}
        <Route path="/" element={<Home />} />

        {/* login opcional */}
        <Route path="/login" element={<Login />} />

        {/* feed também aponta pra home (opcional) */}
        <Route path="/feed" element={<Home />} />

        {/* 🔒 FAVORITES PROTEGIDO */}
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}