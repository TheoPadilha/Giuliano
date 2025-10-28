// routes/stats.js - Rotas para estatísticas do admin
const express = require("express");
const router = express.Router();
const {
  getAdminStats,
  getRecentProperties,
  getRecentBookings,
  getBookingsChart,
} = require("../controllers/statsController");
const { verifyToken, requireAdmin } = require("../middleware/auth");

// Todas as rotas requerem autenticação de admin
router.use(verifyToken);
router.use(requireAdmin);

// GET /api/stats - Estatísticas gerais
router.get("/", getAdminStats);

// GET /api/stats/properties/recent - Propriedades recentes
router.get("/properties/recent", getRecentProperties);

// GET /api/stats/bookings/recent - Reservas recentes
router.get("/bookings/recent", getRecentBookings);

// GET /api/stats/bookings/chart - Dados para gráfico de reservas
router.get("/bookings/chart", getBookingsChart);

module.exports = router;
