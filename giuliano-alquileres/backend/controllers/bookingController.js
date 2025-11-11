const {
  Booking,
  Property,
  User,
  PropertyAvailability,
  City,
} = require("../models");
const Joi = require("joi");
const logger = require("../utils/logger");
const { isBetaMode, getBetaConfig, betaLog } = require("../config/betaMode");
const { sendBookingConfirmation } = require("../services/emailService");

// Esquema de validação para criar reserva
const createBookingSchema = Joi.object({
  property_id: Joi.number().integer().required(),
  check_in: Joi.date().iso().required(),
  check_out: Joi.date().iso().greater(Joi.ref("check_in")).required(),
  guests: Joi.number().integer().min(1).max(20).required(),
  guest_name: Joi.string().min(2).max(100).required(),
  guest_email: Joi.string().email().required(),
  guest_phone: Joi.string()
    .pattern(/^\+?\d{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Telefone inválido. Use apenas números (10-15 dígitos)"
    }),
  guest_document: Joi.string().min(11).max(20).required(),
  special_requests: Joi.string().max(500).optional().allow(""),
  payment_method: Joi.string().valid("credit_card", "debit_card", "pix", "bank_transfer").optional(),
  rooms_data: Joi.string().optional().allow(""),
});

// Criar nova reserva
const createBooking = async (req, res) => {
  try {
    console.log("[Booking] Dados recebidos:", req.body);
    console.log("[Booking] Usuário autenticado:", req.user?.id, req.user?.email);

    // 1. Validar dados
    const { error, value } = createBookingSchema.validate(req.body);
    if (error) {
      console.log("[Booking] Erro de validação:", error.details[0].message);
      return res.status(400).json({
        error: "Dados inválidos",
        details: error.details[0].message,
      });
    }

    const {
      property_id,
      check_in,
      check_out,
      guests,
      guest_name,
      guest_email,
      guest_phone,
      guest_document,
      special_requests,
      payment_method,
      rooms_data,
    } = value;

    console.log("[Booking] Dados validados:", { property_id, check_in, check_out, guests });
    logger.info("Nova tentativa de reserva", {
      property_id,
      check_in,
      check_out,
    });

    // 2. Verificar se a propriedade existe
    console.log("[Booking] Buscando propriedade ID:", property_id);
    const property = await Property.findByPk(property_id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!property) {
      console.log("[Booking] Propriedade não encontrada!");
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }
    console.log("[Booking] Propriedade encontrada:", property.title);

    // 3. Verificar se a propriedade está disponível para reserva
    if (property.status !== "available") {
      return res.status(400).json({
        error: "Propriedade não está disponível para reserva",
      });
    }

    // 4. Verificar número de hóspedes
    if (guests > property.max_guests) {
      return res.status(400).json({
        error: `Número máximo de hóspedes é ${property.max_guests}`,
      });
    }

    // 5. Verificar disponibilidade (sem reservas conflitantes)
    console.log("[Booking] Verificando disponibilidade das datas...");
    const isAvailable = await Booking.checkAvailability(
      property_id,
      check_in,
      check_out
    );

    if (!isAvailable) {
      logger.warn("Tentativa de reserva em datas já ocupadas", {
        property_id,
        check_in,
        check_out,
      });
      console.log("[Booking] ❌ Datas não disponíveis - Há outra reserva neste período");
      return res.status(409).json({
        error: "Datas não disponíveis",
        message: "Este imóvel já possui uma reserva (pendente ou confirmada) neste período. Por favor, escolha outras datas.",
        details: {
          property_id,
          requested_check_in: check_in,
          requested_check_out: check_out,
        }
      });
    }

    console.log("[Booking] ✅ Datas disponíveis");

    // 6. Verificar bloqueios manuais
    const isBlocked = await PropertyAvailability.isBlocked(
      property_id,
      check_in,
      check_out
    );

    if (isBlocked) {
      logger.warn("Tentativa de reserva em datas bloqueadas", {
        property_id,
        check_in,
        check_out,
      });
      return res.status(409).json({
        error: "Propriedade não está disponível para estas datas",
      });
    }

    // 7. Calcular valores
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    // Preço base (você pode adicionar lógica de preço dinâmico aqui)
    const pricePerNight = property.price_per_night;
    const totalPrice = pricePerNight * nights;

    // Taxas (10% de taxa de serviço)
    const serviceFee = totalPrice * 0.1;
    const cleaningFee = 50; // Taxa fixa de limpeza
    const finalPrice = totalPrice + serviceFee + cleaningFee;

    // 8. Criar a reserva
    const bookingStatus = isBetaMode()
      ? getBetaConfig("booking.defaultStatus")
      : "pending";

    console.log("[Booking] Criando reserva com status:", bookingStatus);
    console.log("[Booking] Valores calculados:", {
      nights,
      pricePerNight,
      totalPrice,
      serviceFee,
      cleaningFee,
      finalPrice
    });

    const bookingData = {
      property_id,
      user_id: req.user.id, // ID do usuário logado
      check_in,
      check_out,
      guests,
      nights,
      price_per_night: pricePerNight,
      total_price: totalPrice,
      cleaning_fee: cleaningFee,
      service_fee: serviceFee,
      final_price: finalPrice,
      guest_name,
      guest_email,
      guest_phone,
      guest_document,
      special_requests,
      status: bookingStatus,
    };

    console.log("[Booking] Dados da reserva a ser criada:", bookingData);

    const booking = await Booking.create(bookingData);

    console.log("[Booking] Reserva criada com ID:", booking.id);
    logger.info("Reserva criada com sucesso", { booking_id: booking.id });

    // 9. Modo Beta: Bloquear datas automaticamente no calendário
    if (isBetaMode() && getBetaConfig("booking.autoBlockDates")) {
      try {
        await PropertyAvailability.create({
          property_id,
          start_date: check_in,
          end_date: check_out,
          reason: `Reserva #${booking.id} - ${guest_name}`,
          is_blocked: true,
          booking_id: booking.id, // Associar bloqueio à reserva
        });

        betaLog("Datas bloqueadas automaticamente", {
          booking_id: booking.id,
          property_id,
          check_in,
          check_out,
        });
      } catch (blockError) {
        logger.error("Erro ao bloquear datas no modo Beta", {
          error: blockError.message,
          booking_id: booking.id,
        });
        // Não falhar a reserva por causa do bloqueio
      }
    }

    // 10. Retornar reserva criada
    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "uuid", "title", "city_id"],
          include: [
            {
              model: City,
              as: "city",
              attributes: ["name"],
            },
          ],
        },
        {
          model: User,
          as: "guest",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Mensagem de sucesso baseada no modo
    const successMessage = isBetaMode()
      ? getBetaConfig("booking.successMessage")
      : "Reserva criada com sucesso!";

    const response = {
      message: successMessage,
      booking: createdBooking,
    };

    // Adicionar informações extras no modo Beta
    if (isBetaMode()) {
      response.betaMode = true;
      response.betaNotice = getBetaConfig("booking.betaNotice");
      response.paymentRequired = false;
    }

    res.status(201).json(response);
  } catch (error) {
    console.error("[Booking] Erro ao criar reserva:", error);
    console.error("[Booking] Stack trace:", error.stack);
    console.error("[Booking] Nome do erro:", error.name);
    console.error("[Booking] Mensagem:", error.message);

    logger.error("Erro ao criar reserva", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : undefined,
    });
  }
};

