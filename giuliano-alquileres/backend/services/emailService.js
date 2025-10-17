const nodemailer = require("nodemailer");

// ============================================
// CONFIGURAÇÃO DO NODEMAILER
// ============================================
let transporter = null;

// Inicializar apenas se as credenciais de email estiverem configuradas
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465", // true para porta 465, false para outras
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log("✅ Sistema de Email configurado com sucesso");
} else {
  console.warn("⚠️  Sistema de Email não configurado - Adicione credenciais SMTP no .env");
}

// ============================================
// FUNÇÃO AUXILIAR PARA FORMATAR DATA
// ============================================
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
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
// TEMPLATES DE EMAIL
// ============================================

/**
 * Email de Confirmação de Reserva
 */
const sendBookingConfirmation = async (booking, property, user) => {
  if (!transporter) {
    console.warn("⚠️  Email não enviado - Sistema não configurado");
    return { success: false, error: "Email não configurado" };
  }

  const subject = `✅ Reserva Confirmada - ${property.title}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .property-card { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Reserva Confirmada!</h1>
      <p>Sua reserva foi confirmada com sucesso</p>
    </div>

    <div class="content">
      <p>Olá <strong>${booking.guest_name}</strong>,</p>

      <p>Ótimas notícias! Sua reserva foi confirmada e o pagamento foi aprovado.</p>

      <div class="property-card">
        <h2 style="color: #667eea; margin-top: 0;">📍 ${property.title}</h2>
        <p style="color: #666;">${property.address}</p>

        <div style="margin: 20px 0;">
          <div class="detail-row">
            <span><strong>Check-in:</strong></span>
            <span>${formatDate(booking.check_in)} (após 14h)</span>
          </div>
          <div class="detail-row">
            <span><strong>Check-out:</strong></span>
            <span>${formatDate(booking.check_out)} (até 12h)</span>
          </div>
          <div class="detail-row">
            <span><strong>Noites:</strong></span>
            <span>${booking.nights} noite${booking.nights > 1 ? "s" : ""}</span>
          </div>
          <div class="detail-row">
            <span><strong>Hóspedes:</strong></span>
            <span>${booking.guests} pessoa${booking.guests > 1 ? "s" : ""}</span>
          </div>
          <div class="detail-row" style="border-bottom: none; font-size: 18px; color: #667eea;">
            <span><strong>Valor Total:</strong></span>
            <span><strong>${formatCurrency(booking.total_price)}</strong></span>
          </div>
        </div>
      </div>

      <h3>📋 Próximos Passos:</h3>
      <ul>
        <li>✅ Seu pagamento foi aprovado e processado</li>
        <li>📱 O proprietário entrará em contato em breve</li>
        <li>🗓️ Você receberá um lembrete 1 dia antes do check-in</li>
        <li>🔑 Instruções de check-in serão enviadas próximo à data</li>
      </ul>

      ${booking.special_requests ? `
      <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <strong>💬 Suas observações:</strong><br>
        ${booking.special_requests}
      </div>
      ` : ""}

      <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <strong>📞 Precisa de ajuda?</strong><br>
        Entre em contato conosco:
        <ul style="margin: 10px 0;">
          <li>📧 Email: contato@giulianoalquileres.com</li>
          <li>📱 WhatsApp: <a href="https://wa.me/5547989105580">(47) 98910-5580</a></li>
        </ul>
      </div>

      <center>
        <a href="${process.env.FRONTEND_URL}/bookings" class="button">
          Ver Detalhes da Reserva
        </a>
      </center>
    </div>

    <div class="footer">
      <p>Giuliano Alquileres © ${new Date().getFullYear()}</p>
      <p>Este é um email automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Giuliano Alquileres" <${process.env.SMTP_USER}>`,
      to: booking.guest_email,
      subject: subject,
      html: html,
    });

    console.log("✅ Email de confirmação enviado:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erro ao enviar email de confirmação:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Email de Lembrete de Check-in
 */
const sendCheckInReminder = async (booking, property) => {
  if (!transporter) {
    console.warn("⚠️  Email não enviado - Sistema não configurado");
    return { success: false, error: "Email não configurado" };
  }

  const subject = `🔔 Lembrete: Check-in amanhã - ${property.title}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Seu Check-in é Amanhã!</h1>
      <p>Tudo pronto para sua estadia?</p>
    </div>

    <div class="content">
      <p>Olá <strong>${booking.guest_name}</strong>,</p>

      <p>Estamos ansiosos para recebê-lo(a) amanhã em <strong>${property.title}</strong>!</p>

      <div class="info-box">
        <h2 style="color: #f5576c; margin-top: 0;">📍 Informações Importantes</h2>

        <p><strong>🏠 Endereço:</strong><br>${property.address}</p>

        <p><strong>📅 Check-in:</strong><br>${formatDate(booking.check_in)} às 14h</p>

        <p><strong>🔑 Instruções:</strong></p>
        <ul>
          <li>Horário de check-in: a partir das 14h</li>
          <li>Traga um documento com foto</li>
          <li>O proprietário estará disponível para recebê-lo</li>
        </ul>
      </div>

      <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <strong>💡 Dicas para sua estadia:</strong>
        <ul style="margin: 10px 0;">
          <li>Confirme seu horário de chegada com o proprietário</li>
          <li>Verifique a previsão do tempo</li>
          <li>Tenha o endereço salvo no GPS</li>
        </ul>
      </div>

      <p><strong>Alguma dúvida?</strong> Entre em contato com o proprietário ou nossa equipe.</p>
    </div>

    <div class="footer">
      <p>Giuliano Alquileres © ${new Date().getFullYear()}</p>
      <p>Tenha uma ótima estadia! 🌟</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Giuliano Alquileres" <${process.env.SMTP_USER}>`,
      to: booking.guest_email,
      subject: subject,
      html: html,
    });

    console.log("✅ Email de lembrete enviado:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erro ao enviar email de lembrete:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Email de Cancelamento de Reserva
 */
const sendCancellationEmail = async (booking, property, refundAmount) => {
  if (!transporter) {
    console.warn("⚠️  Email não enviado - Sistema não configurado");
    return { success: false, error: "Email não configurado" };
  }

  const subject = `❌ Reserva Cancelada - ${property.title}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Reserva Cancelada</h1>
      <p>Sua reserva foi cancelada conforme solicitado</p>
    </div>

    <div class="content">
      <p>Olá <strong>${booking.guest_name}</strong>,</p>

      <p>Confirmamos o cancelamento da sua reserva em <strong>${property.title}</strong>.</p>

      <div class="info-box">
        <h3 style="margin-top: 0;">📋 Detalhes do Cancelamento</h3>
        <p><strong>Propriedade:</strong> ${property.title}</p>
        <p><strong>Check-in original:</strong> ${formatDate(booking.check_in)}</p>
        <p><strong>Check-out original:</strong> ${formatDate(booking.check_out)}</p>
        <p><strong>Valor pago:</strong> ${formatCurrency(booking.total_price)}</p>
        ${refundAmount > 0 ? `
          <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <strong>💰 Reembolso:</strong> ${formatCurrency(refundAmount)}<br>
            <small>O valor será processado em até 7 dias úteis</small>
          </div>
        ` : `
          <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 15px;">
            <strong>❌ Sem reembolso</strong><br>
            <small>Cancelamento fora do prazo da política de reembolso</small>
          </div>
        `}
      </div>

      <p>Sentiremos sua falta! Esperamos vê-lo(a) em uma próxima oportunidade.</p>

      <p><strong>Precisa de ajuda?</strong> Entre em contato conosco.</p>
    </div>

    <div class="footer">
      <p>Giuliano Alquileres © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Giuliano Alquileres" <${process.env.SMTP_USER}>`,
      to: booking.guest_email,
      subject: subject,
      html: html,
    });

    console.log("✅ Email de cancelamento enviado:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erro ao enviar email de cancelamento:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Email de Boas-vindas para novos usuários
 */
const sendWelcomeEmail = async (user) => {
  if (!transporter) {
    console.warn("⚠️  Email não enviado - Sistema não configurado");
    return { success: false, error: "Email não configurado" };
  }

  const subject = `🎉 Bem-vindo ao Giuliano Alquileres!`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Bem-vindo(a)!</h1>
      <p>Estamos felizes em tê-lo(a) conosco</p>
    </div>

    <div class="content">
      <p>Olá <strong>${user.name}</strong>,</p>

      <p>Sua conta foi criada com sucesso no <strong>Giuliano Alquileres</strong>!</p>

      <p>Agora você pode:</p>
      <ul>
        <li>🏠 Explorar centenas de imóveis incríveis</li>
        <li>📅 Fazer reservas com segurança</li>
        <li>💳 Pagar com PIX, cartão ou boleto</li>
        <li>⭐ Favoritar seus imóveis preferidos</li>
        <li>📊 Gerenciar todas suas reservas em um só lugar</li>
      </ul>

      <center>
        <a href="${process.env.FRONTEND_URL}/properties" class="button">
          Explorar Imóveis
        </a>
      </center>

      <div style="background: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <strong>💡 Dica:</strong> Complete seu perfil para ter uma experiência personalizada!
      </div>
    </div>

    <div class="footer">
      <p>Giuliano Alquileres © ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Giuliano Alquileres" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: subject,
      html: html,
    });

    console.log("✅ Email de boas-vindas enviado:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Erro ao enviar email de boas-vindas:", error);
    return { success: false, error: error.message };
  }
};

// ============================================
// EXPORTAR FUNÇÕES
// ============================================
module.exports = {
  sendBookingConfirmation,
  sendCheckInReminder,
  sendCancellationEmail,
  sendWelcomeEmail,
};
