const { Property, PropertyPhoto } = require("../models");
const { deleteFile } = require("../middleware/upload");
const { uploadImage, deleteImage, isConfigured } = require("../config/cloudinary");
const Joi = require("joi");
const fs = require('fs').promises;

// Schema para validação de upload
const uploadSchema = Joi.object({
  property_uuid: Joi.string().uuid().required(),
  alt_texts: Joi.array().items(Joi.string().max(255)).optional(),
  main_photo_index: Joi.number().integer().min(0).optional(),
});

// Upload múltiplo de fotos para um imóvel
const uploadPropertyPhotos = async (req, res) => {
  try {
    const { property_uuid } = req.body;
    const { alt_texts, main_photo_index } = req.body;

    // Validar dados básicos
    const { error } = uploadSchema.validate({
      property_uuid,
      alt_texts: alt_texts ? JSON.parse(alt_texts) : undefined,
      main_photo_index: main_photo_index
        ? parseInt(main_photo_index)
        : undefined,
    });

    if (error) {
      // Deletar arquivos enviados em caso de erro de validação
      req.files.forEach((file) => deleteFile(file.filename));

      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    // Verificar se o imóvel existe
    const property = await Property.findOne({ where: { uuid: property_uuid } });
    if (!property) {
      // Deletar arquivos enviados
      req.files.forEach((file) => deleteFile(file.filename));

      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
    }

    // Processar textos alternativos
    const parsedAltTexts = alt_texts ? JSON.parse(alt_texts) : [];
    const mainPhotoIdx = main_photo_index ? parseInt(main_photo_index) : 0;

    // Obter ordem atual das fotos existentes
    const existingPhotos = await PropertyPhoto.findAll({
      where: { property_id: property.id },
      order: [["display_order", "ASC"]],
    });

    let nextOrder = existingPhotos.length;

    // Criar registros das fotos no banco
    const photoPromises = req.files.map(async (file, index) => {
      const altText =
        parsedAltTexts[index] || `Foto ${index + 1} - ${property.title}`;
      const isMain = index === mainPhotoIdx && existingPhotos.length === 0; // Só definir como principal se não houver fotos

      let cloudinaryData = null;
      let filename = file.filename;

      // Se Cloudinary está configurado, fazer upload para lá
      if (isConfigured()) {
        try {
          console.log(`📤 Fazendo upload para Cloudinary: ${file.filename}`);
          cloudinaryData = await uploadImage(file.path, 'properties');
          filename = cloudinaryData.publicId; // Salvar publicId ao invés do filename local
          console.log(`✅ Upload concluído: ${cloudinaryData.url}`);

          // Deletar arquivo local após upload bem-sucedido
          await fs.unlink(file.path).catch(err =>
            console.warn('Erro ao deletar arquivo local:', err)
          );
        } catch (error) {
          console.error('❌ Erro ao fazer upload para Cloudinary:', error);
          // Se falhar, continua com upload local
        }
      }

      return await PropertyPhoto.create({
        property_id: property.id,
        filename: filename,
        cloudinary_url: cloudinaryData?.url || null,
        cloudinary_public_id: cloudinaryData?.publicId || null,
        original_name: file.originalname,
        alt_text: altText,
        is_main: isMain,
        display_order: nextOrder + index,
      });
    });

    const createdPhotos = await Promise.all(photoPromises);

    // Se definiu uma foto principal e não havia fotos antes, definir a escolhida como principal
    if (mainPhotoIdx >= 0 && existingPhotos.length === 0) {
      const mainPhoto = createdPhotos[mainPhotoIdx];
      if (mainPhoto) {
        await mainPhoto.setAsMain();
      }
    }

    res.status(201).json({
      message: `${createdPhotos.length} foto(s) enviada(s) com sucesso`,
      photos: createdPhotos.map((photo) => ({
        id: photo.id,
        filename: photo.filename,
        cloudinary_url: photo.cloudinary_url,
        cloudinary_public_id: photo.cloudinary_public_id,
        original_name: photo.original_name,
        alt_text: photo.alt_text,
        is_main: photo.is_main,
        display_order: photo.display_order,
        url: photo.cloudinary_url || `/uploads/properties/${photo.filename}`,
      })),
    });
  } catch (error) {
    // Em caso de erro, deletar arquivos enviados
    if (req.files) {
      req.files.forEach((file) => deleteFile(file.filename));
    }

    console.error("Erro no upload de fotos:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Listar fotos de um imóvel
const getPropertyPhotos = async (req, res) => {
  try {
    const { property_uuid } = req.params;

    // Buscar imóvel
    const property = await Property.findOne({ where: { uuid: property_uuid } });
    if (!property) {
      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
    }

    // Buscar fotos
    const photos = await PropertyPhoto.findAll({
      where: { property_id: property.id },
      order: [["display_order", "ASC"]],
      attributes: [
        "id",
        "filename",
        "cloudinary_url",
        "cloudinary_public_id",
        "original_name",
        "alt_text",
        "is_main",
        "display_order",
        "created_at",
      ],
    });

    res.json({
      photos: photos.map((photo) => ({
        ...photo.toJSON(),
        url: photo.cloudinary_url || `/uploads/properties/${photo.filename}`,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar fotos:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Definir foto principal
const setMainPhoto = async (req, res) => {
  try {
    const { photo_id } = req.params;

    // Buscar foto
    const photo = await PropertyPhoto.findByPk(photo_id);
    if (!photo) {
      return res.status(404).json({
        error: "Foto não encontrada",
      });
    }

    // Definir como principal
    await photo.setAsMain();

    res.json({
      message: "Foto principal definida com sucesso",
      photo: {
        id: photo.id,
        filename: photo.filename,
        is_main: true,
        url: `/uploads/properties/${photo.filename}`,
      },
    });
  } catch (error) {
    console.error("Erro ao definir foto principal:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Reordenar fotos
const reorderPhotos = async (req, res) => {
  try {
    const { property_uuid } = req.params;
    const { photo_ids } = req.body;

    if (!Array.isArray(photo_ids) || photo_ids.length === 0) {
      return res.status(400).json({
        error: "Lista de IDs das fotos é obrigatória",
      });
    }

    // Buscar imóvel
    const property = await Property.findOne({ where: { uuid: property_uuid } });
    if (!property) {
      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
    }

    // Reordenar fotos
    await PropertyPhoto.reorderPhotos(property.id, photo_ids);

    res.json({
      message: "Fotos reordenadas com sucesso",
    });
  } catch (error) {
    console.error("Erro ao reordenar fotos:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Deletar foto
const deletePhoto = async (req, res) => {
  try {
    const { photo_id } = req.params;

    // Buscar foto
    const photo = await PropertyPhoto.findByPk(photo_id);
    if (!photo) {
      return res.status(404).json({
        error: "Foto não encontrada",
      });
    }

    const filename = photo.filename;
    const cloudinaryPublicId = photo.cloudinary_public_id;
    const wasMain = photo.is_main;
    const propertyId = photo.property_id;

    // Se a foto está no Cloudinary, deletar de lá
    if (cloudinaryPublicId && isConfigured()) {
      try {
        console.log(`🗑️ Deletando do Cloudinary: ${cloudinaryPublicId}`);
        await deleteImage(cloudinaryPublicId);
        console.log(`✅ Deletado do Cloudinary com sucesso`);
      } catch (cloudinaryError) {
        console.error('⚠️ Erro ao deletar do Cloudinary:', cloudinaryError);
        // Continua para deletar do banco mesmo se falhar no Cloudinary
      }
    } else {
      // Se não está no Cloudinary, deletar arquivo local
      deleteFile(filename);
    }

    // Deletar registro do banco
    await photo.destroy();

    // Se era foto principal, definir outra como principal
    if (wasMain) {
      const nextPhoto = await PropertyPhoto.findOne({
        where: { property_id: propertyId },
        order: [["display_order", "ASC"]],
      });

      if (nextPhoto) {
        await nextPhoto.update({ is_main: true });
      }
    }

    res.json({
      message: "Foto deletada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar foto:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Atualizar informações da foto
const updatePhoto = async (req, res) => {
  try {
    const { photo_id } = req.params;
    const { alt_text } = req.body;

    if (!alt_text || alt_text.trim().length === 0) {
      return res.status(400).json({
        error: "Texto alternativo é obrigatório",
      });
    }

    // Buscar foto
    const photo = await PropertyPhoto.findByPk(photo_id);
    if (!photo) {
      return res.status(404).json({
        error: "Foto não encontrada",
      });
    }

    // Atualizar
    await photo.update({ alt_text: alt_text.trim() });

    res.json({
      message: "Foto atualizada com sucesso",
      photo: {
        id: photo.id,
        filename: photo.filename,
        alt_text: photo.alt_text,
        url: `/uploads/properties/${photo.filename}`,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar foto:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  uploadPropertyPhotos,
  getPropertyPhotos,
  setMainPhoto,
  reorderPhotos,
  deletePhoto,
  updatePhoto,
};
