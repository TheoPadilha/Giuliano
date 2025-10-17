const { Payment, Booking, Property, User } = require("../models");
const Joi = require("joi");
const { sendBookingConfirmation } = require("../services/emailService");

// ============================================
// CONFIGURAÇÃO DO MERCADO PAGO
// ============================================
let preference = null;
let mpPayment = null;

// Inicializar apenas se as credenciais estiverem disponíveis
if (process.env.MERCADOPAGO_ACCESS_TOKEN && process.env.MERCADOPAGO_ACCESS_TOKEN !== 'TEST-your-access-token-here') {
  const { MercadoPagoConfig, Preference, Payment: MPPayment } = require("mercadopago");

  const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    options: { timeout: 5000 },
  });

  preference = new Preference(client);
  mpPayment = new MPPayment(client);

  console.log("✅ Mercado Pago configurado com sucesso");
} else {
  console.warn("⚠️  Mercado Pago não configurado - Adicione MERCADOPAGO_ACCESS_TOKEN no .env");
}

// ============================================
// SCHEMAS DE VALIDAÇÃO
// ============================================
const createPaymentSchema = Joi.object({
  booking_id: Joi.number().integer().required(),
  payment_method: Joi.string().valid("pix", "credit_card", "debit_card", "boleto").optional(),
});

