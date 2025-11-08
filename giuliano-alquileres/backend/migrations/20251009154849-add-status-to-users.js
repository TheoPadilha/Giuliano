// Dentro do novo arquivo de migration (ex: XXXXX-add-status-to-users.js)
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    if (!table.status) {
      await queryInterface.addColumn("users", "status", {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
        allowNull: false,
        defaultValue: "pending",
      });
      console.log('✅ Coluna status adicionada');
    } else {
      console.log('⏭️  Coluna status já existe, pulando esta migration.');
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('users');

    if (table.status) {
      await queryInterface.removeColumn("users", "status");
      // Opcional: remover o tipo ENUM, mas pode ser complexo.
      // await queryInterface.sequelize.query('DROP TYPE "enum_users_status";');
    }
  },
};
