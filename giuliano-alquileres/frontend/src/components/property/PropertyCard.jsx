// giuliano-alquileres/frontend/src/components/property/PropertyCard.jsx
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaHome, FaStar, FaBed, FaShower, FaUsers, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";

const PropertyCard = ({ property }) => {
  const getTypeLabel = (type) => {
    const types = {
      apartment: "Apartamento",
      house: "Casa",
      studio: "Studio",
      penthouse: "Cobertura",
    };
    return types[type] || type;
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // 🔧 CORREÇÃO: Garantir que temos o UUID correto
  const propertyId = property.uuid || property.id;

  // 🔧 CORREÇÃO: URL da foto usando o backend
  const getPhotoUrl = (filename) => {
    if (!filename) return null;
    // Se já é uma URL completa, usa direto
    if (filename.startsWith("http")) return filename;
    // Caso contrário, monta a URL do backend (usar variável de ambiente)
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${API_URL}/uploads/properties/${filename}`;
  };

  // Pegar a primeira foto
  const mainPhoto =
    property.photos && property.photos.length > 0
      ? typeof property.photos[0] === "string"
        ? property.photos[0]
        : property.photos[0].filename
      : null;

  return (
    <Link to={`/property/${propertyId}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-amber-400/30 transform hover:-translate-y-2">
        {/* Imagem */}
        <div className="relative h-64 overflow-hidden">
          {mainPhoto ? (
            <img
              src={getPhotoUrl(mainPhoto)}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                console.error("Erro ao carregar imagem:", mainPhoto);
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <FaHome className="text-6xl text-gray-400" />
            </div>
          )}

          {/* Badge Featured */}
          {property.is_featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full font-bold text-xs shadow-lg flex items-center gap-1">
              <FaStar />
              <span>Destaque</span>
            </div>
          )}

          {/* Badge Tipo */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full font-semibold text-xs shadow-md">
            {getTypeLabel(property.type)}
          </div>

          {/* Botão de Favorito */}
          <div className="absolute top-4 right-4">
            <FavoriteButton propertyId={property.id} className="shadow-lg" />
          </div>

          {/* Overlay de Preço */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-gray-300 text-xs mb-1">A partir de</p>
                <p className="text-white text-2xl font-bold">
                  R$ {formatPrice(property.price_per_night)}
                </p>
                <p className="text-gray-300 text-xs">por noite</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <span className="text-white text-sm font-semibold">
                  {property.bedrooms}
                </span>
                <FaBed className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5">
          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-700 transition-colors">
            {property.title}
          </h3>

          {/* Localização */}
          <p className="text-gray-600 text-sm mb-4 flex items-center line-clamp-1">
            <FaMapMarkerAlt className="mr-1" />
            {property.address}
          </p>

          {/* Divisor Dourado */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4"></div>

          {/* Características */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-700">
                <FaBed className="mr-1" />
                <span className="font-semibold">{property.bedrooms}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaShower className="mr-1" />
                <span className="font-semibold">{property.bathrooms}</span>
              </div>
              {property.max_guests && (
                <div className="flex items-center text-gray-700">
                  <FaUsers className="mr-1" />
                  <span className="font-semibold">{property.max_guests}</span>
                </div>
              )}
            </div>

            {/* Ícone de seta */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FaArrowRight className="text-white text-sm" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    uuid: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price_per_night: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    max_guests: PropTypes.number,
    photos: PropTypes.array,
    is_featured: PropTypes.bool,
  }).isRequired,
};

export default PropertyCard;
