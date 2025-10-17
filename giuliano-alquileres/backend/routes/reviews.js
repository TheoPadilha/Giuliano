const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");

// Importar controllers
const reviewController = require("../controllers/reviewController");

// Rotas públicas
router.get("/property/:propertyId", reviewController.getPropertyReviews);

// Rotas protegidas
router.post("/", verifyToken, reviewController.createReview);
router.get("/my", verifyToken, reviewController.getMyReviews);

module.exports = router;