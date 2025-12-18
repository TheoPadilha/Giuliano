const cron = require("node-cron");
const { Booking } = require("../models");
const logger = require("../utils/logger");
const { notifyBookingCancelled, notifyOwnerBookingCancelled } = require("../services/zapiService");

// Função para cancelar reservas pendentes que expiraram (check-in passou e ainda estão pending)
const cancelExpiredPendingBookings = async () => {
  try {
    console.log("[CRON] Verificando reservas pendentes expiradas...");
    logger.info("Iniciando verificação de reservas pendentes expiradas");

    const result = await Booking.cancelExpiredPendingBookings();

    if (result.cancelled > 0) {
      console.log(`[CRON] ✅ ${result.cancelled} reserva(s) pendente(s) cancelada(s) automaticamente`);
      logger.info(`${result.cancelled} reservas pendentes canceladas automaticamente`, {
        bookings: result.bookings.map((b) => ({
          uuid: b.uuid,
          guest_email: b.guest_email,
          property_title: b.property_title,
          check_in: b.check_in,
        })),
      });

      // Enviar notificações WhatsApp para hóspedes e proprietários
      console.log("[CRON] 📧 Enviando notificações de cancelamento...");

      for (const booking of result.bookings) {
        const reason = booking.cancellation_reason || "Proprietário não confirmou a reserva a tempo";

        // Criar objeto property com os dados necessários
        const property = {
          title: booking.property_title,
          address: booking.property?.address || "Endereço não informado",
        };

        // Notificar hóspede
        try {
          const guestResult = await notifyBookingCancelled(booking, property, reason);
          if (guestResult.success) {
            console.log(`[CRON] ✅ WhatsApp enviado para hóspede: ${booking.guest_name}`);
          } else {
            console.log(`[CRON] ⚠️  Falha ao enviar WhatsApp para hóspede: ${guestResult.error}`);
          }
        } catch (error) {
          console.error(`[CRON] ❌ Erro ao notificar hóspede: ${error.message}`);
        }

        // Notificar proprietário/admin
        try {
          const ownerResult = await notifyOwnerBookingCancelled(booking, property, reason);
          if (ownerResult.success) {
            console.log(`[CRON] ✅ WhatsApp enviado para proprietário`);
          } else {
            console.log(`[CRON] ⚠️  Falha ao enviar WhatsApp para proprietário: ${ownerResult.error}`);
          }
        } catch (error) {
          console.error(`[CRON] ❌ Erro ao notificar proprietário: ${error.message}`);
        }
      }
    } else {
      console.log("[CRON] Nenhuma reserva pendente expirada encontrada");
    }
  } catch (error) {
    console.error("[CRON] ❌ Erro ao cancelar reservas pendentes expiradas:", error);
    logger.error("Erro no cron job de cancelamento de reservas expiradas", {
      error: error.message,
      stack: error.stack,
    });
  }
};

// Inicializar cron job
const initCancelExpiredPendingBookingsCron = () => {
  // Rodar todos os dias às 04:00 da manhã (1 hora depois do job de complete)
  cron.schedule("0 4 * * *", cancelExpiredPendingBookings, {
    timezone: "America/Sao_Paulo",
  });

  console.log(
    "✅ [CRON] Job de cancelamento de reservas pendentes expiradas inicializado (roda diariamente às 04:00)"
  );
  logger.info("Cron job de cancelamento de reservas pendentes expiradas inicializado");

  // OPCIONAL: Rodar uma vez ao iniciar o servidor
  // Descomente a linha abaixo se quiser que rode imediatamente ao iniciar
  // cancelExpiredPendingBookings();
};

module.exports = {
  initCancelExpiredPendingBookingsCron,
  cancelExpiredPendingBookings,
};
