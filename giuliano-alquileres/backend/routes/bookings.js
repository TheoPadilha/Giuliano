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

// GET /api/bookings/my - Listar minhas reservas (como hóspede)
router.get("/my", verifyToken, bookingController.getUserBookings);

// GET /api/bookings/owner/all - Listar todas as reservas das minhas propriedades (como proprietário/admin)
router.get("/owner/all", verifyToken, bookingController.getAllOwnerBookings);

// GET /api/bookings/property/:property_id - Listar reservas da propriedade (para proprietário)
// IMPORTANTE: Esta rota deve vir ANTES de /:uuid para evitar conflitos
router.get(
  "/property/:property_id",
  verifyToken,
  bookingController.getPropertyBookings
);

// GET /api/bookings/:uuid - Obter detalhes de uma reserva
router.get("/:uuid", verifyToken, bookingController.getBookingById);

// PUT /api/bookings/:uuid/cancel - Cancelar reserva
router.put("/:uuid/cancel", verifyToken, bookingController.cancelBooking);

// PUT /api/bookings/:uuid/confirm - Confirmar reserva (proprietário)
router.put("/:uuid/confirm", verifyToken, bookingController.confirmBooking);

module.exports = router;
