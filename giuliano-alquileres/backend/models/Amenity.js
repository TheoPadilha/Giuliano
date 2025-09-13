const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Amenity = sequelize.define(
  "Amenity",
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
        notEmpty: { msg: "Nome da comodidade é obrigatório" },
      },
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Nome do ícone (ex: wifi, pool, car)",
    },
    category: {
      type: DataTypes.ENUM("basic", "comfort", "security", "entertainment"),
      defaultValue: "basic",
      allowNull: false,
    },
  },
  {
    tableName: "amenities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // Comodidades são relativamente estáticas
  }
);

// Método para buscar por categoria
Amenity.findByCategory = function (category) {
  return this.findAll({
    where: { category },
    order: [["name", "ASC"]],
  });
};

// Método para buscar todas organizadas por categoria
Amenity.findAllGrouped = async function () {
  const amenities = await this.findAll({
    order: [
      ["category", "ASC"],
      ["name", "ASC"],
    ],
  });

  const grouped = {
    basic: [],
    comfort: [],
    security: [],
    entertainment: [],
  };

  amenities.forEach((amenity) => {
    grouped[amenity.category].push(amenity);
  });

  return grouped;
};

module.exports = Amenity;
