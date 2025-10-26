const { sequelize } = require("../config/database");

// Importar todos os models
const User = require("./User");
const City = require("./City");
const Property = require("./Property");
const PropertyPhoto = require("./PropertyPhoto");
const Amenity = require("./Amenity");
const TouristSpot = require("./TouristSpot");
const Booking = require("./Booking");
const PropertyAvailability = require("./PropertyAvailability");
const Payment = require("./Payment");
const Review = require("./Review");
const CityGuide = require("./CityGuide");

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

// Property -> Booking (1:N) - RESERVAS
Property.hasMany(Booking, {
  foreignKey: "property_id",
  as: "bookings",
});
Booking.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});

// User -> Booking (1:N) - HÓSPEDE
User.hasMany(Booking, {
  foreignKey: "user_id",
  as: "bookings",
});
Booking.belongsTo(User, {
  foreignKey: "user_id",
  as: "guest",
});

// Property -> PropertyAvailability (1:N) - BLOQUEIOS
Property.hasMany(PropertyAvailability, {
  foreignKey: "property_id",
  as: "availability",
});
PropertyAvailability.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});

// Booking -> Payment (1:N) - PAGAMENTOS
Booking.hasMany(Payment, {
  foreignKey: "booking_id",
  as: "payments",
});
Payment.belongsTo(Booking, {
  foreignKey: "booking_id",
  as: "booking",
});

// User -> Payment (1:N) - PAGAMENTOS DO USUÁRIO
User.hasMany(Payment, {
  foreignKey: "user_id",
  as: "payments",
});
Payment.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Property -> Review (1:N) - AVALIAÇÕES
Property.hasMany(Review, {
  foreignKey: "property_id",
  as: "reviews",
});
Review.belongsTo(Property, {
  foreignKey: "property_id",
  as: "property",
});

// User -> Review (1:N) - AVALIAÇÕES DO USUÁRIO
User.hasMany(Review, {
  foreignKey: "user_id",
  as: "reviews",
});
Review.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

// Booking -> Review (1:1) - AVALIAÇÃO DA RESERVA
Booking.hasOne(Review, {
  foreignKey: "booking_id",
  as: "review",
});
Review.belongsTo(Booking, {
  foreignKey: "booking_id",
  as: "booking",
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
  Booking,
  PropertyAvailability,
  Payment,
  Review,
  CityGuide,
  syncModels,
};
