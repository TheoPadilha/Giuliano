/**
 * Utilitário para Compressão de Imagens
 * Comprime imagens automaticamente antes do upload para otimizar performance
 */

/**
 * Comprime uma imagem mantendo qualidade aceitável
 * @param {File} file - Arquivo de imagem original
 * @param {Object} options - Opções de compressão
 * @returns {Promise<File>} - Arquivo comprimido
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxSizeMB = 20, // Tamanho máximo em MB
    maxWidthOrHeight = 2048, // Largura/altura máxima em pixels
    quality = 0.85, // Qualidade de 0 a 1 (85% é um bom balanço)
    fileType = file.type, // Manter tipo original
  } = options;

  // Se a imagem já é menor que 1MB, não comprimir
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB < 1) {
    console.log(`✓ Imagem ${file.name} já está otimizada (${fileSizeMB.toFixed(2)}MB)`);
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calcular novas dimensões mantendo aspect ratio
          let { width, height } = img;

          if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
            if (width > height) {
              height = (height / width) * maxWidthOrHeight;
              width = maxWidthOrHeight;
            } else {
              width = (width / height) * maxWidthOrHeight;
              height = maxWidthOrHeight;
            }
          }

          // Criar canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');

          // Melhorar qualidade do redimensionamento
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Desenhar imagem redimensionada
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para Blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Erro ao comprimir imagem'));
                return;
              }

              const compressedSizeMB = blob.size / 1024 / 1024;

              // Verificar se ainda está muito grande
              if (compressedSizeMB > maxSizeMB) {
                // Tentar comprimir mais reduzindo qualidade
                const newQuality = Math.max(0.5, quality - 0.2);
                console.warn(`⚠️ Imagem ainda grande (${compressedSizeMB.toFixed(2)}MB), tentando qualidade ${(newQuality * 100).toFixed(0)}%`);

                canvas.toBlob(
                  (secondBlob) => {
                    if (!secondBlob) {
                      reject(new Error('Erro ao comprimir imagem'));
                      return;
                    }

                    const finalSizeMB = secondBlob.size / 1024 / 1024;

                    if (finalSizeMB > maxSizeMB) {
                      reject(new Error(`Arquivo muito grande mesmo após compressão: ${finalSizeMB.toFixed(2)}MB. Máximo: ${maxSizeMB}MB`));
                      return;
                    }

                    const compressedFile = new File([secondBlob], file.name, {
                      type: fileType,
                      lastModified: Date.now(),
                    });

                    console.log(`✓ ${file.name}: ${fileSizeMB.toFixed(2)}MB → ${finalSizeMB.toFixed(2)}MB (${((1 - finalSizeMB / fileSizeMB) * 100).toFixed(1)}% redução)`);
                    resolve(compressedFile);
                  },
                  fileType,
                  newQuality
                );
                return;
              }

              // Criar novo arquivo com blob comprimido
              const compressedFile = new File([blob], file.name, {
                type: fileType,
                lastModified: Date.now(),
              });

              console.log(`✓ ${file.name}: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB (${((1 - compressedSizeMB / fileSizeMB) * 100).toFixed(1)}% redução)`);
              resolve(compressedFile);
            },
            fileType,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Erro ao carregar imagem'));
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Comprime múltiplas imagens em paralelo
 * @param {File[]} files - Array de arquivos de imagem
 * @param {Object} options - Opções de compressão
 * @param {Function} onProgress - Callback de progresso (opcional)
 * @returns {Promise<File[]>} - Array de arquivos comprimidos
 */
export const compressImages = async (files, options = {}, onProgress = null) => {
  const total = files.length;
  let completed = 0;

  console.log(`📦 Comprimindo ${total} imagem(ns)...`);

  const compressionPromises = files.map(async (file, index) => {
    try {
      const compressed = await compressImage(file, options);
      completed++;

      if (onProgress) {
        onProgress({
          current: completed,
          total,
          percentage: Math.round((completed / total) * 100),
          file: file.name,
        });
      }

      return compressed;
    } catch (error) {
      console.error(`❌ Erro ao comprimir ${file.name}:`, error.message);
      completed++;

      if (onProgress) {
        onProgress({
          current: completed,
          total,
          percentage: Math.round((completed / total) * 100),
          file: file.name,
          error: error.message,
        });
      }

      // Retornar arquivo original em caso de erro
      return file;
    }
  });

  const results = await Promise.all(compressionPromises);

  const totalOriginal = files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;
  const totalCompressed = results.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024;
  const reduction = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);

  console.log(`✅ Compressão concluída: ${totalOriginal.toFixed(2)}MB → ${totalCompressed.toFixed(2)}MB (${reduction}% redução)`);

  return results;
};

/**
 * Valida se o arquivo é uma imagem válida
 * @param {File} file - Arquivo para validar
 * @returns {boolean} - True se for imagem válida
 */
export const isValidImage = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  return validTypes.includes(file.type);
};

/**
 * Formata tamanho de arquivo para exibição
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} - Tamanho formatado (ex: "2.5 MB")
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default {
  compressImage,
  compressImages,
  isValidImage,
  formatFileSize,
};
