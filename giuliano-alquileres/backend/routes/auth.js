const express = require("express");
const router = express.Router();

// Importar controllers e middlewares
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

// Rotas públicas (sem autenticação)

// POST /api/auth/register - Cadastrar novo usuário
router.post("/register", authController.register);

// POST /api/auth/login - Fazer login
router.post("/login", authController.login);

// Rotas protegidas (com autenticação)

// GET /api/auth/verify - Verificar se token é válido
router.get("/verify", verifyToken, authController.verifyToken);

// POST /api/auth/refresh - Renovar token
router.post("/refresh", verifyToken, authController.refreshToken);

module.exports = router;
