'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('property_photos');

    // Adicionar cloudinary_url se não existir
    if (!table.cloudinary_url) {
      await queryInterface.addColumn('property_photos', 'cloudinary_url', {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'URL da imagem no Cloudinary CDN'
      });
      console.log('✅ Coluna cloudinary_url adicionada');
    } else {
      console.log('⏭️  Coluna cloudinary_url já existe');
    }

    // Adicionar cloudinary_public_id se não existir
    if (!table.cloudinary_public_id) {
      await queryInterface.addColumn('property_photos', 'cloudinary_public_id', {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Public ID da imagem no Cloudinary para deleção'
      });
      console.log('✅ Coluna cloudinary_public_id adicionada');
    } else {
      console.log('⏭️  Coluna cloudinary_public_id já existe');
    }
  },

  async down(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('property_photos');

    if (table.cloudinary_url) {
      await queryInterface.removeColumn('property_photos', 'cloudinary_url');
    }

    if (table.cloudinary_public_id) {
      await queryInterface.removeColumn('property_photos', 'cloudinary_public_id');
    }
  }
};
