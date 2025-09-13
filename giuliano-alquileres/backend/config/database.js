const { Sequelize } = require("sequelize");
require("dotenv").config();

// Configuração da conexão PostgreSQL
const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "giuliano_alquileres",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  dialect: "postgres",

  // Configurações de pool de conexões
  pool: {
    max: 10, // máximo de conexões
    min: 0, // mínimo de conexões
    acquire: 30000, // tempo limite para obter conexão
    idle: 10000, // tempo máximo de conexão inativa
  },

  // Configurações de logging
  logging: process.env.NODE_ENV === "development" ? console.log : false,

  // Configurações extras
  define: {
    timestamps: true, // adiciona createdAt e updatedAt
    underscored: false, // usa camelCase ao invés de snake_case
    freezeTableName: true, // não pluraliza nomes das tabelas
  },

  // Timezone
  timezone: "-03:00", // Horário de Brasília
});

// Teste de conexão
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
