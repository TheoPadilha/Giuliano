// Em routes/admin.js

const express = require("express");
const router = express.Router();

// Importar controllers e middlewares
const adminController = require("../controllers/adminController");
const { verifyToken, requireAdminMaster } = require("../middleware/auth");

// Todas as rotas neste arquivo exigem que o usuário seja um 'admin_master'.
// Podemos aplicar os middlewares para todas as rotas de uma vez.
router.use(verifyToken, requireAdminMaster);

// --- Rotas de Gerenciamento de Usuários ---

// GET /api/admin/users - Listar todos os usuários (com filtros, opcional)
router.get("/users", adminController.getAllUsers);

// PUT /api/admin/users/:id/approve - Aprovar o cadastro de um usuário
router.put("/users/:id/approve", adminController.approveUser);

// PUT /api/admin/users/:id/reject - Rejeitar o cadastro de um usuário
router.put("/users/:id/reject", adminController.rejectUser);

// DELETE /api/admin/users/:id - Reverter usuário para pendente (corrigir aprovação/rejeição acidental)
router.delete("/users/:id", adminController.deleteUser);

module.exports = router;
