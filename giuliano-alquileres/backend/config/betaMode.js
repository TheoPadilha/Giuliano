/**
 * Configuração do Modo Beta
 *
 * Sistema de reservas sem pagamento online para versão Beta pública.
 * Mantém toda a funcionalidade de reservas e bloqueio de datas,
 * mas desativa a integração com Mercado Pago.
 *
 * Para ativar: BETA_MODE=true no .env
 * Para desativar: BETA_MODE=false ou remover do .env
 */

const BETA_MODE = process.env.BETA_MODE === 'true';

const betaConfig = {
  // Status do modo Beta
  enabled: BETA_MODE,

  // Configurações de reserva no modo Beta
  booking: {
    // Status padrão das reservas criadas
    defaultStatus: 'pending', // 'pending', 'confirmed', 'cancelled'

    // Mensagem de sucesso ao criar reserva
    successMessage: 'Reserva solicitada com sucesso! O proprietário entrará em contato para confirmar.',

    // Aviso sobre o modo Beta
    betaNotice: 'Versão Beta – Reservas sem pagamento online.',

    // Bloquear datas automaticamente ao criar reserva
    autoBlockDates: true,

    // Liberar datas automaticamente ao cancelar
    autoUnblockOnCancel: true,

    // Permitir múltiplas reservas pendentes para o mesmo período
    allowMultiplePending: false,
  },

  // Configurações de pagamento no modo Beta
  payment: {
    // Desabilitar completamente o Mercado Pago
    mercadoPagoEnabled: false,

    // Exibir botão de pagamento (mesmo desabilitado)
    showPaymentButton: false,

    // Mensagem quando usuário tentar acessar página de pagamento
    paymentDisabledMessage: 'Pagamentos online estarão disponíveis em breve. O proprietário entrará em contato para combinar a forma de pagamento.',
  },

  // Configurações de notificações
  notifications: {
    // Notificar proprietário sobre nova reserva
    notifyOwnerOnNewBooking: true,

    // Notificar hóspede sobre confirmação
    notifyGuestOnConfirmation: true,

    // Notificar hóspede sobre cancelamento
    notifyGuestOnCancellation: true,

    // Template de e-mail para nova reserva (proprietário)
    ownerEmailTemplate: {
      subject: '[Nova Reserva] {propertyTitle}',
      message: 'Você recebeu uma nova solicitação de reserva para {propertyTitle}.\n\nHóspede: {guestName}\nCheck-in: {checkIn}\nCheck-out: {checkOut}\nHóspedes: {guests}\n\nAcesse o painel administrativo para confirmar ou recusar a reserva.',
    },

    // Template de e-mail para hóspede
    guestEmailTemplate: {
      subject: 'Solicitação de Reserva Recebida - {propertyTitle}',
      message: 'Olá {guestName},\n\nSua solicitação de reserva para {propertyTitle} foi recebida.\n\nDetalhes:\nCheck-in: {checkIn}\nCheck-out: {checkOut}\nHóspedes: {guests}\n\nO proprietário entrará em contato em breve para confirmar.\n\nObrigado!',
    },
  },

  // UI/UX no modo Beta
  ui: {
    // Mostrar badge "Beta" no site
    showBetaBadge: true,

    // Posição do badge: 'header', 'footer', 'both'
    badgePosition: 'header',

    // Cor do badge
    badgeColor: '#FF385C', // Vermelho Airbnb

    // Texto do badge
    badgeText: 'BETA',

    // Tooltip do badge
    badgeTooltip: 'Versão Beta – Reservas sem pagamento online',
  },

  // Recursos disponíveis no modo Beta
  features: {
    // Permitir criação de reservas
    createBooking: true,

    // Permitir cancelamento pelo hóspede
    guestCanCancel: true,

    // Permitir cancelamento pelo proprietário
    ownerCanCancel: true,

    // Permitir confirmação pelo proprietário
    ownerCanConfirm: true,

    // Mostrar preço total (mesmo sem pagamento)
    showTotalPrice: true,

    // Permitir reviews (após reserva confirmada)
    enableReviews: false, // Desabilitado até sair do Beta
  },

  // Logs e debug
  debug: {
    // Logar ações do modo Beta
    logBetaActions: true,

    // Prefixo dos logs
    logPrefix: '[BETA MODE]',
  },
};

/**
 * Verifica se o modo Beta está ativo
 */
const isBetaMode = () => {
  return betaConfig.enabled;
};

/**
 * Obtém configuração específica do modo Beta
 */
const getBetaConfig = (key) => {
  if (!key) return betaConfig;

  const keys = key.split('.');
  let value = betaConfig;

  for (const k of keys) {
    value = value[k];
    if (value === undefined) return null;
  }

  return value;
};

/**
 * Log customizado para modo Beta
 */
const betaLog = (message, data = null) => {
  if (betaConfig.debug.logBetaActions) {
    const timestamp = new Date().toISOString();
    console.log(`${betaConfig.debug.logPrefix} [${timestamp}] ${message}`);
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  }
};

/**
 * Middleware para rotas que devem ser desabilitadas no modo Beta
 */
const requirePaymentEnabled = (req, res, next) => {
  if (isBetaMode() && !betaConfig.payment.mercadoPagoEnabled) {
    return res.status(503).json({
      error: 'Recurso indisponível no modo Beta',
      message: betaConfig.payment.paymentDisabledMessage,
      betaMode: true,
    });
  }
  next();
};

/**
 * Middleware para adicionar informação do modo Beta nas respostas
 */
const addBetaInfo = (req, res, next) => {
  // Sobrescrever res.json para adicionar info Beta
  const originalJson = res.json.bind(res);

  res.json = (data) => {
    if (isBetaMode() && typeof data === 'object' && data !== null) {
      data._betaMode = {
        enabled: true,
        notice: betaConfig.booking.betaNotice,
        paymentEnabled: betaConfig.payment.mercadoPagoEnabled,
      };
    }
    return originalJson(data);
  };

  next();
};

module.exports = {
  betaConfig,
  isBetaMode,
  getBetaConfig,
  betaLog,
  requirePaymentEnabled,
  addBetaInfo,
};
