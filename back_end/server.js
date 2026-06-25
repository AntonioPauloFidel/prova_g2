require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./src/routes/auth");
const postsRoutes = require("./src/routes/posts");
const app = express();

const PORT = process.env.PORT || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true, // necessario para o cookie de sessao ser enviado/recebido
  })
);
app.use(express.json());
app.use(cookieParser());

// Rota de checagem rapida, util para confirmar que o servidor esta de pe
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mensagem: "Eu amo a aula de Desenvolvimento WEB" });
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);

// Tratamento simples de rota inexistente
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
});

// Tratamento de erro generico, para nunca derrubar o servidor por um erro nao tratado
app.use((err, req, res, next) => {
  console.error("Erro inesperado:", err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORT, () => {
  console.log(`Servidor "Últimas Palavras" rodando em http://localhost:${PORT}`);
});
