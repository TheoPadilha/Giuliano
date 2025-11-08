'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('properties');

    if (!table.view_count) {
      await queryInterface.addColumn('properties', 'view_count', {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'Contador de visualizações do imóvel'
      });
      console.log('✅ Coluna view_count adicionada');

      // Índice para otimizar queries ordenadas por view_count
      await queryInterface.addIndex('properties', ['view_count'], {
        name: 'idx_properties_view_count'
      });
      console.log('✅ Índice idx_properties_view_count criado');
    } else {
      console.log('⏭️  Coluna view_count já existe, pulando esta migration');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('properties');

    if (table.view_count) {
      try {
        await queryInterface.removeIndex('properties', 'idx_properties_view_count');
      } catch (e) {
        // Índice pode não existir
      }
      await queryInterface.removeColumn('properties', 'view_count');
    }
  }
};
