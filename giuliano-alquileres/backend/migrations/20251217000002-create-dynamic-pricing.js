'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dynamic_pricing', {
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
      property_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'properties',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      price_per_night: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
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

    // Criar índices (verificar se já existem)
    try {
      await queryInterface.addIndex('dynamic_pricing', ['property_id'], {
        name: 'idx_dynamic_pricing_property',
      });
    } catch (err) {
      console.log('⚠️  Índice idx_dynamic_pricing_property já existe');
    }

    try {
      await queryInterface.addIndex('dynamic_pricing', ['start_date', 'end_date'], {
        name: 'idx_dynamic_pricing_dates',
      });
    } catch (err) {
      console.log('⚠️  Índice idx_dynamic_pricing_dates já existe');
    }

    try {
      await queryInterface.addIndex('dynamic_pricing', ['property_id', 'start_date', 'end_date'], {
        name: 'idx_dynamic_pricing_property_dates',
      });
    } catch (err) {
      console.log('⚠️  Índice idx_dynamic_pricing_property_dates já existe');
    }

    console.log('✅ Tabela dynamic_pricing criada com sucesso');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('dynamic_pricing');
  },
};
