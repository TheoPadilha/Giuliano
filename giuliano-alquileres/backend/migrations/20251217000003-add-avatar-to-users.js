'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'avatar', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'URL da imagem de avatar do usuário (Cloudinary)',
    });

    console.log('✅ Coluna avatar adicionada à tabela users');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'avatar');
  },
};
