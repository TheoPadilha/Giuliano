const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// Importar configuração do banco e models
const { sequelize } = require("./config/database");
const { syncModels, User, City, Property } = require("./models");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares de segurança
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CORS_ORIGIN || "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5500", // Live Server do VS Code
      null, // Para arquivos locais (file://)
    ],
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por IP
  message: "Muitas tentativas, tente novamente em 15 minutos",
});
app.use("/api/", limiter);

// Middlewares para parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Servir arquivos estáticos (uploads)
app.use("/uploads", express.static("uploads"));

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    message: "Giuliano Alquileres API funcionando!",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});

// Rota de teste do banco e models
app.get("/api/test-db", async (req, res) => {
  try {
    await syncModels();

    const counts = {
      users: await User.count(),
      cities: await City.count(),
      properties: await Property.count(),
    };

    res.json({
      message: "Conexão com banco PostgreSQL OK!",
      database: process.env.DB_NAME,
      models: "Sincronizados com sucesso",
      counts,
    });
  } catch (error) {
    console.error("Erro na conexão:", error);
    res.status(500).json({
      error: "Erro na conexão com banco",
      details: error.message,
    });
  }
});

// Importar rotas
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/utilities", require("./routes/utilities"));
app.use("/api/uploads", require("./routes/uploads"));

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
    await syncModels();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Acesse: http://localhost:${PORT}`);
      console.log(`🗄️  Banco: ${process.env.DB_NAME}`);
      console.log(
        `📊 Models: User, City, Property, PropertyPhoto, Amenity, TouristSpot`
      );
    });
  } catch (error) {
    console.error("❌ Erro ao iniciar servidor:", error);
    process.exit(1);
  }
};

startServer();
