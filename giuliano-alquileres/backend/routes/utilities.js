const express = require("express");
const router = express.Router();

// Importar controllers
const utilityController = require("../controllers/utilityController");

// Rotas públicas

// GET /api/utilities/cities - Listar cidades
router.get("/cities", utilityController.getCities);

// GET /api/utilities/cities/:id - Buscar cidade específica
router.get("/cities/:id", utilityController.getCityById);

// GET /api/utilities/amenities - Listar comodidades
router.get("/amenities", utilityController.getAmenities);

// GET /api/utilities/amenities/category/:category - Comodidades por categoria
router.get(
  "/amenities/category/:category",
  utilityController.getAmenitiesByCategory
);

module.exports = router;
