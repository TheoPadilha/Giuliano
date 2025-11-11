// PropertyCard.jsx - Versão Minimalista e Elegante (SEM Context)
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaStar, FaCrown } from "react-icons/fa";
import { IoBedOutline, IoLocationOutline } from "react-icons/io5";
import { BsPeople } from "react-icons/bs";
import { MdBathtub } from "react-icons/md";
import { trackPropertyClick, trackAddToWishlist } from "../../utils/googleAnalytics";
import { UPLOADS_URL } from "../../services/api";

const PropertyCard = ({ property, layout = "vertical", showPremiumBadge = false }) => {
  // Estado local para favorito (sem dependência de Context)
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Toggle simples de favorito
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    // Rastrear adição aos favoritos
    if (newFavoriteState) {
      trackAddToWishlist(property);
    }
  };

  // Rastrear clique no card
  const handleCardClick = () => {
    trackPropertyClick(property, 0);
  };

  // Pegar imagem principal ou primeira imagem
  const getImageUrl = () => {
    if (imageError) {
      return "https://placehold.co/800x600/e0e0e0/666666?text=Sem+Imagem";
    }

    // Backend pode retornar photos, images ou property_images
    const images = property.photos || property.images || property.property_images || [];

    if (images.length > 0) {
      // Prioridade 1: Foto marcada como principal (is_main)
      let image = images.find(img => img.is_main === true);

      // Prioridade 2: Foto com menor display_order
      if (!image) {
        image = images.reduce((prev, curr) =>
          (curr.display_order < prev.display_order) ? curr : prev
        );
      }

      // Prioridade 3: Primeira do array
      if (!image) {
        image = images[0];
      }

      // Prioridade: url (do backend) > cloudinary_url > URL local
      if (image) {
        // PRIORIDADE 1: URL completa retornada pelo backend (já vem com Cloudinary)
        if (image.url && image.url.startsWith("http")) {
          return image.url;
        }

        // PRIORIDADE 2: cloudinary_url (compatibilidade com dados antigos)
        if (image.cloudinary_url) {
          return image.cloudinary_url;
        }

        // PRIORIDADE 3: Se tem filename e não contém '/', construir URL local
        if (image.filename && !image.filename.includes('/')) {
          const url = `${UPLOADS_URL}/properties/${image.filename}`;
          return url;
        }

        // Caso contrário, usar image_url se disponível
        if (image.image_url) {
          return image.image_url;
        }
      }

      return "https://placehold.co/800x600/e0e0e0/666666?text=Sem+Imagem";
    }

    return "https://placehold.co/800x600/e0e0e0/666666?text=Sem+Imagem";
  };

  // Formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calcular média de avaliações
  const averageRating = property.average_rating || 0;
  const reviewsCount = property.reviews_count || 0;

  // Layout Vertical (Grid)
  if (layout === "vertical") {
    return (
      <Link
        to={`/property/${property.uuid || property.id}`}
        className="group block"
        onClick={handleCardClick}
      >
        <div className="relative">
          {/* Container da Imagem */}
          <div className="relative aspect-square rounded-xlarge overflow-hidden bg-airbnb-grey-100 mb-3">
            <img
              src={getImageUrl()}
              alt={property.title || property.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />

            {/* Botão de Favorito */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm z-10"
            >
              {isFavorite ? (
                <FaHeart className="text-rausch text-base" />
              ) : (
                <FaRegHeart className="text-airbnb-black text-base" />
              )}
            </button>

            {/* Badge Preferido dos hóspedes */}
            {(property.is_featured || showPremiumBadge) && (
              <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-white text-airbnb-black text-[11px] font-semibold rounded-md shadow-md flex items-center gap-1 border border-airbnb-grey-200">
                <FaCrown className="text-[10px] text-yellow-600" />
                <span>Preferido dos hóspedes</span>
              </div>
            )}

            {/* Indicadores de Imagem */}
            {(property.photos || property.images)?.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {(property.photos || property.images || []).slice(0, 5).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      idx === 0
                        ? "bg-white w-6"
                        : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-1">
            {/* Localização e Avaliação */}
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-airbnb-black text-[15px] truncate flex-1">
                {property.city?.name || property.location || "Localização"}
              </h3>
              
              {averageRating > 0 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  <FaStar className="text-xs text-airbnb-black" />
                  <span className="text-sm font-medium text-airbnb-black">
                    {averageRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Título */}
            <p className="text-airbnb-grey-600 text-[15px] truncate">
              {property.title || property.name || "Propriedade"}
            </p>

            {/* Detalhes */}
            <div className="flex items-center gap-3 text-airbnb-grey-600 text-sm">
              {property.max_guests && (
                <div className="flex items-center gap-1">
                  <BsPeople className="text-sm" />
                  <span>{property.max_guests}</span>
                </div>
              )}
              
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1">
                  <IoBedOutline className="text-sm" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1">
                  <MdBathtub className="text-sm" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
            </div>

            {/* Preço */}
            <div className="pt-1">
              <p className="text-airbnb-black font-semibold text-[15px]">
                {formatPrice(property.price_per_night || property.price || 0)}
                <span className="font-normal text-airbnb-grey-600"> / noite</span>
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Layout Horizontal (Lista)
  if (layout === "horizontal") {
    return (
      <Link
        to={`/property/${property.uuid || property.id}`}
        className="group block"
        onClick={handleCardClick}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-airbnb-grey-200 rounded-xl hover:shadow-lg transition-all duration-200">
          {/* Imagem */}
          <div className="relative w-full sm:w-48 md:w-64 flex-shrink-0">
            <div className="aspect-[4/3] sm:aspect-square rounded-lg overflow-hidden bg-airbnb-grey-100">
              <img
                src={getImageUrl()}
                alt={property.title || property.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>

            {/* Botão de Favorito */}
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 active:scale-95 transition-all shadow-sm"
            >
              {isFavorite ? (
                <FaHeart className="text-rausch text-base" />
              ) : (
                <FaRegHeart className="text-airbnb-black text-base" />
              )}
            </button>

            {/* Badge Premium ou Preferido dos hóspedes */}
            {(property.is_featured || showPremiumBadge) && (
              <div className="absolute top-2 left-2 px-2.5 py-1.5 bg-white text-airbnb-black text-[11px] font-semibold rounded-md shadow-md flex items-center gap-1 border border-airbnb-grey-200">
                <FaCrown className="text-[10px] text-yellow-600" />
                <span>Preferido dos hóspedes</span>
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="flex-1 flex flex-col justify-between py-1">
            {/* Topo */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-airbnb-black mb-1 line-clamp-2">
                    {property.title || property.name || "Propriedade"}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-airbnb-grey-600 text-sm mb-3">
                    <IoLocationOutline className="text-base" />
                    <span>{property.city?.name || property.location || "Localização"}</span>
                  </div>
                </div>

                {averageRating > 0 && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <FaStar className="text-sm text-airbnb-black" />
                    <span className="text-base font-semibold text-airbnb-black">
                      {averageRating.toFixed(1)}
                    </span>
                    {reviewsCount > 0 && (
                      <span className="text-sm text-airbnb-grey-600">
                        ({reviewsCount})
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Descrição */}
              {property.description && (
                <p className="text-airbnb-grey-600 text-sm line-clamp-2 mb-4">
                  {property.description}
                </p>
              )}

              {/* Detalhes */}
              <div className="flex items-center gap-4 text-airbnb-grey-600">
                {property.max_guests && (
                  <div className="flex items-center gap-1.5">
                    <BsPeople className="text-base" />
                    <span className="text-sm">{property.max_guests} hóspedes</span>
                  </div>
                )}
                
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-1.5">
                    <IoBedOutline className="text-base" />
                    <span className="text-sm">
                      {property.bedrooms} {property.bedrooms === 1 ? "quarto" : "quartos"}
                    </span>
                  </div>
                )}
                
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-1.5">
                    <MdBathtub className="text-base" />
                    <span className="text-sm">
                      {property.bathrooms} {property.bathrooms === 1 ? "banheiro" : "banheiros"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé - Preço */}
            <div className="flex items-end justify-between pt-4 border-t border-airbnb-grey-200 mt-4">
              <div>
                <p className="text-sm text-airbnb-grey-600 mb-1">A partir de</p>
                <p className="text-2xl font-semibold text-airbnb-black">
                  {formatPrice(property.price_per_night || property.price || 0)}
                  <span className="text-base font-normal text-airbnb-grey-600"> / noite</span>
                </p>
              </div>

              <button className="px-6 py-2.5 bg-rausch hover:bg-rausch-dark text-white font-semibold rounded-lg transition-colors">
                Ver detalhes
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return null;
};

export default PropertyCard;