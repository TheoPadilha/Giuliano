const express = require("express");
const router = express.Router();

// Importar controllers e middlewares
const uploadController = require("../controllers/uploadController");
const { verifyToken, requireAdmin } = require("../middleware/auth");
const { handleUpload } = require("../middleware/upload");

// Upload múltiplo de fotos para um imóvel (admin only)
router.post(
  "/properties",
  verifyToken,
  requireAdmin,
  handleUpload,
  uploadController.uploadPropertyPhotos
);

// Listar fotos de um imóvel (público)
router.get(
  "/properties/:property_uuid/photos",
  uploadController.getPropertyPhotos
);

// Definir foto principal (admin only)
router.put(
  "/photos/:photo_id/main",
  verifyToken,
  requireAdmin,
  uploadController.setMainPhoto
);

// Reordenar fotos (admin only)
router.put(
  "/properties/:property_uuid/photos/reorder",
  verifyToken,
  requireAdmin,
  uploadController.reorderPhotos
);

// Atualizar informações da foto (admin only)
router.put(
  "/photos/:photo_id",
  verifyToken,
  requireAdmin,
  uploadController.updatePhoto
);

// Deletar foto (admin only)
router.delete(
  "/photos/:photo_id",
  verifyToken,
  requireAdmin,
  uploadController.deletePhoto
);

module.exports = router;
