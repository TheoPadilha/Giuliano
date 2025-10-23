import { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { reviewsAPI } from "../../services/api";

const CreateReviewModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    cleanliness_rating: 5,
    location_rating: 5,
    value_rating: 5,
    communication_rating: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStarClick = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await reviewsAPI.create({
        property_id: booking.property.id,
        booking_id: booking.id,
        ...formData,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Erro ao criar avaliação:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Erro ao enviar avaliação"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const StarRating = ({ label, field, value }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(field, star)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <FaStar
              className={`text-2xl ${
                star <= value ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-gray-600 font-medium">{value}/5</span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Avaliar Estadia
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {booking?.property?.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Avaliação Geral */}
          <StarRating label="Avaliação Geral" field="rating" value={formData.rating} />

          {/* Avaliações Específicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <StarRating
              label="Limpeza"
              field="cleanliness_rating"
              value={formData.cleanliness_rating}
            />
            <StarRating
              label="Localização"
              field="location_rating"
              value={formData.location_rating}
            />
            <StarRating
              label="Custo-Benefício"
              field="value_rating"
              value={formData.value_rating}
            />
            <StarRating
              label="Comunicação"
              field="communication_rating"
              value={formData.communication_rating}
            />
          </div>

          {/* Comentário */}
          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Comentário (opcional)
            </label>
            <textarea
              id="comment"
              rows="4"
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Compartilhe sua experiência sobre a propriedade..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.comment.length} caracteres
            </p>
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar Avaliação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReviewModal;
