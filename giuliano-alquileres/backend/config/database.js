// database.js modificado

const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

// Verifica se estamos no ambiente de produção (no Render)
if (process.env.DATABASE_URL) {
  // Se a DATABASE_URL existe (no Render), usa ela para conectar
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Essencial para a conexão no Render
      },
    },
    pool: {
      max: 5, // Máximo de conexões (Render free tier tem limite baixo)
      min: 0, // Mínimo de conexões
      acquire: 60000, // Timeout para adquirir conexão (60s)
      idle: 10000, // Tempo que conexão fica ociosa antes de ser liberada (10s)
    },
    logging: false, // Desativa o logging em produção
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
    timezone: "-03:00",
  });
} else {
  // Se não, estamos no ambiente de desenvolvimento (sua máquina local)
  // Usa as variáveis do seu arquivo .env
  sequelize = new Sequelize({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "giuliano_alquileres",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: console.log, // Ativa o logging em desenvolvimento
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true,
    },
    timezone: "-03:00",
  });
}

// O resto do seu arquivo permanece igual
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão PostgreSQL OK!");
    return true;
  } catch (error) {
    console.error("❌ Erro na conexão PostgreSQL:", error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection,
  Sequelize,
};
