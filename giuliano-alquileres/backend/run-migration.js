require("dotenv").config();
const { sequelize } = require("./config/database");

async function runMigration() {
  try {
    console.log("🔄 Executando migration para adicionar campos de recuperação de senha...\n");

    // Adicionar coluna reset_token
    await sequelize.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255) NULL
    `);
    console.log("✅ Coluna reset_token adicionada");

    // Adicionar coluna reset_token_expires
    await sequelize.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMP NULL
    `);
    console.log("✅ Coluna reset_token_expires adicionada");

    // Criar índice para otimizar buscas
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_users_reset_token
      ON users(reset_token)
    `);
    console.log("✅ Índice idx_users_reset_token criado");

    console.log("\n🎉 Migration executada com sucesso!");
    console.log("Agora você pode testar a recuperação de senha.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao executar migration:", error.message);
    process.exit(1);
  }
}

runMigration();
