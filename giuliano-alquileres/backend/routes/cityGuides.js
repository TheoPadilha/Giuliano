const express = require("express");
const router = express.Router();

const cityGuideController = require("../controllers/cityGuideController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// Rotas públicas
// GET /api/city-guides - Lista todas as cidades com guias
router.get("/", cityGuideController.getAllCitiesWithGuides);

// GET /api/city-guides/:city - Busca guia de uma cidade específica
router.get("/:city", cityGuideController.getCityGuideByCity);

// Rotas protegidas (apenas para Admin)
// POST /api/city-guides - Cria um novo guia
router.post(
  "/",
  verifyToken,
  requireAdmin,
  cityGuideController.createCityGuide
);

// PUT /api/city-guides/:id - Atualiza um guia existente
router.put(
  "/:id",
  verifyToken,
  requireAdmin,
  cityGuideController.updateCityGuide
);

// DELETE /api/city-guides/:id - Deleta um guia
router.delete(
  "/:id",
  verifyToken,
  requireAdmin,
  cityGuideController.deleteCityGuide
);

module.exports = router;
