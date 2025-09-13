const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const TouristSpot = sequelize.define(
  "TouristSpot",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cities",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nome do ponto turístico é obrigatório" },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.ENUM(
        "beach",
        "restaurant",
        "nightlife",
        "attraction",
        "shopping"
      ),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Categoria é obrigatória" },
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: { msg: "Website deve ser uma URL válida" },
      },
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true,
      validate: {
        min: 0,
        max: 5,
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "tourist_spots",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,

    indexes: [
      { fields: ["city_id"] },
      { fields: ["category"] },
      { fields: ["is_active"] },
    ],
  }
);

// Método para buscar por cidade e categoria
TouristSpot.findByCityAndCategory = function (cityId, category = null) {
  const where = { city_id: cityId, is_active: true };
  if (category) where.category = category;

  return this.findAll({
    where,
    include: [{ model: require("./City"), attributes: ["name", "state"] }],
    order: [
      ["rating", "DESC"],
      ["name", "ASC"],
    ],
  });
};

// Método para buscar pontos com melhor avaliação
TouristSpot.findTopRated = function (cityId = null, limit = 10) {
  const where = {
    is_active: true,
    rating: { [sequelize.Sequelize.Op.gte]: 4.0 },
  };

  if (cityId) where.city_id = cityId;

  return this.findAll({
    where,
    include: [{ model: require("./City"), attributes: ["name", "state"] }],
    order: [
      ["rating", "DESC"],
      ["name", "ASC"],
    ],
    limit,
  });
};

// Método para buscar por categoria em todas as cidades
TouristSpot.findByCategory = function (category, limit = null) {
  const query = {
    where: { category, is_active: true },
    include: [{ model: require("./City"), attributes: ["name", "state"] }],
    order: [
      ["rating", "DESC"],
      ["name", "ASC"],
    ],
  };

  if (limit) query.limit = limit;

  return this.findAll(query);
};

// Método para buscar pontos próximos (por coordenadas)
TouristSpot.findNearby = function (latitude, longitude, radiusKm = 5) {
  // Fórmula Haversine simplificada para PostgreSQL
  return this.findAll({
    where: {
      is_active: true,
      latitude: { [sequelize.Sequelize.Op.ne]: null },
      longitude: { [sequelize.Sequelize.Op.ne]: null },
    },
    attributes: [
      "*",
      [
        sequelize.literal(`
          6371 * acos(cos(radians(${latitude})) 
          * cos(radians(latitude)) 
          * cos(radians(longitude) - radians(${longitude})) 
          + sin(radians(${latitude})) 
          * sin(radians(latitude)))
        `),
        "distance",
      ],
    ],
    having: sequelize.literal(`distance < ${radiusKm}`),
    order: [[sequelize.literal("distance"), "ASC"]],
  });
};

// Método para agrupar por categoria
TouristSpot.findAllGroupedByCategory = async function (cityId = null) {
  const where = { is_active: true };
  if (cityId) where.city_id = cityId;

  const spots = await this.findAll({
    where,
    include: [{ model: require("./City"), attributes: ["name", "state"] }],
    order: [
      ["category", "ASC"],
      ["rating", "DESC"],
      ["name", "ASC"],
    ],
  });

  const grouped = {
    beach: [],
    restaurant: [],
    nightlife: [],
    attraction: [],
    shopping: [],
  };

  spots.forEach((spot) => {
    grouped[spot.category].push(spot);
  });

  return grouped;
};

module.exports = TouristSpot;
