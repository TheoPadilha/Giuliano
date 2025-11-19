const {
  Property,
  City,
  PropertyPhoto,
  Amenity,
  sequelize,
  User,
} = require("../models");
const Joi = require("joi");
const { Op, QueryTypes } = require("sequelize");

// Esquemas de validação
const propertySchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().optional(),
  type: Joi.string()
    .valid("house", "apartment", "studio", "penthouse")
    .required(),
  max_guests: Joi.number().integer().min(1).max(20).required(),
  bedrooms: Joi.number().integer().min(0).max(10).required(),
  bathrooms: Joi.number().integer().min(1).max(10).required(),
  city_id: Joi.number().integer().required(),
  address: Joi.string().min(5).max(255).required(),
  neighborhood: Joi.string().max(100).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  price_per_night: Joi.number().positive().precision(2).required(),
  weekend_price: Joi.number().positive().precision(2).optional(),
  high_season_price: Joi.number().positive().precision(2).optional(),
  security_deposit: Joi.number().min(0).precision(2).optional(),
  status: Joi.string()
    .valid("available", "occupied", "maintenance", "inactive")
    .optional(),
  is_featured: Joi.boolean().optional(),
  amenities: Joi.array().items(Joi.number().integer()).optional(),
})
  .custom((value, helpers) => {
    // Validação: se latitude é fornecida, longitude também deve ser
    if (
      (value.latitude !== undefined && value.longitude === undefined) ||
      (value.latitude === undefined && value.longitude !== undefined)
    ) {
      return helpers.error("coordinates.incomplete");
    }
    // Arredondar preços para 2 casas decimais
    if (value.price_per_night) {
      value.price_per_night = Math.round(value.price_per_night * 100) / 100;
    }
    if (value.weekend_price) {
      value.weekend_price = Math.round(value.weekend_price * 100) / 100;
    }
    if (value.high_season_price) {
      value.high_season_price = Math.round(value.high_season_price * 100) / 100;
    }
    if (value.security_deposit) {
      value.security_deposit = Math.round(value.security_deposit * 100) / 100;
    }
    return value;
  })
  .messages({
    "coordinates.incomplete":
      "Latitude e longitude devem ser fornecidas juntas ou nenhuma das duas",
  });

