const { sequelize } = require('../config/database');

async function fixPropertyPhotosColumns() {
  try {
    console.log('\n🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado!\n');

    console.log('📋 Adicionando colunas cloudinary_url e url à tabela property_photos...\n');

    // Adicionar coluna cloudinary_url se não existir
    await sequelize.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'property_photos'
              AND column_name = 'cloudinary_url'
          ) THEN
              ALTER TABLE property_photos
              ADD COLUMN cloudinary_url VARCHAR(500);

              RAISE NOTICE 'Coluna cloudinary_url adicionada com sucesso';
          ELSE
              RAISE NOTICE 'Coluna cloudinary_url já existe';
          END IF;
      END $$;
    `);

    // Adicionar coluna url se não existir
    await sequelize.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1
              FROM information_schema.columns
              WHERE table_name = 'property_photos'
              AND column_name = 'url'
          ) THEN
              ALTER TABLE property_photos
              ADD COLUMN url VARCHAR(500);

              RAISE NOTICE 'Coluna url adicionada com sucesso';
          ELSE
              RAISE NOTICE 'Coluna url já existe';
          END IF;
      END $$;
    `);

    console.log('\n✅ Colunas adicionadas com sucesso!');

    // Verificar estrutura final
    console.log('\n📊 Estrutura atual da tabela property_photos:');
    const [results] = await sequelize.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'property_photos'
      ORDER BY ordinal_position;
    `);

    console.table(results);

    await sequelize.close();
    console.log('\n✅ Script executado com sucesso!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('\nDetalhes do erro:');
    console.error(error);
    console.error('\n');

    await sequelize.close();
    process.exit(1);
  }
}

// Executar
console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║  FIX: Adicionar Colunas cloudinary_url e url     ║');
console.log('╚═══════════════════════════════════════════════════╝');

fixPropertyPhotosColumns();
