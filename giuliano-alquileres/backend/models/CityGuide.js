const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const CityGuide = sequelize.define(
  "CityGuide",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    touristic_spots: {
      type: DataTypes.JSONB, // Array de objetos { name, description, type, lat, lng }
      allowNull: true,
    },
    restaurants: {
      type: DataTypes.JSONB, // Array de objetos { name, description, type, address }
      allowNull: true,
    },
    useful_info: {
      type: DataTypes.JSONB, // Array de objetos { title, content }
      allowNull: true,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "city_guides",
    timestamps: true,
  }
);

module.exports = CityGuide;
