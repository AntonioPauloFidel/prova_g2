import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import authService from '../../services/authService';

import './Home.css';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [novoPost, setNovoPost] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    await checarUsuario();
    await carregarPosts();
  };

  const checarUsuario = async () => {
    try {
      // 1. tenta localStorage primeiro
      const localUser = localStorage.getItem('usuario');

      if (localUser) {
        setUser(JSON.parse(localUser));
        return;
      }

      // 2. fallback backend
      const data = await authService.getMe();
      setUser(data.usuario);
    } catch (err) {
      setUser(null);
    }
  };

  const carregarPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data.posts);
    } catch (err) {
      console.error("Erro ao buscar posts", err);
    }
  };

  const handleCriarPost = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const response = await api.post('/posts', { content: novoPost });
      setPosts([response.data.post, ...posts]);
      setNovoPost('');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao publicar.');
    }
  };

  const handleCurtir = async (id) => {
    if (!user) {
      alert("Você precisa estar logado para curtir!");
      return;
    }

    try {
      const { data } = await api.post(`/posts/${id}/favorite`);

      setPosts(prev =>
        prev.map(post =>
          post.id === id
            ? {
                ...post,
                favorited_by_me: data.favorited_by_me,
                favorites_count: data.favorites_count
              }
            : post
        )
      );
    } catch (err) {
      console.error("Erro ao curtir", err);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error("Erro ao sair", err);
    }
  };

  return (
    <div className="home-container">

      <header className="feed-header">
        <h1>🐦 Timeline</h1>

        <div className="user-nav">
          {user ? (
            <>
              <span className="user-info">
                Olá, <strong>{user.name}</strong>
              </span>

              <button
                onClick={() => navigate('/favorites')}
                className="btn-favorites"
              >
                ❤️ Favoritos
              </button>

              <button onClick={handleLogout} className="btn-logout">
                Sair
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="btn-login-nav">
              Entrar
            </button>
          )}
        </div>
      </header>

      {user && (
        <form onSubmit={handleCriarPost} className="tweet-box glass-card">
          <textarea
            value={novoPost}
            onChange={(e) => setNovoPost(e.target.value)}
            placeholder="O que estou pensando?"
            maxLength={280}
            required
          />

          <div className="tweet-box-footer">
            <span className="char-counter">{novoPost.length}/280</span>
            <button type="submit" className="btn-tweet">
              Publicar
            </button>
          </div>

          {erro && <p className="error-text">{erro}</p>}
        </form>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card glass-card">

            <div className="post-header">
              <span className="author-name">{post.author_name}</span>
              <span className="author-username">@{post.author_username}</span>
            </div>

            <p className="post-content">{post.content}</p>

            <div className="post-footer">
              <button
                onClick={() => handleCurtir(post.id)}
                className={`btn-like ${post.favorited_by_me ? 'liked' : ''}`}
              >
                {post.favorited_by_me ? '❤️' : '🤍'} {post.favorites_count}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}