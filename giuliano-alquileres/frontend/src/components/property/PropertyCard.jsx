// src/components/property/PropertyCard.jsx

import { Link } from "react-router-dom";
import PropTypes from "prop-types";

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

  return (
    <Link to={`/properties/${property.uuid}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-amber-400/30 transform hover:-translate-y-2">
        {/* Imagem */}
        <div className="relative h-64 overflow-hidden">
          {property.photos && property.photos.length > 0 ? (
            <img
              src={property.photos[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-6xl">🏠</span>
            </div>
          )}

          {/* Badge Featured */}
          {property.is_featured && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 px-3 py-1 rounded-full font-bold text-xs shadow-lg flex items-center gap-1">
              <span>⭐</span>
              <span>Destaque</span>
            </div>
          )}

          {/* Badge Tipo */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full font-semibold text-xs shadow-md">
            {getTypeLabel(property.type)}
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
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-semibold">
                  {property.bedrooms} 🛏️
                </span>
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
            <span className="mr-1">📍</span>
            {property.address}
          </p>

          {/* Divisor Dourado */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-4"></div>

          {/* Características */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center text-gray-700">
                <span className="mr-1">🛏️</span>
                <span className="font-semibold">{property.bedrooms}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-1">🚿</span>
                <span className="font-semibold">{property.bathrooms}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <span className="mr-1">📐</span>
                <span className="font-semibold">{property.area}m²</span>
              </div>
            </div>

            {/* Ícone de seta */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-600 to-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white text-sm">→</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    price_per_night: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    area: PropTypes.number.isRequired,
    photos: PropTypes.arrayOf(PropTypes.string),
    is_featured: PropTypes.bool,
  }).isRequired,
};

export default PropertyCard;
