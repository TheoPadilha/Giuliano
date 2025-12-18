const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const GuestReview = sequelize.define(
  "GuestReview",
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
    // Relacionamentos
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bookings",
        key: "id",
      },
    },
    guest_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      comment: "Hóspede sendo avaliado",
    },
    host_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      comment: "Proprietário que está avaliando",
    },
    // Avaliações por categoria (1-5 estrelas)
    cleanliness: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      comment: "Limpeza e cuidado com o imóvel",
    },
    communication: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      comment: "Comunicação",
    },
    respect_rules: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
      comment: "Respeito às regras da casa",
    },
    // Avaliação geral (calculada automaticamente)
    overall_rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: false,
      comment: "Média das avaliações",
    },
    // Comentário
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000],
      },
    },
    // Recomendaria este hóspede?
    would_host_again: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "guest_reviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["booking_id"], unique: true }, // Uma avaliação por reserva
      { fields: ["guest_id"] },
      { fields: ["host_id"] },
    ],
    hooks: {
      beforeValidate: (review) => {
        // Calcular avaliação geral automaticamente
        const ratings = [
          review.cleanliness,
          review.communication,
          review.respect_rules,
        ];
        const sum = ratings.reduce((acc, val) => acc + val, 0);
        review.overall_rating = (sum / ratings.length).toFixed(1);
      },
    },
  }
);

// Método para obter avaliações de um hóspede
GuestReview.getGuestReviews = async function (guestId) {
  return await this.findAll({
    where: { guest_id: guestId },
    include: [
      {
        model: sequelize.models.User,
        as: "host",
        attributes: ["id", "uuid", "name", "avatar"],
      },
    ],
    order: [["created_at", "DESC"]],
  });
};

// Método para calcular média geral do hóspede
GuestReview.getGuestAverageRating = async function (guestId) {
  const result = await this.findOne({
    where: { guest_id: guestId },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("overall_rating")), "average"],
      [sequelize.fn("COUNT", sequelize.col("id")), "total"],
    ],
    raw: true,
  });

  return {
    average: result.average ? parseFloat(result.average).toFixed(1) : 0,
    total: parseInt(result.total) || 0,
  };
};

module.exports = GuestReview;
