const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Verificar se o token JWT é válido
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token de acesso requerido'
      });
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso inválido'
      });
    }

    // Verificar e decodificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário atual
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'Usuário não encontrado ou inativo'
      });
    }

    // Adicionar usuário na requisição
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }

    console.error('Erro no middleware de auth:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

// Verificar se o usuário é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Acesso negado. Apenas administradores.'
    });
  }
  next();
};

// Verificar se o usuário é o próprio ou admin
const requireOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = parseInt(req.params.userId || req.params.id);
  const currentUserId = req.user.id;
  const isAdmin = req.user.role === 'admin';

  if (currentUserId !== requestedUserId && !isAdmin) {
    return res.status(403).json({
      error: 'Acesso negado. Você só pode acessar seus próprios dados.'
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

    const token = authHeader.startsWith('Bearer ') 
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
  requireOwnerOrAdmin,
  optionalAuth
};