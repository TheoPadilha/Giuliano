const express = require("express");
const router = express.Router();
const dynamicPricingController = require("../controllers/dynamicPricingController");
const { verifyToken } = require("../middleware/auth");

// Todas as rotas requerem autenticação

// GET /api/properties/:propertyId/pricing - Listar preços dinâmicos
router.get(
  "/:propertyId/pricing",
  dynamicPricingController.getPropertyPricing
);

// POST /api/properties/:propertyId/pricing - Criar preço dinâmico
router.post(
  "/:propertyId/pricing",
  verifyToken,
  dynamicPricingController.createDynamicPricing
);

// PUT /api/properties/:propertyId/pricing/:pricingId - Atualizar preço dinâmico
router.put(
  "/:propertyId/pricing/:pricingId",
  verifyToken,
  dynamicPricingController.updateDynamicPricing
);

// DELETE /api/properties/:propertyId/pricing/:pricingId - Deletar preço dinâmico
router.delete(
  "/:propertyId/pricing/:pricingId",
  verifyToken,
  dynamicPricingController.deleteDynamicPricing
);

module.exports = router;
