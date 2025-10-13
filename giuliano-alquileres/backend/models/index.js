const { sequelize } = require("../config/database");

// Importar todos os models
const User = require("./User");
const City = require("./City");
const Property = require("./Property");
const PropertyPhoto = require("./PropertyPhoto");
const Amenity = require("./Amenity");
const TouristSpot = require("./TouristSpot");

// ============================================
// RELACIONAMENTOS
// ============================================

// User -> Property (1:N) - PROPRIETÁRIO
User.hasMany(Property, {
  foreignKey: "user_id",
  as: "properties",
});
Property.belongsTo(User, {
  foreignKey: "user_id",
  as: "owner",
});

// City -> Property (1:N)
City.hasMany(Property, {
  foreignKey: "city_id",
  as: "properties",
});
Property.belongsTo(City, {
  foreignKey: "city_id",
  as: "city",
});

// Property -> PropertyPhoto (1:N)
Property.hasMany(PropertyPhoto, {
  foreignKey: "property_id",
  as: "photos",
});
PropertyPhoto.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});

// Property -> Amenity (N:N)
Property.belongsToMany(Amenity, {
  through: "property_amenities",
  foreignKey: "property_id",
  otherKey: "amenity_id",
  as: "amenities",
});
Amenity.belongsToMany(Property, {
  through: "property_amenities",
  foreignKey: "amenity_id",
  otherKey: "property_id",
  as: "properties",
});

// User -> Property Favorites (N:N)
User.belongsToMany(Property, {
  through: "user_favorites",
  foreignKey: "user_id",
  otherKey: "property_id",
  as: "favorites",
});
Property.belongsToMany(User, {
  through: "user_favorites",
  foreignKey: "property_id",
  otherKey: "user_id",
  as: "favoritedBy",
});

// City -> TouristSpot (1:N)
City.hasMany(TouristSpot, {
  foreignKey: "city_id",
  as: "touristSpots",
});
TouristSpot.belongsTo(City, {
  foreignKey: "city_id",
  as: "city",
});

// ============================================
// SINCRONIZAR MODELS
// ============================================
const syncModels = async (force = false) => {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexão com banco estabelecida");

    // Sync sem alter para evitar conflito com VIEWs
    await sequelize.sync({ force: false, alter: false });
    console.log("✅ Models sincronizados com banco (sem alterações)");

    return true;
  } catch (error) {
    console.error("❌ Erro ao sincronizar models:", error);
    throw error;
  }
};

// ============================================
// EXPORTAR TUDO
// ============================================
module.exports = {
  sequelize,
  User,
  City,
  Property,
  PropertyPhoto,
  Amenity,
  TouristSpot,
  syncModels,
};
