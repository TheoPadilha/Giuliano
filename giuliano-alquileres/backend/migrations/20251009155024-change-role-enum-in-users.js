// Dentro do novo arquivo de migration (ex: YYYYY-change-role-enum-in-users.js)
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("ALTER TYPE \"enum_users_role\" ADD VALUE 'admin_master'");
    console.log(
      "Valor de ENUM admin_master já existe, pulando esta migration."
    );
  },

  async down(queryInterface, Sequelize) {
    // Reverter isso é complexo e perigoso, pois pode haver dados usando o novo valor.
    // Por segurança, deixamos o 'down' vazio ou apenas com um log.
    console.log(
      "Reverter a adição de um valor ENUM não é suportado diretamente."
    );
  },
};
