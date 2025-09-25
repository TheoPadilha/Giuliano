// src/components/admin/PhotoUpload.jsx

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../services/api";

const PhotoUpload = ({ propertyUuid, onUploadComplete }) => {
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Carregar fotos existentes
  useEffect(() => {
    if (propertyUuid) {
      fetchPhotos();
    }
  }, [propertyUuid]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        `/uploads/properties/${propertyUuid}/photos`
      );
      setPhotos(response.data.photos || []);
    } catch (err) {
      console.error("Erro ao carregar fotos:", err);
      setError("Erro ao carregar fotos existentes");
    } finally {
      setLoading(false);
    }
  };

  // Configuração do dropzone
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!propertyUuid) {
        setError("UUID do imóvel não encontrado");
        return;
      }

      setUploading(true);
      setError("");
      setSuccess("");

      try {
        const formData = new FormData();

        // Adicionar UUID da propriedade
        formData.append("property_uuid", propertyUuid);

        // Adicionar arquivos
        acceptedFiles.forEach((file) => {
          formData.append("photos", file);
        });

        // Adicionar textos alternativos padrão
        const altTexts = acceptedFiles.map(
          (file, index) => `Foto ${photos.length + index + 1}`
        );
        formData.append("alt_texts", JSON.stringify(altTexts));

        // Se não há fotos, a primeira será principal
        if (photos.length === 0) {
          formData.append("main_photo_index", "0");
        }

        console.log("Enviando formData:", {
          property_uuid: propertyUuid,
          files: acceptedFiles.length,
          alt_texts: altTexts,
        });

        const response = await api.post("/uploads/properties", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Upload bem-sucedido:", response.data);

        setSuccess(
          `${response.data.photos.length} foto(s) enviada(s) com sucesso!`
        );

        // Recarregar fotos
        await fetchPhotos();

        // Notificar componente pai
        if (onUploadComplete) {
          onUploadComplete();
        }

        // Limpar mensagem após 3 segundos
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Erro no upload:", err);
        setError(
          err.response?.data?.error ||
            err.response?.data?.details ||
            "Erro ao fazer upload das fotos"
        );
      } finally {
        setUploading(false);
      }
    },
    [propertyUuid, photos.length, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploading,
  });

  // Definir foto principal
  const setMainPhoto = async (photoId) => {
    try {
      setError("");
      await api.put(`/uploads/photos/${photoId}/main`);
      setSuccess("Foto principal definida!");
      await fetchPhotos();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Erro ao definir foto principal");
    }
  };

  // Deletar foto
  const deletePhoto = async (photoId, filename) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta foto?"
    );
    if (!confirmed) return;

    try {
      setError("");
      await api.delete(`/uploads/photos/${photoId}`);
      setSuccess("Foto excluída com sucesso!");
      await fetchPhotos();
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      setError("Erro ao excluir foto");
    }
  };

  // Reordenar fotos (drag and drop)
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e, targetIndex) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    try {
      const newPhotos = [...photos];
      const draggedPhoto = newPhotos[draggedIndex];

      // Remover da posição original
      newPhotos.splice(draggedIndex, 1);

      // Inserir na nova posição
      newPhotos.splice(targetIndex, 0, draggedPhoto);

      // Atualizar estado local imediatamente
      setPhotos(newPhotos);

      // Criar array de IDs na nova ordem
      const photoIds = newPhotos.map((photo) => photo.id);

      // Enviar para o backend
      await api.put(`/uploads/properties/${propertyUuid}/photos/reorder`, {
        photo_ids: photoIds,
      });

      setSuccess("Ordem das fotos atualizada!");
      setTimeout(() => setSuccess(""), 2000);
    } catch (err) {
      console.error("Erro ao reordenar:", err);
      setError("Erro ao reordenar fotos");
      // Recarregar fotos em caso de erro
      await fetchPhotos();
    } finally {
      setDraggedIndex(null);
    }
  };

  if (!propertyUuid) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          ⚠️ Salve o imóvel primeiro para fazer upload de fotos
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          📸 Gerenciar Fotos
        </h3>
        <p className="text-sm text-gray-600">
          Adicione, organize e gerencie as fotos do imóvel
        </p>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">⚠️</span>
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <span className="text-green-500 mr-2">✅</span>
            <span className="text-sm">{success}</span>
          </div>
        </div>
      )}

      {/* Zona de Upload */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : uploading
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
        }`}
      >
        <input {...getInputProps()} />

        <div className="space-y-4">
          <div className="text-6xl">
            {uploading ? "⏳" : isDragActive ? "📤" : "📷"}
          </div>

          {uploading ? (
            <div>
              <p className="text-lg font-medium text-gray-700">
                Fazendo upload das fotos...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse w-full"></div>
              </div>
            </div>
          ) : isDragActive ? (
            <p className="text-lg font-medium text-blue-700">
              Solte as fotos aqui...
            </p>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Arraste fotos aqui ou clique para selecionar
              </p>
              <p className="text-sm text-gray-500">
                Formatos: JPEG, PNG, WebP • Máximo: 5MB por foto • Até 10 fotos
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Fotos */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Carregando fotos...</span>
        </div>
      ) : photos.length > 0 ? (
        <div>
          <h4 className="font-medium text-gray-900 mb-4">
            📋 Fotos Atuais ({photos.length})
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`relative group bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${
                  draggedIndex === index ? "opacity-50" : ""
                } cursor-move`}
              >
                {/* Badge de foto principal */}
                {photo.is_main && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      ⭐ Principal
                    </span>
                  </div>
                )}

                {/* Ordem da foto */}
                <div className="absolute top-2 right-2 z-10">
                  <span className="bg-gray-900 bg-opacity-75 text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{index + 1}
                  </span>
                </div>

                {/* Imagem */}
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={`http://localhost:3001/uploads/properties/${photo.filename}`}
                    alt={photo.alt_text}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      console.error(
                        `❌ Erro ao carregar imagem: ${photo.filename}`
                      );
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4QzEwLjg5NTQgOCAxMCA4Ljg5NTQzIDEwIDEwQzEwIDExLjEwNDYgMTAuODk1NCAxMiAxMiAxMkMxMy4xMDQ2IDEyIDE0IDExLjEwNDYgMTQgMTBDMTQgOC44OTU0MyAxMy4xMDQ2IDggMTIgOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIxIDNIM0MyLjQ0NzcxIDMgMiAzLjQ0NzcxIDIgNFYyMEMyIDIwLjU1MjMgMi40NDc3MSAyMSAzIDIxSDIxQzIxLjU1MjMgMjEgMjIgMjAuNTUyMyAyMiAyMFY0QzIyIDMuNDQ3NzEgMjEuNTUyMyAzIDIxIDNaTTIwIDE5SDRWNUgyMFYxOVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                      e.target.onerror = null;
                    }}
                    onLoad={() =>
                      console.log(`✅ Imagem carregada: ${photo.filename}`)
                    }
                  />
                </div>

                {/* Overlay com ações */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    {!photo.is_main && (
                      <button
                        onClick={() => setMainPhoto(photo.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors"
                        title="Definir como principal"
                      >
                        ⭐ Principal
                      </button>
                    )}

                    <button
                      onClick={() => deletePhoto(photo.id, photo.filename)}
                      className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                      title="Excluir foto"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>

                {/* Informações da foto */}
                <div className="p-3">
                  <p className="text-sm text-gray-600 truncate">
                    {photo.alt_text || photo.original_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Arquivo: {photo.filename}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Instruções */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">💡 Dicas:</h5>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Arraste as fotos para reordená-las</li>
              <li>
                • A primeira foto é definida automaticamente como principal
              </li>
              <li>• Use nomes descritivos para melhor SEO</li>
              <li>• Recomendamos pelo menos 3-5 fotos por imóvel</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <div className="text-4xl mb-4">📷</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma foto adicionada
          </h4>
          <p className="text-gray-600">
            Faça upload das primeiras fotos do imóvel usando a área acima 
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
