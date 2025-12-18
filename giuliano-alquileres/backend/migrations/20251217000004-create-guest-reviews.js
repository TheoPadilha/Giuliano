'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('guest_reviews', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        allowNull: false,
      },
      booking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'bookings',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      guest_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      host_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      cleanliness: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      communication: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      respect_rules: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      overall_rating: {
        type: Sequelize.DECIMAL(2, 1),
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      would_host_again: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Criar índices
    await queryInterface.addIndex('guest_reviews', ['booking_id'], {
      unique: true,
      name: 'idx_guest_reviews_booking_unique',
    });

    await queryInterface.addIndex('guest_reviews', ['guest_id'], {
      name: 'idx_guest_reviews_guest',
    });

    await queryInterface.addIndex('guest_reviews', ['host_id'], {
      name: 'idx_guest_reviews_host',
    });

    console.log('✅ Tabela guest_reviews criada com sucesso');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('guest_reviews');
  },
};
