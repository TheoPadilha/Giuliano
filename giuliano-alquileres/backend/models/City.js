const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const City = sequelize.define(
  "City",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nome da cidade é obrigatório" },
        len: { args: [2, 100], msg: "Nome deve ter entre 2 e 100 caracteres" },
      },
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Estado é obrigatório" },
      },
    },
    country: {
      type: DataTypes.STRING(50),
      defaultValue: "Brasil",
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
      validate: {
        min: -90,
        max: 90,
      },
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
      validate: {
        min: -180,
        max: 180,
      },
    },
  },
  {
    tableName: "cities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // Cidades não precisam de updatedAt

    // Índices
    indexes: [
      {
        unique: true,
        fields: ["name", "state", "country"],
      },
    ],
  }
);

// Método para buscar cidades ativas (com imóveis)
City.findActiveCities = async function () {
  const Property = require("./Property");

  return await this.findAll({
    include: [
      {
        model: Property,
        attributes: [],
        required: true, // INNER JOIN - só cidades com imóveis
        where: { status: "available" },
      },
    ],
    group: ["City.id"],
    order: [["name", "ASC"]],
  });
};

// Método para buscar com coordenadas
City.findWithCoordinates = function () {
  return this.findAll({
    where: {
      latitude: { [sequelize.Sequelize.Op.ne]: null },
      longitude: { [sequelize.Sequelize.Op.ne]: null },
    },
  });
};

module.exports = City;
