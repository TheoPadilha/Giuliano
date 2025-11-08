/**
 * Rota de Setup - Inicialização do Banco de Dados
 *
 * ATENÇÃO: Use apenas uma vez após deploy!
 * Depois remova ou proteja com senha forte
 */

const express = require('express');
const router = express.Router();
const { sequelize, City, User } = require('../models');
const bcrypt = require('bcryptjs');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');

// Lista de cidades de SC
const CITIES_SC = [
  // Região Metropolitana de Balneário Camboriú (prioridade)
  { name: "Balneário Camboriú", state: "SC", region: "Litoral" },
  { name: "Camboriú", state: "SC", region: "Litoral" },
  { name: "Itajaí", state: "SC", region: "Litoral" },
  { name: "Itapema", state: "SC", region: "Litoral" },
  { name: "Porto Belo", state: "SC", region: "Litoral" },
  { name: "Bombinhas", state: "SC", region: "Litoral" },
  { name: "Navegantes", state: "SC", region: "Litoral" },
  { name: "Penha", state: "SC", region: "Litoral" },
  { name: "Balneário Piçarras", state: "SC", region: "Litoral" },
  { name: "Piçarras", state: "SC", region: "Litoral" },
  { name: "Tijucas", state: "SC", region: "Litoral" },
  { name: "Barra Velha", state: "SC", region: "Litoral" },
  { name: "Ilhota", state: "SC", region: "Vale do Itajaí" },
  { name: "Luiz Alves", state: "SC", region: "Vale do Itajaí" },

  // Grande Florianópolis
  { name: "Florianópolis", state: "SC", region: "Litoral" },
  { name: "São José", state: "SC", region: "Grande Florianópolis" },
  { name: "Palhoça", state: "SC", region: "Grande Florianópolis" },
  { name: "Biguaçu", state: "SC", region: "Grande Florianópolis" },
  { name: "Governador Celso Ramos", state: "SC", region: "Litoral" },
  { name: "Santo Amaro da Imperatriz", state: "SC", region: "Grande Florianópolis" },
  { name: "Águas Mornas", state: "SC", region: "Grande Florianópolis" },
  { name: "Antônio Carlos", state: "SC", region: "Grande Florianópolis" },
  { name: "São Pedro de Alcântara", state: "SC", region: "Grande Florianópolis" },

  // Sul do estado
  { name: "Garopaba", state: "SC", region: "Sul" },
  { name: "Imbituba", state: "SC", region: "Sul" },
  { name: "Laguna", state: "SC", region: "Sul" },
  { name: "Paulo Lopes", state: "SC", region: "Sul" },
  { name: "Imaruí", state: "SC", region: "Sul" },
  { name: "Jaguaruna", state: "SC", region: "Sul" },
  { name: "Tubarão", state: "SC", region: "Sul" },
  { name: "Capivari de Baixo", state: "SC", region: "Sul" },

  // Vale do Itajaí
  { name: "Blumenau", state: "SC", region: "Vale do Itajaí" },
  { name: "Brusque", state: "SC", region: "Vale do Itajaí" },
  { name: "Gaspar", state: "SC", region: "Vale do Itajaí" },
  { name: "Indaial", state: "SC", region: "Vale do Itajaí" },
  { name: "Pomerode", state: "SC", region: "Vale do Itajaí" },
  { name: "Timbó", state: "SC", region: "Vale do Itajaí" },
  { name: "Rio dos Cedros", state: "SC", region: "Vale do Itajaí" },
  { name: "Ascurra", state: "SC", region: "Vale do Itajaí" },
  { name: "Apiúna", state: "SC", region: "Vale do Itajaí" },

  // Norte
  { name: "Joinville", state: "SC", region: "Norte" },
  { name: "São Francisco do Sul", state: "SC", region: "Norte" },
  { name: "Araquari", state: "SC", region: "Norte" },
  { name: "Guaramirim", state: "SC", region: "Norte" },
  { name: "Jaraguá do Sul", state: "SC", region: "Norte" },
  { name: "Schroeder", state: "SC", region: "Norte" },
  { name: "Corupá", state: "SC", region: "Norte" },
  { name: "Massaranduba", state: "SC", region: "Norte" },

  // Outras regiões
  { name: "Chapecó", state: "SC", region: "Oeste" },
  { name: "Lages", state: "SC", region: "Serra" },
  { name: "Criciúma", state: "SC", region: "Sul" },
  { name: "Joaçaba", state: "SC", region: "Oeste" },
  { name: "Caçador", state: "SC", region: "Meio Oeste" },
  { name: "Concórdia", state: "SC", region: "Oeste" },
  { name: "Rio do Sul", state: "SC", region: "Alto Vale" },
  { name: "Videira", state: "SC", region: "Meio Oeste" },
  { name: "São Bento do Sul", state: "SC", region: "Planalto Norte" },
  { name: "Mafra", state: "SC", region: "Planalto Norte" },

  // Litoral adicional
  { name: "Balneário Arroio do Silva", state: "SC", region: "Sul" },
  { name: "Balneário Gaivota", state: "SC", region: "Sul" },
  { name: "Balneário Rincão", state: "SC", region: "Sul" },
  { name: "Içara", state: "SC", region: "Sul" },
  { name: "Araranguá", state: "SC", region: "Sul" },
];

