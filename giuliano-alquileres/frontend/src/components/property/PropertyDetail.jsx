// src/pages/PropertyDetails.jsx - TEMA VERMELHO

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/common/Loading";
import {
  FaHome,
  FaStar,
  FaBed,
  FaShower,
  FaRuler,
  FaCar,
  FaMapMarkerAlt,
  FaComments,
  FaWifi,
  FaSnowflake,
  FaSwimmingPool,
  FaUtensils,
  FaTv,
  FaTshirt,
  FaFire,
  FaShieldAlt,
  FaArrowLeft,
  FaChevronLeft,
  FaChevronRight,
  FaCheck,
} from "react-icons/fa";

const PropertyDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const getPhotoUrl = (photo) => {
    if (!photo) return null;

    // Se photo é uma string (filename)
    if (typeof photo === "string") {
      // Se já é uma URL completa
      if (photo.startsWith("http")) return photo;
      // Caso contrário, monta a URL
      return `${
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      }/uploads/properties/${photo}`;
    }

    // Se photo é um objeto com filename
    if (photo.filename) {
      if (photo.filename.startsWith("http")) return photo.filename;
      return `${
        import.meta.env.VITE_API_URL || "http://localhost:5000"
      }/uploads/properties/${photo.filename}`;
    }

    return null;
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (!uuid) {
        setError("ID do imóvel não encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/properties/${uuid}`);
        const propertyData = response.data.property;

        if (!propertyData) {
          setError("Imóvel não encontrado");
          return;
        }

        setProperty(propertyData);
      } catch (err) {
        console.error("Erro ao carregar imóvel:", err);
        if (err.response?.status === 404) {
          setError("Imóvel não encontrado");
        } else {
          setError("Erro ao carregar dados do imóvel");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [uuid]);

  const nextPhoto = () => {
    if (property?.photos?.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === property.photos.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevPhoto = () => {
    if (property?.photos?.length > 0) {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? property.photos.length - 1 : prev - 1
      );
    }
  };

  const goToPhoto = (index) => {
    setCurrentPhotoIndex(index);
  };

  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse no imóvel: "${property.title}" - ${window.location.href}`;
    const phoneNumber = "5547989105580";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const getTypeLabel = (type) => {
    const types = {
      apartment: "Apartamento",
      house: "Casa",
      studio: "Studio",
      penthouse: "Cobertura",
    };
    return types[type] || type;
  };

  const getAmenityIcon = (iconName) => {
    const icons = {
      wifi: <FaWifi />,
      snowflake: <FaSnowflake />,
      waves: <FaSwimmingPool />,
      "chef-hat": "👨‍🍳",
      tv: <FaTv />,
      "washing-machine": <FaTshirt />,
      home: <FaHome />,
      flame: <FaFire />,
      car: <FaCar />,
      shield: <FaShieldAlt />,
    };
    return icons[iconName] || <FaStar />;
  };

  const groupAmenitiesByCategory = (amenities) => {
    const groups = {
      basic: [],
      comfort: [],
      entertainment: [],
      safety: [],
    };

    amenities?.forEach((amenity) => {
      const category = amenity.category || "basic";
      if (groups[category]) {
        groups[category].push(amenity);
      }
    });

    return groups;
  };

  if (loading) {
    return <Loading text="Carregando detalhes do imóvel..." />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-6xl mb-4">
            <FaHome className="text-gray-400 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Imóvel não encontrado"}
          </h1>
          <p className="text-gray-600 mb-6">
            O imóvel que você procura pode ter sido removido ou não existe.
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-3 px-8 rounded-xl inline-block shadow-lg hover:shadow-red-strong transition-all duration-200"
            >
              <FaHome className="mr-2" /> Ver Todos os Imóveis
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="bg-white text-primary-700 border-2 border-primary-600 hover:bg-primary-50 font-bold py-3 px-8 rounded-xl block w-full transition-all duration-200"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const groupedAmenities = groupAmenitiesByCategory(property.amenities);
  const categoryTitles = {
    basic: "Essenciais",
    comfort: "Conforto",
    entertainment: "Lazer",
    safety: "Segurança",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Botão Voltar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-700 hover:text-primary-800 font-semibold transition-colors"
          >
            <FaArrowLeft className="text-xl mr-2" />
            Voltar
          </button>
        </div>
      </div>

      {/* Galeria de Fotos */}
      <div className="relative bg-black">
        <div className="max-w-7xl mx-auto">
          {property.photos && property.photos.length > 0 ? (
            <div className="relative h-[400px] md:h-[600px]">
              <img
                src={property.photos[currentPhotoIndex]}
                alt={`${property.title} - Foto ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navegação de Fotos */}
              {property.photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  >
                    <FaChevronLeft className="text-2xl" />
                  </button>
                  <button
                    onClick={nextPhoto}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  >
                    <FaChevronRight className="text-2xl" />
                  </button>

                  {/* Indicadores */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {property.photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToPhoto(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentPhotoIndex
                            ? "bg-primary-600 w-8"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Contador */}
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentPhotoIndex + 1} / {property.photos.length}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="h-[400px] md:h-[600px] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <FaHome className="text-6xl mb-4 mx-auto" />
                <p className="text-lg">Sem fotos disponíveis</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Detalhes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cabeçalho */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                    {getTypeLabel(property.type)}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    {property.address}
                  </p>
                </div>
                {property.is_featured && (
                  <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    <FaStar className="mr-1" /> Destaque
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center">
                  <FaBed className="text-2xl mr-2 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.bedrooms}
                    </p>
                    <p className="text-sm text-gray-600">Quartos</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaShower className="text-2xl mr-2 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.bathrooms}
                    </p>
                    <p className="text-sm text-gray-600">Banheiros</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaRuler className="text-2xl mr-2 text-primary-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.area}
                    </p>
                    <p className="text-sm text-gray-600">m²</p>
                  </div>
                </div>
                {property.garage_spaces > 0 && (
                  <div className="flex items-center">
                    <FaCar className="text-2xl mr-2 text-primary-600" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {property.garage_spaces}
                      </p>
                      <p className="text-sm text-gray-600">Vagas</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Sobre o imóvel
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Comodidades */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Comodidades
                </h2>
                <div className="space-y-6">
                  {Object.entries(groupedAmenities).map(
                    ([category, amenities]) =>
                      amenities.length > 0 && (
                        <div key={category}>
                          <h3 className="text-lg font-semibold text-primary-700 mb-3">
                            {categoryTitles[category]}
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {amenities.map((amenity) => (
                              <div
                                key={amenity.id}
                                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
                              >
                                <span className="text-2xl mr-3 text-primary-600">
                                  {getAmenityIcon(amenity.icon)}
                                </span>
                                <span className="text-gray-900 font-medium">
                                  {amenity.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Informações de Contato */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Preço por noite</p>
                <p className="text-4xl font-bold text-primary-700">
                  R$ {parseFloat(property.price_per_night).toFixed(2)}
                </p>
              </div>

              <button
                onClick={handleWhatsAppContact}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-red-strong transition-all duration-200 flex items-center justify-center gap-3"
              >
                <FaComments className="text-2xl" />
                <span>Entrar em Contato</span>
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Informações adicionais
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center">
                    <FaCheck className="mr-2 text-green-500" />
                    Check-in flexível
                  </p>
                  <p className="flex items-center">
                    <FaCheck className="mr-2 text-green-500" />
                    Cancelamento grátis
                  </p>
                  <p className="flex items-center">
                    <FaCheck className="mr-2 text-green-500" />
                    Resposta rápida
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Ao entrar em contato, você será direcionado para o WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
