
const { verificarToken } = require("../utils/token");

function lerTokenDoCookie(req) {
  return req.cookies?.token || null;
}

function exigirLogin(req, res, next) {
  const token = lerTokenDoCookie(req);
  const dados = token ? verificarToken(token) : null;

  if (!dados) {
    return res.status(401).json({ erro: "É necessário estar logado para realizar esta ação." });
  }

  req.usuario = dados;
  next();
}

function identificarUsuario(req, res, next) {
  const token = lerTokenDoCookie(req);
  const dados = token ? verificarToken(token) : null;

  req.usuario = dados; // pode ser null, e tudo bem
  next();
}

module.exports = { exigirLogin, identificarUsuario };
