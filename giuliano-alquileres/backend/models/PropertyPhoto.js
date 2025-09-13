const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const PropertyPhoto = sequelize.define(
  "PropertyPhoto",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
    },
    filename: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nome do arquivo é obrigatório" },
      },
    },
    original_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    alt_text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_main: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    display_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    tableName: "property_photos",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false, // Fotos não precisam de updatedAt

    // Índices
    indexes: [
      { fields: ["property_id"] },
      { fields: ["is_main"] },
      { fields: ["display_order"] },
    ],
  }
);

// Hook para garantir que só existe uma foto principal por imóvel
PropertyPhoto.beforeCreate(async (photo) => {
  if (photo.is_main) {
    await PropertyPhoto.update(
      { is_main: false },
      { where: { property_id: photo.property_id, is_main: true } }
    );
  }
});

PropertyPhoto.beforeUpdate(async (photo) => {
  if (photo.is_main && photo.changed("is_main")) {
    await PropertyPhoto.update(
      { is_main: false },
      {
        where: {
          property_id: photo.property_id,
          is_main: true,
          id: { [sequelize.Sequelize.Op.ne]: photo.id },
        },
      }
    );
  }
});

// Método para obter URL completa da foto
PropertyPhoto.prototype.getFullUrl = function (baseUrl = "") {
  return `${baseUrl}/uploads/properties/${this.filename}`;
};

// Método para definir como foto principal
PropertyPhoto.prototype.setAsMain = async function () {
  const transaction = await sequelize.transaction();

  try {
    // Remover foto principal atual
    await PropertyPhoto.update(
      { is_main: false },
      {
        where: { property_id: this.property_id, is_main: true },
        transaction,
      }
    );

    // Definir esta como principal
    await this.update({ is_main: true }, { transaction });

    await transaction.commit();
    return this;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// Método estático para reordenar fotos
PropertyPhoto.reorderPhotos = async function (propertyId, photoIds) {
  const transaction = await sequelize.transaction();

  try {
    for (let i = 0; i < photoIds.length; i++) {
      await this.update(
        { display_order: i },
        {
          where: {
            id: photoIds[i],
            property_id: propertyId,
          },
          transaction,
        }
      );
    }

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = PropertyPhoto;
