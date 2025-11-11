// PropertyDetails.jsx - VERSÃO PROFISSIONAL E IMPRESSIONANTE

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FaArrowLeft, FaShare, FaStar, FaMapMarkerAlt,
  FaUsers, FaBed, FaBath, FaHome,
  FaCheckCircle, FaWhatsapp, FaClock
} from "react-icons/fa";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/common/Loading";
import DateRangePicker from "../components/search/DateRangePicker";
import GuestsPicker from "../components/search/GuestsPicker";
import ReviewSection from "../components/property/ReviewSection";
import FavoriteButton from "../components/property/FavoriteButton";
import AirbnbHeader from "../components/layout/AirbnbHeader";
import PropertyMapLeaflet from "../components/property/PropertyMapLeaflet";
import PropertyAmenities from "../components/property/PropertyAmenities";

const PropertyDetails = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Estados
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] = useState(false);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [bookingDates, setBookingDates] = useState({ checkIn: null, checkOut: null });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0, pets: 0 });
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

  // Parse date string to local date without timezone issues
  const parseDate = (dateString) => {
    if (!dateString) return null;
    if (typeof dateString === 'object' && dateString instanceof Date) {
      return dateString;
    }
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Calcular preço total
  useEffect(() => {
    if (bookingDates.checkIn && bookingDates.checkOut && property) {
      const checkIn = parseDate(bookingDates.checkIn);
      const checkOut = parseDate(bookingDates.checkOut);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      // Calcular número total de hóspedes (adultos + crianças, bebês não contam)
      const totalGuests = guests.adults + guests.children;

      // Preço base (para 2 hóspedes)
      const basePrice = Number(property.price_per_night);

      // Definir número mínimo de hóspedes incluídos no preço base (geralmente 2)
      const minGuestsIncluded = 2;

      // Calcular hóspedes adicionais
      const additionalGuests = Math.max(0, totalGuests - minGuestsIncluded);

      // Valor por hóspede adicional (10% do preço base por hóspede extra)
      const pricePerAdditionalGuest = basePrice * 0.10;

      // Preço total por noite = preço base + (hóspedes adicionais * valor por hóspede adicional)
      const pricePerNight = basePrice + (additionalGuests * pricePerAdditionalGuest);

      // Preço total = preço por noite * número de noites
      const price = pricePerNight * nights;

      setTotalNights(nights);
      setTotalPrice(price);
    }
  }, [bookingDates, property, guests]);

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
    if (!property?.uuid) return;

    try {
      // Definir intervalo de datas: hoje até 12 meses no futuro
      const today = new Date();
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(today.getFullYear() + 1);

      const startDate = today.toISOString().split('T')[0];
      const endDate = oneYearFromNow.toISOString().split('T')[0];

      const response = await api.get(
        `/api/bookings/property/${property.uuid}/occupied?start_date=${startDate}&end_date=${endDate}`
      );
      setOccupiedDates(response.data.occupied_dates || []);
    } catch (error) {
      console.error("Erro ao buscar datas ocupadas:", error);
      // Silenciosamente definir array vazio se houver erro
      setOccupiedDates([]);
    }
  };

  const handleWhatsApp = () => {
    const totalGuests = guests.adults + guests.children;

    let guestsInfo = '';
    if (guests.adults > 0) {
      guestsInfo += `\n   ${guests.adults} adulto${guests.adults > 1 ? 's' : ''}`;
    }
    if (guests.children > 0) {
      guestsInfo += `${guests.adults > 0 ? ', ' : '\n   '}${guests.children} criança${guests.children > 1 ? 's' : ''}`;
    }
    if (guests.infants > 0) {
      guestsInfo += `, ${guests.infants} bebê${guests.infants > 1 ? 's' : ''}`;
    }
    if (guests.pets > 0) {
      guestsInfo += `, ${guests.pets} pet${guests.pets > 1 ? 's' : ''}`;
    }

    const message = `Olá! Tenho interesse no imóvel: "${property.title}"${bookingDates.checkIn ? `\n📅 Check-in: ${bookingDates.checkIn}\n📅 Check-out: ${bookingDates.checkOut}` : ''}\n👥 ${totalGuests} hóspede${totalGuests > 1 ? 's' : ''}${guestsInfo}\n🔗 ${window.location.href}`;
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

  const getStatusInfo = (status) => {
    const statusMap = {
      available: {
        label: "Disponível",
        color: "bg-green-100 text-green-800 border-green-300",
        icon: "✓"
      },
      occupied: {
        label: "Ocupado",
        color: "bg-red-100 text-red-800 border-red-300",
        icon: "✕"
      },
      maintenance: {
        label: "Em Manutenção",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        icon: "⚙"
      },
      inactive: {
        label: "Inativo",
        color: "bg-gray-100 text-gray-800 border-gray-300",
        icon: "○"
      }
    };
    return statusMap[status] || statusMap.available;
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
      {/* Header Estilo Airbnb */}
      <AirbnbHeader />

      {/* Back Button Row */}
      <div className="max-w-[1120px] mx-auto px-6 lg:px-12 py-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-airbnb-black hover:text-airbnb-grey-1000 transition-colors font-medium"
          >
            <FaArrowLeft /> Voltar
          </button>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 rounded-medium hover:bg-airbnb-grey-50 transition-colors font-medium">
              <FaShare className="text-airbnb-black" /> Compartilhar
            </button>
            <FavoriteButton propertyId={property.id} size="lg" />
          </div>
        </div>
      </div>

      {/* Galeria de Fotos - Estilo Airbnb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {photos.length > 0 ? (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px] rounded-2xl overflow-hidden">
            {/* Foto Principal */}
            <div className="col-span-2 row-span-2 relative group cursor-pointer" onClick={() => setShowAllPhotos(true)}>
              <img
                src={photos[0].url || photos[0].cloudinary_url || `${import.meta.env.VITE_API_URL || 'https://giuliano.onrender.com'}/uploads/properties/${photos[0].filename}`}
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
                  src={photo.url || photo.cloudinary_url || `${import.meta.env.VITE_API_URL || 'https://giuliano.onrender.com'}/uploads/properties/${photo.filename}`}
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
                  <div className="flex items-center gap-4 text-gray-600 mb-3">
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
                  {/* Status Badge */}
                  <div className="inline-flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getStatusInfo(property.status).color}`}>
                      <span className="mr-1">{getStatusInfo(property.status).icon}</span>
                      Status: {getStatusInfo(property.status).label}
                    </span>
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
            <PropertyAmenities amenities={amenities} />

            {/* Localização no Mapa */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Onde você vai ficar</h2>
              <PropertyMapLeaflet
                lat={property.latitude}
                lng={property.longitude}
                address={property.address}
              />
            </div>

            {/* Calendário de Disponibilidade */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecione as datas</h2>
              <div className={`bg-gray-50 rounded-2xl p-6 ${property.status !== 'available' ? 'opacity-50 pointer-events-none' : ''}`}>
                {property.status !== 'available' ? (
                  <div className="text-center py-8">
                    <p className="text-gray-700 font-medium mb-2">
                      {property.status === 'occupied' && '🔒 Calendário bloqueado - Imóvel ocupado'}
                      {property.status === 'maintenance' && '⚙️ Calendário bloqueado - Em manutenção'}
                      {property.status === 'inactive' && '○ Calendário bloqueado - Imóvel inativo'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Este imóvel não está disponível para reservas no momento.
                    </p>
                  </div>
                ) : (
                  <DateRangePicker
                    checkIn={bookingDates.checkIn}
                    checkOut={bookingDates.checkOut}
                    onChange={setBookingDates}
                    onClose={() => {}}
                    occupiedDates={occupiedDates}
                    compact={true}
                  />
                )}
              </div>
            </div>

            {/* Reviews */}
            <ReviewSection propertyId={property.uuid} />
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

                {/* Aviso de Indisponibilidade */}
                {property.status !== 'available' && (
                  <div className={`mb-4 p-4 rounded-xl border-2 ${
                    property.status === 'occupied' ? 'bg-red-50 border-red-200' :
                    property.status === 'maintenance' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {property.status === 'occupied' && '🔒 Imóvel Ocupado'}
                      {property.status === 'maintenance' && '⚙️ Em Manutenção'}
                      {property.status === 'inactive' && '○ Imóvel Inativo'}
                    </p>
                    <p className="text-xs text-gray-700">
                      Este imóvel não está disponível para reservas no momento.
                    </p>
                  </div>
                )}

                {/* Seleção de Datas */}
                <div className="mb-4">
                  <div
                    onClick={() => property.status === 'available' && setShowDatePicker(!showDatePicker)}
                    className={`grid grid-cols-2 border border-gray-300 rounded-xl overflow-hidden ${
                      property.status === 'available'
                        ? 'cursor-pointer hover:border-gray-400'
                        : 'cursor-not-allowed opacity-50 bg-gray-50'
                    } transition-colors`}
                  >
                    <div className="p-3 border-r border-gray-300">
                      <div className="text-xs font-bold text-gray-900 mb-1">CHECK-IN</div>
                      <div className="text-sm text-gray-600">
                        {bookingDates.checkIn ? parseDate(bookingDates.checkIn).toLocaleDateString("pt-BR") : "Adicionar"}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold text-gray-900 mb-1">CHECK-OUT</div>
                      <div className="text-sm text-gray-600">
                        {bookingDates.checkOut ? parseDate(bookingDates.checkOut).toLocaleDateString("pt-BR") : "Adicionar"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seleção de Hóspedes */}
                <div className="mb-6 relative">
                  <div
                    className={`border border-gray-300 rounded-xl p-3 ${
                      property.status === 'available'
                        ? 'cursor-pointer hover:border-gray-400'
                        : 'cursor-not-allowed opacity-50 bg-gray-50'
                    } transition-colors`}
                    onClick={() => property.status === 'available' && setShowGuestsPicker(!showGuestsPicker)}
                  >
                    <div className="text-xs font-bold text-gray-900 mb-1">HÓSPEDES</div>
                    <div className="text-sm text-gray-600">
                      {guests.adults + guests.children} {guests.adults + guests.children === 1 ? 'hóspede' : 'hóspedes'}
                      {guests.infants > 0 && `, ${guests.infants} ${guests.infants === 1 ? 'bebê' : 'bebês'}`}
                      {guests.pets > 0 && `, ${guests.pets} ${guests.pets === 1 ? 'animal' : 'animais'}`}
                    </div>
                  </div>

                  {/* Picker de Hóspedes */}
                  {showGuestsPicker && property.status === 'available' && (
                    <GuestsPicker
                      guests={guests}
                      onChange={(newGuests) => {
                        setGuests(newGuests);
                      }}
                      maxGuests={property.max_guests || 16}
                      allowsPets={property.allows_pets || false}
                      onClose={() => setShowGuestsPicker(false)}
                    />
                  )}
                </div>

                {/* Cálculo do Preço */}
                {totalNights > 0 && (
                  <div className="mb-6 space-y-3 pb-6 border-b border-gray-200">
                    <div className="flex justify-between text-gray-700 text-sm">
                      <span>R$ {Number(property.price_per_night).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} x {totalNights} {totalNights === 1 ? 'noite' : 'noites'}</span>
                      <span>R$ {(Number(property.price_per_night) * totalNights).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                    {(() => {
                      const totalGuests = guests.adults + guests.children;
                      const additionalGuests = Math.max(0, totalGuests - 2);
                      if (additionalGuests > 0) {
                        const extraGuestFee = Number(property.price_per_night) * 0.10 * additionalGuests * totalNights;
                        return (
                          <div className="flex justify-between text-gray-700 text-sm">
                            <span>{additionalGuests} {additionalGuests === 1 ? 'hóspede extra' : 'hóspedes extras'}</span>
                            <span>R$ {extraGuestFee.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <div className="flex justify-between text-gray-700 text-sm">
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
                    if (property.status !== 'available') {
                      alert("Este imóvel não está disponível para reservas no momento.");
                      return;
                    }

                    if (!bookingDates.checkIn || !bookingDates.checkOut) {
                      alert("Por favor, selecione as datas de check-in e check-out");
                      return;
                    }

                    const totalGuests = guests.adults + guests.children;

                    if (totalGuests > property.max_guests) {
                      alert(`Esta propriedade suporta no máximo ${property.max_guests} hóspedes`);
                      return;
                    }

                    // Preparar dados da reserva
                    const bookingDataToSave = {
                      checkIn: bookingDates.checkIn,
                      checkOut: bookingDates.checkOut,
                      nights: totalNights,
                      guests,
                      totalGuests,
                      rooms: [] // Adicionar array vazio de rooms por padrão
                    };

                    // Se não está autenticado, salvar dados e redirecionar para login
                    if (!isAuthenticated) {
                      sessionStorage.setItem('pendingBooking', JSON.stringify({
                        property,
                        bookingData: bookingDataToSave,
                        timestamp: Date.now()
                      }));
                      navigate('/guest-login', {
                        state: {
                          from: {
                            pathname: '/booking-checkout'
                          },
                          message: 'Faça login para continuar com sua reserva'
                        }
                      });
                      return;
                    }

                    // Se está autenticado, ir direto para checkout
                    navigate('/booking-checkout', {
                      state: {
                        property,
                        bookingData: bookingDataToSave
                      }
                    });
                  }}
                  disabled={property.status !== 'available' || !bookingDates.checkIn || !bookingDates.checkOut}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {property.status !== 'available'
                    ? 'Imóvel Indisponível'
                    : bookingDates.checkIn && bookingDates.checkOut
                      ? 'Reservar Agora'
                      : 'Selecione as Datas'}
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
                    src={photo.url || photo.cloudinary_url || `${import.meta.env.VITE_API_URL || 'https://giuliano.onrender.com'}/uploads/properties/${photo.filename}`}
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

export default PropertyDetails;
