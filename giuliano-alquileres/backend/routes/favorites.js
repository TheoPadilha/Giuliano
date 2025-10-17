const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Importar controller
const favoritesController = require("../controllers/favoritesController");

// Todas as rotas requerem autenticação
router.post("/:propertyId", verifyToken, favoritesController.addToFavorites);
router.delete("/:propertyId", verifyToken, favoritesController.removeFromFavorites);
router.get("/", verifyToken, favoritesController.getMyFavorites);
router.get("/check/:propertyId", verifyToken, favoritesController.checkIsFavorite);

module.exports = router;