const cron = require("node-cron");
const { Booking } = require("../models");
const { Op } = require("sequelize");
const logger = require("../utils/logger");

// Função para marcar reservas como completed após check-out
const completeExpiredBookings = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Início do dia

    console.log("[CRON] Verificando reservas para marcar como completed...");
    logger.info("Iniciando verificação de reservas expired", { date: today });

    // Buscar reservas confirmadas onde check_out já passou
    const expiredBookings = await Booking.findAll({
      where: {
        status: "confirmed",
        check_out: {
          [Op.lt]: today, // check_out < hoje
        },
      },
    });

    console.log(`[CRON] Encontradas ${expiredBookings.length} reservas para marcar como completed`);

    if (expiredBookings.length > 0) {
      // Atualizar todas para completed
      const updatePromises = expiredBookings.map((booking) =>
        booking.update({
          status: "completed",
          completed_at: new Date(),
        })
      );

      await Promise.all(updatePromises);

      console.log(`[CRON] ✅ ${expiredBookings.length} reservas marcadas como completed`);
      logger.info(`${expiredBookings.length} reservas marcadas como completed`, {
        booking_ids: expiredBookings.map((b) => b.id),
      });
    } else {
      console.log("[CRON] Nenhuma reserva para marcar como completed no momento");
    }
  } catch (error) {
    console.error("[CRON] ❌ Erro ao marcar reservas como completed:", error);
    logger.error("Erro no cron job de complete bookings", {
      error: error.message,
      stack: error.stack,
    });
  }
};

// Inicializar cron job
const initCompleteBookingsCron = () => {
  // Rodar todos os dias às 03:00 da manhã
  cron.schedule("0 3 * * *", completeExpiredBookings, {
    timezone: "America/Sao_Paulo",
  });

  console.log("✅ [CRON] Job de complete bookings inicializado (roda diariamente às 03:00)");
  logger.info("Cron job de complete bookings inicializado");

  // OPCIONAL: Rodar uma vez ao iniciar o servidor (para testar/pegar reservas antigas)
  // Descomente a linha abaixo se quiser que rode imediatamente ao iniciar
  completeExpiredBookings();
};

module.exports = { initCompleteBookingsCron, completeExpiredBookings };
