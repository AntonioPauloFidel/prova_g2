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
      const data = await authService.login({
        username,
        password,
      });

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // ✔ volta pra Home
      navigate("/");

    } catch (err) {
      setErro(
        err.response?.data?.erro ||
        'Usuário ou senha inválidos.'
      );
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
            <label>Usuário</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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