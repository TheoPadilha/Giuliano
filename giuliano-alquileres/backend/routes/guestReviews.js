const express = require("express");
const router = express.Router();
const guestReviewController = require("../controllers/guestReviewController");
const { verifyToken } = require("../middleware/auth");

// POST /api/guest-reviews/booking/:bookingUuid - Criar avaliação de hóspede
router.post(
  "/booking/:bookingUuid",
  verifyToken,
  guestReviewController.createGuestReview
);

// GET /api/guest-reviews/host - Listar avaliações feitas pelo proprietário
router.get("/host", verifyToken, guestReviewController.getHostReviews);

// GET /api/guest-reviews/guest/:guestUuid - Listar avaliações de um hóspede
router.get("/guest/:guestUuid", guestReviewController.getGuestReviews);

// GET /api/guest-reviews/can-review/:bookingUuid - Verificar se pode avaliar
router.get(
  "/can-review/:bookingUuid",
  verifyToken,
  guestReviewController.canReviewGuest
);

module.exports = router;
