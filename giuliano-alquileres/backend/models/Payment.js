const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Payment = sequelize.define(
  "Payment",
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
      allowNull: false,
    },
    booking_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bookings",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    // Mercado Pago IDs
    payment_id: {
      type: DataTypes.STRING(100),
      allowNull: true, // Null até receber do MP
      comment: "ID do pagamento no Mercado Pago",
    },
    preference_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "ID da preferência de pagamento no MP",
    },
    merchant_order_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "ID da ordem no Mercado Pago",
    },
    // Valores
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
      comment: "Valor total pago (em reais)",
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "BRL",
      allowNull: false,
    },
    // Status do pagamento
    status: {
      type: DataTypes.ENUM(
        "pending", // Aguardando pagamento
        "approved", // Pagamento aprovado
        "authorized", // Pagamento autorizado (captura pendente)
        "in_process", // Em processamento
        "in_mediation", // Em disputa/mediação
        "rejected", // Rejeitado
        "cancelled", // Cancelado
        "refunded", // Reembolsado
        "charged_back" // Chargeback
      ),
      defaultValue: "pending",
      allowNull: false,
    },
    status_detail: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Detalhes do status do MP",
    },
    // Método de pagamento
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "credit_card, debit_card, pix, boleto, etc.",
    },
    payment_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Tipo de pagamento: account_money, ticket, etc.",
    },
    // Informações do pagador
    payer_email: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    payer_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    payer_document: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "CPF/CNPJ do pagador",
    },
    // Datas importantes
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Data de aprovação do pagamento",
    },
    refunded_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Data do reembolso",
    },
    // Dados adicionais do Mercado Pago
    mp_response: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Resposta completa do Mercado Pago (para debug)",
    },
    // Informações de reembolso
    refund_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      comment: "Valor reembolsado",
    },
    refund_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Motivo do reembolso",
    },
    // Timestamps
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "payments",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["booking_id"],
        name: "idx_payment_booking",
      },
      {
        fields: ["user_id"],
        name: "idx_payment_user",
      },
      {
        fields: ["payment_id"],
        name: "idx_payment_mp_id",
      },
      {
        fields: ["status"],
        name: "idx_payment_status",
      },
      {
        fields: ["created_at"],
        name: "idx_payment_created",
      },
    ],
  }
);

module.exports = Payment;
