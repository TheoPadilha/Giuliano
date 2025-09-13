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
    role: {
      type: DataTypes.ENUM("admin", "client"),
      defaultValue: "client",
      allowNull: false,
    },
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

    // Hooks para hash da senha
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

// Método para validar senha
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

// Método para excluir senha das respostas
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password_hash;
  return values;
};

// Método estático para buscar por email
User.findByEmail = function (email) {
  return this.findOne({ where: { email, is_active: true } });
};

// Método estático para criar usuário com validação
User.createUser = async function (userData) {
  const { name, email, password, phone, country, role = "client" } = userData;

  // Verificar se email já existe
  const existingUser = await this.findByEmail(email);
  if (existingUser) {
    throw new Error("Email já está em uso");
  }

  return await this.create({
    name,
    email,
    password_hash: password,
    phone,
    country,
    role,
  });
};

module.exports = User;