// Listar reservas do usuário
const getUserBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const where = { user_id: req.user.id };

    if (status) {
      where.status = status;
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "uuid", "title", "address", "city_id"],
          include: [
            {
              model: City,
              as: "city",
              attributes: ["name", "state"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({ bookings });
  } catch (error) {
    logger.error("Erro ao listar reservas", { error: error.message });
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Obter detalhes de uma reserva
const getBookingById = async (req, res) => {
  try {
    const { uuid } = req.params;

    const booking = await Booking.findOne({
      where: { uuid },
      include: [
        {
          model: Property,
          as: "property",
          include: [
            {
              model: City,
              as: "city",
            },
            {
              model: User,
              as: "owner",
              attributes: ["id", "name", "email", "phone"],
            },
          ],
        },
        {
          model: User,
          as: "guest",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Verificar permissão (só o hóspede ou proprietário podem ver)
    const isGuest = booking.user_id === req.user.id;
    const isOwner = booking.property.user_id === req.user.id;
    const isAdmin = req.user.role === "admin_master";

    if (!isGuest && !isOwner && !isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    res.json({ booking });
  } catch (error) {
    logger.error("Erro ao buscar reserva", { error: error.message });
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Cancelar reserva
const cancelBooking = async (req, res) => {
  try {
    const { uuid } = req.params;
    const reason = req.body?.reason || "Cancelamento solicitado";

    console.log("[Booking] Cancelando reserva UUID:", uuid);
    console.log("[Booking] Motivo:", reason);

    const booking = await Booking.findOne({ where: { uuid } });

    if (!booking) {
      console.log("[Booking] Reserva não encontrada!");
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    console.log("[Booking] Reserva encontrada - Status:", booking.status);

    // Verificar se pode cancelar
    if (!booking.canBeCancelled()) {
      console.log("[Booking] Reserva não pode ser cancelada!");
      return res.status(400).json({
        error: "Esta reserva não pode ser cancelada",
      });
    }

    // Verificar permissão
    const isGuest = booking.user_id === req.user.id;
    const isOwner =
      (await Property.findByPk(booking.property_id)).user_id === req.user.id;
    const isAdmin = req.user.role === "admin_master";

    console.log("[Booking] Verificação de permissão - isGuest:", isGuest, "isOwner:", isOwner, "isAdmin:", isAdmin);

    if (!isGuest && !isOwner && !isAdmin) {
      console.log("[Booking] Acesso negado!");
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Calcular reembolso
    const refundAmount = booking.calculateRefund();
    console.log("[Booking] Valor de reembolso:", refundAmount);

    // Cancelar
    await booking.update({
      status: "cancelled",
      cancelled_at: new Date(),
      cancellation_reason: reason,
      cancelled_by: isGuest ? "guest" : isOwner ? "owner" : "admin",
    });

    console.log("[Booking] Reserva cancelada com sucesso!");

    // Modo Beta: Desbloquear datas automaticamente
    if (isBetaMode() && getBetaConfig("booking.autoUnblockOnCancel")) {
      try {
        // Buscar e remover bloqueios associados a esta reserva
        const deletedCount = await PropertyAvailability.destroy({
          where: {
            booking_id: booking.id,
            is_blocked: true,
          },
        });

        betaLog("Datas desbloqueadas após cancelamento", {
          booking_id: booking.id,
          property_id: booking.property_id,
          blocks_removed: deletedCount,
        });
      } catch (unblockError) {
        logger.error("Erro ao desbloquear datas no modo Beta", {
          error: unblockError.message,
          booking_id: booking.id,
        });
        // Não falhar o cancelamento por causa do desbloqueio
      }
    }

    logger.info("Reserva cancelada", {
      booking_id: booking.id,
      cancelled_by: isGuest ? "guest" : "owner",
    });

    res.json({
      message: "Reserva cancelada com sucesso",
      refund_amount: refundAmount,
      booking,
    });
  } catch (error) {
    console.error("[Booking] Erro ao cancelar reserva:", error);
    console.error("[Booking] Stack trace:", error.stack);
    logger.error("Erro ao cancelar reserva", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Verificar disponibilidade
const checkAvailability = async (req, res) => {
  try {
    const { property_id, check_in, check_out } = req.query;

    if (!property_id || !check_in || !check_out) {
      return res.status(400).json({
        error: "property_id, check_in e check_out são obrigatórios",
      });
    }

    const isAvailable = await Booking.checkAvailability(
      property_id,
      check_in,
      check_out
    );

    const isBlocked = await PropertyAvailability.isBlocked(
      property_id,
      check_in,
      check_out
    );

    res.json({
      available: isAvailable && !isBlocked,
      has_bookings: !isAvailable,
      is_blocked: isBlocked,
    });
  } catch (error) {
    logger.error("Erro ao verificar disponibilidade", {
      error: error.message,
    });
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Obter datas ocupadas (para exibir no calendário)
const getOccupiedDates = async (req, res) => {
  try {
    const { property_id } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        error: "start_date e end_date são obrigatórios",
      });
    }

    // Buscar propriedade pelo UUID para obter o ID numérico
    const property = await Property.findOne({
      where: { uuid: property_id }
    });

    if (!property) {
      return res.status(404).json({
        error: "Propriedade não encontrada",
        bookings: [],
        blocks: [],
        occupied_dates: []
      });
    }

    // Buscar reservas confirmadas usando ID numérico
    const bookings = await Booking.getOccupiedDates(
      property.id,
      start_date,
      end_date
    );

    // Buscar bloqueios usando ID numérico
    const blocks = await PropertyAvailability.getBlockedDates(
      property.id,
      start_date,
      end_date
    );

    res.json({
      bookings,
      blocks,
      occupied_dates: [...bookings, ...blocks],
    });
  } catch (error) {
    logger.error("Erro ao buscar datas ocupadas", { error: error.message });
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Listar reservas de uma propriedade (para o proprietário)
const getPropertyBookings = async (req, res) => {
  try {
    const { property_id } = req.params;
    const { status } = req.query;

    // Verificar se é o proprietário
    const property = await Property.findByPk(property_id);
    if (!property) {
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

    const isOwner = property.user_id === req.user.id;
    const isAdmin = req.user.role === "admin_master";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const where = { property_id };
    if (status) {
      where.status = status;
    }

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: User,
          as: "guest",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
      order: [["check_in", "DESC"]],
    });

    res.json({ bookings });
  } catch (error) {
    logger.error("Erro ao listar reservas da propriedade", {
      error: error.message,
    });
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Confirmar reserva (para proprietário no modo Beta)
const confirmBooking = async (req, res) => {
  try {
    const { uuid } = req.params;
    const notes = req.body?.notes || ""; // Notas opcionais do proprietário

    console.log("[Booking] Confirmando reserva UUID:", uuid);
    console.log("[Booking] Notas do proprietário:", notes);

    const booking = await Booking.findOne({
      where: { uuid },
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "title", "user_id", "address", "city_id"],
          include: [
            {
              model: City,
              as: "city",
              attributes: ["name", "state"],
            },
          ],
        },
        {
          model: User,
          as: "guest",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!booking) {
      console.log("[Booking] Reserva não encontrada!");
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    console.log("[Booking] Reserva encontrada - Status:", booking.status);

    // Verificar se é o proprietário
    const isOwner = booking.property.user_id === req.user.id;
    const isAdmin = req.user.role === "admin_master";

    console.log("[Booking] Verificação de permissão - isOwner:", isOwner, "isAdmin:", isAdmin);

    if (!isOwner && !isAdmin) {
      console.log("[Booking] Acesso negado!");
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Verificar se a reserva está pendente
    if (booking.status !== "pending") {
      console.log("[Booking] Status inválido para confirmação:", booking.status);
      return res.status(400).json({
        error: `Reserva não pode ser confirmada. Status atual: ${booking.status}`,
      });
    }

    // Atualizar status para confirmado
    await booking.update({
      status: "confirmed",
      confirmed_at: new Date(),
      owner_notes: notes,
    });

    console.log("[Booking] Reserva confirmada com sucesso!");

    // Enviar email de confirmação para o hóspede
    try {
      console.log("[Booking] Enviando email de confirmação...");
      await sendBookingConfirmation(booking, booking.property, booking.guest);
      console.log("[Booking] Email de confirmação enviado com sucesso!");
    } catch (emailError) {
      console.error("[Booking] Erro ao enviar email de confirmação:", emailError);
      // Não bloqueia a confirmação se o email falhar
      logger.error("Erro ao enviar email de confirmação", {
        error: emailError.message,
        booking_id: booking.id
      });
    }

    logger.info("Reserva confirmada pelo proprietário", {
      booking_id: booking.id,
      property_id: booking.property.id,
      owner_id: req.user.id,
    });

    if (isBetaMode()) {
      betaLog("Reserva confirmada no modo Beta", {
        booking_id: booking.id,
        owner_id: req.user.id,
      });
    }

    res.json({
      message: "Reserva confirmada com sucesso!",
      booking,
    });
  } catch (error) {
    console.error("[Booking] Erro ao confirmar reserva:", error);
    console.error("[Booking] Stack trace:", error.stack);
    logger.error("Erro ao confirmar reserva", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Listar TODAS as reservas das propriedades do proprietário (para admin)
const getAllOwnerBookings = async (req, res) => {
  try {
    const isAdminMaster = req.user.role === "admin_master";

    console.log("[Booking] Buscando reservas - Usuário:", req.user.id, "Admin Master:", isAdminMaster);

    let bookings;

    if (isAdminMaster) {
      // Admin Master: Buscar TODAS as reservas do sistema
      console.log("[Booking] Admin Master - Buscando todas as reservas do sistema");

      bookings = await Booking.findAll({
        include: [
          {
            model: Property,
            as: "property",
            attributes: ["id", "uuid", "title", "address", "city_id", "user_id"],
            include: [
              {
                model: City,
                as: "city",
                attributes: ["name", "state"],
              },
              {
                model: User,
                as: "owner",
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: User,
            as: "guest",
            attributes: ["id", "name", "email", "phone"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      console.log("[Booking] Admin Master - Total de reservas encontradas:", bookings.length);
    } else {
      // Proprietário normal: Buscar apenas reservas das suas propriedades
      console.log("[Booking] Proprietário - Buscando reservas das propriedades do usuário");

      const properties = await Property.findAll({
        where: { user_id: req.user.id },
        attributes: ["id"],
      });

      const propertyIds = properties.map((p) => p.id);
      console.log("[Booking] Propriedades do usuário:", propertyIds);

      if (propertyIds.length === 0) {
        return res.json({ bookings: [] });
      }

      bookings = await Booking.findAll({
        where: {
          property_id: propertyIds,
        },
        include: [
          {
            model: Property,
            as: "property",
            attributes: ["id", "uuid", "title", "address", "city_id", "user_id"],
            include: [
              {
                model: City,
                as: "city",
                attributes: ["name", "state"],
              },
              {
                model: User,
                as: "owner",
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: User,
            as: "guest",
            attributes: ["id", "name", "email", "phone"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      console.log("[Booking] Proprietário - Total de reservas encontradas:", bookings.length);
    }

    res.json({
      bookings,
      isAdminMaster, // Enviar flag para o frontend saber se é admin master
    });
  } catch (error) {
    console.error("[Booking] Erro ao buscar reservas:", error);
    logger.error("Erro ao buscar reservas", {
      error: error.message,
    });
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  confirmBooking,
  checkAvailability,
  getOccupiedDates,
  getPropertyBookings,
  getAllOwnerBookings,
};
