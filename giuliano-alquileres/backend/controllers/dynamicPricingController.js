const DynamicPricing = require("../models/DynamicPricing");
const { Property } = require("../models");
const Joi = require("joi");
const logger = require("../utils/logger");

// Validação
const pricingSchema = Joi.object({
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().greater(Joi.ref("start_date")).required(),
  price_per_night: Joi.number().min(0).required(),
  description: Joi.string().max(100).optional().allow(""),
  priority: Joi.number().integer().min(0).max(100).default(0),
});

// Criar preço dinâmico
const createDynamicPricing = async (req, res) => {
  try {
    const { propertyId } = req.params;

    console.log("[DynamicPricing] Criando preço para propriedade:", propertyId);
    console.log("[DynamicPricing] Dados:", req.body);

    // Verificar se propriedade existe e pertence ao usuário
    const property = await Property.findOne({
      where: { uuid: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

    // Verificar permissão
    const isOwner = property.user_id === req.user.id;
    const isAdmin = req.user.role === "admin_master";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Validar dados
    const { error, value } = pricingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Criar preço dinâmico
    const pricing = await DynamicPricing.create({
      property_id: property.id,
      ...value,
    });

    console.log("[DynamicPricing] Preço criado com ID:", pricing.id);

    res.status(201).json({
      message: "Preço dinâmico criado com sucesso",
      pricing,
    });
  } catch (error) {
    console.error("[DynamicPricing] Erro ao criar preço:", error);
    logger.error("Erro ao criar preço dinâmico", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Listar preços dinâmicos de uma propriedade
const getPropertyPricing = async (req, res) => {
  try {
    const { propertyId } = req.params;

    console.log("[DynamicPricing] Buscando preços para propriedade:", propertyId);

    // Buscar propriedade
    const property = await Property.findOne({
      where: { uuid: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

    // Buscar preços dinâmicos
    const pricings = await DynamicPricing.findAll({
      where: { property_id: property.id },
      order: [
        ["start_date", "ASC"],
        ["priority", "DESC"],
      ],
    });

    console.log("[DynamicPricing] Encontrados", pricings.length, "preços");

    res.json({
      pricings,
      base_price: property.price_per_night,
    });
  } catch (error) {
    console.error("[DynamicPricing] Erro ao buscar preços:", error);
    logger.error("Erro ao buscar preços dinâmicos", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Atualizar preço dinâmico
const updateDynamicPricing = async (req, res) => {
  try {
    const { propertyId, pricingId } = req.params;

    console.log("[DynamicPricing] Atualizando preço:", pricingId);

    // Buscar propriedade
    const property = await Property.findOne({
      where: { uuid: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

    // Verificar permissão
    const isOwner = property.user_id === req.user.id;
    const isAdmin = req.user.role === "admin_master";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Buscar preço dinâmico
    const pricing = await DynamicPricing.findOne({
      where: {
        uuid: pricingId,
        property_id: property.id,
      },
    });

    if (!pricing) {
      return res.status(404).json({ error: "Preço dinâmico não encontrado" });
    }

    // Validar dados
    const { error, value } = pricingSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Atualizar
    await pricing.update(value);

    console.log("[DynamicPricing] Preço atualizado com sucesso");

    res.json({
      message: "Preço dinâmico atualizado com sucesso",
      pricing,
    });
  } catch (error) {
    console.error("[DynamicPricing] Erro ao atualizar preço:", error);
    logger.error("Erro ao atualizar preço dinâmico", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Deletar preço dinâmico
const deleteDynamicPricing = async (req, res) => {
  try {
    const { propertyId, pricingId } = req.params;

    console.log("[DynamicPricing] Deletando preço:", pricingId);

    // Buscar propriedade
    const property = await Property.findOne({
      where: { uuid: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

    // Verificar permissão
    const isOwner = property.user_id === req.user.id;
    const isAdmin = req.user.role === "admin_master";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Buscar e deletar
    const deleted = await DynamicPricing.destroy({
      where: {
        uuid: pricingId,
        property_id: property.id,
      },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Preço dinâmico não encontrado" });
    }

    console.log("[DynamicPricing] Preço deletado com sucesso");

    res.json({
      message: "Preço dinâmico deletado com sucesso",
    });
  } catch (error) {
    console.error("[DynamicPricing] Erro ao deletar preço:", error);
    logger.error("Erro ao deletar preço dinâmico", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  createDynamicPricing,
  getPropertyPricing,
  updateDynamicPricing,
  deleteDynamicPricing,
};
