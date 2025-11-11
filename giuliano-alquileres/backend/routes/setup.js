/**
 * Rota de Setup - Inicialização do Banco de Dados
 *
 * ATENÇÃO: Use apenas uma vez após deploy!
 * Depois remova ou proteja com senha forte
 */

const express = require('express');
const router = express.Router();
const { sequelize, City, User, PropertyPhoto } = require('../models');
const bcrypt = require('bcryptjs');
const { Umzug, SequelizeStorage } = require('umzug');
const path = require('path');
const cloudinary = require('cloudinary').v2;

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

// Endpoint para corrigir fotos antigas com publicId no campo filename
router.post('/fix-photos', async (req, res) => {
  try {
    console.log('\n🔧 Corrigindo fotos antigas...');

    // Buscar todas as fotos que não têm cloudinary_url preenchida
    const photos = await PropertyPhoto.findAll({
      where: {
        cloudinary_url: null
      }
    });

    console.log(`📊 Encontradas ${photos.length} fotos sem cloudinary_url`);

    let fixed = 0;
    let skipped = 0;

    for (const photo of photos) {
      // Se o filename contém '/', é um publicId do Cloudinary
      if (photo.filename && photo.filename.includes('/')) {
        console.log(`🔧 Corrigindo foto ID ${photo.id}: ${photo.filename}`);

        // Construir a URL do Cloudinary baseado no publicId
        const cloudinaryUrl = cloudinary.url(photo.filename, {
          secure: true,
          transformation: []
        });

        // Atualizar a foto com a URL e o publicId corretos
        await photo.update({
          cloudinary_url: cloudinaryUrl,
          cloudinary_public_id: photo.filename
        });

        fixed++;
      } else {
        skipped++;
      }
    }

    console.log(`✅ Correção concluída! ${fixed} fotos corrigidas, ${skipped} mantidas.\n`);

    res.json({
      success: true,
      message: 'Fotos corrigidas com sucesso!',
      fixed,
      skipped,
      total: photos.length
    });

  } catch (error) {
    console.error('\n❌ Erro ao corrigir fotos:', error);

    res.status(500).json({
      success: false,
      error: 'Erro ao corrigir fotos',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ═══════════════════════════════════════════════════════════
// ENDPOINT PARA CRIAR ADMIN MASTER PERSONALIZADO
// ⚠️ USAR APENAS UMA VEZ E DEPOIS REMOVER!
// ═══════════════════════════════════════════════════════════

/**
 * @route   GET /api/setup/create-custom-admin
 * @desc    Criar ou atualizar admin master com email e senha personalizados
 * @access  Protegido por chave secreta na query
 *
 * USO (Cole no navegador):
 * https://giuliano-backend.onrender.com/api/setup/create-custom-admin?secret=giuliano2025setup&email=mundogiu73@gmail.com&password=admin123&name=Giuliano+Admin
 *
 * OU Local:
 * http://localhost:3001/api/setup/create-custom-admin?secret=giuliano2025setup&email=mundogiu73@gmail.com&password=admin123&name=Giuliano+Admin
 */
router.get('/create-custom-admin', async (req, res) => {
  try {
    // 1. Verificar chave secreta
    const { secret, email, password, name, phone } = req.query;

    if (secret !== 'giuliano2025setup') {
      return res.status(403).json({
        success: false,
        error: 'Chave secreta inválida'
      });
    }

    // 2. Validar parâmetros obrigatórios
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email e senha são obrigatórios',
        usage: '/api/setup/create-custom-admin?secret=giuliano2025setup&email=SEU_EMAIL&password=SUA_SENHA&name=SEU_NOME'
      });
    }

    const adminName = name || 'Admin Master';
    const adminPhone = phone || '+5547999951103';

    console.log('\n═══════════════════════════════════════');
    console.log('🔄 SETUP: Criando/Atualizando Admin Master Personalizado');
    console.log('═══════════════════════════════════════');
    console.log('Email:', email);
    console.log('Nome:', adminName);
    console.log('Telefone:', adminPhone);
    console.log('═══════════════════════════════════════\n');

    // 3. Verificar se usuário já existe
    let user = await User.findOne({ where: { email } });

    if (user) {
      console.log('⚠️  Usuário já existe. Atualizando...');

      // Gerar hash da nova senha
      const password_hash = await bcrypt.hash(password, 12);

      // Atualizar usuário existente
      await user.update({
        name: adminName,
        password_hash,
        phone: adminPhone,
        role: 'admin_master',
        status: 'approved'
      });

      console.log('✅ Usuário atualizado com sucesso!');

      return res.json({
        success: true,
        message: 'Admin Master atualizado com sucesso!',
        action: 'updated',
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status
        },
        credentials: {
          email: user.email,
          password: password,
          loginUrl: process.env.FRONTEND_URL ? process.env.FRONTEND_URL + '/login' : 'https://giulianoa-frontend.onrender.com/login'
        },
        warning: '⚠️ IMPORTANTE: Altere a senha após o primeiro login!'
      });
    }

    // 4. Criar novo admin master
    console.log('📝 Criando novo admin master...');

    // Gerar hash da senha
    const password_hash = await bcrypt.hash(password, 12);

    user = await User.create({
      name: adminName,
      email,
      password_hash,
      phone: adminPhone,
      country: 'Brasil',
      role: 'admin_master',
      status: 'approved'
    });

    console.log('✅ Admin Master criado com sucesso!');
    console.log('ID:', user.id);
    console.log('UUID:', user.uuid);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('\n');

    res.json({
      success: true,
      message: 'Admin Master criado com sucesso!',
      action: 'created',
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      },
      credentials: {
        email: user.email,
        password: password,
        loginUrl: process.env.FRONTEND_URL ? process.env.FRONTEND_URL + '/login' : 'https://giulianoa-frontend.onrender.com/login'
      },
      warning: '⚠️ IMPORTANTE: Altere a senha após o primeiro login!'
    });

  } catch (error) {
    console.error('❌ Erro ao criar/atualizar admin master:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/setup/list-admins
 * @desc    Listar todos os usuários admin (para debug)
 * @access  Protegido por chave secreta
 */
router.get('/list-admins', async (req, res) => {
  try {
    const { secret } = req.query;

    if (secret !== 'giuliano2025setup') {
      return res.status(403).json({
        success: false,
        error: 'Chave secreta inválida'
      });
    }

    const admins = await User.findAll({
      where: {
        role: ['admin', 'admin_master']
      },
      attributes: ['id', 'uuid', 'name', 'email', 'role', 'status', 'phone', 'created_at'],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: admins.length,
      admins
    });

  } catch (error) {
    console.error('❌ Erro ao listar admins:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
