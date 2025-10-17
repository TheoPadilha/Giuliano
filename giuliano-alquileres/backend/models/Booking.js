const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    // Relacionamentos
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "properties",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    // Datas da reserva
    check_in: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterToday(value) {
          if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
            throw new Error("Check-in deve ser no futuro");
          }
        },
      },
    },
    check_out: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterCheckIn(value) {
          if (value <= this.check_in) {
            throw new Error("Check-out deve ser depois do check-in");
          }
        },
      },
    },
    // Informações da reserva
    guests: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 20,
      },
    },
    nights: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    // Valores
    price_per_night: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cleaning_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    service_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    final_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    // Status da reserva
    status: {
      type: DataTypes.ENUM(
        "pending", // Aguardando pagamento
        "confirmed", // Pagamento confirmado
        "cancelled", // Cancelada
        "completed", // Concluída (após check-out)
        "in_progress" // Hóspede já fez check-in
      ),
      defaultValue: "pending",
      allowNull: false,
    },
    // Informações de contato do hóspede
    guest_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    guest_email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    guest_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    // Mensagem especial do hóspede
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Informações de pagamento
    payment_method: {
      type: DataTypes.ENUM("credit_card", "debit_card", "pix", "bank_transfer"),
      allowNull: true,
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "refunded", "failed"),
      defaultValue: "pending",
      allowNull: false,
    },
    payment_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "ID da transação no gateway de pagamento",
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    // Cancelamento
    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancelled_by: {
      type: DataTypes.ENUM("guest", "owner", "admin", "system"),
      allowNull: true,
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    // Índices para performance
    indexes: [
      { fields: ["property_id"] },
      { fields: ["user_id"] },
      { fields: ["status"] },
      { fields: ["check_in", "check_out"] },
      { fields: ["payment_status"] },
      // Índices compostos para queries comuns
      {
        fields: ["property_id", "status"],
        name: "idx_property_status",
      },
      {
        fields: ["property_id", "check_in", "check_out"],
        name: "idx_property_dates",
      },
      {
        fields: ["user_id", "status"],
        name: "idx_user_bookings",
      },
    ],

    // Hooks
    hooks: {
      beforeCreate: (booking) => {
        // Calcular número de noites
        const checkIn = new Date(booking.check_in);
        const checkOut = new Date(booking.check_out);
        booking.nights = Math.ceil(
          (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        );

        // Calcular preço total
        booking.total_price = booking.price_per_night * booking.nights;

        // Calcular preço final com taxas
        booking.final_price =
          parseFloat(booking.total_price) +
          parseFloat(booking.cleaning_fee || 0) +
          parseFloat(booking.service_fee || 0);
      },
      beforeUpdate: (booking) => {
        // Recalcular se as datas mudarem
        if (booking.changed("check_in") || booking.changed("check_out")) {
          const checkIn = new Date(booking.check_in);
          const checkOut = new Date(booking.check_out);
          booking.nights = Math.ceil(
            (checkOut - checkIn) / (1000 * 60 * 60 * 24)
          );
          booking.total_price = booking.price_per_night * booking.nights;
          booking.final_price =
            parseFloat(booking.total_price) +
            parseFloat(booking.cleaning_fee || 0) +
            parseFloat(booking.service_fee || 0);
        }
      },
    },
  }
);

// Métodos de instância
Booking.prototype.calculateRefund = function () {
  const now = new Date();
  const checkIn = new Date(this.check_in);
  const daysUntilCheckIn = Math.ceil((checkIn - now) / (1000 * 60 * 60 * 24));

  // Política de cancelamento
  if (daysUntilCheckIn >= 7) {
    return this.final_price; // Reembolso total
  } else if (daysUntilCheckIn >= 3) {
    return this.final_price * 0.5; // 50% de reembolso
  } else {
    return 0; // Sem reembolso
  }
};

Booking.prototype.canBeCancelled = function () {
  return ["pending", "confirmed"].includes(this.status);
};

Booking.prototype.canCheckIn = function () {
  const today = new Date().toISOString().split("T")[0];
  return this.status === "confirmed" && this.check_in === today;
};

// Métodos estáticos
Booking.checkAvailability = async function (propertyId, checkIn, checkOut) {
  const conflictingBookings = await this.count({
    where: {
      property_id: propertyId,
      status: ["confirmed", "in_progress"],
      [sequelize.Sequelize.Op.or]: [
        {
          // Nova reserva começa durante uma reserva existente
          check_in: {
            [sequelize.Sequelize.Op.between]: [checkIn, checkOut],
          },
        },
        {
          // Nova reserva termina durante uma reserva existente
          check_out: {
            [sequelize.Sequelize.Op.between]: [checkIn, checkOut],
          },
        },
        {
          // Nova reserva engloba uma reserva existente
          [sequelize.Sequelize.Op.and]: [
            {
              check_in: {
                [sequelize.Sequelize.Op.lte]: checkIn,
              },
            },
            {
              check_out: {
                [sequelize.Sequelize.Op.gte]: checkOut,
              },
            },
          ],
        },
      ],
    },
  });

  return conflictingBookings === 0;
};

Booking.getOccupiedDates = async function (propertyId, startDate, endDate) {
  const bookings = await this.findAll({
    where: {
      property_id: propertyId,
      status: ["confirmed", "in_progress"],
      check_out: {
        [sequelize.Sequelize.Op.gte]: startDate,
      },
      check_in: {
        [sequelize.Sequelize.Op.lte]: endDate,
      },
    },
    attributes: ["check_in", "check_out"],
    order: [["check_in", "ASC"]],
  });

  return bookings.map((booking) => ({
    start: booking.check_in,
    end: booking.check_out,
  }));
};

module.exports = Booking;
