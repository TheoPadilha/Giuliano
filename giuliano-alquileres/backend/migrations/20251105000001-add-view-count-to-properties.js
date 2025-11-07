'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('properties', 'view_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Contador de visualizações do imóvel'
    });

    // Índice para otimizar queries ordenadas por view_count
    await queryInterface.addIndex('properties', ['view_count'], {
      name: 'idx_properties_view_count'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('properties', 'idx_properties_view_count');
    await queryInterface.removeColumn('properties', 'view_count');
  }
};
