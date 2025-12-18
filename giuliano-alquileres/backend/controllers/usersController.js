const Joi = require("joi");
const User = require("../models/User");
const { uploadImage, deleteImage } = require("../config/cloudinary");
const { deleteFile } = require("../middleware/upload");

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
        avatar: user.avatar,
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

/**
 * @desc    Upload de avatar do usuário
 * @route   POST /api/users/avatar
 * @access  Private
 */
exports.uploadAvatar = async (req, res) => {
  try {
    // Verificar se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Nenhum arquivo foi enviado",
      });
    }

    console.log("[Avatar] Upload iniciado:", {
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Buscar usuário
    const user = await User.findByPk(req.user.id);
    if (!user) {
      // Deletar arquivo temporário
      if (req.file && req.file.filename) {
        await deleteFile(req.file.filename);
      }

      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    let avatarUrl = null;
    let cloudinaryPublicId = null;
    const fs = require("fs").promises;

    // Verificar se Cloudinary está configurado
    const isCloudinaryConfigured = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );

    if (isCloudinaryConfigured) {
      try {
        console.log("[Avatar] Fazendo upload para Cloudinary...");
        const uploadResult = await uploadImage(
          req.file.path,
          `users/avatars/${user.id}`
        );

        avatarUrl = uploadResult.url;
        cloudinaryPublicId = uploadResult.publicId;

        console.log("[Avatar] ✅ Upload para Cloudinary bem-sucedido");

        // Deletar arquivo local após upload bem-sucedido para Cloudinary
        await fs.unlink(req.file.path).catch((err) =>
          console.warn("[Avatar] Erro ao deletar arquivo local:", err)
        );

        // Se o usuário já tinha um avatar no Cloudinary, deletar
        if (user.avatar && user.avatar.includes("cloudinary.com")) {
          try {
            // Extrair public_id da URL do Cloudinary
            const urlParts = user.avatar.split("/");
            const publicIdWithExt = urlParts.slice(-2).join("/");
            const oldPublicId = publicIdWithExt.split(".")[0];

            await deleteImage(oldPublicId);
            console.log("[Avatar] Avatar antigo deletado do Cloudinary");
          } catch (err) {
            console.warn(
              "[Avatar] Erro ao deletar avatar antigo do Cloudinary:",
              err.message
            );
          }
        }
      } catch (cloudinaryError) {
        console.warn(
          "[Avatar] ⚠️ Erro ao fazer upload para Cloudinary:",
          cloudinaryError.message
        );
        console.log("[Avatar] Usando armazenamento local como fallback");
        // Se falhar, continua para usar armazenamento local
      }
    } else {
      console.log(
        "[Avatar] Cloudinary não configurado, usando armazenamento local"
      );
    }

    // Se não conseguiu fazer upload para Cloudinary, usar URL local
    if (!avatarUrl) {
      const backendUrl =
        process.env.BACKEND_URL ||
        `${req.protocol}://${req.get("host")}`;
      avatarUrl = `${backendUrl}/uploads/properties/${req.file.filename}`;

      console.log("[Avatar] ✅ Usando armazenamento local:", avatarUrl);

      // Se o usuário já tinha um avatar local, deletar
      if (user.avatar && !user.avatar.includes("cloudinary.com")) {
        try {
          const oldFilename = user.avatar.split("/").pop();
          await deleteFile(oldFilename);
          console.log("[Avatar] Avatar antigo deletado do armazenamento local");
        } catch (err) {
          console.warn(
            "[Avatar] Erro ao deletar avatar antigo local:",
            err.message
          );
        }
      }
    }

    // Atualizar avatar do usuário
    await user.update({
      avatar: avatarUrl,
    });

    console.log("[Avatar] ✅ Avatar atualizado no banco de dados");

    return res.status(200).json({
      success: true,
      message: "Avatar atualizado com sucesso!",
      avatarUrl: avatarUrl,
    });
  } catch (err) {
    console.error("[Avatar] ❌ Erro ao fazer upload de avatar:", err);

    // Tentar deletar arquivo temporário em caso de erro
    if (req.file && req.file.filename) {
      try {
        await deleteFile(req.file.filename);
      } catch (deleteErr) {
        console.error(
          "[Avatar] Erro ao deletar arquivo temporário:",
          deleteErr
        );
      }
    }

    return res.status(500).json({
      success: false,
      error: "Erro ao fazer upload do avatar. Tente novamente.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

/**
 * @desc    Deletar avatar do usuário
 * @route   DELETE /api/users/avatar
 * @access  Private
 */
exports.deleteAvatar = async (req, res) => {
  try {
    // Buscar usuário
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Usuário não encontrado",
      });
    }

    // Verificar se usuário tem avatar
    if (!user.avatar) {
      return res.status(400).json({
        success: false,
        error: "Usuário não possui avatar",
      });
    }

    console.log("[Avatar] Deletando avatar:", user.avatar);

    // Verificar se é Cloudinary ou armazenamento local
    if (user.avatar.includes("cloudinary.com")) {
      // Deletar do Cloudinary
      try {
        const urlParts = user.avatar.split("/");
        const publicIdWithExt = urlParts.slice(-2).join("/");
        const publicId = publicIdWithExt.split(".")[0];

        await deleteImage(publicId);
        console.log("[Avatar] ✅ Avatar deletado do Cloudinary");
      } catch (err) {
        console.warn(
          "[Avatar] Erro ao deletar avatar do Cloudinary:",
          err.message
        );
      }
    } else {
      // Deletar do armazenamento local
      try {
        const filename = user.avatar.split("/").pop();
        await deleteFile(filename);
        console.log("[Avatar] ✅ Avatar deletado do armazenamento local");
      } catch (err) {
        console.warn(
          "[Avatar] Erro ao deletar avatar local:",
          err.message
        );
      }
    }

    // Remover avatar do banco de dados
    await user.update({
      avatar: null,
    });

    return res.status(200).json({
      success: true,
      message: "Avatar removido com sucesso!",
    });
  } catch (err) {
    console.error("[Avatar] Erro ao deletar avatar:", err);
    return res.status(500).json({
      success: false,
      error: "Erro ao deletar avatar. Tente novamente.",
    });
  }
};

module.exports = exports;
