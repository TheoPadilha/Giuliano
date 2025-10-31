import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  FaCheckCircle, FaCalendarAlt, FaMapMarkerAlt, FaUsers,
  FaEnvelope, FaPhone, FaDownload, FaPrint, FaHome,
  FaWhatsapp, FaStar, FaClock
} from "react-icons/fa";
import api from "../services/api";
import Loading from "../components/common/Loading";

const BookingConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const paymentStatus = searchParams.get("status");
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/bookings/${bookingId}`);
      setBooking(response.data.booking);
    } catch (error) {
      console.error("Erro ao carregar reserva:", error);
      setError("Não foi possível carregar os detalhes da reserva");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const message = `✅ Minha reserva foi confirmada!\n\nReserva: #${booking.uuid}\nImóvel: ${booking.property.title}\nCheck-in: ${formatDate(booking.check_in)}\nCheck-out: ${formatDate(booking.check_out)}\nHóspedes: ${booking.guests}\n\nObrigado!`;
    const phoneNumber = "5547989105580";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  if (loading) {
    return <Loading text="Carregando confirmação..." />;
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops!</h2>
          <p className="text-gray-600 mb-6">{error || "Reserva não encontrada"}</p>
          <button
            onClick={() => navigate("/my-bookings")}
            className="btn-primary"
          >
            Ver Minhas Reservas
          </button>
        </div>
      </div>
    );
  }

  // Status de pagamento
  const isSuccess = paymentStatus === "approved" || booking.payment_status === "paid";
  const isPending = paymentStatus === "pending" || booking.payment_status === "pending";

  return (
    <div className="min-h-screen bg-white py-12 print:bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Animation */}
        {isSuccess && (
          <div className="text-center mb-12 print:mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-rausch rounded-full mb-6 animate-bounce print:animate-none shadow-lg">
              <FaCheckCircle className="text-white text-5xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Reserva Confirmada!
            </h1>
            <p className="text-xl text-airbnb-grey-600">
              Sua hospedagem está garantida. Enviamos todos os detalhes por email.
            </p>
          </div>
        )}

        {isPending && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-airbnb-grey-400 rounded-full mb-6">
              <FaClock className="text-white text-5xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Pagamento Pendente
            </h1>
            <p className="text-xl text-airbnb-grey-600">
              Aguardando confirmação do pagamento. Você receberá um email assim que for processado.
            </p>
          </div>
        )}

        {/* Main Card */}
        <div className="card overflow-hidden mb-8 print:shadow-none">
          {/* Header with Property Image */}
          <div className="relative h-64 md:h-80 print:h-40">
            {booking.property.photos && booking.property.photos[0] && (
              <img
                src={booking.property.photos[0].url}
                alt={booking.property.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">{booking.property.title}</h2>
              <p className="flex items-center gap-2 text-lg">
                <FaMapMarkerAlt />
                <span>{booking.property.address}</span>
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-8 md:p-10">
            {/* Reservation Number */}
            <div className="bg-airbnb-grey-50 border-2 border-dashed border-airbnb-grey-300 rounded-xl p-6 mb-8 text-center">
              <p className="text-sm text-airbnb-grey-600 mb-1">Número da Reserva</p>
              <p className="text-3xl font-mono font-bold text-rausch">
                #{booking.uuid.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* Grid with Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Check-in */}
              <div className="bg-airbnb-grey-50 rounded-xl p-6 border border-airbnb-grey-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-rausch" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-airbnb-black font-semibold">Check-in</p>
                    <p className="text-xs text-airbnb-grey-600">Após 14:00</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-airbnb-black">
                  {formatDate(booking.check_in)}
                </p>
              </div>

              {/* Check-out */}
              <div className="bg-airbnb-grey-50 rounded-xl p-6 border border-airbnb-grey-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center">
                    <FaCalendarAlt className="text-rausch" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-airbnb-black font-semibold">Check-out</p>
                    <p className="text-xs text-airbnb-grey-600">Até 12:00</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-airbnb-black">
                  {formatDate(booking.check_out)}
                </p>
              </div>

              {/* Guests */}
              <div className="bg-airbnb-grey-50 rounded-xl p-6 border border-airbnb-grey-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center">
                    <FaUsers className="text-rausch" size={20} />
                  </div>
                  <p className="text-sm text-airbnb-black font-semibold">Hóspedes</p>
                </div>
                <p className="text-xl font-bold text-airbnb-black">
                  {booking.guests} {booking.guests === 1 ? "pessoa" : "pessoas"}
                </p>
              </div>

              {/* Nights */}
              <div className="bg-airbnb-grey-50 rounded-xl p-6 border border-airbnb-grey-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-rausch/10 rounded-full flex items-center justify-center">
                    <FaHome className="text-rausch" size={20} />
                  </div>
                  <p className="text-sm text-airbnb-black font-semibold">Estadia</p>
                </div>
                <p className="text-xl font-bold text-airbnb-black">
                  {booking.nights} {booking.nights === 1 ? "noite" : "noites"}
                </p>
              </div>
            </div>

            {/* Guest Info */}
            <div className="bg-airbnb-grey-50 rounded-xl p-6 mb-8 border border-airbnb-grey-200">
              <h3 className="heading-3 mb-4">Informações do Hóspede</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-rausch" size={20} />
                  <div>
                    <p className="text-xs text-airbnb-grey-600">Email</p>
                    <p className="font-medium text-airbnb-black">{booking.guest_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-rausch" size={20} />
                  <div>
                    <p className="text-xs text-airbnb-grey-600">Telefone</p>
                    <p className="font-medium text-airbnb-black">{booking.guest_phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-airbnb-grey-50 rounded-xl p-6 border border-airbnb-grey-200">
              <h3 className="heading-3 mb-4">Resumo do Pagamento</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-airbnb-grey-700">
                  <span>{formatCurrency(booking.price_per_night)} x {booking.nights} noites</span>
                  <span className="font-semibold">{formatCurrency(booking.total_price)}</span>
                </div>
                {booking.service_fee > 0 && (
                  <div className="flex justify-between text-airbnb-grey-700">
                    <span>Taxa de serviço</span>
                    <span className="font-semibold">{formatCurrency(booking.service_fee)}</span>
                  </div>
                )}
                {booking.cleaning_fee > 0 && (
                  <div className="flex justify-between text-airbnb-grey-700">
                    <span>Taxa de limpeza</span>
                    <span className="font-semibold">{formatCurrency(booking.cleaning_fee)}</span>
                  </div>
                )}
                <div className="pt-4 border-t-2 border-airbnb-grey-300 flex justify-between items-center">
                  <span className="text-xl font-bold text-airbnb-black">Total Pago</span>
                  <span className="text-3xl font-bold text-rausch">
                    {formatCurrency(booking.final_price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print:hidden">
          <button
            onClick={handlePrint}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <FaPrint />
            <span>Imprimir</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="btn-secondary flex items-center justify-center gap-2 !bg-green-600 !text-white hover:!bg-green-700"
          >
            <FaWhatsapp />
            <span>Compartilhar</span>
          </button>

          <Link
            to="/my-bookings"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <FaHome />
            <span>Minhas Reservas</span>
          </Link>
        </div>

        {/* Next Steps */}
        <div className="bg-airbnb-grey-50 border border-airbnb-grey-200 rounded-2xl p-8 print:border print:border-airbnb-grey-300">
          <h3 className="heading-3 mb-4">Próximos Passos</h3>
          <ul className="space-y-3 text-airbnb-grey-700">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-rausch mt-1 flex-shrink-0" size={20} />
              <span>
                <strong>Confirmação:</strong> Você receberá um email com todos os detalhes da reserva
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-rausch mt-1 flex-shrink-0" size={20} />
              <span>
                <strong>Check-in:</strong> Apresente-se no imóvel no dia {formatDate(booking.check_in)} após as 14:00h
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-rausch mt-1 flex-shrink-0" size={20} />
              <span>
                <strong>Dúvidas:</strong> Entre em contato conosco pelo WhatsApp a qualquer momento
              </span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="text-rausch mt-1 flex-shrink-0" size={20} />
              <span>
                <strong>Avaliação:</strong> Após sua estadia, não esqueça de deixar uma avaliação!
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
