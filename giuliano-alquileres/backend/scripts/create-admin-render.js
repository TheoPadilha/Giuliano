const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');

// ═══════════════════════════════════════════════════════════
// CONFIGURE AQUI OS DADOS DO ADMIN MASTER
// ═══════════════════════════════════════════════════════════
const ADMIN_DATA = {
  name: 'Giuliano Admin',
  email: 'mundogiu73@gmail.com',
  password: 'admin123',  // ⚠️ MUDE ESTA SENHA DEPOIS DO PRIMEIRO LOGIN!
  phone: '+5547999951103',
  country: 'Brasil'
};
// ═══════════════════════════════════════════════════════════

async function createAdminMaster() {
  let sequelize;

  try {
    // Usar DATABASE_URL do ambiente (Render)
    const DATABASE_URL = process.env.DATABASE_URL;

    if (!DATABASE_URL) {
      throw new Error('❌ DATABASE_URL não encontrada! Execute no Render ou defina a variável.');
    }

    console.log('\n🔄 Conectando ao banco de PRODUÇÃO...');

    // Conectar ao banco usando DATABASE_URL
    sequelize = new Sequelize(DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    });

    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de PRODUÇÃO!\n');

    // Definir modelo User inline (para não depender de imports)
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING(50)
      },
      country: {
        type: DataTypes.STRING(100)
      },
      role: {
        type: DataTypes.ENUM('guest', 'owner', 'admin', 'admin_master'),
        allowNull: false,
        defaultValue: 'guest'
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      }
    }, {
      tableName: 'users',
      underscored: true,
      timestamps: true
    });

    console.log('═══════════════════════════════════════');
    console.log('📋 CRIANDO ADMIN MASTER EM PRODUÇÃO');
    console.log('═══════════════════════════════════════');
    console.log(`Nome: ${ADMIN_DATA.name}`);
    console.log(`Email: ${ADMIN_DATA.email}`);
    console.log(`Senha: ${ADMIN_DATA.password}`);
    console.log('═══════════════════════════════════════\n');

    // Verificar se já existe
    const existingUser = await User.findOne({
      where: { email: ADMIN_DATA.email }
    });

    if (existingUser) {
      console.log('⚠️  USUÁRIO JÁ EXISTE!\n');
      console.log('Dados do usuário:');
      console.log('ID:', existingUser.id);
      console.log('Nome:', existingUser.name);
      console.log('Email:', existingUser.email);
      console.log('Role atual:', existingUser.role);
      console.log('Status:', existingUser.status);
      console.log('');

      if (existingUser.role !== 'admin_master') {
        console.log('🔄 Promovendo para admin_master...');
        await existingUser.update({
          role: 'admin_master',
          status: 'approved'
        });
        console.log('✅ Promovido com sucesso!\n');
      } else {
        console.log('ℹ️  Já é admin_master.\n');

        // Resetar senha
        console.log('🔄 Resetando senha para: ' + ADMIN_DATA.password);
        const password_hash = await bcrypt.hash(ADMIN_DATA.password, 12);
        await existingUser.update({ password_hash });
        console.log('✅ Senha resetada com sucesso!\n');
      }

      await sequelize.close();
      process.exit(0);
    }

    // Criar novo admin
    console.log('🔐 Gerando hash da senha...');
    const password_hash = await bcrypt.hash(ADMIN_DATA.password, 12);

    console.log('📝 Criando admin master...');
    const adminMaster = await User.create({
      name: ADMIN_DATA.name,
      email: ADMIN_DATA.email,
      password_hash: password_hash,
      phone: ADMIN_DATA.phone,
      country: ADMIN_DATA.country,
      role: 'admin_master',
      status: 'approved'
    });

    console.log('✅ Admin Master criado com sucesso!\n');

    console.log('═══════════════════════════════════════');
    console.log('     CREDENCIAIS DE ACESSO PRODUÇÃO    ');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', adminMaster.email);
    console.log('🔑 Senha:', ADMIN_DATA.password);
    console.log('👤 Role:', adminMaster.role);
    console.log('✅ Status:', adminMaster.status);
    console.log('═══════════════════════════════════════\n');

    console.log('🔗 URL de Login PRODUÇÃO:');
    console.log('   https://giulianoa-frontend.onrender.com/login\n');

    console.log('⚠️  IMPORTANTE: Altere a senha após o primeiro login!\n');

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERRO:', error.message);
    console.error('\nDetalhes:', error);

    if (sequelize) {
      await sequelize.close();
    }
    process.exit(1);
  }
}

console.log('\n╔═══════════════════════════════════════╗');
console.log('║ CRIAR ADMIN MASTER - PRODUÇÃO RENDER  ║');
console.log('╚═══════════════════════════════════════╝');

createAdminMaster();
