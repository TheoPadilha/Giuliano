const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Review = sequelize.define("Review", {
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
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "properties",
      key: "id",
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
  booking_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "bookings",
      key: "id",
    },
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cleanliness_rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
  },
  location_rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
  },
  value_rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
  },
  communication_rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
  },
  is_visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "reviews",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  indexes: [
    { fields: ["property_id"] },
    { fields: ["user_id"] },
    { fields: ["booking_id"], unique: true },
    { fields: ["rating"] },
    { fields: ["created_at"] },
  ],
});

module.exports = Review;