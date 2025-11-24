const axios = require("axios");

// ============================================
// CONFIGURAÇÃO DO ZAPI
// ============================================
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const ZAPI_INSTANCE = process.env.ZAPI_INSTANCE;
const ZAPI_CLIENT_TOKEN = process.env.ZAPI_CLIENT_TOKEN;
const ZAPI_PHONE = process.env.ZAPI_PHONE || "5547989105580"; // Número padrão

const isConfigured = () => {
  return !!(ZAPI_TOKEN && ZAPI_INSTANCE && ZAPI_CLIENT_TOKEN);
};

if (isConfigured()) {
  console.log("✅ Sistema ZAPI (WhatsApp) configurado com sucesso");
} else {
  console.warn("⚠️  Sistema ZAPI não configurado - Adicione ZAPI_TOKEN, ZAPI_INSTANCE e ZAPI_CLIENT_TOKEN no .env");
}

// ============================================
// FUNÇÃO AUXILIAR PARA FORMATAR DATA
// ============================================
const formatDate = (date) => {
  // Adiciona horário meio-dia para evitar problemas de timezone
  const dateWithTime = date.includes('T') ? date : `${date}T12:00:00`;
  return new Date(dateWithTime).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// ============================================
// FUNÇÕES DE ENVIO
// ============================================

/**
 * Enviar mensagem via ZAPI
 */
const sendMessage = async (phone, message) => {
  if (!isConfigured()) {
    console.warn("⚠️  Mensagem WhatsApp não enviada - Sistema não configurado");
    return { success: false, error: "ZAPI não configurado" };
  }

  try {
    const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE}/token/${ZAPI_TOKEN}/send-text`;

    // Remove caracteres não numéricos
    let cleanPhone = phone.replace(/\D/g, '');

    // Adiciona código do Brasil (55) se não começar com 55
    if (!cleanPhone.startsWith('55')) {
      cleanPhone = '55' + cleanPhone;
    }

    const response = await axios.post(
      url,
      {
        phone: cleanPhone,
        message: message,
      },
      {
        headers: {
          'Client-Token': ZAPI_CLIENT_TOKEN,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log(`✅ Mensagem WhatsApp enviada para ${cleanPhone}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("❌ Erro ao enviar WhatsApp via ZAPI:", error.message);
    if (error.response) {
      console.error("   Detalhes:", error.response.data);
    }
    return { success: false, error: error.message };
  }
};

/**
 * Notificar nova reserva ao admin
 */
const notifyNewBooking = async (booking, property, user) => {
  if (!isConfigured()) {
    console.warn("⚠️  Notificação WhatsApp não enviada - Sistema não configurado");
    return { success: false, error: "ZAPI não configurado" };
  }

  // Verificar se é solicitação (pending) ou confirmação (confirmed)
  const isPending = booking.status === 'pending';
  const title = isPending
    ? '📩 *NOVA SOLICITAÇÃO DE RESERVA!*\n_Aguardando sua confirmação_'
    : '✅ *RESERVA CONFIRMADA!*';

  const message = `
${title}

👤 *Hóspede:* ${booking.guest_name}
📧 *Email:* ${booking.guest_email}
📞 *Telefone:* ${booking.guest_phone}

🏠 *Imóvel:* ${property.title}
📍 *Localização:* ${property.address}

📅 *Check-in:* ${formatDate(booking.check_in)}
📅 *Check-out:* ${formatDate(booking.check_out)}
🌙 *Noites:* ${booking.nights}

👥 *Adultos:* ${booking.adults}
👶 *Crianças:* ${booking.children}
🍼 *Bebês:* ${booking.infants}
🐾 *Pets:* ${booking.pets}

💰 *Valor Total:* ${formatCurrency(booking.total_price)}
💳 *Status Pagamento:* ${booking.payment_status === 'pending' ? 'Pendente' : booking.payment_status === 'paid' ? 'Pago' : 'Outros'}

🔗 *Código da Reserva:* #${booking.id}

🌐 *Site:* https://ziguealuga.com
  `.trim();

  return await sendMessage(ZAPI_PHONE, message);
};

/**
 * Enviar confirmação ao hóspede
 */
const sendBookingConfirmation = async (booking, property) => {
  if (!isConfigured()) {
    console.warn("⚠️  Confirmação WhatsApp não enviada - Sistema não configurado");
    return { success: false, error: "ZAPI não configurado" };
  }

  // Só envia se o hóspede tiver telefone
  if (!booking.guest_phone) {
    console.warn("⚠️  Hóspede sem telefone cadastrado");
    return { success: false, error: "Telefone não informado" };
  }

  // Verificar se é solicitação (pending) ou confirmação (confirmed)
  const isPending = booking.status === 'pending';

  const title = isPending
    ? '📩 *Solicitação de Reserva Recebida!*\n_Aguardando confirmação do proprietário_'
    : '✅ *Sua reserva foi CONFIRMADA!*';

  const additionalInfo = isPending
    ? 'Você receberá uma notificação assim que o proprietário confirmar sua reserva.'
    : 'Em breve entraremos em contato com mais detalhes sobre sua estadia.';

  const message = `
Olá *${booking.guest_name}*! 👋

${title}

🏠 *Imóvel:* ${property.title}
📍 ${property.address}

📅 *Check-in:* ${formatDate(booking.check_in)} (após 14h)
📅 *Check-out:* ${formatDate(booking.check_out)} (até 12h)
🌙 *${booking.nights} noite${booking.nights > 1 ? 's' : ''}*

💰 *Valor Total:* ${formatCurrency(booking.total_price)}

📝 *Código da Reserva:* #${booking.id}

${additionalInfo}

🌐 *Site:* https://ziguealuga.com

_Ziguealuga - Sua melhor experiência em aluguéis_
  `.trim();

  return await sendMessage(booking.guest_phone, message);
};

module.exports = {
  sendMessage,
  notifyNewBooking,
  sendBookingConfirmation,
  isConfigured,
};
