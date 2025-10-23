const Joi = require("joi");
const User = require("../models/User");

// Validação de atualização de perfil
const profileSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.min": "Nome deve ter no mínimo 2 caracteres",
    "string.max": "Nome deve ter no máximo 100 caracteres",
    "any.required": "Nome é obrigatório",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email inválido",
    "any.required": "Email é obrigatório",
  }),
  phone: Joi.string().min(10).max(20).optional().allow("", null),
  country: Joi.string().max(50).optional().allow("", null),
});

// Validação de alteração de senha
const passwordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Senha atual é obrigatória",
  }),
  newPassword: Joi.string().min(6).max(100).required().messages({
    "string.min": "Nova senha deve ter no mínimo 6 caracteres",
    "string.max": "Nova senha deve ter no máximo 100 caracteres",
    "any.required": "Nova senha é obrigatória",
  }),
});

/**
 * @desc    Atualizar perfil do usuário
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    // Validar dados
    const { error, value } = profileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const { name, email, phone, country } = value;

    // Buscar usuário
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar se o email já está em uso por outro usuário
    if (email !== user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          success: false,
          error: "Este email já está em uso",
        });
      }
    }

    // Atualizar usuário
    await user.update({
      name,
      email: email.toLowerCase().trim(),
      phone: phone || null,
      country: country || "Brasil",
    });

    return res.status(200).json({
      success: true,
      message: "Perfil atualizado com sucesso!",
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
    console.error("Erro ao atualizar perfil:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao atualizar perfil. Tente novamente.",
    });
  }
};

/**
 * @desc    Alterar senha do usuário
 * @route   PUT /api/users/password
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    // Validar dados
    const { error, value } = passwordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const { currentPassword, newPassword } = value;

    // Buscar usuário
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar senha atual
    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Senha atual incorreta",
      });
    }

    // Atualizar senha
    await user.update({
      password_hash: newPassword, // O hook beforeUpdate do modelo irá criptografar
    });

    return res.status(200).json({
      success: true,
      message: "Senha alterada com sucesso!",
    });
  } catch (err) {
    console.error("Erro ao alterar senha:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao alterar senha. Tente novamente.",
    });
  }
};

module.exports = exports;
