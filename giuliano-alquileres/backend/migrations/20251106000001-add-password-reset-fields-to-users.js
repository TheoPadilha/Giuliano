"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adicionar campos de recuperação de senha na tabela users
    await queryInterface.addColumn("users", "reset_token", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "Token para recuperação de senha",
    });

    await queryInterface.addColumn("users", "reset_token_expires", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Data de expiração do token de recuperação",
    });

    // Adicionar índice para otimizar buscas por token
    await queryInterface.addIndex("users", ["reset_token"], {
      name: "idx_users_reset_token",
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remover índice primeiro
    await queryInterface.removeIndex("users", "idx_users_reset_token");

    // Remover colunas
    await queryInterface.removeColumn("users", "reset_token_expires");
    await queryInterface.removeColumn("users", "reset_token");
  },
};
