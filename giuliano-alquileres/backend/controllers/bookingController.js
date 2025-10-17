const {
  Booking,
  Property,
  User,
  PropertyAvailability,
  City,
} = require("../models");
const Joi = require("joi");
const logger = require("../utils/logger");

// Esquema de validação para criar reserva
const createBookingSchema = Joi.object({
  property_id: Joi.number().integer().required(),
  check_in: Joi.date().iso().required(),
  check_out: Joi.date().iso().greater(Joi.ref("check_in")).required(),
  guests: Joi.number().integer().min(1).max(20).required(),
  guest_name: Joi.string().min(2).max(100).required(),
  guest_email: Joi.string().email().required(),
  guest_phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required(),
  special_requests: Joi.string().max(500).optional().allow(""),
});

// Criar nova reserva
const createBooking = async (req, res) => {
  try {
    // 1. Validar dados
    const { error, value } = createBookingSchema.validate(req.body);
    if (error) {
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
      special_requests,
    } = value;

    logger.info("Nova tentativa de reserva", {
      property_id,
      check_in,
      check_out,
    });

    // 2. Verificar se a propriedade existe
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
      return res.status(404).json({ error: "Propriedade não encontrada" });
    }

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
      return res.status(409).json({
        error: "Propriedade já está reservada para estas datas",
      });
    }

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
    const booking = await Booking.create({
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
      special_requests,
      status: "pending", // Aguardando pagamento
    });

    logger.info("Reserva criada com sucesso", { booking_id: booking.id });

    // 9. Retornar reserva criada
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

    res.status(201).json({
      message: "Reserva criada com sucesso!",
      booking: createdBooking,
    });
  } catch (error) {
    logger.error("Erro ao criar reserva", { error: error.message });
    res.status(500).json({
      error: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
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
    const { reason } = req.body;

    const booking = await Booking.findOne({ where: { uuid } });

    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Verificar se pode cancelar
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        error: "Esta reserva não pode ser cancelada",
      });
    }

    // Verificar permissão
    const isGuest = booking.user_id === req.user.id;
    const isOwner =
      (await Property.findByPk(booking.property_id)).user_id === req.user.id;
    const isAdmin = req.user.role === "admin_master";

    if (!isGuest && !isOwner && !isAdmin) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    // Calcular reembolso
    const refundAmount = booking.calculateRefund();

    // Cancelar
    await booking.update({
      status: "cancelled",
      cancelled_at: new Date(),
      cancellation_reason: reason,
      cancelled_by: isGuest ? "guest" : isOwner ? "owner" : "admin",
    });

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
    logger.error("Erro ao cancelar reserva", { error: error.message });
    res.status(500).json({ error: "Erro interno do servidor" });
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

    // Buscar reservas confirmadas
    const bookings = await Booking.getOccupiedDates(
      property_id,
      start_date,
      end_date
    );

    // Buscar bloqueios
    const blocks = await PropertyAvailability.getBlockedDates(
      property_id,
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

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  checkAvailability,
  getOccupiedDates,
  getPropertyBookings,
};
