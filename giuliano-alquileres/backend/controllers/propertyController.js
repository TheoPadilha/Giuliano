const { Property, City, PropertyPhoto, Amenity } = require("../models");
const Joi = require("joi");
const { Op } = require("sequelize");

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
      status = "available",
      featured,
      search,
    } = req.query;

    // Construir filtros
    const where = {};

    if (status) where.status = status;
    if (city_id) where.city_id = parseInt(city_id);
    if (type) where.type = type;
    if (max_guests) where.max_guests = { [Op.gte]: parseInt(max_guests) };
    if (featured === "true") where.is_featured = true;

    // Filtros de preço
    if (min_price || max_price) {
      where.price_per_night = {};
      if (min_price) where.price_per_night[Op.gte] = parseFloat(min_price);
      if (max_price) where.price_per_night[Op.lte] = parseFloat(max_price);
    }

    // Busca por texto
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Calcular offset
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Buscar imóveis
    const { count, rows: properties } = await Property.findAndCountAll({
      where,
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
        },
        {
          model: Amenity,
          as: "amenities",
          through: { attributes: [] },
          attributes: ["id", "name", "icon", "category"],
        },
      ],
      order: [
        ["is_featured", "DESC"],
        ["created_at", "DESC"],
      ],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });

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
    console.error("Erro ao buscar imóveis:", error);
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
          order: [["display_order", "ASC"]],
        },
        {
          model: Amenity,
          as: "amenities",
          through: { attributes: [] },
          attributes: ["id", "name", "icon", "category"],
        },
      ],
    });

    if (!property) {
      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
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
    // Validar dados
    const { error, value } = propertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { amenities, ...propertyData } = value;

    // Verificar se cidade existe
    const city = await City.findByPk(propertyData.city_id);
    if (!city) {
      return res.status(400).json({
        error: "Cidade não encontrada",
      });
    }

    // Criar imóvel
    const property = await Property.create(propertyData);

    // Associar comodidades se fornecidas
    if (amenities && amenities.length > 0) {
      await property.setAmenities(amenities);
    }

    // Buscar imóvel criado com relacionamentos
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
      ],
    });

    res.status(201).json({
      message: "Imóvel criado com sucesso",
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

    // Buscar imóvel
    const property = await Property.findOne({ where: { uuid } });
    if (!property) {
      return res.status(404).json({
        error: "Imóvel não encontrado",
      });
    }

    // Validar dados (permitir campos opcionais)
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
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { amenities, ...propertyData } = value;

    // Verificar cidade se fornecida
    if (propertyData.city_id) {
      const city = await City.findByPk(propertyData.city_id);
      if (!city) {
        return res.status(400).json({
          error: "Cidade não encontrada",
        });
      }
    }

    // Atualizar imóvel
    await property.update(propertyData);

    // Atualizar comodidades se fornecidas
    if (amenities) {
      await property.setAmenities(amenities);
    }

    // Buscar imóvel atualizado
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
      ],
    });

    res.json({
      message: "Imóvel atualizado com sucesso",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Erro ao atualizar imóvel:", error);
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
          where: { is_main: true },
          required: false,
          attributes: ["id", "filename", "alt_text"],
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

module.exports = {
  getProperties,
  getPropertyByUuid,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
};
