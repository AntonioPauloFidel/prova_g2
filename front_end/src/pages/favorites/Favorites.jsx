import React, { useEffect, useState } from 'react';
import { getPosts } from '../../services/postsService';
import './Favorites.css';

const Favorites = () => {
  const [posts, setPosts] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  const carregarFavoritos = async () => {
    try {
      const todosPosts = await getPosts();
      const apenasFavoritos = todosPosts.filter((post) => post.favorited_by_me);
      setPosts(apenasFavoritos);
    } catch (err) {
      console.error("Erro ao carregar favoritos", err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="favorites-container">
      <h1>❤️ Posts Favoritos</h1>

      {carregando && <p>Carregando...</p>}

      <div className="favorites-list">
        {posts.map(post => (
          <div key={post.id} className="favorite-card">
            <h3>{post.author_name}</h3>
            <p>@{post.author_username}</p>
            <p>{post.content}</p>
          </div>
        ))}
      </div>

      {!carregando && posts.length === 0 && <p>Você ainda não curtiu nenhum post.</p>}
    </div>
  );
};

export default Favorites;