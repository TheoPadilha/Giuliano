// src/pages/PropertyDetails.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Loading from "../components/common/Loading";

const PropertyDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Carregar dados do imóvel
  useEffect(() => {
    const fetchProperty = async () => {
      if (!uuid) {
        setError("ID do imóvel não encontrado");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/properties/${uuid}`);
        const propertyData = response.data.property;

        if (!propertyData) {
          setError("Imóvel não encontrado");
          return;
        }

        setProperty(propertyData);
        console.log("✅ Imóvel carregado:", propertyData);
      } catch (err) {
        console.error("❌ Erro ao carregar imóvel:", err);
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

  // Funções da galeria de fotos
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

  // Função WhatsApp
  const handleWhatsAppContact = () => {
    const message = `Olá! Tenho interesse no imóvel: "${property.title}" - ${window.location.href}`;
    const phoneNumber = "5547989105580"; // Substitua pelo número real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

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

  // Função para obter ícone da comodidade
  const getAmenityIcon = (iconName) => {
    const icons = {
      wifi: "📶",
      snowflake: "❄️",
      waves: "🏊",
      "chef-hat": "👨‍🍳",
      tv: "📺",
      "washing-machine": "🧺",
      home: "🏠",
      flame: "🔥",
      car: "🚗",
      shield: "🛡️",
    };
    return icons[iconName] || "⭐";
  };

  // Agrupar comodidades
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
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Imóvel não encontrado"}
          </h1>
          <p className="text-gray-600 mb-6">
            O imóvel que você procura pode ter sido removido ou não existe.
          </p>
          <div className="space-y-3">
            <Link to="/" className="btn-primary block">
              🏠 Ver Todos os Imóveis
            </Link>
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary block w-full"
            >
              ← Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const photos = property.photos || [];
  const amenityGroups = groupAmenitiesByCategory(property.amenities);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navegação */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Voltar
              </button>
              <div>
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Giuliano Alquileres
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500">
                <option value="pt">🇧🇷 Português</option>
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal - Fotos e Informações */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galeria de Fotos */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {photos.length > 0 ? (
                <div className="relative">
                  {/* Foto Principal */}
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <img
                      src={`http://localhost:3001/uploads/properties/${photos[currentPhotoIndex].filename}`}
                      alt={photos[currentPhotoIndex].alt_text || property.title}
                      className="w-full h-96 object-cover"
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA4QzEwLjg5NTQgOCAxMCA4Ljg5NTQzIDEwIDEwQzEwIDExLjEwNDYgMTAuODk1NCAxMiAxMiAxMkMxMy4xMDQ2IDEyIDE0IDExLjEwNDYgMTQgMTBDMTQgOC44OTU0MyAxMy4xMDQ2IDggMTIgOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIxIDNIM0MyLjQ0NzcxIDMgMiAzLjQ0NzcxIDIgNFYyMEMyIDIwLjU1MjMgMi40NDc3MSAyMSAzIDIxSDIxQzIxLjU1MjMgMjEgMjIgMjAuNTUyMyAyMiAyMFY0QzIyIDMuNDQ3NzEgMjEuNTUyMyAzIDIxIDNaTTIwIDE5SDRWNUgyMFYxOVoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+";
                      }}
                    />
                  </div>

                  {/* Controles de Navegação */}
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={prevPhoto}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextPhoto}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
                      >
                        →
                      </button>

                      {/* Indicador de posição */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentPhotoIndex + 1} / {photos.length}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="h-96 bg-gray-200 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-6xl mb-4">📷</div>
                    <p>Nenhuma foto disponível</p>
                  </div>
                </div>
              )}

              {/* Miniaturas */}
              {photos.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-6 gap-2">
                    {photos.map((photo, index) => (
                      <button
                        key={photo.id}
                        onClick={() => goToPhoto(index)}
                        className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === currentPhotoIndex
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={`http://localhost:3001/uploads/properties/${photo.filename}`}
                          alt={photo.alt_text}
                          className="w-full h-16 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Informações do Imóvel */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {property.title}
                  </h1>
                  {property.is_featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      ⭐ Destaque
                    </span>
                  )}
                </div>

                <div className="flex items-center text-gray-600 mb-4">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-lg">
                    {property.city?.name}, {property.city?.state}
                  </span>
                  {property.neighborhood && (
                    <span className="ml-2 text-gray-500">
                      • {property.neighborhood}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-6 text-gray-600 text-lg">
                  <div className="flex items-center">
                    <span className="mr-2">👥</span>
                    <span>{property.max_guests} hóspedes</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🛏️</span>
                    <span>{property.bedrooms} quartos</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🚿</span>
                    <span>{property.bathrooms} banheiros</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">🏠</span>
                    <span>{getTypeLabel(property.type)}</span>
                  </div>
                </div>
              </div>

              {/* Descrição */}
              {property.description && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    📝 Sobre o Imóvel
                  </h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Comodidades */}
              {property.amenities && property.amenities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    ⭐ Comodidades
                  </h2>

                  {Object.entries(amenityGroups).map(
                    ([category, amenities]) =>
                      amenities.length > 0 && (
                        <div key={category} className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
                            {category === "basic" && "🏠 Básicas"}
                            {category === "comfort" && "😌 Conforto"}
                            {category === "entertainment" &&
                              "🎉 Entretenimento"}
                            {category === "safety" && "🛡️ Segurança"}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {amenities.map((amenity) => (
                              <div
                                key={amenity.id}
                                className="flex items-center p-3 bg-gray-50 rounded-lg"
                              >
                                <span className="text-xl mr-3">
                                  {getAmenityIcon(amenity.icon)}
                                </span>
                                <span className="text-sm text-gray-700 font-medium">
                                  {amenity.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              )}
            </div>

            {/* Localização */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                📍 Localização
              </h2>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-gray-600 mr-3 mt-1">🏠</span>
                  <div>
                    <p className="font-medium text-gray-900">Endereço</p>
                    <p className="text-gray-600">{property.address}</p>
                    {property.neighborhood && (
                      <p className="text-sm text-gray-500">
                        Bairro: {property.neighborhood}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-gray-600 mr-3 mt-1">🌎</span>
                  <div>
                    <p className="font-medium text-gray-900">Cidade</p>
                    <p className="text-gray-600">
                      {property.city?.name}, {property.city?.state}
                      {property.city?.country && ` - ${property.city.country}`}
                    </p>
                  </div>
                </div>

                {/* Placeholder para mapa - você pode integrar Google Maps ou similar */}
                <div className="mt-6 h-64 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">🗺️</div>
                    <p className="text-lg font-medium">
                      Mapa em Desenvolvimento
                    </p>
                    <p className="text-sm">
                      Em breve: visualização interativa da localização
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Preços e Contato */}
          <div className="space-y-6">
            {/* Card de Preços */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    R${" "}
                    {property.price_per_night
                      ? Number(property.price_per_night).toLocaleString(
                          "pt-BR",
                          { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                        )
                      : "0,00"}
                  </div>
                  <div className="text-gray-600">por noite</div>
                </div>

                {/* Preços especiais */}
                {(property.weekend_price || property.high_season_price) && (
                  <div className="mt-4 space-y-2 text-sm">
                    {property.weekend_price && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fim de semana:</span>
                        <span className="font-medium">
                          R${" "}
                          {Number(property.weekend_price).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    )}
                    {property.high_season_price && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alta temporada:</span>
                        <span className="font-medium">
                          R${" "}
                          {Number(property.high_season_price).toLocaleString(
                            "pt-BR",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Botão WhatsApp Principal */}
                <button
                  onClick={handleWhatsAppContact}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                >
                  <span className="text-2xl mr-3">💬</span>
                  Conversar no WhatsApp
                </button>

                {/* Informações de Contato */}
                <div className="text-center space-y-2 text-sm text-gray-600">
                  <p className="flex items-center justify-center">
                    <span className="mr-2">⚡</span>
                    Resposta rápida garantida
                  </p>
                  <p className="flex items-center justify-center">
                    <span className="mr-2">🔒</span>
                    Reserva segura e fácil
                  </p>
                  <p className="flex items-center justify-center">
                    <span className="mr-2">❓</span>
                    Tire suas dúvidas sem compromisso
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                ℹ️ Informações Importantes
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <div>
                    <p className="font-medium">Check-in Flexível</p>
                    <p className="text-gray-600">
                      Horário combinado via WhatsApp
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <div>
                    <p className="font-medium">Limpeza Incluída</p>
                    <p className="text-gray-600">
                      Imóvel higienizado para sua chegada
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <div>
                    <p className="font-medium">Suporte 24h</p>
                    <p className="text-gray-600">
                      Atendimento durante toda sua estadia
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">✓</span>
                  <div>
                    <p className="font-medium">Cancelamento</p>
                    <p className="text-gray-600">
                      Política flexível - consulte condições
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Botão Voltar para a Lista */}
            <Link
              to="/"
              className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-colors duration-200"
            >
              ← Ver Outros Imóveis
            </Link>
          </div>
        </div>
      </div>

      {/* WhatsApp Flutuante */}
      <button
        onClick={handleWhatsAppContact}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 transform hover:scale-110 z-50"
        title="Contato via WhatsApp"
      >
        <div className="text-2xl">💬</div>
      </button>
    </div>
  );
};

export default PropertyDetails;
