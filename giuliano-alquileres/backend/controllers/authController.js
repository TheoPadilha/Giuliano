const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendPasswordResetEmail } = require("../services/emailService");

// Validação de registro
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Nome deve ter no mínimo 2 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
    "any.required": "Nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),
  password: Joi.string().min(6).max(100).required().messages({
    "string.min": "Senha deve ter no mínimo 6 caracteres",
    "string.max": "Senha deve ter no máximo 100 caracteres",
    "any.required": "Senha é obrigatória",
  }),
  phone: Joi.string().min(10).max(20).optional().allow(""),
  country: Joi.string().max(50).optional().allow(""),
  role: Joi.string().valid("client", "admin").optional(), // Apenas client ou admin podem se registrar
});

// Validação de login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),
  password: Joi.string().required().messages({
    "any.required": "Senha é obrigatória",
  }),
});

// Gerar JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * @desc    Registrar novo usuário (Cliente ou Admin)
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    // Validar dados
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const { name, email, password, phone, country, role } = value;

    // Verificar se o email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Este email já está cadastrado",
      });
    }

    // Determinar role e status
    const userRole = role || "client"; // Padrão é 'client'
    const userStatus = userRole === "client" ? "approved" : "pending"; // Clientes aprovados automaticamente

    // Criar usuário
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password_hash: password,
      phone: phone || null,
      country: country || "Brasil",
      role: userRole,
      status: userStatus,
    });

    // Se for cliente, gerar token imediatamente (já está aprovado)
    // Se for admin, aguardar aprovação
    if (userRole === "client") {
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: "Cadastro realizado com sucesso! Você já pode fazer login.",
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        token,
      });
    } else {
      // Admin precisa de aprovação
      return res.status(201).json({
        success: true,
        message:
          "Cadastro realizado! Sua conta de proprietário será analisada e você receberá um email quando for aprovada.",
        user: {
          id: user.id,
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    }
  } catch (err) {
    console.error("Erro no registro:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao registrar usuário. Tente novamente.",
    });
  }
};

/**
 * @desc    Login de usuário
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    // Validar dados
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const { email, password } = value;

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha incorretos",
      });
    }

    // Validar senha
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Email ou senha incorretos",
      });
    }

    // Verificar status da conta
    if (user.status === "pending") {
      return res.status(403).json({
        success: false,
        error:
          "Sua conta de proprietário está aguardando aprovação. Você receberá um email quando for aprovada.",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        success: false,
        error:
          "Sua conta foi rejeitada. Entre em contato com o suporte para mais informações.",
      });
    }

    // Gerar token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login realizado com sucesso!",
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao fazer login. Tente novamente.",
    });
  }
};

/**
 * @desc    Verificar token JWT
 * @route   GET /api/auth/verify
 * @access  Private
 */
exports.verify = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Erro ao verificar token:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao verificar token",
    });
  }
};

/**
 * @desc    Renovar token JWT
 * @route   POST /api/auth/refresh
 * @access  Private
 */
exports.refresh = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar se o usuário ainda está ativo
    if (user.status !== "approved") {
      return res.status(403).json({
        success: false,
        error: "Sua conta não está mais ativa",
      });
    }

    // Gerar novo token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Token renovado com sucesso",
      token,
    });
  } catch (err) {
    console.error("Erro ao renovar token:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao renovar token",
    });
  }
};

/**
 * @desc    Solicitar recuperação de senha
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email é obrigatório",
      });
    }

    // Buscar usuário
    const user = await User.findByEmail(email);
    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return res.status(200).json({
        success: true,
        message: "Se o email existir em nossa base, você receberá as instruções de recuperação",
      });
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Definir expiração (60 minutos)
    const expiryMinutes = parseInt(process.env.PASSWORD_RESET_TOKEN_EXPIRY) || 60;
    const resetTokenExpires = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Salvar token no banco
    user.reset_token = resetTokenHash;
    user.reset_token_expires = resetTokenExpires;
    await user.save();

    // Enviar email
    await sendPasswordResetEmail(user, resetToken);

    return res.status(200).json({
      success: true,
      message: "Se o email existir em nossa base, você receberá as instruções de recuperação",
    });
  } catch (err) {
    console.error("Erro ao solicitar recuperação de senha:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao processar solicitação. Tente novamente.",
    });
  }
};

/**
 * @desc    Redefinir senha com token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Token e nova senha são obrigatórios",
      });
    }

    // Validar senha
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Senha deve ter no mínimo 6 caracteres",
      });
    }

    // Hash do token recebido
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Buscar usuário com token válido
    const { Op } = require("sequelize");
    const user = await User.findOne({
      where: {
        reset_token: resetTokenHash,
        reset_token_expires: {
          [Op.gt]: new Date(), // Token não expirado
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Token inválido ou expirado",
      });
    }

    // Atualizar senha
    user.password_hash = newPassword; // O hook beforeUpdate fará o hash
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Senha redefinida com sucesso! Você já pode fazer login com a nova senha.",
    });
  } catch (err) {
    console.error("Erro ao redefinir senha:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao redefinir senha. Tente novamente.",
    });
  }
};

module.exports = exports;
