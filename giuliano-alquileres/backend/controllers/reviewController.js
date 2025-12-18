const { Review, Property, User, Booking, PropertyPhoto, sequelize } = require("../models");
const Joi = require("joi");

// Validação
const reviewSchema = Joi.object({
  booking_id: Joi.number().integer().required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(1000).optional(),
  cleanliness_rating: Joi.number().integer().min(1).max(5).optional(),
  location_rating: Joi.number().integer().min(1).max(5).optional(),
  value_rating: Joi.number().integer().min(1).max(5).optional(),
  communication_rating: Joi.number().integer().min(1).max(5).optional(),
});

// Criar avaliação
const createReview = async (req, res) => {
  try {
    console.log("[Review] Dados recebidos:", req.body);
    console.log("[Review] Usuário:", req.user.id, req.user.email);

    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
      console.log("[Review] Erro de validação:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    console.log("[Review] Dados validados:", value);

    // Verificar se booking existe e pertence ao usuário
    console.log("[Review] Buscando booking ID:", value.booking_id, "para usuário:", req.user.id);
    const booking = await Booking.findOne({
      where: {
        id: value.booking_id,
        user_id: req.user.id,
        status: 'completed' // Só pode avaliar após check-out
      },
      include: [{ model: Property, as: 'property' }]
    });

    console.log("[Review] Booking encontrada:", booking ? `Sim (ID: ${booking.id})` : "Não");

    if (!booking) {
      return res.status(404).json({ error: "Reserva não encontrada ou não finalizada" });
    }

    // Verificar se já avaliou
    const existingReview = await Review.findOne({
      where: { booking_id: value.booking_id }
    });

    if (existingReview) {
      return res.status(400).json({ error: "Você já avaliou esta reserva" });
    }

    console.log("[Review] Criando review com property_id:", booking.property.id);

    // Criar avaliação
    const review = await Review.create({
      ...value,
      property_id: booking.property.id,
      user_id: req.user.id,
    });

    res.status(201).json({
      message: "Avaliação criada com sucesso",
      review: await Review.findByPk(review.id, {
        include: [
          { model: User, as: 'user', attributes: ['name'] },
          { model: Property, as: 'property', attributes: ['title'] }
        ]
      })
    });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    console.error("Stack trace:", error.stack);
    console.error("Mensagem:", error.message);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Listar avaliações de uma propriedade
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    console.log(`[Reviews] Buscando reviews para propriedade UUID: ${propertyId}`);

    // Buscar propriedade pelo UUID para obter o ID numérico
    const property = await Property.findOne({
      where: { uuid: propertyId }
    });

    if (!property) {
      console.log(`[Reviews] Propriedade não encontrada com UUID: ${propertyId}`);
      return res.status(404).json({
        error: "Propriedade não encontrada",
        reviews: [],
        pagination: { page, limit, total: 0, pages: 0 },
        stats: {
          avg_rating: "0.0",
          total_reviews: 0,
          avg_cleanliness: "0.0",
          avg_location: "0.0",
          avg_value: "0.0",
          avg_communication: "0.0",
        }
      });
    }

    console.log(`[Reviews] Propriedade encontrada - ID: ${property.id}, Nome: ${property.title}`);

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: {
        property_id: property.id,
        is_visible: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'created_at']
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    console.log(`[Reviews] Encontradas ${count} reviews para a propriedade`);

    // Calcular estatísticas
    let stats = null;
    if (count > 0) {
      console.log(`[Reviews] Calculando estatísticas...`);
      stats = await Review.findOne({
        where: { property_id: property.id, is_visible: true },
        attributes: [
          [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'total_reviews'],
          [sequelize.fn('AVG', sequelize.col('cleanliness_rating')), 'avg_cleanliness'],
          [sequelize.fn('AVG', sequelize.col('location_rating')), 'avg_location'],
          [sequelize.fn('AVG', sequelize.col('value_rating')), 'avg_value'],
          [sequelize.fn('AVG', sequelize.col('communication_rating')), 'avg_communication'],
        ],
        raw: true,
      });
      console.log(`[Reviews] Estatísticas calculadas:`, stats);
    }

    res.json({
      reviews,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
      stats: {
        avg_rating: parseFloat(stats?.avg_rating || 0).toFixed(1),
        total_reviews: parseInt(stats?.total_reviews || 0),
        avg_cleanliness: parseFloat(stats?.avg_cleanliness || 0).toFixed(1),
        avg_location: parseFloat(stats?.avg_location || 0).toFixed(1),
        avg_value: parseFloat(stats?.avg_value || 0).toFixed(1),
        avg_communication: parseFloat(stats?.avg_communication || 0).toFixed(1),
      }
    });
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      error: "Erro interno do servidor",
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Minhas avaliações
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { user_id: req.user.id },
      include: [
        { 
          model: Property, 
          as: 'property', 
          attributes: ['title'],
          include: [{ model: PropertyPhoto, as: 'photos', limit: 1 }]
        }
      ],
      order: [['created_at', 'DESC']],
    });

    res.json({ reviews });
  } catch (error) {
    console.error("Erro ao buscar minhas avaliações:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  getMyReviews,
};