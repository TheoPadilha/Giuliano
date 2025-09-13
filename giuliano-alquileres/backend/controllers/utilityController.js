const { City, Amenity, Property } = require("../models");

// Listar todas as cidades
const getCities = async (req, res) => {
  try {
    const { active_only = "false" } = req.query;

    let cities;

    if (active_only === "true") {
      // Apenas cidades que têm imóveis disponíveis
      cities = await City.findAll({
        include: [
          {
            model: Property,
            as: "properties",
            attributes: [],
            required: true,
            where: { status: "available" },
          },
        ],
        attributes: ["id", "name", "state", "country"],
        group: ["City.id"],
        order: [["name", "ASC"]],
      });
    } else {
      // Todas as cidades
      cities = await City.findAll({
        attributes: ["id", "name", "state", "country", "latitude", "longitude"],
        order: [["name", "ASC"]],
      });
    }

    res.json({ cities });
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Buscar cidade específica
const getCityById = async (req, res) => {
  try {
    const { id } = req.params;

    const city = await City.findByPk(id, {
      attributes: ["id", "name", "state", "country", "latitude", "longitude"],
    });

    if (!city) {
      return res.status(404).json({
        error: "Cidade não encontrada",
      });
    }

    res.json({ city });
  } catch (error) {
    console.error("Erro ao buscar cidade:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Listar todas as comodidades
const getAmenities = async (req, res) => {
  try {
    const { grouped = "false" } = req.query;

    if (grouped === "true") {
      // Retornar agrupadas por categoria
      const amenities = await Amenity.findAll({
        attributes: ["id", "name", "icon", "category"],
        order: [
          ["category", "ASC"],
          ["name", "ASC"],
        ],
      });

      const grouped = {
        basic: [],
        comfort: [],
        security: [],
        entertainment: [],
      };

      amenities.forEach((amenity) => {
        grouped[amenity.category].push(amenity);
      });

      res.json({ amenities: grouped });
    } else {
      // Retornar lista simples
      const amenities = await Amenity.findAll({
        attributes: ["id", "name", "icon", "category"],
        order: [["name", "ASC"]],
      });

      res.json({ amenities });
    }
  } catch (error) {
    console.error("Erro ao buscar comodidades:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Buscar comodidades por categoria
const getAmenitiesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const validCategories = ["basic", "comfort", "security", "entertainment"];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: "Categoria inválida",
        valid_categories: validCategories,
      });
    }

    const amenities = await Amenity.findAll({
      where: { category },
      attributes: ["id", "name", "icon", "category"],
      order: [["name", "ASC"]],
    });

    res.json({ amenities });
  } catch (error) {
    console.error("Erro ao buscar comodidades por categoria:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCities,
  getCityById,
  getAmenities,
  getAmenitiesByCategory,
};
