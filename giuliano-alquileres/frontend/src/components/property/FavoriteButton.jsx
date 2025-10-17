import { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const FavoriteButton = ({ propertyId, className = "" }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIsFavorite();
    }
  }, [propertyId, user]);

  const checkIsFavorite = async () => {
    try {
      const response = await api.get(`/favorites/check/${propertyId}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert('Faça login para adicionar aos favoritos');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${propertyId}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${propertyId}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Erro ao alterar favorito:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-200 ${
        isFavorite 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white text-gray-600 hover:text-red-500 hover:bg-red-50'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <FaHeart className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
    </button>
  );
};

export default FavoriteButton;