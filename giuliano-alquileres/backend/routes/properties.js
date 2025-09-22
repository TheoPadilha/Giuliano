// backend/routes/properties.js - VERSÃO CORRIGIDA

const express = require("express");
const router = express.Router();

// Importar controllers e middlewares
const propertyController = require("../controllers/propertyController");
const {
  verifyToken,
  requireAdmin,
  optionalAuth,
} = require("../middleware/auth");

// Rotas públicas (sem autenticação)

// GET /api/properties - Listar imóveis com filtros
router.get("/", optionalAuth, propertyController.getProperties);

// GET /api/properties/featured - Imóveis em destaque
router.get("/featured", propertyController.getFeaturedProperties);

// GET /api/properties/:uuid - Buscar imóvel específico
router.get("/:uuid", optionalAuth, propertyController.getPropertyByUuid);

// Rotas protegidas (admin only)

// POST /api/properties - Criar novo imóvel
router.post("/", verifyToken, requireAdmin, propertyController.createProperty);

// 🛠️ CORREÇÃO: Adicionar rota PUT para atualização
router.put(
  "/:uuid",
  verifyToken,
  requireAdmin,
  propertyController.updateProperty
);

// 🛠️ CORREÇÃO: Adicionar rota PATCH para atualização parcial
router.patch(
  "/:uuid",
  verifyToken,
  requireAdmin,
  propertyController.updateProperty
);

// DELETE /api/properties/:uuid - Deletar imóvel
router.delete(
  "/:uuid",
  verifyToken,
  requireAdmin,
  propertyController.deleteProperty
);

module.exports = router;
