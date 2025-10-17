const express = require("express");
const router = express.Router();

// Importar controllers e middlewares
const bookingController = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/auth");

// ===== ROTAS PÚBLICAS =====

// GET /api/bookings/availability - Verificar disponibilidade
router.get("/availability", bookingController.checkAvailability);

// GET /api/bookings/property/:property_id/occupied - Obter datas ocupadas
router.get(
  "/property/:property_id/occupied",
  bookingController.getOccupiedDates
);

// ===== ROTAS PROTEGIDAS (Requer autenticação) =====

// POST /api/bookings - Criar nova reserva
router.post("/", verifyToken, bookingController.createBooking);

// GET /api/bookings/my - Listar minhas reservas
router.get("/my", verifyToken, bookingController.getUserBookings);

// GET /api/bookings/:uuid - Obter detalhes de uma reserva
router.get("/:uuid", verifyToken, bookingController.getBookingById);

// PUT /api/bookings/:uuid/cancel - Cancelar reserva
router.put("/:uuid/cancel", verifyToken, bookingController.cancelBooking);

// GET /api/bookings/property/:property_id - Listar reservas da propriedade (para proprietário)
router.get(
  "/property/:property_id",
  verifyToken,
  bookingController.getPropertyBookings
);

module.exports = router;
