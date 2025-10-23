import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaHome, FaCalendarAlt } from "react-icons/fa";
import { reviewsAPI } from "../services/api";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const fetchMyReviews = async () => {
    try {
      const response = await reviewsAPI.getMyReviews();
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Erro ao buscar minhas avaliações:", error);
    } finally {
      setLoading(false);
    }
  };

  const RatingDisplay = ({ label, value }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center">
        <FaStar className="text-yellow-400 text-sm mr-1" />
        <span className="font-medium text-gray-900">{value.toFixed(1)}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando suas avaliações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Minhas Avaliações
          </h1>
          <p className="text-gray-600">
            Confira as avaliações que você fez sobre as propriedades
          </p>
        </div>

        {/* Lista de Avaliações */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FaStar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma avaliação ainda
            </h3>
            <p className="text-gray-600 mb-6">
              Você ainda não fez nenhuma avaliação. Complete uma reserva para
              poder avaliar!
            </p>
            <Link
              to="/my-bookings"
              className="inline-block px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all"
            >
              Ver Minhas Reservas
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Header da Avaliação */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Imagem da Propriedade */}
                      {review.property?.photos?.[0] && (
                        <Link to={`/property/${review.property.uuid}`}>
                          <img
                            src={`${import.meta.env.VITE_API_URL}${
                              review.property.photos[0].url
                            }`}
                            alt={review.property.title}
                            className="w-24 h-24 rounded-lg object-cover hover:opacity-90 transition-opacity"
                          />
                        </Link>
                      )}

                      {/* Informações da Propriedade */}
                      <div className="flex-1">
                        <Link
                          to={`/property/${review.property?.uuid}`}
                          className="hover:text-red-600 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {review.property?.title}
                          </h3>
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <FaCalendarAlt className="mr-1" />
                          Avaliado em{" "}
                          {format(new Date(review.created_at), "dd 'de' MMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Avaliação Geral */}
                    <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg">
                      <FaStar className="text-yellow-400 text-xl mr-2" />
                      <span className="text-2xl font-bold text-gray-900">
                        {review.rating}
                      </span>
                      <span className="text-gray-600 ml-1">/5</span>
                    </div>
                  </div>

                  {/* Avaliações Específicas */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {review.cleanliness_rating && (
                      <RatingDisplay
                        label="Limpeza"
                        value={review.cleanliness_rating}
                      />
                    )}
                    {review.location_rating && (
                      <RatingDisplay
                        label="Localização"
                        value={review.location_rating}
                      />
                    )}
                    {review.value_rating && (
                      <RatingDisplay
                        label="Custo-Benefício"
                        value={review.value_rating}
                      />
                    )}
                    {review.communication_rating && (
                      <RatingDisplay
                        label="Comunicação"
                        value={review.communication_rating}
                      />
                    )}
                  </div>

                  {/* Comentário */}
                  {review.comment && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <p className="text-gray-700 leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  )}

                  {/* Status de Visibilidade */}
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        review.is_visible
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {review.is_visible ? "Visível" : "Oculto"}
                    </span>
                    <Link
                      to={`/property/${review.property?.uuid}`}
                      className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                    >
                      Ver Propriedade →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReviews;
