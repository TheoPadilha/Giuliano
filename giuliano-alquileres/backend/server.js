const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Validar variáveis de ambiente críticas
const requiredEnvVars = ["JWT_SECRET", "DB_PASSWORD"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    `❌ Erro: Variáveis de ambiente obrigatórias não encontradas: ${missingEnvVars.join(
      ", "
    )}`
  );
  process.exit(1);
}

// Definir NODE_ENV padrão como production (segurança)
process.env.NODE_ENV = process.env.NODE_ENV || "production";

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

// CORS Configuration - Remover null para maior segurança
const allowedOrigins = [
  process.env.CORS_ORIGIN || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:5500",
  "https://giulianoa-frontend.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requisições sem origin (mobile apps, Postman, etc.) apenas em dev
      if (!origin && process.env.NODE_ENV === "development") {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true,
  })
);

// Rate limiting geral para toda a API
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Aumentado para não bloquear desenvolvimento
  message: { error: "Muitas requisições. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Muitas requisições. Tente novamente em 15 minutos."
    });
  }
});

// Rate limiter específico para autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Aumentado de 5 para 10
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Muitas tentativas de login. Tente novamente em 15 minutos."
    });
  }
});

// Rate limiter para cadastro
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Aumentado de 3 para 10
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Muitos cadastros. Tente novamente em 1 hora."
    });
  }
});

app.use("/api/", generalLimiter);

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

// Importar rotas com rate limiters específicos
app.use("/api/auth", require("./routes/auth")(authLimiter, registerLimiter));
app.use("/api/users", require("./routes/users"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/utilities", require("./routes/utilities"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/favorites", require("./routes/favorites"));

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

// Handlers para erros não capturados - mantém servidor rodando
process.on("uncaughtException", (error) => {
  console.error("❌ Erro não capturado:", error);
  console.log("⚠️  Servidor continuará rodando...");
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Promise rejeitada não tratada em:", promise);
  console.error("Razão:", reason);
  console.log("⚠️  Servidor continuará rodando...");
});

// Handlers para sinais de encerramento
process.on("SIGTERM", () => {
  console.log("📡 SIGTERM recebido. Encerrando graciosamente...");
  server.close(() => {
    console.log("👋 Servidor encerrado");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("\n📡 SIGINT recebido. Encerrando graciosamente...");
  server.close(() => {
    console.log("👋 Servidor encerrado");
    process.exit(0);
  });
});

// Iniciar servidor
let server;
const startServer = async () => {
  try {
    // ✅ SINCRONIZAR MODELS COM O BANCO ANTES DE INICIAR
    console.log("🔄 Sincronizando models com o banco de dados...");
    await syncModels();
    console.log("✅ Models sincronizados com sucesso!\n");

    server = app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Acesse: http://localhost:${PORT}`);
      console.log(
        `🗄️  Banco: ${process.env.DB_NAME || "Configurado via DATABASE_URL"}`
      );
      console.log(`🔒 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`💡 Pressione Ctrl+C para encerrar\n`);
    });

    // Evita que o servidor encerre sozinho
    server.on("error", (error) => {
      console.error("❌ Erro no servidor:", error);
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Porta ${PORT} já está em uso!`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    console.error("Detalhes:", error.message);
    process.exit(1);
  }
};

startServer();
