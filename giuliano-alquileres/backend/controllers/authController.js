const jwt = require("jsonwebtoken");
const { User } = require("../models");
const Joi = require("joi");

// Esquemas de validação
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .min(10)
    .max(20)
    .optional()
    .messages({
      "string.pattern.base":
        "Telefone deve estar em formato internacional válido (ex: +5511999999999)",
    }),
  country: Joi.string().max(50).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Gerar JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Registrar novo usuário
const register = async (req, res) => {
  try {
    // 1. Validar dados (seu código Joi já faz isso)
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { name, email, password, phone, country } = value;

    // 2. Verificar se email já existe (seu código já faz isso)
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "Email já está em uso",
      });
    }

    // 3. Criar usuário (o modelo já define role='admin' e status='pending' por padrão)
    const user = await User.createUser({
      name,
      email,
      password,
      phone,
      country,
    });

    // --- ALTERAÇÃO PRINCIPAL: NÃO GERAR E NÃO ENVIAR TOKEN ---
    // Em vez disso, enviamos uma resposta clara para o frontend.
    res.status(201).json({
      message:
        "Cadastro realizado com sucesso! Sua conta está aguardando aprovação do administrador.",
      user: {
        uuid: user.uuid,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro no register:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Login de usuário
const login = async (req, res) => {
  try {
    // 1. Validar dados (seu código Joi já faz isso perfeitamente)
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { email, password } = value;

    // 2. Buscar usuário (com as novas colunas)
    const user = await User.findOne({
      where: { email }, // Removemos 'is_active' para tratar o status manualmente
      attributes: [
        "id",
        "uuid",
        "name",
        "email",
        "phone",
        "country",
        "role",
        "status", // <-- IMPORTANTE: Adicionar 'status' aos atributos
        "password_hash",
      ],
    });

    // 3. Verificar se usuário existe e a senha é válida
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({
        error: "Email ou senha incorretos",
      });
    }

    // --- ALTERAÇÃO PRINCIPAL: Verificar o status de aprovação ---
    if (user.status !== "approved") {
      if (user.status === "pending") {
        return res.status(403).json({
          // 403 Forbidden é mais semântico aqui
          error: "Acesso negado",
          message: "Sua conta está pendente de aprovação pelo administrador.",
        });
      }
      if (user.status === "rejected") {
        return res.status(403).json({
          error: "Acesso negado",
          message: "Sua conta foi rejeitada. Entre em contato com o suporte.",
        });
      }
      // Caso haja algum outro status inesperado
      return res.status(403).json({
        error: "Acesso negado",
        message: "Sua conta não está ativa. Contate o suporte.",
      });
    }

    // 4. Gerar token (sua função generateToken já inclui o 'role', o que é perfeito)
    const token = generateToken(user);

    // 5. Enviar resposta
    res.json({
      message: "Login realizado com sucesso",
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
        status: user.status, // É bom enviar o status também
      },
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verificar token válido
const verifyToken = async (req, res) => {
  try {
    const user = req.user; // Vem do middleware de auth

    res.json({
      valid: true,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no verifyToken:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const user = req.user; // Vem do middleware de auth

    // Gerar novo token
    const newToken = generateToken(user);

    res.json({
      message: "Token renovado com sucesso",
      token: newToken,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro no refreshToken:", error);
    res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  refreshToken,
};
