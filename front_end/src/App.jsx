import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importações ajustadas para a tua estrutura exata de pastas (letras minúsculas nos caminhos)
import Login from './pages/login/Login.jsx'; 
import Home from './pages/home/Home.jsx';

import { useTheme } from './context/ThemeContext.jsx';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Router>
      {/* Botão Flutuante de Troca de Tema (Garante os pontos da Feature Extra!) */}
      <button 
        onClick={toggleTheme} 
        className="theme-toggle-btn"
        title="Alternar Tema"
      >
        {theme === 'light' ? '🌙 Noite' : '☀️ Dia'}
      </button>

      <Routes>
        {/* Rota da Página Inicial (Feed / Home) */}
        <Route path="/" element={<Login />} />

        {/* Rota da Tela de Login */}
        <Route path="/login" element={<Home />} />

        {/* Se o utilizador tentar aceder a qualquer link inexistente, é redirecionado para a Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;