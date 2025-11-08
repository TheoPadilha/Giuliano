'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('property_photos', 'cloudinary_url', {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL da imagem no Cloudinary CDN'
    });

    await queryInterface.addColumn('property_photos', 'cloudinary_public_id', {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Public ID da imagem no Cloudinary para deleção'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('property_photos', 'cloudinary_url');
    await queryInterface.removeColumn('property_photos', 'cloudinary_public_id');
  }
};
