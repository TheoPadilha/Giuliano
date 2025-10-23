import { useState, useEffect } from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../../services/api';

const ReviewSection = ({ propertyId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [propertyId]);

  const fetchReviews = async (pageNum = 1) => {
    try {
      const response = await api.get(`/api/reviews/property/${propertyId}?page=${pageNum}&limit=5`);
      
      if (pageNum === 1) {
        setReviews(response.data.reviews);
        setStats(response.data.stats);
      } else {
        setReviews(prev => [...prev, ...response.data.reviews]);
      }
      
      setHasMore(response.data.pagination.page < response.data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchReviews(page + 1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const renderRatingBar = (label, rating) => (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600 w-20">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${(rating / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-900 w-8">{rating}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <FaStar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ainda não há avaliações
        </h3>
        <p className="text-gray-600">
          Seja o primeiro a avaliar esta propriedade
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avaliação Geral */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {stats.avg_rating}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(stats.avg_rating))}
            </div>
            <p className="text-gray-600">
              {stats.total_reviews} avaliação{stats.total_reviews !== 1 ? 'ões' : ''}
            </p>
          </div>

          {/* Detalhes por Categoria */}
          <div className="space-y-3">
            {renderRatingBar('Limpeza', stats.avg_cleanliness)}
            {renderRatingBar('Localização', stats.avg_location)}
            {renderRatingBar('Custo-benefício', stats.avg_value)}
            {renderRatingBar('Comunicação', stats.avg_communication)}
          </div>
        </div>
      </div>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {review.user.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <FaUser className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                  <span className="text-sm text-gray-500">
                    {format(new Date(review.created_at), 'MMM yyyy', { locale: ptBR })}
                  </span>
                </div>
                
                <div className="flex items-center mb-3">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    {review.rating}/5
                  </span>
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Botão Carregar Mais */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Carregar mais avaliações
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;