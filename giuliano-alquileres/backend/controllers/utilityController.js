const { City, Amenity, Property } = require("../models");
const axios = require("axios");

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

// Geocodificação de endereço usando OpenStreetMap Nominatim (GRÁTIS!)
const geocodeAddress = async (req, res) => {
  try {
    const { address } = req.body;

    // Validar entrada
    if (!address) {
      return res.status(400).json({
        error: "Endereço é obrigatório",
      });
    }

    console.log(`🗺️  Geocodificando endereço: ${address}`);

    // Fazer requisição para OpenStreetMap Nominatim (100% GRATUITO)
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: address,
          format: "json",
          addressdetails: 1,
          limit: 1,
        },
        headers: {
          "User-Agent": "Ziguealuga-Platform/1.0", // Nominatim exige User-Agent
        },
        timeout: 30000, // 30 segundos timeout (aumentado de 10s)
      }
    );

    const results = response.data;

    // Verificar se encontrou resultados
    if (results && results.length > 0) {
      const result = results[0];

      console.log(`✅ Coordenadas encontradas: ${result.lat}, ${result.lon}`);

      return res.json({
        success: true,
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted_address: result.display_name,
        place_id: result.place_id,
        warning: "As coordenadas são aproximadas. Verifique a precisão no mapa e ajuste manualmente se necessário.",
      });
    } else {
      console.log("⚠️  Nenhum resultado encontrado para o endereço");
      return res.status(404).json({
        error:
          "Endereço não encontrado. Verifique o endereço e tente novamente.",
      });
    }
  } catch (error) {
    console.error("❌ Erro ao geocodificar endereço:", error.message);

    // Tratamento específico para erros de rede/timeout
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return res.status(504).json({
        error:
          "Tempo limite excedido ao conectar com o serviço de mapas. Tente novamente em alguns segundos ou insira as coordenadas manualmente.",
        canSkip: true,
      });
    }

    if (error.response) {
      // Erro da API
      console.error("❌ Resposta de erro:", error.response.status, error.response.data);

      // Rate limiting do Nominatim
      if (error.response.status === 429) {
        return res.status(429).json({
          error: "Muitas requisições ao serviço de mapas. Aguarde alguns segundos e tente novamente, ou insira as coordenadas manualmente.",
          canSkip: true,
        });
      }

      return res.status(error.response.status || 500).json({
        error: "Erro ao conectar com o serviço de mapas",
        canSkip: true,
        details:
          process.env.NODE_ENV === "development"
            ? error.response.data
            : undefined,
      });
    }

    res.status(500).json({
      error: "Erro interno do servidor ao processar geocodificação",
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
  geocodeAddress,
};
