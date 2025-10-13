// Em controllers/adminController.js

const { User } = require("../models");

// Listar todos os usuários pendentes de aprovação
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({
      where: { status: "pending" },
      order: [["created_at", "ASC"]], // Mostrar os mais antigos primeiro
    });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários pendentes." });
  }
};

// Aprovar um usuário
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    user.status = "approved";
    await user.save();
    res.json({ message: `Usuário ${user.name} aprovado com sucesso.`, user });
  } catch (error) {
    res.status(500).json({ error: "Erro ao aprovar usuário." });
  }
};

// Rejeitar um usuário
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    user.status = "rejected";
    // Opcional: você pode também desativar o usuário
    // user.is_active = false;
    await user.save();
    res.json({ message: `Usuário ${user.name} rejeitado.`, user });
  } catch (error) {
    res.status(500).json({ error: "Erro ao rejeitar usuário." });
  }
};

// Listar todos os usuários (exemplo de uma rota de admin mais geral)
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.findAll({
      order: [["name", "ASC"]],
    });
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar todos os usuários." });
  }
};