// ============================================
// CRIAR PREFERÊNCIA DE PAGAMENTO
// ============================================
const createPaymentPreference = async (req, res) => {
  try {
    // Verificar se o Mercado Pago está configurado
    if (!preference) {
      return res.status(503).json({
        error: "Sistema de pagamento não configurado",
        details: "Configure as credenciais do Mercado Pago no servidor",
      });
    }

    const { error, value } = createPaymentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const { booking_id } = value;
    const userId = req.user.id;

    // Buscar reserva com dados completos
    const booking = await Booking.findOne({
      where: { id: booking_id, user_id: userId },
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "title", "address", "city_id"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        error: "Reserva não encontrada ou você não tem permissão para acessá-la",
      });
    }

    // Verificar se já existe um pagamento aprovado para esta reserva
    const existingPayment = await Payment.findOne({
      where: {
        booking_id: booking_id,
        status: "approved",
      },
    });

    if (existingPayment) {
      return res.status(400).json({
        error: "Esta reserva já possui um pagamento aprovado",
      });
    }

    // Criar preferência de pagamento no Mercado Pago
    const preferenceData = {
      items: [
        {
          id: `booking-${booking.id}`,
          title: `Reserva: ${booking.property.title}`,
          description: `Check-in: ${booking.check_in} | Check-out: ${booking.check_out} | ${booking.nights} noites`,
          category_id: "real_estate",
          quantity: 1,
          unit_price: parseFloat(booking.total_price),
        },
      ],
      payer: {
        name: booking.guest_name,
        email: booking.guest_email,
        phone: {
          number: booking.guest_phone || "",
        },
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment/success`,
        failure: `${process.env.FRONTEND_URL}/payment/failure`,
        pending: `${process.env.FRONTEND_URL}/payment/pending`,
      },
      auto_return: "approved",
      notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      external_reference: `booking-${booking.id}`,
      statement_descriptor: "GIULIANO ALQUILERES",
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
    };

    const mpPreference = await preference.create({ body: preferenceData });

    // Criar registro de pagamento no banco
    const payment = await Payment.create({
      booking_id: booking.id,
      user_id: userId,
      preference_id: mpPreference.id,
      amount: booking.total_price,
      currency: "BRL",
      status: "pending",
      payer_email: booking.guest_email,
      payer_name: booking.guest_name,
      mp_response: mpPreference,
    });

    res.status(201).json({
      message: "Preferência de pagamento criada com sucesso",
      payment: {
        id: payment.uuid,
        preference_id: mpPreference.id,
        init_point: mpPreference.init_point, // URL para redirecionar o usuário
        sandbox_init_point: mpPreference.sandbox_init_point, // URL de teste
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error("❌ Erro ao criar preferência de pagamento:", error);
    res.status(500).json({
      error: "Erro ao processar pagamento",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ============================================
// WEBHOOK DO MERCADO PAGO
// ============================================
const handleWebhook = async (req, res) => {
  try {
    const { type, data, action } = req.body;

    console.log("📥 Webhook recebido:", { type, action, data });

    // Responder imediatamente para o MP
    res.status(200).send("OK");

    // Processar apenas notificações de pagamento
    if (type === "payment" || action === "payment.created" || action === "payment.updated") {
      if (!mpPayment) {
        console.error("❌ Mercado Pago não configurado para processar webhook");
        return;
      }

      const paymentId = data.id;

      // Buscar informações do pagamento no Mercado Pago
      const mpPaymentData = await mpPayment.get({ id: paymentId });

      console.log("💳 Dados do pagamento:", mpPaymentData);

      // Extrair booking_id do external_reference
      const externalReference = mpPaymentData.external_reference; // "booking-123"
      const bookingId = parseInt(externalReference.split("-")[1]);

      if (!bookingId) {
        console.error("❌ Booking ID não encontrado no external_reference");
        return;
      }

      // Buscar ou criar registro de pagamento
      let payment = await Payment.findOne({
        where: { payment_id: paymentId.toString() },
      });

      if (!payment) {
        // Buscar pelo booking_id
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
          console.error("❌ Reserva não encontrada:", bookingId);
          return;
        }

        payment = await Payment.create({
          booking_id: bookingId,
          user_id: booking.user_id,
          payment_id: paymentId.toString(),
          merchant_order_id: mpPaymentData.order?.id?.toString(),
          amount: mpPaymentData.transaction_amount,
          currency: mpPaymentData.currency_id,
          status: mpPaymentData.status,
          status_detail: mpPaymentData.status_detail,
          payment_method: mpPaymentData.payment_method_id,
          payment_type: mpPaymentData.payment_type_id,
          payer_email: mpPaymentData.payer?.email,
          payer_name: `${mpPaymentData.payer?.first_name || ""} ${mpPaymentData.payer?.last_name || ""}`.trim(),
          payer_document: mpPaymentData.payer?.identification?.number,
          mp_response: mpPaymentData,
        });
      } else {
        // Atualizar pagamento existente
        await payment.update({
          status: mpPaymentData.status,
          status_detail: mpPaymentData.status_detail,
          payment_method: mpPaymentData.payment_method_id,
          payment_type: mpPaymentData.payment_type_id,
          mp_response: mpPaymentData,
          approved_at: mpPaymentData.status === "approved" ? new Date() : payment.approved_at,
        });
      }

      // Atualizar status da reserva baseado no pagamento
      const booking = await Booking.findByPk(bookingId, {
        include: [
          {
            model: Property,
            as: "property",
          },
          {
            model: User,
            as: "guest",
          },
        ],
      });

      if (booking) {
        if (mpPaymentData.status === "approved") {
          await booking.update({
            payment_status: "paid",
            status: "confirmed",
          });
          console.log("✅ Reserva confirmada! Booking ID:", bookingId);

          // Enviar email de confirmação
          try {
            await sendBookingConfirmation(booking, booking.property, booking.guest);
            console.log("📧 Email de confirmação enviado");
          } catch (emailError) {
            console.error("❌ Erro ao enviar email:", emailError);
            // Não falhar o webhook por causa do email
          }
        } else if (mpPaymentData.status === "rejected" || mpPaymentData.status === "cancelled") {
          await booking.update({
            payment_status: "failed",
            status: "cancelled",
          });
          console.log("❌ Pagamento rejeitado/cancelado. Booking ID:", bookingId);
        } else if (mpPaymentData.status === "pending" || mpPaymentData.status === "in_process") {
          await booking.update({
            payment_status: "pending",
          });
          console.log("⏳ Pagamento pendente. Booking ID:", bookingId);
        }
      }
    }
  } catch (error) {
    console.error("❌ Erro ao processar webhook:", error);
    // Não retornar erro para não fazer o MP reenviar
  }
};

// ============================================
// LISTAR PAGAMENTOS DO USUÁRIO
// ============================================
const getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: payments } = await Payment.findAndCountAll({
      where: { user_id: userId },
      include: [
        {
          model: Booking,
          as: "booking",
          include: [
            {
              model: Property,
              as: "property",
              attributes: ["id", "uuid", "title", "address"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("❌ Erro ao buscar pagamentos:", error);
    res.status(500).json({
      error: "Erro ao buscar pagamentos",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ============================================
// BUSCAR DETALHES DE UM PAGAMENTO
// ============================================
const getPaymentByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const payment = await Payment.findOne({
      where: { uuid },
      include: [
        {
          model: Booking,
          as: "booking",
          include: [
            {
              model: Property,
              as: "property",
              attributes: ["id", "uuid", "title", "address", "user_id"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({ error: "Pagamento não encontrado" });
    }

    // Verificar permissões
    const isOwner = payment.user_id === userId;
    const isPropertyOwner = payment.booking.property.user_id === userId;
    const isAdmin = ["admin", "admin_master"].includes(userRole);

    if (!isOwner && !isPropertyOwner && !isAdmin) {
      return res.status(403).json({ error: "Sem permissão para acessar este pagamento" });
    }

    res.json({ payment });
  } catch (error) {
    console.error("❌ Erro ao buscar pagamento:", error);
    res.status(500).json({
      error: "Erro ao buscar pagamento",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// ============================================
// EXPORTAR FUNÇÕES
// ============================================
module.exports = {
  createPaymentPreference,
  handleWebhook,
  getMyPayments,
  getPaymentByUuid,
};
