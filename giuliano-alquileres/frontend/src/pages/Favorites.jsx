import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import PropertyCard from '../components/property/PropertyCard';
import { FaHeart } from 'react-icons/fa';

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/api/favorites');
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Faça login para ver seus favoritos
          </h2>
          <Link
            to="/login"
            className="link"
          >
            Fazer login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-sm mx-auto mb-4"></div>
          <p className="mt-4 text-airbnb-grey-600">Carregando seus favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="heading-2 mb-2">Meus Favoritos</h1>
          <p className="text-airbnb-grey-600">
            {favorites.length} propriedade{favorites.length !== 1 ? 's' : ''} salva{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="card p-12 text-center">
            <FaHeart className="mx-auto h-12 w-12 text-airbnb-grey-400 mb-4" />
            <h3 className="heading-3 mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-airbnb-grey-600 mb-6">
              Explore nossas propriedades e salve suas favoritas clicando no coração
            </p>
            <Link
              to="/properties"
              className="btn-primary inline-flex items-center"
            >
              Explorar Propriedades
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavoriteChange={fetchFavorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;