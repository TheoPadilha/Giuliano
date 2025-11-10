const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
require("dotenv").config();

// Validar variáveis de ambiente críticas
const requiredEnvVars = ["JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

// Validar banco de dados: deve ter DATABASE_URL (produção) OU DB_PASSWORD (desenvolvimento)
if (!process.env.DATABASE_URL && !process.env.DB_PASSWORD) {
  console.error(
    "❌ Erro: Configure DATABASE_URL (produção) ou DB_PASSWORD (desenvolvimento)"
  );
  process.exit(1);
}

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
const { syncModels, User, City, Property, CityGuide } = require("./models");

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
  process.env.CORS_ORIGIN || "http://localhost:5173", //https://ziguealuga.com
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "http://localhost:3004",
  "http://localhost:3005",
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
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // Mais permissivo em dev
  message: { error: "Muitas requisições. Tente novamente em 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Pular rate limit para localhost em desenvolvimento
    return process.env.NODE_ENV === "development" &&
           (req.ip === "::1" || req.ip === "127.0.0.1" || req.ip === "::ffff:127.0.0.1");
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Muitas requisições. Tente novamente em 15 minutos.",
    });
  },
});

// Rate limiter específico para autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // Aumentado de 5 para 10
  skipSuccessfulRequests: true, // Não conta requisições bem-sucedidas
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Muitas tentativas de login. Tente novamente em 15 minutos.",
    });
  },
});

// Rate limiter para cadastro
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Aumentado de 3 para 10
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: "Muitos cadastros. Tente novamente em 1 hora.",
    });
  },
});

app.use("/api/", generalLimiter);

// Middlewares para parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir arquivos estáticos
// Servir arquivos estáticos
// O Render pode não ter o diretório 'uploads' no mesmo nível que o 'server.js'
// O caminho absoluto é mais seguro em ambientes de produção como o Render.
// No entanto, o `path.join(__dirname, "uploads")` está correto para a estrutura do projeto.
// O problema é que o Render pode estar executando o `server.js` de um diretório diferente
// ou o diretório `uploads` não está persistindo.
// Se o problema for a persistência, a solução é usar um serviço de armazenamento externo (Cloudinary, S3).
// Como o código já tem dependência do Cloudinary (linha 18 do package.json), vou verificar se o upload está sendo feito para o Cloudinary.

// Se o upload estiver sendo feito localmente, o problema é que o Render não persiste arquivos.
// Vou assumir que o problema é a persistência e que o upload deveria estar usando o Cloudinary,
// mas o código está servindo localmente.

// Se o upload estiver sendo feito localmente, a rota estática está correta.
// O problema é que o arquivo não existe no servidor do Render.
// A rota estática está correta: /uploads -> ./uploads
// O caminho da imagem é: https://giuliano.onrender.com/uploads/properties/...
// O caminho no servidor é: /uploads/properties/...

// Se o upload for local, a correção é migrar para o Cloudinary.
// Se o upload já for para o Cloudinary, o problema é que o frontend está usando a URL local.

// Vou verificar o controller de upload para ver se o Cloudinary está sendo usado.
// O arquivo é `Giuliano/giuliano-alquileres/backend/controllers/uploadController.js`

// Por enquanto, vou apenas garantir que o caminho estático está o mais robusto possível,
// embora o `path.join` já faça isso.

// A rota estática está correta. O problema é que o arquivo não existe no servidor do Render.
// O Render não persiste arquivos no sistema de arquivos local.
// A solução correta é usar o Cloudinary, que já está nas dependências.

// Vou verificar o `uploadController.js` para confirmar se o Cloudinary está sendo usado.
// Se não estiver, a correção será implementá-lo.

// Por enquanto, não vou alterar o `server.js`. Vou para a fase 2 para diagnosticar o uso do Cloudinary.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "Giuliano Alquileres API funcionando!",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
    domain: "ziguealuga.com",
  });
});

// Health check endpoint para deploy (Render, Railway, etc)
app.get("/health", async (req, res) => {
  try {
    // Testar conexão com banco de dados
    await sequelize.authenticate();

    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    });
  }
});

// Importar rotas com rate limiters específicos
app.use("/api/auth", require("./routes/auth")(authLimiter, registerLimiter));
app.use("/api/users", require("./routes/users"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/utilities", require("./routes/utilities"));
app.use("/api/uploads", require("./routes/uploads"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/stats", require("./routes/stats"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/city-guides", require("./routes/cityGuides"));

// Rota de setup inicial (apenas para primeiro deploy)
// ⚠️ ATENÇÃO: Remover ou proteger depois de usar!
app.use("/api/setup", require("./routes/setup"));

// Rota temporária para seed de dados
// ⚠️ REMOVIDO POR SEGURANÇA - Seed de comodidades já foi concluído
// app.use("/api/seed", require("./routes/seed"));

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
