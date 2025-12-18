import { useState, useRef } from "react";
import { FaCamera, FaTrash, FaUser } from "react-icons/fa";
import api from "../../services/api";

const AvatarUpload = ({ currentAvatar, onAvatarChange }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentAvatar);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem válida");
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB");
      return;
    }

    try {
      setUploading(true);

      // Criar FormData
      const formData = new FormData();
      formData.append("avatar", file);

      // Upload
      const response = await api.post("/api/users/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Atualizar preview
      setPreview(response.data.avatarUrl);

      // Notificar componente pai
      if (onAvatarChange) {
        onAvatarChange(response.data.avatarUrl);
      }

      alert("Avatar atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao fazer upload:", error);
      alert(
        error.response?.data?.error ||
          "Erro ao fazer upload do avatar. Tente novamente."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm("Deseja realmente remover seu avatar?")) {
      return;
    }

    try {
      setUploading(true);

      await api.delete("/api/users/avatar");

      // Limpar preview
      setPreview(null);

      // Notificar componente pai
      if (onAvatarChange) {
        onAvatarChange(null);
      }

      alert("Avatar removido com sucesso!");
    } catch (error) {
      console.error("Erro ao deletar avatar:", error);
      alert(
        error.response?.data?.error ||
          "Erro ao deletar avatar. Tente novamente."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Avatar Preview */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-airbnb-grey-100 border-4 border-white shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rausch to-babu text-white">
              <FaUser className="text-5xl opacity-80" />
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg border-2 border-airbnb-grey-200 hover:bg-airbnb-grey-50 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          title="Alterar foto"
        >
          <FaCamera className="text-airbnb-grey-700" />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary text-sm !py-2 !px-4 disabled:opacity-50"
        >
          {uploading ? "Enviando..." : preview ? "Alterar foto" : "Adicionar foto"}
        </button>

        {preview && (
          <button
            onClick={handleDeleteAvatar}
            disabled={uploading}
            className="btn-secondary text-sm !py-2 !px-4 !text-red-600 hover:!bg-red-50 disabled:opacity-50"
          >
            <FaTrash className="inline mr-2" />
            Remover
          </button>
        )}
      </div>

      <p className="text-xs text-airbnb-grey-500 mt-3 text-center max-w-xs">
        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB
      </p>
    </div>
  );
};

export default AvatarUpload;
