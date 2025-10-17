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
    const { error, value } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Verificar se booking existe e pertence ao usuário
    const booking = await Booking.findOne({
      where: { 
        id: value.booking_id, 
        user_id: req.user.id,
        status: 'completed' // Só pode avaliar após check-out
      },
      include: [{ model: Property, as: 'property' }]
    });

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
          { model: User, as: 'user', attributes: ['name', 'avatar'] },
          { model: Property, as: 'property', attributes: ['title'] }
        ]
      })
    });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Listar avaliações de uma propriedade
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { 
        property_id: propertyId,
        is_visible: true 
      },
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['name', 'avatar', 'created_at'] 
        }
      ],
      order: [['created_at', 'DESC']],
      limit,
      offset,
    });

    // Calcular estatísticas
    const stats = await Review.findOne({
      where: { property_id: propertyId, is_visible: true },
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
    res.status(500).json({ error: "Erro interno do servidor" });
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