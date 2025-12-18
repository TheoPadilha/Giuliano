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

// Calcular preço para um período específico
const calculatePriceForPeriod = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { checkIn, checkOut } = req.query;

    console.log("[DynamicPricing] Calculando preço para período:", { propertyId, checkIn, checkOut });

    // Validar datas
    if (!checkIn || !checkOut) {
      return res.status(400).json({ error: "Datas de check-in e check-out são obrigatórias" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: "Data de check-out deve ser posterior ao check-in" });
    }

    // Buscar propriedade
    const property = await Property.findOne({
      where: { uuid: propertyId },
    });

    if (!property) {
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

    // Buscar preços dinâmicos que se sobrepõem com o período
    const pricings = await DynamicPricing.findAll({
      where: {
        property_id: property.id,
      },
      order: [["priority", "DESC"]], // Maior prioridade primeiro
    });

    // Calcular preço noite por noite
    const nightlyPrices = [];
    let currentDate = new Date(checkInDate);
    const basePrice = Number(property.price_per_night);

    while (currentDate < checkOutDate) {
      const dateStr = currentDate.toISOString().split("T")[0];

      // Encontrar preço dinâmico aplicável para esta noite (maior prioridade)
      const applicablePricing = pricings.find((pricing) => {
        const start = new Date(pricing.start_date);
        const end = new Date(pricing.end_date);
        return currentDate >= start && currentDate < end;
      });

      const nightPrice = applicablePricing
        ? Number(applicablePricing.price_per_night)
        : basePrice;

      nightlyPrices.push({
        date: dateStr,
        price: nightPrice,
        isDynamic: !!applicablePricing,
        description: applicablePricing?.description || null,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Calcular totais
    const totalNights = nightlyPrices.length;
    const totalPrice = nightlyPrices.reduce((sum, night) => sum + night.price, 0);
    const averagePrice = totalPrice / totalNights;

    console.log("[DynamicPricing] Cálculo concluído:", {
      totalNights,
      totalPrice,
      averagePrice,
      dynamicDays: nightlyPrices.filter((n) => n.isDynamic).length,
    });

    res.json({
      propertyId: property.uuid,
      checkIn,
      checkOut,
      totalNights,
      basePrice,
      totalPrice,
      averagePrice,
      nightlyPrices,
      hasDynamicPricing: nightlyPrices.some((n) => n.isDynamic),
    });
  } catch (error) {
    console.error("[DynamicPricing] Erro ao calcular preço:", error);
    logger.error("Erro ao calcular preço para período", { error: error.message });
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
  calculatePriceForPeriod,
};
