module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Alterar o ENUM do campo 'role' para incluir 'client'
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" ADD VALUE IF NOT EXISTS 'client';
    `);

    // Alterar o padrão do campo 'role' para 'client'
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('client', 'admin', 'admin_master'),
      defaultValue: 'client',
      allowNull: false,
    });

    // Alterar o padrão do campo 'status' para 'approved' (clientes são aprovados automaticamente)
    await queryInterface.changeColumn('users', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'approved',
      allowNull: false,
    });

    console.log('✅ Migração concluída: role "client" adicionado e padrões atualizados');
  },

  down: async (queryInterface, Sequelize) => {
    // Reverter as alterações (se necessário)
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'admin_master'),
      defaultValue: 'admin',
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false,
    });

    console.log('⚠️ Migração revertida: role "client" removido');
  },
};
