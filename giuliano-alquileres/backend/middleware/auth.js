const jwt = require("jsonwebtoken");
const { User, Property } = require("../models");

// Verificar se o token JWT é válido
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token de acesso requerido",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: "Token de acesso inválido",
      });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário atual
    const user = await User.findByPk(decoded.id);

    // --- ALTERAÇÃO APLICADA AQUI ---
    // A verificação agora é apenas se o usuário ainda existe no banco.
    // A lógica de se ele pode ou não usar o sistema já foi tratada no login.
    if (!user) {
      return res.status(401).json({
        error: "Usuário associado a este token não foi encontrado.",
      });
    }

    // Adicionar usuário na requisição
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Token inválido",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expirado",
      });
    }

    console.error("Erro no middleware de auth:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
    });
  }
};

const requireAdminMaster = (req, res, next) => {
  // O middleware 'verifyToken' já deve ter sido executado antes deste,
  // então podemos confiar que 'req.user' existe e é válido.
  if (req.user.role !== "admin_master") {
    return res.status(403).json({
      error: "Acesso negado. Apenas para administradores do sistema.",
    });
  }
  next();
};

// Verificar se o usuário é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Acesso negado. Apenas administradores.",
    });
  }
  next();
};

// Verificar se o usuário é o próprio ou admin
const requireOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = parseInt(req.params.userId || req.params.id);
  const currentUserId = req.user.id;
  const isAdmin = req.user.role === "admin";

  if (currentUserId !== requestedUserId && !isAdmin) {
    return res.status(403).json({
      error: "Acesso negado. Você só pode acessar seus próprios dados.",
    });
  }
  next();
};

// Middleware opcional - não falha se não tiver token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      req.user = null;
      return next();
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    req.user = user && user.is_active ? user : null;
    next();
  } catch (error) {
    // Em caso de erro, continuar sem usuário autenticado
    req.user = null;
    next();
  }
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireAdminMaster,
  requireOwnerOrAdmin,
  optionalAuth,
};

// Verificar se o usuário é o proprietário do imóvel ou um admin_master
const requirePropertyOwnerOrAdminMaster = async (req, res, next) => {
  try {
    const propertyUuid = req.params.uuid;
    const userId = req.user.id; // ID do usuário logado
    const userRole = req.user.role; // Papel do usuário logado

    // Se o usuário é um admin_master, ele tem acesso total
    if (userRole === "admin_master") {
      return next();
    }

    // Se não for admin_master, verificar se é o proprietário do imóvel
    const property = await Property.findOne({ where: { uuid: propertyUuid } });

    if (!property) {
      return res.status(404).json({ error: "Imóvel não encontrado." });
    }

    if (property.user_id !== userId) {
      return res
        .status(403)
        .json({
          error: "Acesso negado. Você não é o proprietário deste imóvel.",
        });
    }

    // Se for o proprietário, permite a ação
    next();
  } catch (error) {
    console.error(
      "Erro no middleware requirePropertyOwnerOrAdminMaster:",
      error
    );
    return res
      .status(500)
      .json({
        error: "Erro interno do servidor ao verificar permissões do imóvel.",
      });
  }
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireAdminMaster,
  requireOwnerOrAdmin,
  optionalAuth,
  requirePropertyOwnerOrAdminMaster,
};
