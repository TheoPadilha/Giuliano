const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const usersController = require("../controllers/usersController");
const { uploadSingle } = require("../middleware/upload");

// Todas as rotas requerem autenticação
router.put("/profile", verifyToken, usersController.updateProfile);
router.put("/password", verifyToken, usersController.updatePassword);

// Rotas de avatar
router.post(
  "/avatar",
  verifyToken,
  uploadSingle("avatar"),
  usersController.uploadAvatar
);
router.delete("/avatar", verifyToken, usersController.deleteAvatar);

module.exports = router;
