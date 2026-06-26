import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import './Login.css';

export default function Login() {
  // false = tela de login | true = tela de cadastro
  const [modoCadastro, setModoCadastro] = useState(false);

  // Campos comuns aos dois modos
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Campos só do cadastro
  const [name, setName] = useState('');
  const [epitaph, setEpitaph] = useState('');

  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  function alternarModo() {
    setErro('');
    setModoCadastro((atual) => !atual);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');

    if (modoCadastro && password.length < 4) {
      setErro('A senha precisa ter pelo menos 4 caracteres.');
      return;
    }

    try {
      setEnviando(true);

      const data = modoCadastro
        ? await authService.register({ name, username, password, epitaph })
        : await authService.login({ username, password });

      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      navigate('/');
    } catch (err) {
      const mensagemPadrao = modoCadastro
        ? 'Não foi possível criar a conta. Tente novamente.'
        : 'Usuário ou senha inválidos.';

      setErro(err.response?.data?.erro || mensagemPadrao);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="sphere sphere-1"></div>
      <div className="sphere sphere-2"></div>

      <div className="glass-card">
        <div className="logo-area">
          <span className="twitter-old-logo">🐦</span>
          <h2>{modoCadastro ? 'Criar conta' : 'Entrar no Twitter'}</h2>
        </div>

        {erro && <div className="error-message">{erro}</div>}

        <form onSubmit={handleSubmit}>
          {modoCadastro && (
            <div className="input-group">
              <label>Nome</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

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

          {modoCadastro && (
            <div className="input-group">
              <label>Epitáfio (opcional)</label>
              <input
                value={epitaph}
                onChange={(e) => setEpitaph(e.target.value)}
                placeholder="Mais um espírito perdido na timeline..."
              />
            </div>
          )}

          <button type="submit" className="btn-login" disabled={enviando}>
            {enviando
              ? (modoCadastro ? 'Criando conta...' : 'Entrando...')
              : (modoCadastro ? 'Cadastrar' : 'Entrar')}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          {modoCadastro ? (
            <>
              Já tem conta?{' '}
              <button type="button" className="link-button" onClick={alternarModo}>
                Entrar
              </button>
            </>
          ) : (
            <>
              Não tem conta?{' '}
              <button type="button" className="link-button" onClick={alternarModo}>
                Cadastre-se
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}