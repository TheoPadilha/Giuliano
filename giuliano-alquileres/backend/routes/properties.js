const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/propertyController");
const {
  verifyToken,
  requireAdmin,
  optionalAuth,
  requireAdminMaster,
  requirePropertyOwnerOrAdminMaster,
} = require("../middleware/auth");

// Rotas públicas
router.get("/", optionalAuth, propertyController.getProperties);
router.get("/featured", propertyController.getFeaturedProperties);
router.get("/:uuid", optionalAuth, propertyController.getPropertyByUuid);

// Rotas protegidas
router.post("/", verifyToken, requireAdmin, propertyController.createProperty);

router.put(
  "/:uuid",
  verifyToken,
  requirePropertyOwnerOrAdminMaster,
  propertyController.updateProperty
);

router.patch(
  "/:uuid",
  verifyToken,
  requirePropertyOwnerOrAdminMaster,
  propertyController.updateProperty
);

router.delete(
  "/:uuid",
  verifyToken,
  requirePropertyOwnerOrAdminMaster,
  propertyController.deleteProperty
);

// 🔥 NOVA ROTA: Toggle Featured (apenas admin_master)
router.put(
  "/:uuid/toggle-featured",
  verifyToken,
  requireAdminMaster,
  propertyController.toggleFeatured
);

module.exports = router;
