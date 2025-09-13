const jwt = require("jsonwebtoken");
const { User } = require("../models");
const Joi = require("joi");

// Esquemas de validação
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().min(10).max(20).optional(),
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
    // Validar dados
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { name, email, password, phone, country } = value;

    // Verificar se email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        error: "Email já está em uso",
      });
    }

    // Criar usuário
    const user = await User.createUser({
      name,
      email,
      password,
      phone,
      country,
    });

    // Gerar token
    const token = generateToken(user);

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
      },
      token,
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
    // Validar dados
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { email, password } = value;

    // Buscar usuário com senha
    const user = await User.findOne({
      where: { email, is_active: true },
      attributes: [
        "id",
        "uuid",
        "name",
        "email",
        "phone",
        "country",
        "role",
        "password_hash",
      ],
    });

    if (!user) {
      return res.status(401).json({
        error: "Email ou senha incorretos",
      });
    }

    // Verificar senha
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: "Email ou senha incorretos",
      });
    }

    // Gerar token
    const token = generateToken(user);

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
