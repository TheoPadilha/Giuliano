const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const User = require('../models/User');

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
  try {
    console.log('\n🔄 Conectando ao banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conectado!\n');

    console.log('═══════════════════════════════════════');
    console.log('📋 CRIANDO ADMIN MASTER');
    console.log('═══════════════════════════════════════');
    console.log(`Nome: ${ADMIN_DATA.name}`);
    console.log(`Email: ${ADMIN_DATA.email}`);
    console.log(`Senha: ${ADMIN_DATA.password}`);
    console.log(`Telefone: ${ADMIN_DATA.phone}`);
    console.log('═══════════════════════════════════════\n');

    // Verificar se já existe um usuário com esse email
    const existingUser = await User.findOne({
      where: { email: ADMIN_DATA.email }
    });

    if (existingUser) {
      console.log('⚠️  USUÁRIO JÁ EXISTE!\n');
      console.log('Dados do usuário encontrado:');
      console.log('ID:', existingUser.id);
      console.log('Nome:', existingUser.name);
      console.log('Email:', existingUser.email);
      console.log('Role atual:', existingUser.role);
      console.log('Status:', existingUser.status);
      console.log('');

      // Perguntar se quer promover para admin_master
      if (existingUser.role !== 'admin_master') {
        console.log('🔄 Promovendo usuário para admin_master...');

        await existingUser.update({
          role: 'admin_master',
          status: 'approved'
        });

        console.log('✅ Usuário promovido para admin_master com sucesso!\n');
        console.log('═══════════════════════════════════════');
        console.log('📧 Email:', existingUser.email);
        console.log('👤 Role:', 'admin_master');
        console.log('✅ Status:', 'approved');
        console.log('═══════════════════════════════════════\n');
      } else {
        console.log('ℹ️  Usuário já é admin_master. Nada a fazer.\n');
      }

      await sequelize.close();
      process.exit(0);
    }

    // Criar hash da senha
    console.log('🔐 Gerando hash da senha...');
    const password_hash = await bcrypt.hash(ADMIN_DATA.password, 12);

    // Criar admin master
    console.log('📝 Criando usuário no banco...');
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
    console.log('        CREDENCIAIS DE ACESSO         ');
    console.log('═══════════════════════════════════════');
    console.log('📧 Email:', adminMaster.email);
    console.log('🔑 Senha:', ADMIN_DATA.password);
    console.log('👤 Role:', adminMaster.role);
    console.log('🆔 ID:', adminMaster.id);
    console.log('🔗 UUID:', adminMaster.uuid);
    console.log('✅ Status:', adminMaster.status);
    console.log('═══════════════════════════════════════\n');

    console.log('⚠️  IMPORTANTE:');
    console.log('   1. Faça login com essas credenciais');
    console.log('   2. Altere a senha IMEDIATAMENTE!');
    console.log('   3. Use uma senha forte em produção\n');

    console.log('🔗 URL de Login:');
    console.log('   Local: http://localhost:5173/login');
    console.log('   Produção: https://giulianoa-frontend.onrender.com/login\n');

    await sequelize.close();
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
console.log('\n');
console.log('╔═══════════════════════════════════════╗');
console.log('║   CRIAR ADMIN MASTER - Zigué Aluga    ║');
console.log('╚═══════════════════════════════════════╝');

createAdminMaster();
