"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');

    // Adicionar campos de recuperação de senha na tabela users
    if (!table.reset_token) {
      await queryInterface.addColumn("users", "reset_token", {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: "Token para recuperação de senha",
      });
      console.log('✅ Coluna reset_token adicionada');
    } else {
      console.log('⏭️  Coluna reset_token já existe');
    }

    if (!table.reset_token_expires) {
      await queryInterface.addColumn("users", "reset_token_expires", {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Data de expiração do token de recuperação",
      });
      console.log('✅ Coluna reset_token_expires adicionada');
    } else {
      console.log('⏭️  Coluna reset_token_expires já existe');
    }

    // Adicionar índice para otimizar buscas por token
    if (!table.reset_token) {
      try {
        await queryInterface.addIndex("users", ["reset_token"], {
          name: "idx_users_reset_token",
        });
        console.log('✅ Índice idx_users_reset_token criado');
      } catch (e) {
        console.log('⏭️  Índice idx_users_reset_token já existe');
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');

    // Remover índice primeiro
    try {
      await queryInterface.removeIndex("users", "idx_users_reset_token");
    } catch (e) {
      // Índice pode não existir
    }

    // Remover colunas
    if (table.reset_token_expires) {
      await queryInterface.removeColumn("users", "reset_token_expires");
    }

    if (table.reset_token) {
      await queryInterface.removeColumn("users", "reset_token");
    }
  },
};
