import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/login/Login.jsx'; 
import Home from './pages/home/Home.jsx';

import { ThemeProvider, useTheme } from './context/ThemeContext.jsx';
import './App.css';

// Esse componente roda isolado dentro do Provider para não quebrar o hook useTheme
function MainContent() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      {/* Botão de alternar tema */}
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === 'light' ? '🌙 Noite' : '☀️ Dia'}
      </button>

      <Routes>
        {/* Rota inicial abrindo o Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rota do Feed/Home */}
        <Route path="/feed" element={<Home />} />
        
        {/* Fallback de segurança */}
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