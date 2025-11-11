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
    cloudinary_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "URL da imagem no Cloudinary CDN",
    },
    cloudinary_public_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Public ID da imagem no Cloudinary para deleção",
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
    // Virtual field para URL completa
    url: {
      type: DataTypes.VIRTUAL,
      get() {
        // Prioridade para URL do Cloudinary
        if (this.cloudinary_url) {
          return this.cloudinary_url;
        }
        // Caso contrário, retorna null (frontend deve lidar)
        return null;
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
  // Se tem URL do Cloudinary, usar ela (CDN)
  if (this.cloudinary_url) {
    return this.cloudinary_url;
  }
  // Senão, usar URL local
  // Em produção, o Render não persiste arquivos, então a URL local só funciona se o Cloudinary não estiver configurado
  // e o arquivo tiver sido carregado localmente (o que não deve acontecer em produção).
  // A URL local deve ser completa, mas o `baseUrl` não está sendo passado corretamente.
  // Como o frontend está buscando a URL completa, vamos garantir que o backend sempre retorne a URL completa.
  // No entanto, o frontend deve ser corrigido para usar a URL completa retornada pela API.
  // Por enquanto, vamos garantir que o backend retorne a URL correta, mesmo que o frontend precise de correção.
  // A URL local é construída no frontend, o backend só retorna o caminho.
  // A correção deve ser feita no frontend, mas vamos garantir que o backend não dependa de `baseUrl` para a URL local.
  // O problema é que o frontend está usando a URL local, mas o arquivo não existe.
  // A correção é forçar o uso da URL do Cloudinary no frontend, ou garantir que o backend retorne a URL completa.

  // O `getFullUrl` é usado internamente no backend (ex: `uploadController.js` linha 121 e `getPropertyPhotos` linha 172).
  // A linha 172 do `getPropertyPhotos` usa: `url: photo.cloudinary_url || `/uploads/properties/${photo.filename}``
  // Isso significa que o frontend está recebendo a URL relativa `/uploads/properties/...` quando o Cloudinary não é usado.
  // O frontend deve ser corrigido para usar a URL do Cloudinary se disponível, ou a URL completa da API se for local.

  // A correção mais segura é garantir que o frontend use a URL do Cloudinary se ela existir no objeto da foto.
  // O objeto retornado pela API já tem `cloudinary_url` e `filename`.

  // Vamos corrigir o frontend para usar `cloudinary_url` se existir.
  // O `getFullUrl` não é usado para a resposta da API, então não precisa ser alterado.
  // A correção é no frontend.

  // Vou avançar para a fase 3 e corrigir o frontend.
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