// Listar imóveis com filtros
const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      city_id,
      type,
      max_guests,
      min_price,
      max_price,
      bedrooms,
      bathrooms,
      status,
      featured,
      search,
      amenities,
      user_id,
      checkIn,
      checkOut,
    } = req.query;

    console.log("🔍 Parâmetros de busca recebidos:", req.query);

    const where = {};
    const currentUser = req.user;

    // ========================================
    // 🔥 SISTEMA DE APROVAÇÃO REMOVIDO
    // Agora todos os imóveis são visíveis
    // ========================================

    // 1. Filtro explícito por user_id (para painel admin)
    if (user_id) {
      if (currentUser) {
        if (currentUser.role === "admin_master") {
          where.user_id = parseInt(user_id);
        } else if (
          currentUser.role === "admin" &&
          currentUser.id === parseInt(user_id)
        ) {
          where.user_id = parseInt(user_id);
        }
      }
    }

    // 2. Filtro de status - força "available" para usuários não-admin
    if (!currentUser || currentUser.role === 'client') {
      // Usuários não autenticados ou clientes: mostrar APENAS disponíveis
      where.status = 'available';
      console.log('🔒 Rota pública: Filtrando apenas imóveis disponíveis');
    } else if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'admin_master')) {
      // Admins podem filtrar por status específico
      if (status && status.trim()) {
        where.status = status;
        console.log(`📌 Admin filtrando por status: ${status}`);
      }
      // Se admin não especificar status, mostra todos para gestão
    }

    // 3. Cidade
    if (city_id) where.city_id = parseInt(city_id);

    // 4. Tipo
    if (type) where.type = type;

    // 5. Hóspedes
    if (max_guests) where.max_guests = { [Op.gte]: parseInt(max_guests) };

    // 6. Quartos
    if (bedrooms) where.bedrooms = { [Op.gte]: parseInt(bedrooms) };

    // 7. Banheiros
    if (bathrooms) where.bathrooms = { [Op.gte]: parseInt(bathrooms) };

    // 8. Featured
    if (featured === "true") where.is_featured = true;

    // 9. Filtros de preço
    if (min_price || max_price) {
      where.price_per_night = {};
      if (min_price) where.price_per_night[Op.gte] = parseFloat(min_price);
      if (max_price) where.price_per_night[Op.lte] = parseFloat(max_price);
    }

    // 10. Busca por texto
    if (search && search.trim()) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search.trim()}%` } },
        { description: { [Op.iLike]: `%${search.trim()}%` } },
        { address: { [Op.iLike]: `%${search.trim()}%` } },
        { neighborhood: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    // 11. Filtro de amenidades
    if (amenities) {
      const amenityIds = amenities.split(",").map((id) => parseInt(id.trim()));

      if (amenityIds.length > 0) {
        console.log(`🏷️ Filtrando por amenities: ${amenityIds.join(", ")}`);

        const propertiesWithAmenities = await sequelize.query(
          `
          SELECT p.id
          FROM properties p
          INNER JOIN property_amenities pa ON p.id = pa.property_id
          WHERE pa.amenity_id IN (:amenityIds)
          GROUP BY p.id
          HAVING COUNT(DISTINCT pa.amenity_id) = :amenityCount
          `,
          {
            replacements: {
              amenityIds: amenityIds,
              amenityCount: amenityIds.length,
            },
            type: QueryTypes.SELECT,
          }
        );

        const propertyIds = propertiesWithAmenities.map((p) => p.id);

        if (propertyIds.length > 0) {
          where.id = { [Op.in]: propertyIds };
        } else {
          return res.json({
            properties: [],
            pagination: {
              currentPage: parseInt(page),
              totalPages: 0,
              totalItems: 0,
              itemsPerPage: parseInt(limit),
              hasNextPage: false,
              hasPrevPage: false,
            },
          });
        }
      }
    }

    // 12. 🔥 FILTRO POR DISPONIBILIDADE DE DATAS (CHECK-IN E CHECK-OUT)
    if (checkIn && checkOut) {
      console.log(`📅 Filtrando por disponibilidade: ${checkIn} até ${checkOut}`);

      // Buscar propriedades que NÃO têm reservas conflitantes nas datas solicitadas
      const unavailableProperties = await sequelize.query(
        `
        SELECT DISTINCT b.property_id
        FROM bookings b
        WHERE b.status IN ('pending', 'confirmed', 'in_progress')
          AND (
            (b.check_in <= :checkOut AND b.check_out >= :checkIn)
          )
        `,
        {
          replacements: {
            checkIn: checkIn,
            checkOut: checkOut,
          },
          type: QueryTypes.SELECT,
        }
      );

      const unavailablePropertyIds = unavailableProperties.map((p) => p.property_id);

      // Filtrar para excluir propriedades indisponíveis
      if (unavailablePropertyIds.length > 0) {
        console.log(`❌ ${unavailablePropertyIds.length} propriedades indisponíveis nestas datas`);

        if (where.id && where.id[Op.in]) {
          // Se já existe filtro de ID (de amenidades), fazer intersecção
          where.id[Op.in] = where.id[Op.in].filter(
            (id) => !unavailablePropertyIds.includes(id)
          );
        } else {
          // Caso contrário, excluir apenas as indisponíveis
          where.id = { [Op.notIn]: unavailablePropertyIds };
        }
      } else {
        console.log(`✅ Todas as propriedades disponíveis nestas datas`);
      }
    }

    console.log("📋 Filtros WHERE finais:", JSON.stringify(where, null, 2));

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const count = await Property.count({
      where,
      distinct: true,
      col: "id",
    });

    console.log(`📊 Total de propriedades encontradas: ${count}`);

    const properties = await Property.findAll({
      where,
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name", "state", "country"],
        },
        {
          model: PropertyPhoto,
          as: "photos",
          required: false,
          attributes: [
            "id",
            "filename",
            "cloudinary_url",
            "cloudinary_public_id",
            "alt_text",
            "is_main",
            "display_order",
          ],
          separate: true,
          order: [
            ["is_main", "DESC"],
            ["display_order", "ASC"],
          ],
        },
        {
          model: Amenity,
          as: "amenities",
          through: { attributes: [] },
          attributes: ["id", "name", "icon", "category"],
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [
        ["is_featured", "DESC"],
        ["created_at", "DESC"],
      ],
      limit: parseInt(limit),
      offset,
      subQuery: true,
    });

    console.log(
      `✅ Retornando ${properties.length} propriedades da página ${page}`
    );

    const totalPages = Math.ceil(count / parseInt(limit));

    // Adicionar URL completa nas fotos
    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
    const propertiesWithUrls = properties.map((property) => {
      const propertyJSON = property.toJSON();
      if (propertyJSON.photos && propertyJSON.photos.length > 0) {
        propertyJSON.photos = propertyJSON.photos.map((photo) => ({
          ...photo,
          url: photo.cloudinary_url || `${backendUrl}/uploads/properties/${photo.filename}`,
        }));
      }
      return propertyJSON;
    });

    res.json({
      properties: propertiesWithUrls,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar imóveis:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Buscar imóvel por UUID
const getPropertyByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;

    const property = await Property.findOne({
      where: { uuid },
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name", "state", "country"],
        },
        {
          model: PropertyPhoto,
          as: "photos",
          attributes: [
            "id",
            "filename",
            "cloudinary_url",
            "cloudinary_public_id",
            "original_name",
            "alt_text",
            "is_main",
            "display_order",
          ],
          separate: true,
          order: [["display_order", "ASC"]],
        },
        {
          model: Amenity,
          as: "amenities",
          through: { attributes: [] },
          attributes: ["id", "name", "icon", "category"],
        },
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!property) {
      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
    }

    // 🔒 Controle de acesso por status
    const currentUser = req.user;
    if (property.status !== 'available') {
      // Se o imóvel não está disponível, verificar se é admin
      if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'admin_master')) {
        return res.status(404).json({
          error: "Imóvel não encontrado",
        });
      }
      console.log(`⚠️ Admin acessando imóvel com status: ${property.status}`);
    }

    // 📊 Incrementar contador de visualizações
    // Apenas incrementar para usuários não-admin visualizando imóveis disponíveis
    if (property.status === 'available' && (!currentUser || currentUser.role === 'client')) {
      await property.increment('view_count', { by: 1 });
      console.log(`👁️ Visualização registrada para imóvel ${property.uuid} (Total: ${property.view_count + 1})`);
    }

    // Adicionar URL completa nas fotos
    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
    const propertyJSON = property.toJSON();
    if (propertyJSON.photos && propertyJSON.photos.length > 0) {
      propertyJSON.photos = propertyJSON.photos.map((photo) => ({
        ...photo,
        url: photo.cloudinary_url || `${backendUrl}/uploads/properties/${photo.filename}`,
      }));
    }

    res.json({ property: propertyJSON });
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Criar novo imóvel
const createProperty = async (req, res) => {
  try {
    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { amenities, ...propertyData } = value;

    const city = await City.findByPk(propertyData.city_id);
    if (!city) {
      return res.status(400).json({
        error: "Cidade não encontrada",
      });
    }

    propertyData.user_id = req.user.id;

    // 🔥 VALIDAÇÃO: Apenas admin_master pode marcar como destaque
    // Se o usuário não for admin_master, remove a propriedade is_featured
    if (req.user.role !== "admin_master") {
      delete propertyData.is_featured;
    }

    const newProperty = await Property.create(propertyData);

    if (amenities && amenities.length > 0) {
      const existingAmenities = await Amenity.findAll({
        where: { id: amenities },
      });
      await newProperty.addAmenities(existingAmenities);
    }

    // Recarregar o imóvel para incluir as associações
    const propertyWithAssociations = await Property.findByPk(newProperty.id, {
      include: [
        { model: City, as: "city" },
        { model: Amenity, as: "amenities", through: { attributes: [] } },
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });

    res.status(201).json({ property: propertyWithAssociations });
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Atualizar imóvel
const updateProperty = async (req, res) => {
  try {
    const { uuid } = req.params;
    const { error, value } = propertySchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { amenities, ...propertyData } = value;

    const property = await Property.findOne({
      where: { uuid },
      include: [{ model: Amenity, as: "amenities" }],
    });

    if (!property) {
      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
    }

    // 🔥 VALIDAÇÃO: Apenas admin_master pode alterar is_featured
    // Proprietários (admin) podem alterar o status dos próprios imóveis
    if (req.user.role !== "admin_master") {
      // Remove is_featured - apenas admin_master pode marcar como destaque
      delete propertyData.is_featured;

      // Verificar se o usuário é o proprietário do imóvel
      const isOwner = property.user_id === req.user.id;

      // Se não for o proprietário e não for admin_master, não pode alterar status
      if (!isOwner && propertyData.status) {
        delete propertyData.status;
      }

      // Verificar se está tentando alterar o user_id
      if (propertyData.user_id && propertyData.user_id !== req.user.id) {
        return res.status(403).json({
          error:
            "Acesso negado. Você não pode alterar o proprietário do imóvel.",
        });
      }
    }

    // Se city_id for fornecido, verificar se a cidade existe
    if (propertyData.city_id) {
      const city = await City.findByPk(propertyData.city_id);
      if (!city) {
        return res.status(400).json({
          error: "Cidade não encontrada",
        });
      }
    }

    await property.update(propertyData);

    // Atualizar amenidades
    if (amenities) {
      const existingAmenities = await Amenity.findAll({
        where: { id: amenities },
      });
      await property.setAmenities(existingAmenities);
    }

    // Recarregar o imóvel para incluir as associações atualizadas
    const updatedProperty = await Property.findByPk(property.id, {
      include: [
        { model: City, as: "city" },
        { model: Amenity, as: "amenities", through: { attributes: [] } },
        { model: User, as: "owner", attributes: ["id", "name", "email"] },
      ],
    });

    res.json({ property: updatedProperty });
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Deletar imóvel
const deleteProperty = async (req, res) => {
  try {
    const { uuid } = req.params;

    const property = await Property.findOne({ where: { uuid } });

    if (!property) {
      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
    }

    await property.destroy();

    res.json({
      message: "Imóvel deletado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao deletar imóvel:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Buscar imóveis em destaque
const getFeaturedProperties = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const properties = await Property.findAll({
      where: {
        status: "available",
        is_featured: true,
      },
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name", "state"],
        },
        {
          model: PropertyPhoto,
          as: "photos",
          required: false,
          attributes: [
            "id",
            "filename",
            "cloudinary_url",
            "cloudinary_public_id",
            "alt_text",
            "is_main",
            "display_order",
          ],
          separate: true,
          order: [
            ["is_main", "DESC"],
            ["display_order", "ASC"],
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
    });

    // Adicionar URL completa nas fotos
    const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;
    const propertiesWithUrls = properties.map((property) => {
      const propertyJSON = property.toJSON();
      if (propertyJSON.photos && propertyJSON.photos.length > 0) {
        propertyJSON.photos = propertyJSON.photos.map((photo) => ({
          ...photo,
          url: photo.cloudinary_url || `${backendUrl}/uploads/properties/${photo.filename}`,
        }));
      }
      return propertyJSON;
    });

    res.json({ properties: propertiesWithUrls });
  } catch (error) {
    console.error("Erro ao buscar imóveis em destaque:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// 🔥 NOVA ROTA: Toggle Featured (apenas admin_master)
const toggleFeatured = async (req, res) => {
  try {
    const { uuid } = req.params;

    const property = await Property.findOne({ where: { uuid } });

    if (!property) {
      return res.status(404).json({ error: "Imóvel não encontrado." });
    }

    // Toggle o status
    await property.update({ is_featured: !property.is_featured });

    res.json({
      message: property.is_featured
        ? "Imóvel marcado como destaque!"
        : "Imóvel removido dos destaques!",
      property,
    });
  } catch (error) {
    console.error("Erro ao alterar destaque:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

module.exports = {
  getProperties,
  getPropertyByUuid,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  toggleFeatured,
};
