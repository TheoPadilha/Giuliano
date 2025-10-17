const { sequelize } = require("./config/database");

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão estabelecida com sucesso!");

    // Mostra as tabelas criadas
    const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("\n📋 Tabelas no banco:");
    results.forEach((row) => console.log(`  - ${row.table_name}`));

    await sequelize.close();
  } catch (error) {
    console.error("❌ Erro ao conectar:", error.message);
  }
}

testConnection();
