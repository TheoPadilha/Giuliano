const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
  createPaymentPreference,
  handleWebhook,
  getMyPayments,
  getPaymentByUuid,
} = require("../controllers/paymentController");

// ============================================
// ROTAS PÚBLICAS
// ============================================

// Webhook do Mercado Pago (não precisa de autenticação)
router.post("/webhook", handleWebhook);

// ============================================
// ROTAS PROTEGIDAS (requerem autenticação)
// ============================================

// Criar preferência de pagamento
router.post("/create-preference", verifyToken, createPaymentPreference);

// Listar meus pagamentos
router.get("/my", verifyToken, getMyPayments);

// Buscar detalhes de um pagamento por UUID
router.get("/:uuid", verifyToken, getPaymentByUuid);

module.exports = router;
