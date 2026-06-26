import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Favorites.css';

const Favorites = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      const { data } = await api.get('/posts/favorites');
      setPosts(data.posts);
    } catch (err) {
      console.error("Erro ao carregar favoritos", err);
    }
  };

  return (
    <div className="favorites-container">
      <h1>❤️ Posts Favoritos</h1>

      <div className="favorites-list">
        {posts.map(post => (
          <div key={post.id} className="favorite-card">
            <h3>{post.author_name}</h3>
            <p>@{post.author_username}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;