// Endpoint de inicialização
router.post('/initialize', async (req, res) => {
  try {
    const results = {
      database: 'checking',
      cities: { created: 0, existing: 0 },
      admin: 'checking',
      errors: []
    };

    // 1. Testar conexão com banco
    console.log('\n🔄 Testando conexão com banco...');
    await sequelize.authenticate();
    results.database = 'connected';
    console.log('✅ Banco conectado!');

    // 2. Sincronizar models (cria tabelas se não existem)
    console.log('\n🔄 Sincronizando tabelas...');
    await sequelize.sync({ alter: false });
    console.log('✅ Tabelas sincronizadas!');

    // 3. Popular cidades
    console.log('\n🔄 Populando cidades...');
    for (const cityData of CITIES_SC) {
      try {
        const [city, isNew] = await City.findOrCreate({
          where: {
            name: cityData.name,
            state: cityData.state
          },
          defaults: cityData
        });

        if (isNew) {
          results.cities.created++;
          console.log(`✅ Criada: ${cityData.name}`);
        } else {
          results.cities.existing++;
        }
      } catch (error) {
        console.error(`❌ Erro ao criar ${cityData.name}:`, error.message);
        results.errors.push(`Cidade ${cityData.name}: ${error.message}`);
      }
    }

    // 4. Criar usuário admin (se não existe)
    console.log('\n🔄 Verificando usuário admin...');
    try {
      const existingAdmin = await User.findOne({
        where: { email: 'admin@ziguealuga.com' }
      });

      if (existingAdmin) {
        results.admin = 'already_exists';
        console.log('⏭️  Admin já existe');
      } else {
        // Passar senha em texto puro - o hook beforeCreate fará o hash
        const admin = await User.create({
          name: 'Giuliano Admin',
          email: 'admin@ziguealuga.com',
          password_hash: 'admin123', // Hook do model fará o hash automaticamente
          phone: '+5547989105580',
          role: 'admin_master',
          status: 'approved',
          country: 'Brasil'
        });
        results.admin = 'created';
        console.log('✅ Admin criado:', admin.email);
      }
    } catch (error) {
      console.error('❌ Erro ao criar admin:', error.message);
      results.admin = 'error';
      results.errors.push(`Admin: ${error.message}`);
    }

    // 5. Retornar resultado
    console.log('\n✅ Setup concluído!\n');

    return res.status(200).json({
      success: true,
      message: 'Setup do banco de dados concluído!',
      results: results,
      next_steps: [
        '1. Acesse /health para verificar se está tudo OK',
        '2. Faça login com: admin@ziguealuga.com / admin123',
        '3. REMOVA este endpoint /api/setup depois!'
      ]
    });

  } catch (error) {
    console.error('\n❌ Erro no setup:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro ao inicializar banco de dados',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Endpoint para verificar status
router.get('/status', async (req, res) => {
  try {
    const citiesCount = await City.count();
    const usersCount = await User.count();
    const hasAdmin = await User.findOne({ where: { role: 'admin_master' } });

    res.json({
      database: 'connected',
      cities: citiesCount,
      users: usersCount,
      has_admin: !!hasAdmin,
      ready: citiesCount > 0 && !!hasAdmin
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// Endpoint para verificar e recriar admin
router.post('/reset-admin', async (req, res) => {
  try {
    // Deletar admin antigo se existir
    await User.destroy({
      where: { email: 'admin@ziguealuga.com' }
    });

    // Criar novo admin (senha em texto puro - hook fará o hash)
    const admin = await User.create({
      name: 'Giuliano Admin',
      email: 'admin@ziguealuga.com',
      password_hash: 'admin123', // Hook do model fará o hash automaticamente
      phone: '+5547989105580',
      role: 'admin_master',
      status: 'approved',
      country: 'Brasil'
    });

    res.json({
      success: true,
      message: 'Admin recriado com sucesso!',
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        status: admin.status
      }
    });
  } catch (error) {
    console.error('Erro ao recriar admin:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para rodar migrations pendentes
router.post('/migrate', async (req, res) => {
  try {
    console.log('\n🔄 Executando migrations pendentes...');

    // Configurar Umzug para rodar migrations
    const umzug = new Umzug({
      migrations: {
        glob: path.join(__dirname, '../migrations/*.js'),
        resolve: ({ name, path: filepath, context: sequelize }) => {
          const migration = require(filepath);
          return {
            name,
            up: async () => migration.up(sequelize.getQueryInterface(), sequelize.constructor),
            down: async () => migration.down(sequelize.getQueryInterface(), sequelize.constructor)
          };
        }
      },
      context: sequelize,
      storage: new SequelizeStorage({ sequelize }),
      logger: console
    });

    // Rodar migrations pendentes
    const migrations = await umzug.up();

    console.log('✅ Migrations concluídas!\n');

    res.json({
      success: true,
      message: 'Migrations executadas com sucesso!',
      migrations: migrations.map(m => m.name),
      count: migrations.length
    });

  } catch (error) {
    console.error('\n❌ Erro ao rodar migrations:', error);

    res.status(500).json({
      success: false,
      error: 'Erro ao executar migrations',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
