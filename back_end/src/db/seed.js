// src/db/seed.js
//
// Popula o banco com alguns usuarios e posts de exemplo, para facilitar
// a demonstracao em sala sem precisar cadastrar tudo na mao.
//
// Rodar com: npm run seed

const bcrypt = require("bcryptjs");
const db = require("./database");

function seed() {
  const jaTemUsuarios = db.prepare("SELECT COUNT(*) AS total FROM users").get();

  if (jaTemUsuarios.total > 0) {
    console.log("Banco ja possui usuarios. Seed nao executado (apague o arquivo .sqlite para recriar do zero).");
    return;
  }

  const inserirUsuario = db.prepare(`
    INSERT INTO users (name, username, password_hash, epitaph)
    VALUES (?, ?, ?, ?)
  `);

  const inserirPost = db.prepare(`
    INSERT INTO posts (content, user_id) VALUES (?, ?)
  `);

  const senhaPadrao = bcrypt.hashSync("123456", 10);

  const ana = inserirUsuario.run(
    "Ana Espectro",
    "ana",
    senhaPadrao,
    "Aqui jaz quem tweetava 'bom dia' todo santo dia"
  );

  const bento = inserirUsuario.run(
    "Bento Saudade",
    "bento",
    senhaPadrao,
    "Descansa em paz, thread mal contada"
  );

  inserirPost.run("RIP minha timeline de 2014, vou sentir saudade dos memes de Nyan Cat.", ana.lastInsertRowid);
  inserirPost.run("Aqui descansa o pessaro azul. Que ele cante em outro plano.", ana.lastInsertRowid);
  inserirPost.run("140 caracteres eram suficientes. Nunca precisamos de mais que isso.", bento.lastInsertRowid);
  inserirPost.run("Momento de silencio pelos trending topics que nunca mais vamos entender.", bento.lastInsertRowid);

  console.log("Seed concluido!");
  console.log("Usuarios de teste: ana / 123456  e  bento / 123456");
}

seed();
