const {
  Property,
  City,
  PropertyPhoto,
  Amenity,
  sequelize,
  User, // Importar o modelo User
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
  price_per_night: Joi.number().positive().required(),
  weekend_price: Joi.number().positive().optional(),
  high_season_price: Joi.number().positive().optional(),
  status: Joi.string()
    .valid("available", "occupied", "maintenance", "inactive")
    .optional(),
  is_featured: Joi.boolean().optional(),
  amenities: Joi.array().items(Joi.number().integer()).optional(),
  // user_id não é validado aqui, pois é adicionado pelo backend
  // approval_status não é validado aqui, pois é gerenciado pelo admin_master
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
      status, // Status de disponibilidade (available, occupied, etc.)
      approval_status, // Status de aprovação (pending, approved, rejected)
      featured,
      search,
      amenities,
      user_id, // Filtrar por user_id (para admin ver seus próprios imóveis)
    } = req.query;

    console.log("🔍 Parâmetros de busca recebidos:", req.query);

    // Construir filtros
    const where = {};

    // --- Lógica de Permissão para Visibilidade de Imóveis ---
    // req.user pode ser undefined se o optionalAuth não encontrar token
    const currentUser = req.user;

    if (currentUser && currentUser.role !== "admin_master") {
      where.approval_status = "approved";
      // Se for um admin normal, filtra pelos seus próprios imóveis
      if (currentUser.role === "admin") {
        where.user_id = currentUser.id;
      }
    } else if (currentUser && currentUser.role === "admin_master") {
      // Admin_master pode ver todos os status de aprovação
      if (approval_status && approval_status.trim()) {
        where.approval_status = approval_status;
      }
    } else {
      // Para usuários não logados ou clientes, só mostra imóveis aprovados
      where.approval_status = "approved";
    }

    // Status de disponibilidade (só filtra se for explicitamente passado)
    if (status && status.trim()) {
      where.status = status;
      console.log(`📌 Filtrando por status: ${status}`);
    }

    // Filtrar por user_id (apenas se for admin_master ou se o user_id for o do próprio usuário)
    // Apenas aplica o filtro user_id se o usuário logado for admin_master OU se o user_id na query for o ID do próprio usuário logado (admin)
    if (
      user_id &&
      currentUser &&
      (currentUser.role === "admin_master" ||
        currentUser.id === parseInt(user_id))
    ) {
      where.user_id = parseInt(user_id);
    }

    // Cidade
    if (city_id) where.city_id = parseInt(city_id);

    // Tipo
    if (type) where.type = type;

    // Hóspedes
    if (max_guests) where.max_guests = { [Op.gte]: parseInt(max_guests) };

    // Quartos
    if (bedrooms) where.bedrooms = { [Op.gte]: parseInt(bedrooms) };

    // Banheiros
    if (bathrooms) where.bathrooms = { [Op.gte]: parseInt(bathrooms) };

    // Featured
    if (featured === "true") where.is_featured = true;

    // Filtros de preço
    if (min_price || max_price) {
      where.price_per_night = {};
      if (min_price) where.price_per_night[Op.gte] = parseFloat(min_price);
      if (max_price) where.price_per_night[Op.lte] = parseFloat(max_price);
    }

    // Busca por texto
    if (search && search.trim()) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search.trim()}%` } },
        { description: { [Op.iLike]: `%${search.trim()}%` } },
        { address: { [Op.iLike]: `%${search.trim()}%` } },
        { neighborhood: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    // Filtro de amenidades
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

    console.log("📋 Filtros WHERE:", JSON.stringify(where, null, 2));

    // Calcular offset
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // COUNT separado (sem amenities)
    const count = await Property.count({
      where,
      distinct: true,
      col: "id",
    });

    console.log(`📊 Total de propriedades encontradas: ${count}`);

    // SELECT com includes
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
          as: "owner", // Adicionar o proprietário do imóvel
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

    // Calcular total de páginas
    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      properties,
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

    // --- Lógica de Permissão para Visibilidade de Imóvel Único ---
    // Se o usuário não for admin_master e o imóvel não estiver aprovado, ou
    // se for admin e o imóvel não for dele e não estiver aprovado, nega acesso.
    if (req.user && req.user.role !== "admin_master") {
      if (property.approval_status !== "approved") {
        return res
          .status(403)
          .json({ error: "Acesso negado. Imóvel não aprovado." });
      }
      if (req.user.role === "admin" && property.user_id !== req.user.id) {
        return res
          .status(403)
          .json({
            error: "Acesso negado. Você não é o proprietário deste imóvel.",
          });
      }
    }

    res.json({ property });
  } catch (error) {
    console.error("Erro ao buscar imóvel:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Criar novo imóvel (admin only)
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

    // Adicionar o user_id do usuário logado
    propertyData.user_id = req.user.id;
    // Definir o status inicial como \'pending\'
    propertyData.approval_status = "pending";

    const property = await Property.create(propertyData);

    if (amenities && amenities.length > 0) {
      await property.setAmenities(amenities);
    }

    const createdProperty = await Property.findByPk(property.id, {
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name", "state"],
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

    res.status(201).json({
      message: "Imóvel criado com sucesso e aguardando aprovação!",
      property: createdProperty,
    });
  } catch (error) {
    console.error("Erro ao criar imóvel:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Atualizar imóvel (admin only)
const updateProperty = async (req, res) => {
  try {
    const { uuid } = req.params;

    console.log(`🔍 Buscando imóvel para atualização: ${uuid}`);

    let property = await Property.findOne({ where: { uuid } });

    if (!property) {
      console.log(`❌ Imóvel não encontrado: ${uuid}`);
      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
    }

    console.log(`✅ Imóvel encontrado: ${property.id} (${property.uuid})`);

    const updateSchema = propertySchema.fork(
      [
        "title",
        "type",
        "max_guests",
        "bedrooms",
        "bathrooms",
        "city_id",
        "address",
        "price_per_night",
      ],
      (schema) => schema.optional()
    );

    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      console.log(`❌ Dados inválidos:`, error.details[0].message);
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { amenities, ...propertyData } = value;

    if (propertyData.city_id) {
      const city = await City.findByPk(propertyData.city_id);
      if (!city) {
        return res.status(400).json({
          error: "Cidade não encontrada",
        });
      }
    }

    console.log(`📝 Atualizando imóvel com dados:`, propertyData);

    await property.update(propertyData);

    if (Array.isArray(amenities)) {
      console.log(`🏷️ Atualizando amenities:`, amenities);
      await property.setAmenities(amenities);
    }

    const updatedProperty = await Property.findByPk(property.id, {
      include: [
        {
          model: City,
          as: "city",
          attributes: ["id", "name", "state"],
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

    console.log(`✅ Imóvel atualizado com sucesso`);

    res.json({
      message: "Imóvel atualizado com sucesso",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("💥 Erro ao atualizar imóvel:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Deletar imóvel (admin only)
const deleteProperty = async (req, res) => {
  try {
    const { uuid } = req.params;

    let property = await Property.findOne({ where: { uuid } });

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
        approval_status: "approved", // Apenas imóveis aprovados
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
          where: { is_main: true },
          required: false,
          attributes: ["id", "filename", "alt_text"],
          separate: true,
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
    });

    res.json({ properties });
  } catch (error) {
    console.error("Erro ao buscar imóveis em destaque:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Aprovar imóvel (admin_master only)
const approveProperty = async (req, res) => {
  try {
    const { uuid } = req.params;

    const property = await Property.findOne({ where: { uuid } });

    if (!property) {
      return res.status(404).json({ error: "Imóvel não encontrado." });
    }

    await property.update({ approval_status: "approved" });

    res.json({ message: "Imóvel aprovado com sucesso!", property });
  } catch (error) {
    console.error("Erro ao aprovar imóvel:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

// Rejeitar imóvel (admin_master only)
const rejectProperty = async (req, res) => {
  try {
    const { uuid } = req.params;

    const property = await Property.findOne({ where: { uuid } });

    if (!property) {
      return res.status(404).json({ error: "Imóvel não encontrado." });
    }

    await property.update({ approval_status: "rejected" });

    res.json({ message: "Imóvel rejeitado com sucesso!", property });
  } catch (error) {
    console.error("Erro ao rejeitar imóvel:", error);
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
  approveProperty,
  rejectProperty,
};
