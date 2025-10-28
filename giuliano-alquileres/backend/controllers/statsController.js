// statsController.js - Controller para estatísticas do admin
const { Property, Booking, Payment, Review, User } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require("../config/database");

// Obter estatísticas gerais do dashboard
const getAdminStats = async (req, res) => {
  try {
    // Total de propriedades
    const totalProperties = await Property.count();

    // Propriedades em destaque
    const featuredProperties = await Property.count({
      where: { is_featured: true },
    });

    // Propriedades disponíveis
    const availableProperties = await Property.count({
      where: { status: "available" },
    });

    // Total de reservas
    const totalBookings = await Booking.count();

    // Reservas confirmadas
    const confirmedBookings = await Booking.count({
      where: { status: "confirmed" },
    });

    // Reservas pendentes
    const pendingBookings = await Booking.count({
      where: { status: "pending" },
    });

    // Receita total (soma de final_price de bookings confirmados e completados)
    const revenueResult = await Booking.sum("final_price", {
      where: {
        status: {
          [Op.in]: ["confirmed", "completed"],
        },
      },
    });
    const totalRevenue = revenueResult || 0;

    // Receita do mês atual
    const currentMonth = new Date();
    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const monthlyRevenueResult = await Booking.sum("final_price", {
      where: {
        status: {
          [Op.in]: ["confirmed", "completed"],
        },
        created_at: {
          [Op.gte]: firstDayOfMonth,
        },
      },
    });
    const monthlyRevenue = monthlyRevenueResult || 0;

    // Número de hóspedes únicos
    const uniqueGuests = await Booking.count({
      distinct: true,
      col: "guest_email",
    });

    // Avaliação média geral
    const avgRatingResult = await Review.findOne({
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
    });
    const averageRating = avgRatingResult
      ? parseFloat(avgRatingResult.dataValues.avgRating || 0).toFixed(1)
      : 0;

    // Total de avaliações
    const totalReviews = await Review.count();

    // Total de usuários
    const totalUsers = await User.count();

    // Usuários pendentes de aprovação
    const pendingUsers = await User.count({
      where: { status: "pending" },
    });

    // Reservas recentes (últimas 7 dias)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBookings = await Booking.count({
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    });

    res.json({
      success: true,
      stats: {
        properties: {
          total: totalProperties,
          featured: featuredProperties,
          available: availableProperties,
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          recent: recentBookings,
        },
        revenue: {
          total: parseFloat(totalRevenue).toFixed(2),
          monthly: parseFloat(monthlyRevenue).toFixed(2),
        },
        guests: {
          unique: uniqueGuests,
        },
        reviews: {
          total: totalReviews,
          averageRating: parseFloat(averageRating),
        },
        users: {
          total: totalUsers,
          pending: pendingUsers,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar estatísticas",
      details: error.message,
    });
  }
};

// Obter propriedades recentes
const getRecentProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const properties = await Property.findAll({
      order: [["created_at", "DESC"]],
      limit: limit,
      include: [
        {
          model: require("../models").City,
          as: "city",
          attributes: ["name", "state"],
        },
      ],
    });

    res.json({
      success: true,
      properties,
    });
  } catch (error) {
    console.error("Erro ao buscar propriedades recentes:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar propriedades recentes",
      details: error.message,
    });
  }
};

// Obter reservas recentes
const getRecentBookings = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const bookings = await Booking.findAll({
      order: [["created_at", "DESC"]],
      limit: limit,
      include: [
        {
          model: Property,
          as: "property",
          attributes: ["title", "uuid"],
        },
        {
          model: User,
          as: "user",
          attributes: ["name", "email"],
        },
      ],
    });

    res.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Erro ao buscar reservas recentes:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar reservas recentes",
      details: error.message,
    });
  }
};

// Obter dados para gráficos (reservas por mês)
const getBookingsChart = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;

    // Buscar reservas dos últimos X meses
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const bookings = await Booking.findAll({
      where: {
        created_at: {
          [Op.gte]: startDate,
        },
      },
      attributes: [
        [
          sequelize.fn(
            "DATE_FORMAT",
            sequelize.col("created_at"),
            "%Y-%m"
          ),
          "month",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        [sequelize.fn("SUM", sequelize.col("final_price")), "revenue"],
      ],
      group: [
        sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y-%m"),
      ],
      order: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y-%m"),
          "ASC",
        ],
      ],
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Erro ao buscar dados do gráfico:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar dados do gráfico",
      details: error.message,
    });
  }
};

module.exports = {
  getAdminStats,
  getRecentProperties,
  getRecentBookings,
  getBookingsChart,
};
