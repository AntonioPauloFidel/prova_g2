import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      await authService.login(username, password);
      navigate('/');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Usuário ou senha inválidos.');
    }
  };

  return (
    <div className="login-container">
      <div className="sphere sphere-1"></div>
      <div className="sphere sphere-2"></div>

      <div className="glass-card">
        <div className="logo-area">
          <span className="twitter-old-logo">🐦</span>
          <h2>Entrar no Twitter</h2>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: joao_silva"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
              required
            />
          </div>

          <button type="submit" className="btn-login">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}