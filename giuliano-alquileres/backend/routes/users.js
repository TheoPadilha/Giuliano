const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const usersController = require("../controllers/usersController");

// Todas as rotas requerem autenticação
router.put("/profile", verifyToken, usersController.updateProfile);
router.put("/password", verifyToken, usersController.updatePassword);

module.exports = router;
