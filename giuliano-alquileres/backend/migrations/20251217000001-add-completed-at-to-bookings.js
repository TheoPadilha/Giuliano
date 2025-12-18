'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('bookings');

    if (!table.completed_at) {
      await queryInterface.addColumn('bookings', 'completed_at', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Data em que a reserva foi marcada como concluída (após check-out)'
      });
      console.log('✅ Coluna completed_at adicionada à tabela bookings');

      // Índice para otimizar queries de reservas completed
      await queryInterface.addIndex('bookings', ['completed_at'], {
        name: 'idx_bookings_completed_at'
      });
      console.log('✅ Índice idx_bookings_completed_at criado');
    } else {
      console.log('⏭️  Coluna completed_at já existe, pulando esta migration');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('bookings');

    if (table.completed_at) {
      try {
        await queryInterface.removeIndex('bookings', 'idx_bookings_completed_at');
      } catch (e) {
        // Índice pode não existir
      }
      await queryInterface.removeColumn('bookings', 'completed_at');
    }
  }
};
