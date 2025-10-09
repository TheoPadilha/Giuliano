const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../config/database");

const User = sequelize.define(
  "User",
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Nome é obrigatório" },
        len: { args: [2, 100], msg: "Nome deve ter entre 2 e 100 caracteres" },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "Email é obrigatório" },
        isEmail: { msg: "Email deve ter formato válido" },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: {
          args: [10, 20],
          msg: "Telefone deve ter entre 10 e 20 caracteres",
        },
      },
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Brasil",
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Senha é obrigatória" },
      },
    },
    // --- ALTERAÇÃO 1: Ajustando o campo 'role' ---
    role: {
      type: DataTypes.ENUM("admin", "admin_master"), // Novos papéis
      defaultValue: "admin", // Todo novo cadastro será um 'admin' (dono de imóvel)
      allowNull: false,
    },
    // --- ALTERAÇÃO 2: Adicionando o campo 'status' ---
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"), // Status possíveis
      defaultValue: "pending", // Todo novo cadastro começa como pendente
      allowNull: false,
    },
    // O campo 'is_active' pode ser redundante agora, mas vamos mantê-lo por enquanto.
    // Poderíamos usá-lo para um admin desativar uma conta em vez de deletá-la.
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 12);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("password_hash")) {
          user.password_hash = await bcrypt.hash(user.password_hash, 12);
        }
      },
    },
  }
);

// --- NENHUMA ALTERAÇÃO NECESSÁRIA ABAIXO ---
// Seus métodos continuam perfeitamente válidos.

User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

// --- ALTERAÇÃO 3: Pequeno ajuste no método estático para buscar usuário ---
// Agora ele não deve mais procurar por 'is_active', pois o status de aprovação é mais importante para o login.
User.findByEmail = function (email) {
  return this.findOne({ where: { email } }); // Removemos o 'is_active: true' daqui
};

// O método createUser não precisa de alterações, pois os valores padrão de 'role' e 'status' já farão o trabalho.
User.createUser = async function (userData) {
  const { name, email, password, phone, country } = userData;

  const existingUser = await this.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("Email já está em uso");
  }

  return await this.create({
    name,
    email,
    password_hash: password,
    phone,
    country,
    // 'role' e 'status' serão definidos pelos valores padrão do modelo.
  });
};

module.exports = User;
