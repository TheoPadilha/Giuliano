'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('property_photos', 'cloudinary_url', {
      type: Sequelize.STRING(500),
      allowNull: true,
      comment: 'URL da imagem no Cloudinary CDN'
    });

    await queryInterface.addColumn('property_photos', 'cloudinary_public_id', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Public ID da imagem no Cloudinary para deleção'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('property_photos', 'cloudinary_url');
    await queryInterface.removeColumn('property_photos', 'cloudinary_public_id');
  }
};
