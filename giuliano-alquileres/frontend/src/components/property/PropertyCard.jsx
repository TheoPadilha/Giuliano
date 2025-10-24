// AIRBNB STYLE PropertyCard - Cópia Exata do Design
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";
import FavoriteButton from "./FavoriteButton";

const PropertyCard = ({ property }) => {
  const getTypeLabel = (type) => {
    const types = {
      apartment: "Apartamento",
      house: "Casa inteira",
      studio: "Studio",
      penthouse: "Cobertura",
    };
    return types[type] || type;
  };

  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const propertyId = property.uuid || property.id;

  const getPhotoUrl = (filename) => {
    if (!filename) return null;
    if (filename.startsWith("http")) return filename;
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    return `${API_URL}/uploads/properties/${filename}`;
  };

  const mainPhoto =
    property.photos && property.photos.length > 0
      ? typeof property.photos[0] === "string"
        ? property.photos[0]
        : property.photos[0].filename
      : null;

  // Rating fictício (pode vir do backend)
  const rating = property.rating || 4.8;
  const reviewCount = property.review_count || 124;

  return (
    <Link to={`/property/${propertyId}`} className="group block">
      <div className="w-full">
        {/* Container da Imagem - Estilo Airbnb */}
        <div className="relative mb-3">
          {/* Imagem Principal */}
          <div className="relative aspect-[20/19] rounded-xlarge overflow-hidden">
            {mainPhoto ? (
              <img
                src={getPhotoUrl(mainPhoto)}
                alt={property.title}
                className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-200"
                loading="lazy"
                onError={(e) => {
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23F7F7F7'/%3E%3C/svg%3E";
                }}
              />
            ) : (
              <div className="w-full h-full bg-airbnb-grey-50 flex items-center justify-center">
                <div className="text-airbnb-grey-300 text-4xl">🏠</div>
              </div>
            )}

            {/* Loading Skeleton */}
            <div className="absolute inset-0 bg-gradient-to-r from-airbnb-grey-50 via-airbnb-grey-100 to-airbnb-grey-50 bg-[length:200%_100%] animate-shimmer opacity-0 group-hover:opacity-0"></div>
          </div>

          {/* Botão Favorito - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton propertyId={property.id} />
          </div>

          {/* Badge Superhost (se aplicável) */}
          {property.is_featured && (
            <div className="absolute top-3 left-3 bg-white text-airbnb-black text-xs font-semibold px-2 py-1 rounded-small shadow-sm">
              Superhost
            </div>
          )}
        </div>

        {/* Informações do Card - Estilo Airbnb */}
        <div className="flex flex-col">
          {/* Rating e Reviews */}
          <div className="flex items-center mb-1">
            <FaStar className="text-airbnb-black text-xs mr-1" />
            <span className="text-airbnb-black text-sm font-normal">
              {rating.toFixed(1)}
            </span>
            <span className="text-airbnb-grey-400 text-sm ml-1">
              ({reviewCount})
            </span>
          </div>

          {/* Localização */}
          <h3 className="text-airbnb-black text-base font-normal mb-0.5 line-clamp-1">
            {property.address?.split(',')[0] || property.city || "Brasil"}
          </h3>

          {/* Tipo de Propriedade */}
          <p className="text-airbnb-grey-400 text-sm font-normal mb-1 line-clamp-1">
            {getTypeLabel(property.type)}
          </p>

          {/* Detalhes (quartos, hóspedes) */}
          <p className="text-airbnb-grey-400 text-sm font-normal mb-2">
            {property.max_guests} hóspedes · {property.bedrooms} quarto{property.bedrooms > 1 ? 's' : ''} · {property.bathrooms} banheiro{property.bathrooms > 1 ? 's' : ''}
          </p>

          {/* Preço */}
          <div className="flex items-baseline">
            <span className="text-airbnb-black text-base font-semibold">
              R$ {formatPrice(property.price_per_night)}
            </span>
            <span className="text-airbnb-black text-sm font-normal ml-1">
              / noite
            </span>
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
