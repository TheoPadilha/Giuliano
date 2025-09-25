// src/components/property/PropertyCard.jsx

import { Link } from "react-router-dom";

const PropertyCard = ({ property, showWhatsApp = true, className = "" }) => {
  // Função para obter label do tipo
  const getTypeLabel = (type) => {
    const types = {
      apartment: "Apartamento",
      house: "Casa",
      studio: "Studio",
      penthouse: "Cobertura",
    };
    return types[type] || type;
  };

  // Função WhatsApp
  const handleWhatsAppContact = (e) => {
    e.preventDefault(); // Evita navegação do Link
    e.stopPropagation();

    const message = `Olá! Tenho interesse no imóvel: "${property.title}"`;
    const phoneNumber = "5547989105580"; // Substitua pelo número real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // URL da foto principal
  const mainPhoto =
    property.photos && property.photos.length > 0
      ? property.photos.find((photo) => photo.is_main) || property.photos[0]
      : null;

  const photoUrl = mainPhoto
    ? `http://localhost:3001/uploads/properties/${mainPhoto.filename}`
    : null;

  return (
    <Link
      to={`/property/${property.uuid || property.id}`}
      className={`block group ${className}`}
    >
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Badge de Destaque */}
        {property.is_featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              ⭐ DESTAQUE
            </span>
          </div>
        )}

        {/* Contador de Fotos */}
        {property.photos && property.photos.length > 1 && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-black bg-opacity-60 text-white text-xs font-medium px-2 py-1 rounded-full">
              📷 {property.photos.length}
            </span>
          </div>
        )}

        {/* Imagem Principal */}
        <div className="relative overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={mainPhoto?.alt_text || property.title}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.parentNode.innerHTML = `
                  <div class="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div class="text-center text-gray-400">
                      <div class="text-4xl mb-2">🏠</div>
                      <p class="text-sm">Sem foto</p>
                    </div>
                  </div>
                `;
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">🏠</div>
                <p className="text-sm">Sem foto disponível</p>
              </div>
            </div>
          )}

          {/* Overlay com tipo do imóvel */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-white bg-opacity-90 text-gray-800 text-xs font-semibold px-2 py-1 rounded-lg">
              {getTypeLabel(property.type)}
            </span>
          </div>
        </div>

        {/* Conteúdo do Card */}
        <div className="p-6">
          {/* Título e Localização */}
          <div className="mb-4">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-2">
              {property.title}
            </h3>

            <div className="flex items-center text-gray-600 mb-2">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">
                {property.city?.name}, {property.city?.state}
                {property.neighborhood && (
                  <span className="text-gray-400">
                    {" "}
                    • {property.neighborhood}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Características do Imóvel */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <span className="mr-1">👥</span>
                <span>{property.max_guests}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🛏️</span>
                <span>{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🚿</span>
                <span>{property.bathrooms}</span>
              </div>
            </div>

            {/* Status do Imóvel */}
            <div>
              {property.status === "available" ? (
                <span className="text-green-600 font-medium text-xs">
                  ✅ Disponível
                </span>
              ) : (
                <span className="text-gray-400 font-medium text-xs">
                  ❌ Indisponível
                </span>
              )}
            </div>
          </div>

          {/* Comodidades Principais */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {property.amenities.slice(0, 4).map((amenity) => (
                  <span
                    key={amenity.id}
                    className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                    title={amenity.name}
                  >
                    {amenity.icon === "wifi" && "📶"}
                    {amenity.icon === "snowflake" && "❄️"}
                    {amenity.icon === "waves" && "🏊"}
                    {amenity.icon === "car" && "🚗"}
                    {!["wifi", "snowflake", "waves", "car"].includes(
                      amenity.icon
                    ) && "⭐"}
                    <span className="ml-1">{amenity.name}</span>
                  </span>
                ))}
                {property.amenities.length > 4 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{property.amenities.length - 4} mais
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Preços e Ações */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                R${" "}
                {property.price_per_night
                  ? Number(property.price_per_night).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0,00"}
              </div>
              <div className="text-sm text-gray-600">por noite</div>

              {/* Preços especiais */}
              {(property.weekend_price || property.high_season_price) && (
                <div className="text-xs text-gray-500 mt-1">
                  {property.weekend_price && (
                    <div>
                      FDS: R${" "}
                      {Number(property.weekend_price).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </div>
                  )}
                  {property.high_season_price && (
                    <div>
                      Alta: R${" "}
                      {Number(property.high_season_price).toLocaleString(
                        "pt-BR",
                        { minimumFractionDigits: 2 }
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botão WhatsApp */}
            {showWhatsApp && property.status === "available" && (
              <button
                onClick={handleWhatsAppContact}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center"
                title="Contato via WhatsApp"
              >
                <span className="mr-2">💬</span>
                <span className="hidden sm:inline">WhatsApp</span>
                <span className="sm:hidden">Contato</span>
              </button>
            )}
          </div>

          {/* Botão Ver Detalhes (aparece no hover) */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-full bg-blue-600 text-white text-center py-2 rounded-lg font-medium text-sm">
              👀 Ver Detalhes Completos
            </div>
          </div>
        </div>

        {/* Indicador de Loading para transição */}
        <div className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-200 pointer-events-none"></div>
      </div>
    </Link>
  );
};

export default PropertyCard;
