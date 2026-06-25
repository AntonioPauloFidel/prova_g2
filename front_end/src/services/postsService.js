
import api from "./api";

// GET /api/posts

export async function getPosts() {
  const { data } = await api.get("/posts");
  return data.posts; // array de posts
}

// POST /api/posts
// Precisa estar logado. content: string (máx. 280 caracteres)
export async function createPost(content) {
  const { data } = await api.post("/posts", { content });
  return data.post;
}

// POST /api/posts/:id/favorite

export async function toggleFavorite(postId) {
  const { data } = await api.post(`/posts/${postId}/favorite`);
  return data; // { post_id, favorited_by_me, favorites_count }
}

export default { getPosts, createPost, toggleFavorite };
