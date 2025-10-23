// PropertyDetails.jsx - VERSÃO PROFISSIONAL E IMPRESSIONANTE

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft, FaShare, FaStar, FaMapMarkerAlt,
  FaUsers, FaBed, FaBath, FaHome,
  FaCheckCircle, FaWhatsapp, FaClock
} from "react-icons/fa";
import api from "../services/api";
import Loading from "../components/common/Loading";
import DateRangePicker from "../components/search/DateRangePicker";
import RoomsGuestsPicker from "../components/search/RoomsGuestsPicker";
import ReviewSection from "../components/property/ReviewSection";
import FavoriteButton from "../components/property/FavoriteButton";

const PropertyDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();

  // Estados
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRoomsPicker, setShowRoomsPicker] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [bookingDates, setBookingDates] = useState({ checkIn: null, checkOut: null });
  const [rooms, setRooms] = useState([{ adults: 2, children: [] }]);
  const [totalNights, setTotalNights] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Carregar propriedade
  useEffect(() => {
    fetchProperty();
  }, [uuid]);

  // Carregar datas ocupadas quando a propriedade é carregada
  useEffect(() => {
    if (property?.id) {
      fetchOccupiedDates();
    }
  }, [property?.id]);

  // Calcular preço total
  useEffect(() => {
    if (bookingDates.checkIn && bookingDates.checkOut && property) {
      const checkIn = new Date(bookingDates.checkIn);
      const checkOut = new Date(bookingDates.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const price = Number(property.price_per_night) * nights;

      setTotalNights(nights);
      setTotalPrice(price);
    }
  }, [bookingDates, property]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/properties/${uuid}`);
      setProperty(response.data.property);
    } catch (err) {
      console.error("Erro ao carregar imóvel:", err);
      setError(err.response?.status === 404 ? "Imóvel não encontrado" : "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const fetchOccupiedDates = async () => {
    try {
      const response = await api.get(`/api/bookings/property/${property.id}/occupied`);
      setOccupiedDates(response.data.occupiedDates || []);
    } catch (error) {
      console.error("Erro ao buscar datas ocupadas:", error);
    }
  };

  const handleWhatsApp = () => {
    const totalGuests = rooms.reduce((total, room) => total + room.adults + room.children.length, 0);

    let roomsInfo = '';
    rooms.forEach((room, index) => {
      roomsInfo += `\n   Quarto ${index + 1}: ${room.adults} adulto${room.adults > 1 ? 's' : ''}`;
      if (room.children.length > 0) {
        roomsInfo += `, ${room.children.length} criança${room.children.length > 1 ? 's' : ''} (${room.children.map(age => `${age} ano${age !== 1 ? 's' : ''}`).join(', ')})`;
      }
    });

    const message = `Olá! Tenho interesse no imóvel: "${property.title}"${bookingDates.checkIn ? `\n📅 Check-in: ${bookingDates.checkIn}\n📅 Check-out: ${bookingDates.checkOut}` : ''}\n👥 ${rooms.length} quarto${rooms.length > 1 ? 's' : ''}, ${totalGuests} hóspede${totalGuests > 1 ? 's' : ''}${roomsInfo}\n🔗 ${window.location.href}`;
    const phoneNumber = "5547989105580";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
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

  if (loading) return <Loading text="Carregando detalhes do imóvel..." />;

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Imóvel não encontrado"}</h1>
          <p className="text-gray-600 mb-6">O imóvel que você procura pode ter sido removido ou não existe.</p>
          <div className="flex gap-3">
            <Link to="/properties" className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors">
              Ver Todos os Imóveis
            </Link>
            <button onClick={() => navigate(-1)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const photos = property.photos || [];
  const amenities = property.amenities || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Sticky */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              <FaArrowLeft /> Voltar
            </button>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors font-medium">
                <FaShare className="text-red-600" /> Compartilhar
              </button>
              <FavoriteButton propertyId={property.id} size="lg" />
            </div>
          </div>
        </div>
      </header>

      {/* Galeria de Fotos - Estilo Airbnb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {photos.length > 0 ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
            {/* Foto Principal */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setShowAllPhotos(true)}>
              <img
                src={`${import.meta.env.VITE_API_URL}/uploads/properties/${photos[0].filename}`}
                alt={property.title}
                className="w-full h-full object-cover group-hover:brightness-90 transition-all"
              />
            </div>

            {/* Fotos Secundárias */}
            {photos.slice(1, 5).map((photo, index) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer"
                onClick={() => setShowAllPhotos(true)}
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/properties/${photo.filename}`}
                  alt={`Foto ${index + 2}`}
                  className="w-full h-full object-cover group-hover:brightness-90 transition-all"
                />
                {index === 3 && photos.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white font-bold text-xl hover:bg-opacity-60 transition-all">
                    +{photos.length - 5} fotos
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[500px] bg-gray-200 rounded-2xl flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-lg">Nenhuma foto disponível</p>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda - Informações */}
          <div className="lg:col-span-2 space-y-8">
            {/* Título e Localização */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span className="font-medium">4.9</span>
                      <span className="text-sm">(127 avaliações)</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="text-red-600" />
                      <span>{property.city?.name}, {property.city?.state}</span>
                    </div>
                  </div>
                </div>
                {property.is_featured && (
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Premium
                  </span>
                )}
              </div>

              {/* Características Rápidas */}
              <div className="flex items-center gap-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-red-600" />
                  <span className="font-medium">{property.max_guests} hóspedes</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBed className="text-red-600" />
                  <span className="font-medium">{property.bedrooms} quartos</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaBath className="text-red-600" />
                  <span className="font-medium">{property.bathrooms} banheiros</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHome className="text-red-600" />
                  <span className="font-medium">{getTypeLabel(property.type)}</span>
                </div>
              </div>
            </div>

            {/* Descrição */}
            {property.description && (
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sobre este espaço</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{property.description}</p>
              </div>
            )}

            {/* Comodidades */}
            {amenities.length > 0 && (
              <div className="border-b border-gray-200 pb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">O que este lugar oferece</h2>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.slice(0, 10).map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-3 py-3">
                      <span className="text-2xl">{getAmenityIcon(amenity.icon)}</span>
                      <span className="text-gray-700 font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
                {amenities.length > 10 && (
                  <button className="mt-6 px-6 py-3 border-2 border-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    Mostrar todas as {amenities.length} comodidades
                  </button>
                )}
              </div>
            )}

            {/* Calendário de Disponibilidade */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecione as datas</h2>
              <div className="bg-gray-50 rounded-2xl p-6">
                <DateRangePicker
                  checkIn={bookingDates.checkIn}
                  checkOut={bookingDates.checkOut}
                  onChange={setBookingDates}
                  onClose={() => {}}
                  occupiedDates={occupiedDates}
                />
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection propertyId={property.id} />
          </div>

          {/* Coluna Direita - Card de Reserva */}
          <div className="lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Card de Reserva */}
              <div className="border border-gray-300 rounded-2xl shadow-xl p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">
                      R$ {Number(property.price_per_night).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-gray-600">/ noite</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <FaStar className="text-yellow-400" />
                    <span className="font-medium">4.9</span>
                    <span>•</span>
                    <span>127 avaliações</span>
                  </div>
                </div>

                {/* Seleção de Datas */}
                <div className="mb-4">
                  <div
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="grid grid-cols-2 border border-gray-300 rounded-xl overflow-hidden cursor-pointer hover:border-gray-400 transition-colors"
                  >
                    <div className="p-3 border-r border-gray-300">
                      <div className="text-xs font-bold text-gray-900 mb-1">CHECK-IN</div>
                      <div className="text-sm text-gray-600">
                        {bookingDates.checkIn ? new Date(bookingDates.checkIn).toLocaleDateString("pt-BR") : "Adicionar"}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold text-gray-900 mb-1">CHECK-OUT</div>
                      <div className="text-sm text-gray-600">
                        {bookingDates.checkOut ? new Date(bookingDates.checkOut).toLocaleDateString("pt-BR") : "Adicionar"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seleção de Quartos e Hóspedes */}
                <div className="mb-6 relative">
                  <div
                    className="border border-gray-300 rounded-xl p-3 cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => setShowRoomsPicker(!showRoomsPicker)}
                  >
                    <div className="text-xs font-bold text-gray-900 mb-1">QUARTOS E HÓSPEDES</div>
                    <div className="text-sm text-gray-600">
                      {rooms.length} {rooms.length === 1 ? 'quarto' : 'quartos'}, {' '}
                      {rooms.reduce((total, room) => total + room.adults + room.children.length, 0)} {' '}
                      {rooms.reduce((total, room) => total + room.adults + room.children.length, 0) === 1 ? 'hóspede' : 'hóspedes'}
                    </div>
                  </div>

                  {/* Picker de Quartos e Hóspedes */}
                  {showRoomsPicker && (
                    <div className="relative z-50">
                      <RoomsGuestsPicker
                        rooms={rooms}
                        onChange={(newRooms) => {
                          setRooms(newRooms);
                        }}
                        onClose={() => setShowRoomsPicker(false)}
                      />
                    </div>
                  )}
                </div>

                {/* Cálculo do Preço */}
                {totalNights > 0 && (
                  <div className="mb-6 space-y-3 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700">
                      <span>R$ {Number(property.price_per_night).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} x {totalNights} noites</span>
                      <span>R$ {totalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Taxa de serviço</span>
                      <span>R$ {(totalPrice * 0.05).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>R$ {(totalPrice * 1.05).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}

                {/* Botão de Reserva */}
                <button
                  onClick={() => {
                    if (!bookingDates.checkIn || !bookingDates.checkOut) {
                      alert("Por favor, selecione as datas de check-in e check-out");
                      return;
                    }

                    const totalGuests = rooms.reduce((total, room) => total + room.adults + room.children.length, 0);

                    if (totalGuests > property.max_guests) {
                      alert(`Esta propriedade suporta no máximo ${property.max_guests} hóspedes`);
                      return;
                    }

                    navigate('/booking-checkout', {
                      state: {
                        property,
                        bookingData: {
                          checkIn: bookingDates.checkIn,
                          checkOut: bookingDates.checkOut,
                          nights: totalNights,
                          rooms,
                          totalGuests
                        }
                      }
                    });
                  }}
                  disabled={!bookingDates.checkIn || !bookingDates.checkOut}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {bookingDates.checkIn && bookingDates.checkOut ? 'Reservar Agora' : 'Selecione as Datas'}
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">Você não será cobrado nesta etapa</p>

                {/* Botão WhatsApp como alternativa */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <FaWhatsapp className="text-lg" />
                  <span>Consultar pelo WhatsApp</span>
                </button>
              </div>

              {/* Informações Extras */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Cancelamento grátis</p>
                    <p className="text-sm text-gray-600">Cancele até 48h antes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaClock className="text-blue-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Check-in flexível</p>
                    <p className="text-sm text-gray-600">Combinado com o anfitrião</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaWhatsapp className="text-green-500 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Suporte 24/7</p>
                    <p className="text-sm text-gray-600">Atendimento via WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão WhatsApp Flutuante */}
      <button
        onClick={handleWhatsApp}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white w-16 h-16 rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 z-50 flex items-center justify-center"
        title="Contato via WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
      </button>

      {/* Modal de Galeria Completa */}
      {showAllPhotos && (
        <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
          <div className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Todas as fotos</h2>
                <button
                  onClick={() => setShowAllPhotos(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all"
                >
                  ✕ Fechar
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={`${import.meta.env.VITE_API_URL}/uploads/properties/${photo.filename}`}
                    alt={photo.alt_text || property.title}
                    className="w-full rounded-xl"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function para ícones de comodidades
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

export default PropertyDetails;
