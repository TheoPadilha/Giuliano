const { DataTypes, Op } = require("sequelize");
const { sequelize } = require("../config/database");

const Property = sequelize.define(
  "Property",
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Título é obrigatório" },
        len: {
          args: [5, 200],
          msg: "Título deve ter entre 5 e 200 caracteres",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("house", "apartment", "studio", "penthouse"),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Tipo do imóvel é obrigatório" },
      },
    },
    max_guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "Deve acomodar pelo menos 1 pessoa" },
        max: { args: [20], msg: "Máximo de 20 pessoas" },
      },
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Número de quartos não pode ser negativo" },
        max: { args: [10], msg: "Máximo de 10 quartos" },
      },
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: "Deve ter pelo menos 1 banheiro" },
        max: { args: [10], msg: "Máximo de 10 banheiros" },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    city_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cities",
        key: "id",
      },
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Endereço é obrigatório" },
      },
    },
    neighborhood: {
      type: DataTypes.STRING(100),
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
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: { args: [0], msg: "Preço não pode ser negativo" },
        max: { args: [99999.99], msg: "Preço muito alto" },
      },
    },
    weekend_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: { args: [0], msg: "Preço não pode ser negativo" },
      },
    },
    high_season_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: { args: [0], msg: "Preço não pode ser negativo" },
      },
    },
    status: {
      type: DataTypes.ENUM("available", "occupied", "maintenance", "inactive"),
      defaultValue: "available",
      allowNull: false,
    },
    is_featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approval_status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      defaultValue: "pending",
      allowNull: false,
    },
  },
  {
    tableName: "properties",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    // Índices para performance
    indexes: [
      { fields: ["user_id"] },
      { fields: ["city_id"] },
      { fields: ["status"] },
      { fields: ["type"] },
      { fields: ["price_per_night"] },
      { fields: ["max_guests"] },
      { fields: ["is_featured"] },
    ],
  }
);

// Método para buscar imóveis disponíveis
Property.findAvailable = function (filters = {}) {
  const where = { status: "available" };

  // Aplicar filtros
  if (filters.city_id) where.city_id = filters.city_id;
  if (filters.type) where.type = filters.type;
  if (filters.max_guests) where.max_guests = { [Op.gte]: filters.max_guests };
  if (filters.min_price)
    where.price_per_night = { [Op.gte]: filters.min_price };
  if (filters.max_price) {
    where.price_per_night = where.price_per_night
      ? { ...where.price_per_night, [Op.lte]: filters.max_price }
      : { [Op.lte]: filters.max_price };
  }

  return this.findAll({
    where,
    include: [
      { model: require("./City"), attributes: ["name", "state"] },
      {
        model: require("./PropertyPhoto"),
        where: { is_main: true },
        required: false,
      },
    ],
    order: [
      ["is_featured", "DESC"],
      ["created_at", "DESC"],
    ],
  });
};

// Método para buscar imóveis em destaque
Property.findFeatured = function (limit = 6) {
  return this.findAll({
    where: {
      status: "available",
      is_featured: true,
    },
    include: [
      { model: require("./City"), attributes: ["name", "state"] },
      {
        model: require("./PropertyPhoto"),
        where: { is_main: true },
        required: false,
      },
    ],
    limit,
    order: [["created_at", "DESC"]],
  });
};

// Método para buscar por UUID (para URLs amigáveis)
Property.findByUuid = function (uuid) {
  return this.findOne({
    where: { uuid },
    include: [
      { model: require("./City") },
      { model: require("./PropertyPhoto"), order: [["display_order", "ASC"]] },
      { model: require("./Amenity"), through: { attributes: [] } },
    ],
  });
};

// Método para criar URL amigável
Property.prototype.getSlug = function () {
  return `${this.uuid}-${this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
};

// Método para calcular preço com base na data
Property.prototype.calculatePrice = function (
  checkIn = null,
  isWeekend = false
) {
  // Lógica simples - pode ser expandida
  if (this.high_season_price && this.isHighSeason(checkIn)) {
    return this.high_season_price;
  }
  if (this.weekend_price && isWeekend) {
    return this.weekend_price;
  }
  return this.price_per_night;
};

// Método para verificar alta temporada (simplificado)
Property.prototype.isHighSeason = function (date) {
  if (!date) return false;
  const month = new Date(date).getMonth() + 1;
  return month === 12 || month === 1 || month === 2; // Verão
};

module.exports = Property;
