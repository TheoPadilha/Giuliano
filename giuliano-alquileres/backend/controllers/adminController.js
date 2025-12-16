// Em controllers/adminController.js

const { User } = require("../models");
const zapiService = require("../services/zapiService");

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

    // Enviar WhatsApp de confirmação de aprovação
    if (user.phone && user.role === "admin") {
      setImmediate(async () => {
        try {
          const approvalMessage = `
Olá *${user.name}*! 🎉

✅ *Sua conta foi APROVADA!*

Parabéns! Sua solicitação de cadastro como proprietário na plataforma *ZigueAluga* foi aprovada com sucesso.

🎯 *Agora você pode:*
• Acessar o painel administrativo
• Cadastrar seus imóveis
• Gerenciar suas reservas
• Visualizar relatórios

🔐 *Acesse agora:*
🌐 https://ziguealuga.com/login

📧 *Login:* ${user.email}

Bem-vindo à família ZigueAluga! 🏠

_Qualquer dúvida, estamos à disposição._
          `.trim();

          await zapiService.sendMessage(user.phone, approvalMessage);
          console.log(`✅ WhatsApp de aprovação enviado para ${user.name}`);
        } catch (whatsappError) {
          console.error("❌ Erro ao enviar WhatsApp de aprovação:", whatsappError.message);
        }
      });
    }

    res.json({ message: `Usuário ${user.name} aprovado com sucesso.`, user });
  } catch (error) {
    console.error("Erro ao aprovar usuário:", error);
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

    // Enviar WhatsApp informando rejeição (opcional, mais delicado)
    if (user.phone && user.role === "admin") {
      setImmediate(async () => {
        try {
          const adminPhone = process.env.ZAPI_PHONE || "5547989105580";
          const rejectionMessage = `
Olá *${user.name}*,

Agradecemos seu interesse na plataforma *ZigueAluga*.

Infelizmente, não foi possível aprovar seu cadastro como proprietário neste momento.

📞 *Entre em contato:*
Para mais informações ou esclarecimentos, entre em contato conosco pelo WhatsApp ${adminPhone}

🌐 *Site:* https://ziguealuga.com

_Equipe ZigueAluga_
          `.trim();

          await zapiService.sendMessage(user.phone, rejectionMessage);
          console.log(`✅ WhatsApp de rejeição enviado para ${user.name}`);
        } catch (whatsappError) {
          console.error("❌ Erro ao enviar WhatsApp de rejeição:", whatsappError.message);
        }
      });
    }

    res.json({ message: `Usuário ${user.name} rejeitado.`, user });
  } catch (error) {
    console.error("Erro ao rejeitar usuário:", error);
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

// Reverter usuário para pendente (para corrigir aprovação/rejeição acidental)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Não permitir reverter admin_master
    if (user.role === "admin_master") {
      return res.status(403).json({ error: "Não é permitido modificar um admin master." });
    }

    // Não faz sentido "reverter" um usuário que já está pendente
    if (user.status === "pending") {
      return res.status(400).json({ error: "Usuário já está pendente." });
    }

    const oldStatus = user.status;
    user.status = "pending";
    await user.save();

    console.log(`🔄 Usuário ${user.name} revertido de "${oldStatus}" para "pending" pelo admin`);
    res.json({
      message: `Usuário ${user.name} revertido para pendente com sucesso.`,
      user
    });
  } catch (error) {
    console.error("Erro ao reverter usuário:", error);
    res.status(500).json({ error: "Erro ao reverter usuário." });
  }
};
