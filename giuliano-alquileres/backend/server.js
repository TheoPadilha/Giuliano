const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Importar configuração do banco e models
const { sequelize } = require("./config/database");
const { syncModels, User, City, Property } = require("./models");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// --- ALTERAÇÃO 1: Adicionar a URL do frontend do Render à lista de origens permitidas no CORS ---
// Isso é crucial para que o frontend possa se comunicar com o backend.
const allowedOrigins = [
  process.env.CORS_ORIGIN || "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5500",
  "https://giulianoa-frontend.onrender.com", // Adicione a URL do seu frontend aqui
  null,
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas tentativas, tente novamente em 15 minutos",
});
app.use("/api/", limiter);

// Middlewares para parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir arquivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "Giuliano Alquileres API funcionando!",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});

// ... (suas outras rotas de teste podem permanecer aqui) ...

// Importar rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/utilities", require("./routes/utilities"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/admin", require("./routes/admin"));

// --- ALTERAÇÃO 2: Adicionar um placeholder para as futuras rotas de administração ---
// Vamos criar este arquivo de rotas em breve.
// app.use("/api/admin", require("./routes/admin"));

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Algo deu errado!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Erro interno do servidor",
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // --- ALTERAÇÃO 3: Adicionar a sincronização com { alter: true } ---
    // Isso irá ler os modelos (incluindo as mudanças no User) e alterar as tabelas no banco de dados.
    // Ele adicionará a coluna 'status' e modificará a coluna 'role' sem apagar os dados.
    //await sequelize.sync({ alter: true });
    // console.log(
    //   "✅ Banco de dados sincronizado com as alterações dos modelos."
    // );

    // A função syncModels pode não ser mais necessária se sync({ alter: true }) for usado,
    // mas vamos mantê-la caso ela faça algo a mais.
    // await syncModels();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Acesse: http://localhost:${PORT}`);
      console.log(`🗄️  Banco: ${process.env.DB_NAME}`);
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
