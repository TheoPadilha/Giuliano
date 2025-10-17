const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

/**
 * PropertyAvailability - Bloqueios de disponibilidade
 * Permite o proprietário bloquear datas específicas (manutenção, uso pessoal, etc.)
 */
const PropertyAvailability = sequelize.define(
  "PropertyAvailability",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
    },
    // Data de início do bloqueio
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    // Data de fim do bloqueio
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if (value < this.start_date) {
            throw new Error("Data final deve ser após a data inicial");
          }
        },
      },
    },
    // Tipo de bloqueio
    block_type: {
      type: DataTypes.ENUM(
        "maintenance", // Manutenção
        "personal_use", // Uso pessoal do proprietário
        "unavailable", // Indisponível (genérico)
        "seasonal_closure" // Fechamento sazonal
      ),
      defaultValue: "unavailable",
      allowNull: false,
    },
    // Motivo do bloqueio (opcional)
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Se o bloqueio é ativo
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "property_availability",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      { fields: ["property_id"] },
      { fields: ["start_date", "end_date"] },
      {
        fields: ["property_id", "start_date", "end_date"],
        name: "idx_property_dates_availability",
      },
      { fields: ["is_active"] },
    ],
  }
);

// Métodos estáticos
PropertyAvailability.getBlockedDates = async function (
  propertyId,
  startDate,
  endDate
) {
  const blocks = await this.findAll({
    where: {
      property_id: propertyId,
      is_active: true,
      end_date: {
        [sequelize.Sequelize.Op.gte]: startDate,
      },
      start_date: {
        [sequelize.Sequelize.Op.lte]: endDate,
      },
    },
    attributes: ["start_date", "end_date", "block_type", "reason"],
    order: [["start_date", "ASC"]],
  });

  return blocks.map((block) => ({
    start: block.start_date,
    end: block.end_date,
    type: block.block_type,
    reason: block.reason,
  }));
};

PropertyAvailability.isBlocked = async function (
  propertyId,
  checkIn,
  checkOut
) {
  const blockedCount = await this.count({
    where: {
      property_id: propertyId,
      is_active: true,
      [sequelize.Sequelize.Op.or]: [
        {
          start_date: {
            [sequelize.Sequelize.Op.between]: [checkIn, checkOut],
          },
        },
        {
          end_date: {
            [sequelize.Sequelize.Op.between]: [checkIn, checkOut],
          },
        },
        {
          [sequelize.Sequelize.Op.and]: [
            {
              start_date: {
                [sequelize.Sequelize.Op.lte]: checkIn,
              },
            },
            {
              end_date: {
                [sequelize.Sequelize.Op.gte]: checkOut,
              },
            },
          ],
        },
      ],
    },
  });

  return blockedCount > 0;
};

module.exports = PropertyAvailability;
