const express = require("express");

// Importar controllers e middlewares
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/auth");

// Exportar função que recebe os limiters
module.exports = (authLimiter, registerLimiter) => {
  const router = express.Router();

  // Rotas públicas (sem autenticação)

  // POST /api/auth/register - Cadastrar novo usuário (com rate limiter específico)
  router.post("/register", registerLimiter, authController.register);

  // POST /api/auth/login - Fazer login (com rate limiter específico)
  router.post("/login", authLimiter, authController.login);

  // Rotas protegidas (com autenticação)

  // GET /api/auth/verify - Verificar se token é válido
  router.get("/verify", verifyToken, authController.verify);

  // POST /api/auth/refresh - Renovar token
  router.post("/refresh", verifyToken, authController.refresh);

  return router;
};
