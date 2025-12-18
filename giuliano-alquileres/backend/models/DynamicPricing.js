const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const DynamicPricing = sequelize.define(
  "DynamicPricing",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    // Relacionamento
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
    },
    // Período de preço personalizado
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if (value < this.start_date) {
            throw new Error("Data final deve ser posterior à data inicial");
          }
        },
      },
    },
    // Preço por noite neste período
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    // Descrição do período (ex: "Réveillon", "Carnaval", "Alta Temporada")
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    // Prioridade (para quando há períodos sobrepostos)
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: "Maior prioridade sobrescreve períodos de menor prioridade em caso de sobreposição",
    },
  },
  {
    tableName: "dynamic_pricing",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    // Índices para performance
    indexes: [
      { fields: ["property_id"] },
      { fields: ["start_date", "end_date"] },
      {
        fields: ["property_id", "start_date", "end_date"],
        name: "idx_dynamic_pricing_property_dates",
      },
    ],
  }
);

// Método estático para obter preço em uma data específica
DynamicPricing.getPriceForDate = async function (propertyId, date) {
  const pricing = await this.findOne({
    where: {
      property_id: propertyId,
      start_date: { [sequelize.Sequelize.Op.lte]: date },
      end_date: { [sequelize.Sequelize.Op.gte]: date },
    },
    order: [["priority", "DESC"]], // Maior prioridade primeiro
  });

  return pricing ? parseFloat(pricing.price_per_night) : null;
};

// Método estático para obter preços de um período
DynamicPricing.getPricesForPeriod = async function (propertyId, startDate, endDate) {
  const pricings = await this.findAll({
    where: {
      property_id: propertyId,
      [sequelize.Sequelize.Op.or]: [
        {
          // Períodos que começam ou terminam dentro do range
          start_date: {
            [sequelize.Sequelize.Op.between]: [startDate, endDate],
          },
        },
        {
          end_date: {
            [sequelize.Sequelize.Op.between]: [startDate, endDate],
          },
        },
        {
          // Períodos que englobam todo o range
          start_date: { [sequelize.Sequelize.Op.lte]: startDate },
          end_date: { [sequelize.Sequelize.Op.gte]: endDate },
        },
      ],
    },
    order: [
      ["start_date", "ASC"],
      ["priority", "DESC"],
    ],
  });

  return pricings;
};

module.exports = DynamicPricing;
