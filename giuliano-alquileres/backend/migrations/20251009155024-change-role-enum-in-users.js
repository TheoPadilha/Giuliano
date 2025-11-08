// Dentro do novo arquivo de migration (ex: YYYYY-change-role-enum-in-users.js)
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.query("ALTER TYPE \"enum_users_role\" ADD VALUE IF NOT EXISTS 'admin_master'");
      console.log('✅ Valor admin_master adicionado ao ENUM');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log("⏭️  Valor de ENUM admin_master já existe, pulando esta migration.");
      } else {
        throw error;
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Reverter isso é complexo e perigoso, pois pode haver dados usando o novo valor.
    // Por segurança, deixamos o 'down' vazio ou apenas com um log.
    console.log(
      "Reverter a adição de um valor ENUM não é suportado diretamente."
    );
  },
};
