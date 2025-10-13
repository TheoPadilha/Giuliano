// backend/routes/properties.js - VERSÃO CORRIGIDA

const express = require("express");
const router = express.Router();

// Importar controllers e middlewares
const propertyController = require("../controllers/propertyController");
const {
  verifyToken,
  requireAdmin,
  optionalAuth,
  requireAdminMaster, // <-- NOVO MIDDLEWARE IMPORTADO
  requirePropertyOwnerOrAdminMaster,
} = require("../middleware/auth");

// Rotas públicas (sem autenticação)

// GET /api/properties - Listar imóveis com filtros
router.get("/", optionalAuth, propertyController.getProperties);

// GET /api/properties/featured - Imóveis em destaque
router.get("/featured", propertyController.getFeaturedProperties);

// GET /api/properties/:uuid - Buscar imóvel específico
router.get("/:uuid", optionalAuth, propertyController.getPropertyByUuid);

// Rotas protegidas (admin only)

// POST /api/properties - Criar novo imóvel (apenas admin ou admin_master)
router.post("/", verifyToken, requireAdmin, propertyController.createProperty);

// PUT /api/properties/:uuid - Atualizar imóvel
// Apenas o proprietário do imóvel ou um admin_master pode atualizar
router.put(
  "/:uuid",
  verifyToken,
  requirePropertyOwnerOrAdminMaster,
  propertyController.updateProperty
);

// PATCH /api/properties/:uuid - Atualização parcial de imóvel
// Apenas o proprietário do imóvel ou um admin_master pode atualizar
router.patch(
  "/:uuid",
  verifyToken,
  requirePropertyOwnerOrAdminMaster,
  propertyController.updateProperty
);

// DELETE /api/properties/:uuid - Deletar imóvel
// Apenas o proprietário do imóvel ou um admin_master pode deletar
router.delete(
  "/:uuid",
  verifyToken,
  requirePropertyOwnerOrAdminMaster,
  propertyController.deleteProperty
);

// --- Rotas de Aprovação de Imóveis (admin_master only) ---

// PUT /api/properties/:uuid/approve - Aprovar imóvel
router.put(
  "/:uuid/approve",
  verifyToken,
  requireAdminMaster, // <-- APENAS ADMIN_MASTER PODE APROVAR
  propertyController.approveProperty
);

// PUT /api/properties/:uuid/reject - Rejeitar imóvel
router.put(
  "/:uuid/reject",
  verifyToken,
  requireAdminMaster, // <-- APENAS ADMIN_MASTER PODE REJEITAR
  propertyController.rejectProperty
);

module.exports = router;
