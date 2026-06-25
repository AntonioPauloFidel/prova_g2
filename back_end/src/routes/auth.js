const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db/database");
const { gerarToken } = require("../utils/token");
const { exigirLogin } = require("../middleware/auth");

const router = express.Router();

const SALT_ROUNDS = 10;

const OPCOES_COOKIE = {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias, em ms
};

// POST /api/auth/register
router.post("/register", (req, res) => {
  const { name, username, password, epitaph } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ erro: "Nome, usuario e senha são obrigatórios." });
  }

  if (password.length < 4) {
    return res.status(400).json({ erro: "A senha precisa ter pelo menos 4 caracteres." });
  }

  const usernameNormalizado = username.trim().toLowerCase();

  const usuarioExistente = db
    .prepare("SELECT id FROM users WHERE username = ?")
    .get(usernameNormalizado);

  if (usuarioExistente) {
    return res.status(409).json({ erro: "Esse nome de usuário já está em uso." });
  }

  const hash = bcrypt.hashSync(password, SALT_ROUNDS);

  const resultado = db
    .prepare(
      `INSERT INTO users (name, username, password_hash, epitaph)
       VALUES (?, ?, ?, ?)`
    )
    .run(
      name.trim(),
      usernameNormalizado,
      hash,
      epitaph?.trim() || "Mais um espírito perdido na timeline..."
    );

  const novoUsuario = {
    id: resultado.lastInsertRowid,
    name: name.trim(),
    username: usernameNormalizado,
  };

  const token = gerarToken(novoUsuario);
  res.cookie("token", token, OPCOES_COOKIE);

  res.status(201).json({ usuario: novoUsuario });
});

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ erro: "Usuário e senha são obrigatórios." });
  }

  const usernameNormalizado = username.trim().toLowerCase();

  const usuario = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(usernameNormalizado);

  // Mensagem generica de proposito: nao revelamos se o erro foi
  // "usuario nao existe" ou "senha errada", por seguranca.
  const credenciaisInvalidas = () =>
    res.status(401).json({ erro: "Usuário ou senha inválidos." });

  if (!usuario) {
    return credenciaisInvalidas();
  }

  const senhaCorreta = bcrypt.compareSync(password, usuario.password_hash);

  if (!senhaCorreta) {
    return credenciaisInvalidas();
  }

  const token = gerarToken(usuario);
  res.cookie("token", token, OPCOES_COOKIE);

  res.json({
    usuario: { id: usuario.id, name: usuario.name, username: usuario.username },
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ mensagem: "Logout realizado com sucesso." });
});

// GET /api/auth/me  -> usado pelo front para restaurar a sessao ao recarregar a pagina
router.get("/me", exigirLogin, (req, res) => {
  const usuario = db
    .prepare("SELECT id, name, username, epitaph FROM users WHERE id = ?")
    .get(req.usuario.id);

  if (!usuario) {
    return res.status(404).json({ erro: "Usuário não encontrado." });
  }

  res.json({ usuario });
});

module.exports = router;
