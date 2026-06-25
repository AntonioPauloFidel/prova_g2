const express = require("express");
const db = require("../db/database");
const { exigirLogin, identificarUsuario } = require("../middleware/auth");

const router = express.Router();

const TAMANHO_MAXIMO_POST = 280; // mesma logica do "antigo Twitter": 280 caracteres

// GET /api/posts
router.get("/", identificarUsuario, (req, res) => {
  const usuarioId = req.usuario?.id || null;

  const posts = db
    .prepare(
      `SELECT
         posts.id,
         posts.content,
         posts.created_at,
         users.id   AS author_id,
         users.name AS author_name,
         users.username AS author_username,
         (SELECT COUNT(*) FROM favorites WHERE favorites.post_id = posts.id) AS favorites_count,
         EXISTS(
           SELECT 1 FROM favorites
           WHERE favorites.post_id = posts.id AND favorites.user_id = ?
         ) AS favorited_by_me
       FROM posts
       JOIN users ON users.id = posts.user_id
       ORDER BY posts.created_at DESC, posts.id DESC`
    )
    .all(usuarioId);

  // SQLite retorna 0/1 para EXISTS; convertendo para boolean de verdade
  const postsFormatados = posts.map((post) => ({
    ...post,
    favorited_by_me: Boolean(post.favorited_by_me),
  }));

  res.json({ posts: postsFormatados });
});

// POST /api/posts
router.post("/", exigirLogin, (req, res) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ erro: "O post não pode estar vazio." });
  }

  if (content.length > TAMANHO_MAXIMO_POST) {
    return res
      .status(400)
      .json({ erro: `O post não pode passar de ${TAMANHO_MAXIMO_POST} caracteres.` });
  }

  const resultado = db
    .prepare("INSERT INTO posts (content, user_id) VALUES (?, ?)")
    .run(content.trim(), req.usuario.id);

  const novoPost = db
    .prepare(
      `SELECT
         posts.id,
         posts.content,
         posts.created_at,
         users.id   AS author_id,
         users.name AS author_name,
         users.username AS author_username,
         0 AS favorites_count,
         0 AS favorited_by_me
       FROM posts
       JOIN users ON users.id = posts.user_id
       WHERE posts.id = ?`
    )
    .get(resultado.lastInsertRowid);

  res.status(201).json({ post: { ...novoPost, favorited_by_me: false } });
});

// POST /api/posts/:id/favorite  (toggle curtir/descurtir)
router.post("/:id/favorite", exigirLogin, (req, res) => {
  const postId = Number(req.params.id);

  const post = db.prepare("SELECT id FROM posts WHERE id = ?").get(postId);

  if (!post) {
    return res.status(404).json({ erro: "Post não encontrado." });
  }

  const curtidaExistente = db
    .prepare("SELECT id FROM favorites WHERE user_id = ? AND post_id = ?")
    .get(req.usuario.id, postId);

  if (curtidaExistente) {
    db.prepare("DELETE FROM favorites WHERE id = ?").run(curtidaExistente.id);
  } else {
    db.prepare("INSERT INTO favorites (user_id, post_id) VALUES (?, ?)").run(
      req.usuario.id,
      postId
    );
  }

  const totalCurtidas = db
    .prepare("SELECT COUNT(*) AS total FROM favorites WHERE post_id = ?")
    .get(postId).total;

  res.json({
    post_id: postId,
    favorited_by_me: !curtidaExistente, // inverteu o estado anterior
    favorites_count: totalCurtidas,
  });
});

module.exports = router;
