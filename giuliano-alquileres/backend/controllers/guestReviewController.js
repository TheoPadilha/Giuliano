const GuestReview = require("../models/GuestReview");
const { Booking, Property, User } = require("../models");
const Joi = require("joi");
const logger = require("../utils/logger");

// Validação
const guestReviewSchema = Joi.object({
  cleanliness: Joi.number().integer().min(1).max(5).required(),
  communication: Joi.number().integer().min(1).max(5).required(),
  respect_rules: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).optional().allow(""),
  would_host_again: Joi.boolean().required(),
});

// Criar avaliação de hóspede
const createGuestReview = async (req, res) => {
  try {
    const { bookingUuid } = req.params;

    console.log("[GuestReview] Criando avaliação para reserva:", bookingUuid);
    console.log("[GuestReview] Dados:", req.body);

    // Validar dados
    const { error, value } = guestReviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Buscar reserva
    const booking = await Booking.findOne({
      where: { uuid: bookingUuid },
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["id", "user_id"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Verificar se o usuário é o proprietário do imóvel
    if (booking.property.user_id !== req.user.id) {
      return res.status(403).json({
        error: "Apenas o proprietário do imóvel pode avaliar o hóspede",
      });
    }

    // Verificar se a reserva está concluída
    if (booking.status !== "completed") {
      return res.status(400).json({
        error: "Só é possível avaliar após a conclusão da estadia",
      });
    }

    // Verificar se já existe avaliação para esta reserva
    const existingReview = await GuestReview.findOne({
      where: { booking_id: booking.id },
    });

    if (existingReview) {
      return res.status(400).json({
        error: "Você já avaliou este hóspede para esta reserva",
      });
    }

    // Criar avaliação
    const review = await GuestReview.create({
      booking_id: booking.id,
      guest_id: booking.user_id,
      host_id: req.user.id,
      ...value,
    });

    console.log("[GuestReview] Avaliação criada com ID:", review.id);

    res.status(201).json({
      message: "Avaliação do hóspede criada com sucesso",
      review,
    });
  } catch (error) {
    console.error("[GuestReview] Erro ao criar avaliação:", error);
    logger.error("Erro ao criar avaliação de hóspede", {
      error: error.message,
    });
    res.status(500).json({
      error: "Erro interno do servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Listar avaliações que o proprietário fez
const getHostReviews = async (req, res) => {
  try {
    const reviews = await GuestReview.findAll({
      where: { host_id: req.user.id },
      include: [
        {
          model: User,
          as: "guest",
          attributes: ["id", "uuid", "name", "avatar"],
        },
        {
          model: Booking,
          as: "booking",
          attributes: ["uuid", "check_in", "check_out"],
          include: [
            {
              model: Property,
              as: "property",
              attributes: ["title"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.json({ reviews });
  } catch (error) {
    console.error("[GuestReview] Erro ao buscar avaliações:", error);
    logger.error("Erro ao buscar avaliações de hóspedes", {
      error: error.message,
    });
    res.status(500).json({
      error: "Erro interno do servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Listar avaliações recebidas por um hóspede
const getGuestReviews = async (req, res) => {
  try {
    const { guestUuid } = req.params;

    // Buscar hóspede
    const guest = await User.findOne({ where: { uuid: guestUuid } });
    if (!guest) {
      return res.status(404).json({ error: "Hóspede não encontrado" });
    }

    const reviews = await GuestReview.findAll({
      where: { guest_id: guest.id },
      include: [
        {
          model: User,
          as: "host",
          attributes: ["id", "uuid", "name", "avatar"],
        },
        {
          model: Booking,
          as: "booking",
          attributes: ["check_in", "check_out"],
          include: [
            {
              model: Property,
              as: "property",
              attributes: ["title"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Calcular média
    const stats = await GuestReview.getGuestAverageRating(guest.id);

    res.json({
      reviews,
      stats: {
        average: parseFloat(stats.average),
        total: stats.total,
      },
    });
  } catch (error) {
    console.error("[GuestReview] Erro ao buscar avaliações do hóspede:", error);
    logger.error("Erro ao buscar avaliações do hóspede", {
      error: error.message,
    });
    res.status(500).json({
      error: "Erro interno do servidor",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Verificar se o proprietário pode avaliar o hóspede de uma reserva
const canReviewGuest = async (req, res) => {
  try {
    const { bookingUuid } = req.params;

    const booking = await Booking.findOne({
      where: { uuid: bookingUuid },
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["user_id"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada" });
    }

    // Verificar se é o proprietário
    if (booking.property.user_id !== req.user.id) {
      return res.json({ canReview: false, reason: "not_owner" });
    }

    // Verificar se está concluída
    if (booking.status !== "completed") {
      return res.json({ canReview: false, reason: "not_completed" });
    }

    // Verificar se já avaliou
    const existingReview = await GuestReview.findOne({
      where: { booking_id: booking.id },
    });

    if (existingReview) {
      return res.json({ canReview: false, reason: "already_reviewed" });
    }

    res.json({ canReview: true });
  } catch (error) {
    console.error("[GuestReview] Erro ao verificar permissão:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  createGuestReview,
  getHostReviews,
  getGuestReviews,
  canReviewGuest,
};
