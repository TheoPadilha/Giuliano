/**
 * Configuração do Cloudinary
 * CDN de imagens para armazenamento persistente
 */

const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary com variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Upload de imagem para o Cloudinary
 * @param {string} filePath - Caminho do arquivo local
 * @param {string} folder - Pasta no Cloudinary (ex: 'properties')
 * @returns {Promise<object>} - Dados da imagem no Cloudinary
 */
const uploadImage = async (filePath, folder = 'properties') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `giuliano/${folder}`,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }, // Otimização automática
        { width: 2000, height: 2000, crop: 'limit' } // Limitar tamanho máximo
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Erro ao fazer upload para Cloudinary:', error);
    throw error;
  }
};

/**
 * Deletar imagem do Cloudinary
 * @param {string} publicId - ID público da imagem no Cloudinary
 * @returns {Promise<object>} - Resultado da deleção
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Erro ao deletar imagem do Cloudinary:', error);
    throw error;
  }
};

/**
 * Verificar se Cloudinary está configurado
 * @returns {boolean}
 */
const isConfigured = () => {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  isConfigured
};
