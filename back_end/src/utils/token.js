const jwt = require("jsonwebtoken");

const SEGREDO = process.env.JWT_SECRET || "segredo-de-emergencia-trocar-isso";
const DURACAO_TOKEN = "7d";

function gerarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, username: usuario.username, name: usuario.name },
    SEGREDO,
    { expiresIn: DURACAO_TOKEN }
  );
}

function verificarToken(token) {
  try {
    return jwt.verify(token, SEGREDO);
  } catch (erro) {
    return null;
  }
}

module.exports = { gerarToken, verificarToken };
